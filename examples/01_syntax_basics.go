package examples

// ============================================================================
// 1. VARIABLES & TYPES
// ============================================================================

// Variables declaration
var globalVar string = "I am global"

const Pi = 3.14159 // Constant (type inferred)

func VariablesAndTypes() {
	// Declaration styles
	var name string = "Alice" // explicit type
	var age int = 30
	city := "New York" // type inference (short declaration, only in functions)
	_, _, _ = name, age, city // use variables

	// Type coercion (Go is strict, use conversion)
	var a int = 10
	var b float64 = float64(a) // explicit conversion
	_ = b // use variable

	// Constants
	const maxRetries = 3

	// Mutability - Go variables are mutable by default
	name = "Bob" // Can change
	// Pi = 3.14  // Error: can't reassign constant
}

// ============================================================================
// 2. CONTROL FLOW
// ============================================================================

func ControlFlow() {
	// If-Else
	score := 85
	if score >= 90 {
		// A
	} else if score >= 80 {
		// B
	} else {
		// C
	}

	// Switch-Case
	day := "Monday"
	switch day {
	case "Monday":
		// start of week
	case "Friday":
		// almost weekend
	default:
		// other day
	}

	// For loops (Go has only FOR, no WHILE)
	for i := 0; i < 5; i++ {
		// loop 5 times
	}

	// Range loop
	numbers := []int{1, 2, 3, 4}
	for index, value := range numbers {
		_, _ = index, value // use both
	}

	// Infinite loop with break
	for {
		// do something
		break
	}
}

// Error handling (Go style - explicit error returns)
func DivideWithError(a, b int) (int, error) {
	if b == 0 {
		return 0, ErrorDivideByZero
	}
	return a / b, nil
}

// Custom error type
type ErrorType struct {
	Message string
}

func (e *ErrorType) Error() string {
	return e.Message
}

var ErrorDivideByZero = &ErrorType{"cannot divide by zero"}

// ============================================================================
// 3. FUNCTIONS
// ============================================================================

// Simple function with parameters and return type
func Add(a int, b int) int {
	return a + b
}

// Multiple return values
func Divide(a, b int) (int, int) {
	return a / b, a % b
}

// Named return values
func SwapStrings(a, b string) (first string, second string) {
	first = b
	second = a
	return // implicit return with named values
}

// Variadic function (variable number of arguments)
func Sum(numbers ...int) int {
	total := 0
	for _, n := range numbers {
		total += n
	}
	return total
}

// Functions as first-class objects
func ApplyOperation(a, b int, operation func(int, int) int) int {
	return operation(a, b)
}

// Closure/Lambda
func MakeMultiplier(factor int) func(int) int {
	return func(x int) int {
		return x * factor
	}
}

// ============================================================================
// 4. DATA STRUCTURES
// ============================================================================

func DataStructures() {
	// Strings
	str := "Hello, Go!"
	_ = len(str)                    // get length
	_ = str[0:5]                    // substring
	_ = IndexString(str, "Go")      // custom search

	// Arrays (fixed size)
	arr := [3]int{1, 2, 3}
	_ = arr[0]        // access element
	_ = len(arr)      // length

	// Slices (dynamic arrays)
	slice := []int{1, 2, 3}
	slice = append(slice, 4)        // add element
	newSlice := slice[1:3]          // slice [start:end)
	_ = newSlice

	// Maps (dictionaries)
	person := map[string]string{
		"name": "Alice",
		"city": "NYC",
	}
	person["age"] = "30"            // add/update
	delete(person, "age")           // remove
	value := person["name"]         // access
	_ = value

	// No sets in Go, use map[string]bool or custom type
	set := make(map[string]bool)
	set["golang"] = true
	set["rust"] = true

	// No tuples in Go by default - use structs
	type Point struct {
		X int
		Y int
	}
	p := Point{1, 2}
	_ = p.X
}

// String utility
func IndexString(s, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

// ============================================================================
// 5. OOP (Structs and Methods in Go)
// ============================================================================

// Struct definition
type Animal struct {
	name  string
	age   int
}

// Method (associated with type) - receiver syntax
func (a Animal) Speak() string {
	return a.name + " makes a sound"
}

// Pointer receiver (can modify the struct)
func (a *Animal) HaveBirthday() {
	a.age++
}

// Interface definition
type Speaker interface {
	Speak() string
}

// Go uses implicit interface implementation
type Dog struct {
	Animal
	breed string
}

func (d Dog) Speak() string {
	return d.name + " barks"
}

// Encapsulation via capitalization
// Exported (public): functions/fields start with uppercase
// Unexported (private): start with lowercase

// Polymorphism via interfaces
func MakeSpeakTwice(s Speaker) string {
	return s.Speak() + " " + s.Speak()
}
