package examples

import (
	"fmt"
	"testing"
)

// ============================================================================
// DESIGN PATTERNS IN GO
// ============================================================================

// ============================================================================
// 1. DEPENDENCY INJECTION
// ============================================================================

// Instead of a class creating its own dependencies, they're passed in.
// Makes code testable and flexible.

// Logger interface (dependency)
type Logger interface {
	Log(message string)
}

// Real logger implementation
type ConsoleLogger struct{}

func (cl *ConsoleLogger) Log(message string) {
	fmt.Println("[LOG]", message)
}

// Mock logger for testing
type MockLogger struct {
	Messages []string
}

func (ml *MockLogger) Log(message string) {
	ml.Messages = append(ml.Messages, message)
}

// UserService depends on Logger, but doesn't create it
// Logger is "injected" via constructor
type UserService struct {
	logger Logger
}

// Constructor - dependency is injected
func NewUserService(logger Logger) *UserService {
	return &UserService{logger: logger}
}

func (us *UserService) CreateUser(name string) {
	us.logger.Log("Creating user: " + name)
	// create user logic
}

// Test with mock logger
func TestDependencyInjection(t *testing.T) {
	mockLogger := &MockLogger{}
	service := NewUserService(mockLogger)

	service.CreateUser("Alice")

	if len(mockLogger.Messages) == 0 {
		t.Error("expected log message")
	}

	expected := "Creating user: Alice"
	if mockLogger.Messages[0] != expected {
		t.Errorf("got %q, want %q", mockLogger.Messages[0], expected)
	}
}

// ============================================================================
// 2. ABSTRACT FACTORY PATTERN
// ============================================================================

// Creates families of related objects without specifying concrete types.

// Product interfaces
type Button interface {
	Click()
}

type Checkbox interface {
	Toggle()
}

// Concrete products - Windows
type WindowsButton struct{}

func (wb *WindowsButton) Click() {
	fmt.Println("Windows button clicked")
}

type WindowsCheckbox struct{}

func (wc *WindowsCheckbox) Toggle() {
	fmt.Println("Windows checkbox toggled")
}

// Concrete products - Mac
type MacButton struct{}

func (mb *MacButton) Click() {
	fmt.Println("Mac button clicked")
}

type MacCheckbox struct{}

func (mc *MacCheckbox) Toggle() {
	fmt.Println("Mac checkbox toggled")
}

// Abstract factory interface
type UIFactory interface {
	CreateButton() Button
	CreateCheckbox() Checkbox
}

// Concrete factory - Windows
type WindowsFactory struct{}

func (wf *WindowsFactory) CreateButton() Button {
	return &WindowsButton{}
}

func (wf *WindowsFactory) CreateCheckbox() Checkbox {
	return &WindowsCheckbox{}
}

// Concrete factory - Mac
type MacFactory struct{}

func (mf *MacFactory) CreateButton() Button {
	return &MacButton{}
}

func (mf *MacFactory) CreateCheckbox() Checkbox {
	return &MacCheckbox{}
}

// Factory method to get right factory
func GetUIFactory(osType string) UIFactory {
	switch osType {
	case "windows":
		return &WindowsFactory{}
	case "mac":
		return &MacFactory{}
	default:
		return &WindowsFactory{}
	}
}

// Application uses factory, doesn't care about concrete types
type Application struct {
	factory UIFactory
	button  Button
	box     Checkbox
}

func NewApplication(osType string) *Application {
	factory := GetUIFactory(osType)
	return &Application{
		factory: factory,
		button:  factory.CreateButton(),
		box:     factory.CreateCheckbox(),
	}
}

func (app *Application) Render() {
	app.button.Click()
	app.box.Toggle()
}

func TestAbstractFactory(t *testing.T) {
	// Create Mac UI
	macApp := NewApplication("mac")
	macApp.Render()

	// Create Windows UI without changing code
	winApp := NewApplication("windows")
	winApp.Render()

	// Both work, but create different UI elements
	t.Log("Abstract Factory test passed")
}

// ============================================================================
// 3. STRATEGY PATTERN
// ============================================================================

// Different algorithms can swap at runtime without changing client code.

// Strategy interface
type PaymentStrategy interface {
	Pay(amount float64) string
}

// Concrete strategies
type CreditCardPayment struct {
	CardNumber string
}

func (ccp *CreditCardPayment) Pay(amount float64) string {
	return fmt.Sprintf("Paid $%.2f with credit card %s", amount, ccp.CardNumber)
}

type PayPalPayment struct {
	Email string
}

func (pp *PayPalPayment) Pay(amount float64) string {
	return fmt.Sprintf("Paid $%.2f via PayPal to %s", amount, pp.Email)
}

type CryptocurrencyPayment struct {
	WalletAddress string
}

func (cp *CryptocurrencyPayment) Pay(amount float64) string {
	return fmt.Sprintf("Paid $%.2f in crypto to wallet %s", amount, cp.WalletAddress)
}

// Context that uses strategy
type PaymentProcessor struct {
	strategy PaymentStrategy
}

func NewPaymentProcessor(strategy PaymentStrategy) *PaymentProcessor {
	return &PaymentProcessor{strategy: strategy}
}

// Change strategy at runtime
func (pp *PaymentProcessor) SetPaymentStrategy(strategy PaymentStrategy) {
	pp.strategy = strategy
}

func (pp *PaymentProcessor) ProcessPayment(amount float64) string {
	return pp.strategy.Pay(amount)
}

