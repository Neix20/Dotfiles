#!/usr/bin/env python3
"""
Test suite and examples for CapabilityRecommender Hook
"""

import json
import sys
from pathlib import Path
from typing import List, Dict

# Add the hooks directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from capability_recommender import CapabilityRecommender, TaskContext, EffortLevel, ModelTier

class HookTester:
    def __init__(self):
        self.recommender = CapabilityRecommender()
        self.test_cases = self._load_test_cases()
    
    def _load_test_cases(self) -> List[Dict]:
        """Define test cases covering various scenarios"""
        return [
            {
                "name": "Simple Query",
                "task": TaskContext(
                    description="What is the difference between Epics and User Stories?",
                    context="I'm new to Jira and project management"
                ),
                "expected": {
                    "effort_level": EffortLevel.LOW,
                    "model_tier": ModelTier.FAST
                }
            },
            {
                "name": "Medium Development Task",
                "task": TaskContext(
                    description="Help me debug this React component performance issue",
                    context="Component is re-rendering too frequently, causing lag",
                    priority="normal"
                ),
                "expected": {
                    "effort_level": EffortLevel.MEDIUM,
                    "model_tier": ModelTier.BALANCED
                }
            },
            {
                "name": "Complex Architecture Task",
                "task": TaskContext(
                    description="Design microservices architecture for property management system",
                    context="Need to handle multi-tenancy, real-time updates, and scaling",
                    priority="normal",
                    project_type="enterprise"
                ),
                "expected": {
                    "effort_level": EffortLevel.HIGH,
                    "model_tier": ModelTier.PREMIUM
                }
            },
            {
                "name": "Urgent Simple Task",
                "task": TaskContext(
                    description="Fix this CSS styling issue quickly",
                    context="Button alignment is broken in production",
                    priority="urgent"
                ),
                "expected": {
                    "effort_level": EffortLevel.LOW,
                    "model_tier": ModelTier.BALANCED  # Upgraded due to urgency
                }
            },
            {
                "name": "Full Project Scaffold",
                "task": TaskContext(
                    description="Scaffold all of our AI Workflow with documentation and agents",
                    context="Need complete setup from scratch including .github structure",
                    priority="normal",
                    project_type="production"
                ),
                "expected": {
                    "effort_level": EffortLevel.HIGH,
                    "model_tier": ModelTier.PREMIUM
                }
            },
            {
                "name": "Code Review Task",
                "task": TaskContext(
                    description="Review and improve this Python function for better performance",
                    context="Function processes large datasets but is running slowly"
                ),
                "expected": {
                    "effort_level": EffortLevel.MEDIUM,
                    "model_tier": ModelTier.BALANCED
                }
            },
            {
                "name": "Documentation Request",
                "task": TaskContext(
                    description="Create API documentation for our REST endpoints",
                    context="Need comprehensive docs with examples"
                ),
                "expected": {
                    "effort_level": EffortLevel.MEDIUM,
                    "model_tier": ModelTier.BALANCED
                }
            },
            {
                "name": "Quick File Search",
                "task": TaskContext(
                    description="Find all TypeScript files in the project",
                    context=""
                ),
                "expected": {
                    "effort_level": EffortLevel.LOW,
                    "model_tier": ModelTier.FAST
                }
            }
        ]
    
    def run_single_test(self, test_case: Dict) -> Dict:
        """Run a single test case and return results"""
        recommendation = self.recommender.recommend(test_case["task"])
        
        # Check if predictions match expectations
        effort_match = recommendation.effort_level == test_case["expected"]["effort_level"]
        tier_match = recommendation.model_tier == test_case["expected"]["model_tier"]
        
        return {
            "name": test_case["name"],
            "task_description": test_case["task"].description,
            "prediction": {
                "effort_level": recommendation.effort_level.value,
                "model_tier": recommendation.model_tier.value,
                "confidence": round(recommendation.confidence, 3),
                "estimated_tokens": recommendation.estimated_tokens,
                "cost_tier": recommendation.cost_tier
            },
            "expected": {
                "effort_level": test_case["expected"]["effort_level"].value,
                "model_tier": test_case["expected"]["model_tier"].value
            },
            "matches": {
                "effort_level": effort_match,
                "model_tier": tier_match,
                "overall": effort_match and tier_match
            },
            "reasoning": recommendation.reasoning
        }
    
    def run_all_tests(self) -> Dict:
        """Run all test cases and return summary"""
        results = []
        total_tests = len(self.test_cases)
        correct_effort = 0
        correct_tier = 0
        correct_overall = 0
        
        print("Running CapabilityRecommender Hook Tests...")
        print("=" * 60)
        
        for test_case in self.test_cases:
            result = self.run_single_test(test_case)
            results.append(result)
            
            if result["matches"]["effort_level"]:
                correct_effort += 1
            if result["matches"]["model_tier"]: 
                correct_tier += 1
            if result["matches"]["overall"]:
                correct_overall += 1
            
            # Print individual test result
            status = "✅ PASS" if result["matches"]["overall"] else "❌ FAIL"
            print(f"{status} {result['name']}")
            print(f"   Task: {result['task_description'][:60]}...")
            print(f"   Predicted: {result['prediction']['effort_level']}/{result['prediction']['model_tier']} (confidence: {result['prediction']['confidence']})")
            print(f"   Expected:  {result['expected']['effort_level']}/{result['expected']['model_tier']}")
            if not result["matches"]["overall"]:
                print(f"   Reasoning: {result['reasoning']}")
            print()
        
        # Calculate accuracy
        accuracy = {
            "effort_level": correct_effort / total_tests,
            "model_tier": correct_tier / total_tests,
            "overall": correct_overall / total_tests
        }
        
        # Print summary
        print("=" * 60)
        print("TEST SUMMARY:")
        print(f"Total Tests: {total_tests}")
        print(f"Effort Level Accuracy: {accuracy['effort_level']:.1%} ({correct_effort}/{total_tests})")
        print(f"Model Tier Accuracy: {accuracy['model_tier']:.1%} ({correct_tier}/{total_tests})")
        print(f"Overall Accuracy: {accuracy['overall']:.1%} ({correct_overall}/{total_tests})")
        
        return {
            "total_tests": total_tests,
            "results": results,
            "accuracy": accuracy,
            "summary": {
                "correct_effort": correct_effort,
                "correct_tier": correct_tier,
                "correct_overall": correct_overall
            }
        }

