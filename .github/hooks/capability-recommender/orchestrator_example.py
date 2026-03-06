#!/usr/bin/env python3
"""
Example Orchestrator Integration for CapabilityRecommender Hook

This demonstrates how to integrate the hook into an AI workflow orchestrator.
"""

import asyncio
import json
import time
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
from enum import Enum

from capability_recommender import (
    CapabilityRecommender, 
    TaskContext, 
    CapabilityRecommendation,
    ModelTier,
    EffortLevel
)

class ExecutionStatus(Enum):
    PENDING = "pending"
    RUNNING = "running" 
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class ModelConfig:
    name: str
    tier: ModelTier
    max_tokens: int
    cost_per_token: float
    average_latency_ms: int
    availability: bool = True

@dataclass
class ExecutionResult:
    task_id: str
    success: bool
    tokens_used: int
    execution_time_ms: int
    output: str
    error: Optional[str] = None
    cost: float = 0.0

class MockModelProvider:
    """Mock model provider for demonstration"""
    
    def __init__(self):
        self.models = {
            ModelTier.FAST: [
                ModelConfig("claude-haiku", ModelTier.FAST, 4000, 0.0001, 200),
                ModelConfig("gpt-4o-mini", ModelTier.FAST, 4000, 0.00015, 180)
            ],
            ModelTier.BALANCED: [
                ModelConfig("claude-sonnet", ModelTier.BALANCED, 8000, 0.0003, 500),
                ModelConfig("gpt-4o", ModelTier.BALANCED, 8000, 0.0005, 600)
            ],
            ModelTier.PREMIUM: [
                ModelConfig("claude-opus", ModelTier.PREMIUM, 16000, 0.001, 1200),
                ModelConfig("gpt-4", ModelTier.PREMIUM, 8000, 0.003, 2000)
            ]
        }
    
    def get_available_models(self, tier: ModelTier) -> List[ModelConfig]:
        return [m for m in self.models[tier] if m.availability]
    
    def select_optimal_model(self, tier: ModelTier, estimated_tokens: int) -> ModelConfig:
        available = self.get_available_models(tier)
        if not available:
            # Fallback to any available model
            for fallback_tier in ModelTier:
                fallback = self.get_available_models(fallback_tier)
                if fallback:
                    return fallback[0]
        
        # Select model that can handle the token requirement
        suitable = [m for m in available if m.max_tokens >= estimated_tokens]
        if suitable:
            # Pick the most cost-effective suitable model
            return min(suitable, key=lambda m: m.cost_per_token)
        
        # If no model can handle full tokens, pick the largest
        return max(available, key=lambda m: m.max_tokens)
    
    async def execute_task(self, model: ModelConfig, task: str, 
                          max_tokens: int, timeout: int) -> ExecutionResult:
        """Simulate model execution"""
        start_time = time.time()
        
        # Simulate processing delay based on model latency
        await asyncio.sleep(model.average_latency_ms / 1000)
        
        # Mock token usage (roughly proportional to task complexity)
        tokens_used = min(len(task.split()) * 10 + 200, max_tokens)
        
        # Mock execution time
        execution_time_ms = int((time.time() - start_time) * 1000)
        
        # Calculate cost
        cost = tokens_used * model.cost_per_token
        
        # Mock success (95% success rate)
        import random
        success = random.random() > 0.05
        
        return ExecutionResult(
            task_id=f"task_{int(time.time())}",
            success=success,
            tokens_used=tokens_used,
            execution_time_ms=execution_time_ms,
            output=f"Mock response from {model.name}: Processed '{task[:50]}...'" if success else "",
            error=None if success else "Mock execution error",
            cost=cost
        )