func TestStrategyPattern(t *testing.T) {
	// Start with credit card
	processor := NewPaymentProcessor(&CreditCardPayment{CardNumber: "1234-5678-9012-3456"})
	result := processor.ProcessPayment(100.0)
	if !contains(result, "credit card") {
		t.Errorf("expected credit card payment, got %q", result)
	}

	// Switch to PayPal
	processor.SetPaymentStrategy(&PayPalPayment{Email: "user@example.com"})
	result = processor.ProcessPayment(100.0)
	if !contains(result, "PayPal") {
		t.Errorf("expected PayPal payment, got %q", result)
	}

	// Switch to Cryptocurrency
	processor.SetPaymentStrategy(&CryptocurrencyPayment{WalletAddress: "1A1z..."})
	result = processor.ProcessPayment(100.0)
	if !contains(result, "crypto") {
		t.Errorf("expected crypto payment, got %q", result)
	}
}

func contains(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// ============================================================================
// 4. ADAPTER PATTERN
// ============================================================================

// Convert interface of one class to another interface clients expect.
// Useful for integrating incompatible systems.

// Existing system with incompatible interface
type OldPaymentGateway struct{}

func (og *OldPaymentGateway) MakePayment(cardNumber string, amount int) bool {
	fmt.Printf("Old Gateway: Processing %d cents on card %s\n", amount, cardNumber)
	return true
}

// New system expects this interface
type ModernPaymentGateway interface {
	ProcessTransaction(amount float64, cardToken string) error
}

// Adapter converts old interface to new interface
type PaymentGatewayAdapter struct {
	oldGateway *OldPaymentGateway
}

func NewPaymentGatewayAdapter(gateway *OldPaymentGateway) ModernPaymentGateway {
	return &PaymentGatewayAdapter{oldGateway: gateway}
}

// Implement new interface by adapting old interface
func (adapter *PaymentGatewayAdapter) ProcessTransaction(amount float64, cardToken string) error {
	// Convert amount from dollars to cents
	amountInCents := int(amount * 100)

	// Call old interface
	success := adapter.oldGateway.MakePayment(cardToken, amountInCents)

	if !success {
		return fmt.Errorf("payment failed")
	}
	return nil
}

// Real-world example: integrating third-party library
type ThirdPartyEmailService struct{}

func (tes *ThirdPartyEmailService) SendMail(to string, subject string, body string) bool {
	fmt.Printf("3rd party: Sending email to %s\n", to)
	return true
}

// Our email interface
type EmailService interface {
	Send(recipient string, message string) error
}

// Adapter for third-party service
type EmailServiceAdapter struct {
	service *ThirdPartyEmailService
}

func NewEmailServiceAdapter(service *ThirdPartyEmailService) EmailService {
	return &EmailServiceAdapter{service: service}
}

func (adapter *EmailServiceAdapter) Send(recipient string, message string) error {
	success := adapter.service.SendMail(recipient, "Notification", message)
	if !success {
		return fmt.Errorf("email failed to send")
	}
	return nil
}

func TestAdapterPattern(t *testing.T) {
	// Old system
	oldGateway := &OldPaymentGateway{}

	// Adapt it to new interface
	adapter := NewPaymentGatewayAdapter(oldGateway)

	// Use with new interface
	err := adapter.ProcessTransaction(99.99, "4532-1111-2222-3333")
	if err != nil {
		t.Errorf("payment failed: %v", err)
	}

	// Test email adapter
	thirdPartyEmail := &ThirdPartyEmailService{}
	emailAdapter := NewEmailServiceAdapter(thirdPartyEmail)

	err = emailAdapter.Send("user@example.com", "Welcome to our app!")
	if err != nil {
		t.Errorf("email failed: %v", err)
	}
}

// ============================================================================
// BONUS: COMBINED PATTERN EXAMPLE
// ============================================================================

// Real-world scenario: order processing system using multiple patterns

// Strategy: different shipping methods
type ShippingStrategy interface {
	Ship(address string) (cost float64, days int)
}

type StandardShipping struct{}

func (ss *StandardShipping) Ship(address string) (float64, int) {
	return 5.99, 5
}

type ExpressShipping struct{}

func (es *ExpressShipping) Ship(address string) (float64, int) {
	return 15.99, 2
}

// Dependency injection: order service depends on payment and shipping
type OrderService struct {
	paymentProcessor *PaymentProcessor
	shippingMethod   ShippingStrategy
}

func NewOrderService(payment PaymentStrategy, shipping ShippingStrategy) *OrderService {
	return &OrderService{
		paymentProcessor: NewPaymentProcessor(payment),
		shippingMethod:   shipping,
	}
}

func (os *OrderService) PlaceOrder(amount float64, address string) (string, error) {
	// Process payment
	paymentResult := os.paymentProcessor.ProcessPayment(amount)

	// Calculate shipping
	shippingCost, days := os.shippingMethod.Ship(address)

	result := fmt.Sprintf("%s | Shipping: $%.2f in %d days", paymentResult, shippingCost, days)
	return result, nil
}

func TestCombinedPatterns(t *testing.T) {
	// Create order service with dependency injection
	// Using strategy for payment and shipping
	service := NewOrderService(
		&CreditCardPayment{CardNumber: "1234-5678"},
		&StandardShipping{},
	)

	result, err := service.PlaceOrder(99.99, "123 Main St")
	if err != nil {
		t.Fatalf("order failed: %v", err)
	}

	if !contains(result, "credit card") || !contains(result, "Shipping") {
		t.Errorf("unexpected result: %s", result)
	}

	// Switch to express shipping
	service.shippingMethod = &ExpressShipping{}
	result, err = service.PlaceOrder(99.99, "123 Main St")
	if err != nil {
		t.Fatalf("order failed: %v", err)
	}

	if !contains(result, "2 days") {
		t.Errorf("expected express shipping in result: %s", result)
	}
}
