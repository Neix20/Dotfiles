# Go Language Learning Examples

A comprehensive guide to learning Go programming language based on the language checklist.

## Files Overview

### 1. **01_syntax_basics.go**

Covers fundamental Go concepts:

#### Variables & Types
```go
var name string = "Alice"      // explicit type declaration
city := "NYC"                   // type inference (short form, functions only)
const Pi = 3.14159              // constants (immutable)
var age int = age + 1           // variables are mutable
```

Key Points:
- Go has strict typing; use explicit conversion: `float64(intValue)`
- `const` is immutable; `var` is mutable
- Short declaration `:=` only works inside functions
- No implicit type coercion (unlike JavaScript)

#### Control Flow
```go
// If-Else
if age >= 18 {
    // adult
} else if age >= 13 {
    // teen
} else {
    // child
}

// Switch-Case
switch day {
case "Monday":
    // monday logic
default:
    // other
}

// Loops - Go only has FOR
for i := 0; i < 10; i++ { } // traditional
for _, value := range numbers { } // range loop
for { break } // infinite with break
```

#### Functions
```go
func Add(a, b int) int {
    return a + b
}

func Divide(a, b int) (int, int) {
    return a / b, a % b  // multiple returns
}

func Sum(numbers ...int) int { } // variadic
```

#### Data Structures
- **Strings**: `"Hello"`, access with `[index]`, no string class
- **Arrays**: `[3]int{1,2,3}` - fixed size
- **Slices**: `[]int{1,2,3}` - dynamic, `append()`, `slice[start:end)`
- **Maps**: `map[string]int{"a": 1}` - like dicts/objects
- **No sets**: use `map[string]bool` or custom types
- **No tuples**: use structs

#### OOP (Go Style)
```go
type Person struct {
    Name string
    Age  int
}

// Method: function associated with type
func (p Person) Greet() string {
    return "Hi, I'm " + p.Name
}

// Pointer receiver: can modify the struct
func (p *Person) HaveBirthday() {
    p.Age++
}

// Interface: contract that types must satisfy
type Speaker interface {
    Speak() string
}

// Types implicitly implement interfaces (no `implements` keyword)
```

Key Go OOP Differences:
- No classes; use structs + methods
- No inheritance; use composition and embedding
- Interfaces are implicit (structural typing)
- Public/private via capitalization (`Name` vs `name`)
- Encapsulation is simple: export or don't

#### Error Handling
```go
func Divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil  // nil means no error
}

// Usage
result, err := Divide(10, 0)
if err != nil {
    // handle error
    log.Fatal(err)
}
```

This is the Go way - explicit error returns, not exceptions.

---

### 2. **02_testing.go**

Go's built-in testing framework:

#### Unit Testing
```go
func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2,3) = %d, want 5", result)
    }
}
```

Run tests:
```bash
go test .           # run all tests
go test -v .        # verbose output
go test -run TestAdd . # run specific test
```

#### Table-Driven Tests (Best Practice)
```go
func TestMultiplyTable(t *testing.T) {
    tests := []struct {
        a, b, expected int
        name string
    }{
        {3, 4, 12, "positive"},
        {-3, 4, -12, "negative"},
        {0, 5, 0, "zero"},
    }

    for _, test := range tests {
        t.Run(test.name, func(t *testing.T) {
            result := Multiply(test.a, test.b)
            if result != test.expected {
                t.Errorf("got %d, want %d", result, test.expected)
            }
        })
    }
}
```

#### Assertions
```go
t.Error()    // log error, continue
t.Errorf()   // log formatted error, continue
t.Fatal()    // log error, stop test
t.Fatalf()   // log formatted error, stop test
```

#### Benchmarking
```bash
go test -bench=. .          # run benchmarks
go test -bench=. -count=5 . # run 5 times
```

#### Mocking & Stubs
```go
// Use interfaces for testability
type Database interface {
    GetUser(id string) (string, error)
}

// Real implementation
type RealDB struct {}

// Mock for testing
type MockDB struct {
    Users map[string]string
}

// Both implement Database interface
```

#### Test Coverage
```bash
go test -cover .                          # see coverage %
go test -coverprofile=coverage.out .      # generate report
go tool cover -html=coverage.out          # visualize
```

---

### 3. **03_advanced.go**

#### Modules & Packages
- Each directory is a package
- File starts with `package name`
- Exported symbols: `CapitalCase` (public)
- Unexported symbols: `camelCase` (private)
- Import standard library: `import "fmt"`
- Import third-party: `import "github.com/user/repo"`

#### Concurrency - Goroutines
```go
// Launch lightweight "thread"
go func() {
    fmt.Println("runs concurrently")
}()

// Main function waits by default, but goroutines might not finish
// Use channels or sync.WaitGroup
```

#### Channels
```go
// Unbuffered: send/receive at same time
ch := make(chan string)
ch <- "data"    // send
msg := <-ch     // receive (blocks if empty)

// Buffered: can send N times before blocking
ch := make(chan string, 2)
ch <- "msg1"
ch <- "msg2"
// ch <- "msg3" would block

// Close channel
close(ch)
for msg := range ch { } // range ends when closed
```

#### Select Statement
```go
select {
case msg := <-ch1:
    fmt.Println("got from ch1")
case msg := <-ch2:
    fmt.Println("got from ch2")
case <-time.After(5*time.Second):
    fmt.Println("timeout")
}
```

