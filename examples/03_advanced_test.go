package examples

import (
	"fmt"
	"sync"
	"time"
)

// ============================================================================
// MODULES/PACKAGES/NAMESPACING
// ============================================================================

// In Go:
// - Each file belongs to a package (defined with 'package' keyword)
// - Package = directory
// - Exported symbols start with uppercase (Snake, Add, GreetUser)
// - Unexported symbols are lowercase (helper, internal, log)
// - To import: "import path/to/package"
// - Standard library: import "fmt", "net/http", "encoding/json"
// - Third-party: import "github.com/user/package"

// Example exported function
func ExportedFunction() string {
	return "I am public"
}

// Example unexported function
func unexportedHelper() string {
	return "I am private"
}

// ============================================================================
// CONCURRENCY - GOROUTINES & CHANNELS
// ============================================================================

// Goroutine: lightweight thread managed by Go runtime
func ConcurrencyBasics() {
	// Launch goroutine
	go func() {
		fmt.Println("Running in goroutine")
	}()

	// Channel: send/receive data between goroutines
	messages := make(chan string)

	// Send to channel in goroutine
	go func() {
		messages <- "Hello from goroutine"
	}()

	// Receive from channel (blocks until data available)
	msg := <-messages
	fmt.Println(msg)
}

// Worker pool pattern
func ProcessTasks(tasks []int) []int {
	results := make(chan int, 10)
	var wg sync.WaitGroup

	// Launch worker goroutines
	for _, task := range tasks {
		wg.Add(1)
		go func(t int) {
			defer wg.Done()
			results <- t * 2 // process task
		}(task)
	}

	// Close results channel when all workers done
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	var processed []int
	for result := range results {
		processed = append(processed, result)
	}
	return processed
}

// Channel select pattern (async waiting)
func SelectChannels() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "first"
	}()

	go func() {
		time.Sleep(200 * time.Millisecond)
		ch2 <- "second"
	}()

	// Wait for first channel to have data
	select {
	case msg1 := <-ch1:
		fmt.Println("Got:", msg1)
	case msg2 := <-ch2:
		fmt.Println("Got:", msg2)
	case <-time.After(1 * time.Second):
		fmt.Println("Timeout")
	}
}

// Buffered channels
func BufferedChannels() {
	// Create channel with buffer of 2
	messages := make(chan string, 2)

	// Can send 2 without blocking
	messages <- "message 1"
	messages <- "message 2"

	// Now would block if we try to send 3rd without receiving

	fmt.Println(<-messages)
	fmt.Println(<-messages)
}

// Mutex for shared state protection
type Counter struct {
	mu    sync.Mutex
	value int
}

func (c *Counter) Increment() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.value++
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.value
}

// ============================================================================
// ITERATORS/GENERATORS (Not built-in like Python, but achievable)
// ============================================================================

// Generator pattern using channels
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

// Range over generator
func UseGenerator() {
	for num := range GenerateNumbers(5) {
		fmt.Println(num)
	}
}

// Iterator pattern using methods
type Iterator interface {
	HasNext() bool
	Next() interface{}
}

type SliceIterator struct {
	data  []int
	index int
}

func (si *SliceIterator) HasNext() bool {
	return si.index < len(si.data)
}

func (si *SliceIterator) Next() interface{} {
	if !si.HasNext() {
		return nil
	}
	value := si.data[si.index]
	si.index++
	return value
}

func NewSliceIterator(data []int) Iterator {
	return &SliceIterator{data: data, index: 0}
}

// ============================================================================
// ADVANCED: CONTEXT (for cancellation and timeouts)
// ============================================================================

// Note: Would require "import context" which is not available in this example package
// But here's how it would work:
/*
import "context"

func ContextCancellation() {
	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Launch job that respects context
	go func(ctx context.Context) {
		select {
		case <-time.After(3 * time.Second):
			fmt.Println("Job completed")
		case <-ctx.Done():
			fmt.Println("Job cancelled or timed out")
		}
	}(ctx)

	time.Sleep(3 * time.Second)
}
*/

// ============================================================================
// ADVANCED: REFLECTION (Introspection)
// ============================================================================

// Example: Generic function that works with any type
type Wrapper struct {
	Value interface{}
}

func (w Wrapper) String() string {
	// In real reflection code, you'd inspect the type
	return fmt.Sprintf("Wrapper contains: %v", w.Value)
}

// Note: Full reflection would use "import reflect" which not in this example
// Go's interface{} provides some dynamic typing capabilities