def demonstrate_hook_usage():
    """Demonstrate different ways to use the hook"""
    
    print("\n" + "=" * 60)
    print("HOOK USAGE DEMONSTRATIONS")
    print("=" * 60)
    
    # Example 1: Direct usage
    print("\n1. Direct Hook Usage:")
    recommender = CapabilityRecommender()
    
    task = TaskContext(
        description="Create a comprehensive project management system",
        context="Including user authentication, task tracking, and reporting",
        priority="normal",
        project_type="enterprise"
    )
    
    recommendation = recommender.recommend(task)
    print(f"   Effort: {recommendation.effort_level.value}")
    print(f"   Model: {recommendation.model_tier.value}")
    print(f"   Tokens: {recommendation.estimated_tokens}")
    print(f"   Cost Tier: {recommendation.cost_tier}")
    print(f"   Reasoning: {recommendation.reasoning}")
    
    # Example 2: JSON API usage
    print("\n2. JSON API Usage:")
    from capability_recommender import capability_hook
    
    result = capability_hook(
        "Help me understand React hooks",
        context="I'm new to React and functional components",
        priority="normal"
    )
    
    print("   Response:", json.dumps(result, indent=2)[:200] + "...")
    
    # Example 3: CLI usage
    print("\n3. CLI Usage Examples:")
    print("   python capability_recommender.py 'Design API architecture'")
    print("   python capability_recommender.py 'What is Docker?' --priority low")
    print("   python capability_recommender.py 'Fix critical bug' --priority urgent --json")

def benchmark_performance():
    """Simple performance benchmark"""
    import time
    
    print("\n" + "=" * 60)
    print("PERFORMANCE BENCHMARK")
    print("=" * 60)
    
    recommender = CapabilityRecommender()
    
    # Test different task complexities
    tasks = [
        "What is Python?",
        "Build a REST API with authentication and database integration",
        "Design enterprise-scale microservices architecture with monitoring, logging, deployment automation, and multi-region disaster recovery"
    ]
    
    for i, task_desc in enumerate(tasks, 1):
        task = TaskContext(description=task_desc)
        
        # Measure time
        start_time = time.time()
        recommendation = recommender.recommend(task)
        end_time = time.time()
        
        print(f"\nTask {i}: {task_desc[:50]}...")
        print(f"   Processing time: {(end_time - start_time)*1000:.2f}ms")
        print(f"   Result: {recommendation.effort_level.value}/{recommendation.model_tier.value}")
        print(f"   Confidence: {recommendation.confidence:.3f}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='CapabilityRecommender Hook Test Suite')
    parser.add_argument('--test', action='store_true', help='Run test suite')
    parser.add_argument('--demo', action='store_true', help='Show usage demonstrations')
    parser.add_argument('--benchmark', action='store_true', help='Run performance benchmark')
    parser.add_argument('--all', action='store_true', help='Run everything')
    
    args = parser.parse_args()
    
    if args.all or not any([args.test, args.demo, args.benchmark]):
        args.test = args.demo = args.benchmark = True
    
    tester = HookTester()
    
    if args.test:
        tester.run_all_tests()
    
    if args.demo:
        demonstrate_hook_usage()
    
    if args.benchmark:
        benchmark_performance()