class AIWorkflowOrchestrator:
    """
    Main orchestrator that uses CapabilityRecommender hook for intelligent routing
    """
    
    def __init__(self):
        self.capability_recommender = CapabilityRecommender()
        self.model_provider = MockModelProvider()
        self.execution_history: List[Dict] = []
        self.analytics = {
            'total_requests': 0,
            'total_cost': 0.0,
            'average_confidence': 0.0,
            'model_tier_usage': {tier: 0 for tier in ModelTier},
            'effort_level_distribution': {level: 0 for level in EffortLevel}
        }
    
    async def process_request(self, task_description: str, 
                            context: str = "", 
                            priority: str = "normal",
                            user_id: str = None) -> Dict[str, Any]:
        """
        Main request processing workflow using the capability hook
        """
        # Step 1: Get capability recommendation
        task = TaskContext(
            description=task_description,
            context=context,
            priority=priority,
            user_id=user_id
        )
        
        recommendation = self.capability_recommender.recommend(task)
        
        # Step 2: Select optimal model based on recommendation
        selected_model = self.model_provider.select_optimal_model(
            recommendation.model_tier,
            recommendation.estimated_tokens
        )
        
        # Step 3: Execute task with selected model
        execution_result = await self.model_provider.execute_task(
            selected_model,
            task_description,
            recommendation.estimated_tokens,
            recommendation.suggested_timeout
        )
        
        # Step 4: Collect analytics
        self._update_analytics(recommendation, execution_result)
        
        # Step 5: Log execution for monitoring
        execution_log = {
            'timestamp': time.time(),
            'task': asdict(task),
            'recommendation': recommendation.to_dict(),
            'selected_model': asdict(selected_model),
            'execution_result': asdict(execution_result),
            'cost_efficiency': self._calculate_cost_efficiency(recommendation, execution_result)
        }
        self.execution_history.append(execution_log)
        
        return {
            'success': execution_result.success,
            'output': execution_result.output,
            'error': execution_result.error,
            'metadata': {
                'effort_level': recommendation.effort_level.value,
                'model_used': selected_model.name,
                'confidence': recommendation.confidence,
                'tokens_used': execution_result.tokens_used,
                'estimated_tokens': recommendation.estimated_tokens,
                'cost': execution_result.cost,
                'execution_time_ms': execution_result.execution_time_ms,
                'recommendation_accuracy': self._assess_recommendation_accuracy(
                    recommendation, execution_result
                )
            }
        }
    
    def _update_analytics(self, recommendation: CapabilityRecommendation, 
                         execution_result: ExecutionResult):
        """Update running analytics"""
        self.analytics['total_requests'] += 1
        self.analytics['total_cost'] += execution_result.cost
        
        # Running average confidence
        current_avg = self.analytics['average_confidence']
        n = self.analytics['total_requests']
        self.analytics['average_confidence'] = (
            (current_avg * (n-1) + recommendation.confidence) / n
        )
        
        # Distribution tracking
        self.analytics['model_tier_usage'][recommendation.model_tier] += 1
        self.analytics['effort_level_distribution'][recommendation.effort_level] += 1
    
    def _calculate_cost_efficiency(self, recommendation: CapabilityRecommendation,
                                 execution_result: ExecutionResult) -> float:
        """Calculate cost efficiency score (0-1, higher is better)"""
        if not execution_result.success:
            return 0.0
        
        # Compare actual vs estimated tokens
        token_accuracy = min(
            recommendation.estimated_tokens / max(execution_result.tokens_used, 1),
            execution_result.tokens_used / max(recommendation.estimated_tokens, 1)
        )
        
        # Penalize over-provisioning more than under-provisioning
        if execution_result.tokens_used < recommendation.estimated_tokens:
            token_accuracy *= 0.8  # Slight penalty for waste
        
        return token_accuracy
    
    def _assess_recommendation_accuracy(self, recommendation: CapabilityRecommendation,
                                     execution_result: ExecutionResult) -> Dict[str, float]:
        """Assess how accurate the recommendation was"""
        token_error = abs(
            recommendation.estimated_tokens - execution_result.tokens_used
        ) / max(recommendation.estimated_tokens, 1)
        
        # Simple heuristic: if task succeeded quickly, effort was probably correct
        time_efficiency = min(
            recommendation.suggested_timeout * 1000 / max(execution_result.execution_time_ms, 1),
            1.0
        )
        
        return {
            'token_estimation_error': token_error,
            'time_efficiency': time_efficiency,
            'success': 1.0 if execution_result.success else 0.0
        }
    
    def get_analytics_summary(self) -> Dict[str, Any]:
        """Get comprehensive analytics summary"""
        if self.analytics['total_requests'] == 0:
            return {'message': 'No requests processed yet'}
        
        return {
            'summary': {
                'total_requests': self.analytics['total_requests'],
                'total_cost': round(self.analytics['total_cost'], 4),
                'average_cost_per_request': round(
                    self.analytics['total_cost'] / self.analytics['total_requests'], 4
                ),
                'average_confidence': round(self.analytics['average_confidence'], 3)
            },
            'model_tier_usage': {
                tier.value: count for tier, count in self.analytics['model_tier_usage'].items()
            },
            'effort_level_distribution': {
                level.value: count for level, count in self.analytics['effort_level_distribution'].items()
            },
            'recent_executions': self.execution_history[-5:]  # Last 5 executions
        }