#### WaitGroup (Synchronization)
```go
var wg sync.WaitGroup
wg.Add(2)  // expect 2 goroutines

go func() {
    defer wg.Done()  // signal completion
    // work
}()

wg.Wait()  // block until all Done()
```

#### Mutex (Lock)
```go
var mu sync.Mutex

mu.Lock()
// critical section - only one goroutine at a time
defer mu.Unlock()
```

#### Iterators via Channels
```go
func GenerateNumbers(max int) <-chan int {
    out := make(chan int)
    go func() {
        for i := 0; i <= max; i++ {
            out <- i
        }
        close(out)
    }()
    return out
}

// Use it
for num := range GenerateNumbers(5) {
    fmt.Println(num)
}
```

---

## Running the Examples

### Run all tests:
```bash
cd /Users/justin/Exercism/go/examples
go test -v .
```

### Run specific test:
```bash
go test -run TestMultiply -v .
```

### Run benchmarks:
```bash
go test -bench=. .
```

### Check test coverage:
```bash
go test -cover .
```

### View coverage report:
```bash
go test -coverprofile=coverage.out .
go tool cover -html=coverage.out  # opens in browser
```

---

## Go Quirks & Best Practices

### ✅ Do's
- Use interfaces for design (flexibility, mockability)
- Handle errors explicitly (check `err != nil`)
- Use table-driven tests
- Export only what needs exporting (lowercase for private)
- Use `defer` for cleanup (file close, unlock, etc.)
- Prefer composition over inheritance

### ❌ Don'ts
- Don't use `panic()` unless unrecoverable
- Don't ignore error returns
- Don't use global variables
- Don't create "kitchen sink" packages
- Don't use exceptions (Go has no try-catch)

### Go Philosophy
> "Make it boring" - Go prioritizes simplicity and clarity over cleverness

---

### 4. **04_design_patterns_test.go**

Real-world design patterns implemented in Go:

#### 1. Dependency Injection
Injects dependencies via constructors instead of creating them internally.
```go
type UserService struct {
    logger Logger  // dependency
}

func NewUserService(logger Logger) *UserService {
    return &UserService{logger: logger}
}
```

**Benefits:**
- Testable: inject mock logger
- Flexible: swap implementations
- Decoupled: service doesn't depend on concrete logger

**Use when:** Need to swap implementations (e.g., LocalStorage vs CloudStorage)

#### 2. Abstract Factory
Creates families of related objects without specifying concrete types.
```go
type UIFactory interface {
    CreateButton() Button
    CreateCheckbox() Checkbox
}

// Different factories for different platforms
Windows := WindowsFactory{}
Mac := MacFactory{}
```

**Benefits:**
- Ensure related products work together
- Easy to add new families (iOS, Android)
- Hide concrete classes from client

**Use when:** Multiple families of related objects (Windows/Mac UI, MySQL/PostgreSQL DB)

#### 3. Strategy Pattern
Encapsulates different algorithms and lets them swap at runtime.
```go
type PaymentStrategy interface {
    Pay(amount float64) string
}

processor.SetPaymentStrategy(&CreditCardPayment{})
processor.SetPaymentStrategy(&PayPalPayment{})  // swap at runtime
```

**Benefits:**
- Avoid large if-else chains
- Easy to add new strategies
- Runtime flexibility

**Use when:** Multiple ways to do something (payment, sorting, compression)

#### 4. Adapter Pattern
Converts incompatible interfaces to work together.
```go
// Old interface
type OldPaymentGateway { MakePayment(card string, cents int) }

// New interface adapter
adapter := NewPaymentGatewayAdapter(oldGateway)
adapter.ProcessTransaction(99.99, "token")  // works with new interface
```

**Benefits:**
- Integrate legacy code with new systems
- Use third-party libraries
- Single Responsibility: adapter only converts

**Use when:** Integrating incompatible systems (new code + legacy code)

#### 5. Combined Pattern Example
Order service using Dependency Injection + Strategy:
```go
service := NewOrderService(
    &CreditCardPayment{CardNumber: "1234"},
    &StandardShipping{},
)
service.PlaceOrder(99.99, "address")

// Switch strategy at runtime
service.shippingMethod = &ExpressShipping{}
```

---

## Next Steps

1. ✅ Study each file: understand variables, control flow, functions
2. ✅ Write tests for simple functions (table-driven)
3. ✅ Experiment with goroutines and channels
4. ✅ Build a small project (TODO app, API server, CLI tool)
5. ✅ Read [Effective Go](https://golang.org/doc/effective_go)

---

## Checklist Progress

- [x] Variables & Types
- [x] Control Flow
- [x] Functions
- [x] Data Structures
- [x] OOP (Structs, Methods, Interfaces)
- [x] Error Handling
- [x] Unit Testing
- [x] Table-Driven Tests
- [x] Assertions
- [x] Mocking & Stubs
- [x] Test Coverage
- [x] Benchmarking
- [x] Modules/Packages
- [x] Concurrency (Goroutines, Channels)
- [x] Iterators/Generators
- [x] Design Patterns
  - [x] Dependency Injection
  - [x] Abstract Factory
  - [x] Strategy Pattern
  - [x] Adapter Pattern
