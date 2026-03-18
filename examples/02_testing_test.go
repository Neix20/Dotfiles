package examples

import (
	"fmt"
	"testing"
)

// ============================================================================
// UNIT TESTING
// ============================================================================

// Function to test
func Multiply(a, b int) int {
	return a * b
}

// Basic test function (must start with Test)
func TestMultiply(t *testing.T) {
	result := Multiply(3, 4)
	expected := 12

	if result != expected {
		t.Errorf("Multiply(3, 4) = %d; want %d", result, expected)
	}
}

// Table-driven tests (Go best practice)
func TestMultiplyTable(t *testing.T) {
	tests := []struct {
		a        int
		b        int
		expected int
		name     string
	}{
		{3, 4, 12, "positive numbers"},
		{-3, 4, -12, "negative times positive"},
		{0, 5, 0, "zero times number"},
		{-3, -4, 12, "negative times negative"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := Multiply(test.a, test.b)
			if result != test.expected {
				t.Errorf("Multiply(%d, %d) = %d; want %d",
					test.a, test.b, result, test.expected)
			}
		})
	}
}

// Test with assertions (Go has basic t.Fatal, t.Error, etc.)
func TestAddWithAssertions(t *testing.T) {
	// t.Fatal stops test on failure
	result := Add(2, 3)
	if result != 5 {
		t.Fatalf("Add failed: got %d, want 5", result)
	}

	// t.Error continues test on failure
	if result != 5 {
		t.Errorf("Add failed: got %d, want 5", result)
	}
}

// ============================================================================
// BENCHMARKING
// ============================================================================

func BenchmarkMultiply(b *testing.B) {
	// Run the operation b.N times
	for i := 0; i < b.N; i++ {
		Multiply(3, 4)
	}
}

func BenchmarkAddVsMultiply(b *testing.B) {
	b.Run("Add", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			Add(3, 4)
		}
	})

	b.Run("Multiply", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			Multiply(3, 4)
		}
	})
}

// ============================================================================
// MOCKING & STUBS
// ============================================================================

// Interface for database operations (to be mocked)
type Database interface {
	GetUser(id string) (string, error)
	SaveUser(id string, name string) error
}

// Real database (stub)
type RealDB struct{}

func (db *RealDB) GetUser(id string) (string, error) {
	// In real implementation, query database
	return "Alice", nil
}

func (db *RealDB) SaveUser(id string, name string) error {
	// In real implementation, save to database
	return nil
}

// Mock database for testing
type MockDB struct {
	Users map[string]string
}

func (m *MockDB) GetUser(id string) (string, error) {
	if name, exists := m.Users[id]; exists {
		return name, nil
	}
	return "", fmt.Errorf("user not found")
}

func (m *MockDB) SaveUser(id string, name string) error {
	m.Users[id] = name
	return nil
}

// Function that uses database (depends on interface, not concrete type)
func GetUserGreeting(db Database, userID string) (string, error) {
	name, err := db.GetUser(userID)
	if err != nil {
		return "", err
	}
	return "Hello, " + name, nil
}

// Test using mock
func TestGetUserGreeting_WithMock(t *testing.T) {
	mockDB := &MockDB{
		Users: map[string]string{
			"user1": "Bob",
		},
	}

	greeting, err := GetUserGreeting(mockDB, "user1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := "Hello, Bob"
	if greeting != expected {
		t.Errorf("got %q, want %q", greeting, expected)
	}
}

// Test with stub returning error
func TestGetUserGreeting_NotFound(t *testing.T) {
	mockDB := &MockDB{Users: map[string]string{}}

	_, err := GetUserGreeting(mockDB, "nonexistent")
	if err == nil {
		t.Error("expected error for nonexistent user, got nil")
	}
}

// ============================================================================
// TEST COVERAGE
// ============================================================================

// Run tests with coverage:
// go test -cover ./examples
// go test -coverprofile=coverage.out ./examples
// go tool cover -html=coverage.out

// Function with multiple paths (for coverage testing)
func ClassifyNumber(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else if n%2 == 0 {
		return "even"
	} else {
		return "odd"
	}
}

func TestClassifyNumber_Coverage(t *testing.T) {
	tests := []struct {
		input    int
		expected string
	}{
		{-5, "negative"},
		{0, "zero"},
		{4, "even"},
		{7, "odd"},
	}

	for _, test := range tests {
		result := ClassifyNumber(test.input)
		if result != test.expected {
			t.Errorf("ClassifyNumber(%d) = %q, want %q",
				test.input, result, test.expected)
		}
	}
}