async def demo_orchestrator():
    """Demonstrate the orchestrator with various tasks"""
    
    print("🚀 AI Workflow Orchestrator with CapabilityRecommender Hook")
    print("=" * 60)
    
    orchestrator = AIWorkflowOrchestrator()
    
    # Demo tasks of varying complexity
    demo_tasks = [
        {
            'description': 'What is the difference between Docker and Kubernetes?',
            'context': 'I am new to containerization',
            'priority': 'normal'
        },
        {
            'description': 'Debug this React performance issue in production',
            'context': 'Users reporting slow page loads, suspect component re-renders',
            'priority': 'urgent' 
        },
        {
            'description': 'Design complete microservices architecture for property management',
            'context': 'Multi-tenant SaaS, real-time updates, 10K+ concurrent users',
            'priority': 'normal'
        },
        {
            'description': 'Fix CSS button alignment',
            'context': 'Simple styling fix needed',
            'priority': 'low'
        },
        {
            'description': 'Scaffold entire AI workflow with agents and documentation',
            'context': 'Complete project setup from scratch including GitHub structure',
            'priority': 'normal'
        }
    ]
    
    # Process each task
    for i, task in enumerate(demo_tasks, 1):
        print(f"\n📋 Task {i}: {task['description'][:50]}...")
        
        result = await orchestrator.process_request(**task)
        
        if result['success']:
            print(f"   ✅ Success - Model: {result['metadata']['model_used']}")
            print(f"   Effort: {result['metadata']['effort_level']} | "
                  f"Confidence: {result['metadata']['confidence']:.2f}")
            print(f"   Tokens: {result['metadata']['tokens_used']}/{result['metadata']['estimated_tokens']} | "
                  f"Cost: ${result['metadata']['cost']:.4f}")
        else:
            print(f"   ❌ Failed - {result['error']}")
    
    # Show analytics
    print("\n" + "=" * 60)
    print("📊 ANALYTICS SUMMARY")
    print("=" * 60)
    
    analytics = orchestrator.get_analytics_summary()
    summary = analytics['summary']
    
    print(f"Total Requests: {summary['total_requests']}")
    print(f"Total Cost: ${summary['total_cost']}")
    print(f"Average Cost/Request: ${summary['average_cost_per_request']}")
    print(f"Average Confidence: {summary['average_confidence']}")
    
    print(f"\nModel Tier Usage:")
    for tier, count in analytics['model_tier_usage'].items():
        print(f"   {tier}: {count} requests")
    
    print(f"\nEffort Level Distribution:")
    for level, count in analytics['effort_level_distribution'].items():
        print(f"   {level}: {count} requests")

if __name__ == "__main__":
    # Run the orchestrator demo
    asyncio.run(demo_orchestrator())