#!/usr/bin/env python3
"""
CapabilityRecommender Hook for AI Workflow Orchestration

This hook analyzes incoming tasks and provides dual recommendations:
1. Effort Level Classification (Low/Medium/High)
2. Model Tier Suggestion (Fast/Balanced/Premium)
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from enum import Enum
from pathlib import Path

class EffortLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class ModelTier(Enum):
    FAST = "fast"        # Haiku, GPT-4o-mini - Cost efficient
    BALANCED = "balanced"  # Sonnet, GPT-4o - Good balance
    PREMIUM = "premium"    # Opus, GPT-4 - Best quality

@dataclass
class TaskContext:
    description: str
    context: str = ""
    priority: str = "normal"  # urgent, normal, low
    user_id: Optional[str] = None
    project_type: Optional[str] = None
    deadline: Optional[str] = None

@dataclass
class CapabilityRecommendation:
    effort_level: EffortLevel
    model_tier: ModelTier
    reasoning: str
    confidence: float
    estimated_tokens: int
    suggested_timeout: int
    cost_tier: str  # low, medium, high
    metadata: Dict = None

    def to_dict(self) -> Dict:
        data = asdict(self)
        data['effort_level'] = self.effort_level.value
        data['model_tier'] = self.model_tier.value
        return data

class CapabilityRecommender:
    """
    Main hook class for capability and model tier recommendations
    """
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_config(config_path)
        self._compile_patterns()
        
    def _load_config(self, config_path: Optional[str] = None) -> Dict:
        """Load hook configuration"""
        if config_path is None:
            config_path = Path(__file__).parent / "hook_config.json"
        
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default configuration if no config file exists"""
        return {
            "patterns": {
                "low": [
                    r'\b(what|explain|define|show|list|find|read|check|view)\b',
                    r'\b(simple|quick|basic|easy|straightforward)\b',
                    r'\?$',
                    r'\b(help.*understand|clarify|tell.*about)\b'
                ],
                "medium": [
                    r'\b(analyze|compare|implement|create|build|debug|fix)\b',
                    r'\b(integrate|process|transform|generate|develop)\b',
                    r'\b(help.*with|step.*by.*step|walk.*through)\b',
                    r'\b(update|modify|change|improve)\b'
                ],
                "high": [
                    r'\b(design|architect|orchestrate|optimize|refactor)\b',
                    r'\b(complex|advanced|system|enterprise|scale|comprehensive)\b',
                    r'\b(entire|full.*stack|end.*to.*end|complete.*system)\b',
                    r'\b(from.*scratch|new.*project|bootstrap|scaffold)\b'
                ]
            },
            "model_mapping": {
                "low": "fast",
                "medium": "balanced", 
                "high": "premium"
            },
            "token_estimates": {
                "low": 800,
                "medium": 3000,
                "high": 8000
            },
            "timeouts": {
                "low": 45,
                "medium": 120,
                "high": 300
            },
            "cost_multipliers": {
                "fast": 1.0,
                "balanced": 3.0,
                "premium": 10.0
            }
        }
    
    def _compile_patterns(self):
        """Compile regex patterns for efficiency"""
        patterns = self.config["patterns"]
        self.low_regex = re.compile('|'.join(patterns["low"]), re.IGNORECASE)
        self.medium_regex = re.compile('|'.join(patterns["medium"]), re.IGNORECASE)
        self.high_regex = re.compile('|'.join(patterns["high"]), re.IGNORECASE)
    
    def classify_effort_level(self, task: TaskContext) -> Tuple[EffortLevel, float]:
        """
        Classify effort level with confidence score
        Returns (effort_level, confidence_score)
        """
        text = f"{task.description} {task.context}".lower()
        
        # Count pattern matches
        low_matches = len(self.low_regex.findall(text))
        medium_matches = len(self.medium_regex.findall(text))
        high_matches = len(self.high_regex.findall(text))
        
        # Heuristic analysis
        scores = self._calculate_heuristic_scores(text, task)
        
        # Add pattern match scores
        scores[EffortLevel.LOW] += low_matches * 2
        scores[EffortLevel.MEDIUM] += medium_matches * 2
        scores[EffortLevel.HIGH] += high_matches * 2
        
        # Determine winner
        max_score = max(scores.values())
        if max_score == 0:
            return EffortLevel.MEDIUM, 0.6  # Default to medium
        
        effort_level = max(scores, key=scores.get)
        
        # Calculate confidence
        total_score = sum(scores.values())
        confidence = min(max_score / total_score if total_score > 0 else 0.6, 0.95)
        
        return effort_level, confidence
    
    def _calculate_heuristic_scores(self, text: str, task: TaskContext) -> Dict[EffortLevel, int]:
        """Calculate scores based on heuristics"""
        scores = {level: 0 for level in EffortLevel}
        
        word_count = len(text.split())
        
        # Word count heuristics
        if word_count > 100:
            scores[EffortLevel.HIGH] += 2
        elif word_count > 50:
            scores[EffortLevel.MEDIUM] += 1
        elif word_count < 20:
            scores[EffortLevel.LOW] += 1
        
        # Technical indicators
        tech_indicators = ['code', 'function', 'class', 'api', 'database', 'algorithm']
        tech_score = sum(1 for indicator in tech_indicators if indicator in text)
        if tech_score >= 2:
            scores[EffortLevel.HIGH] += 1
        elif tech_score == 1:
            scores[EffortLevel.MEDIUM] += 1
        
        # File/project indicators
        file_indicators = ['file', 'directory', 'project', 'repository', 'workspace']
        if any(indicator in text for indicator in file_indicators):
            scores[EffortLevel.MEDIUM] += 1
        
        # Priority adjustments
        if task.priority == "urgent":
            scores[EffortLevel.HIGH] += 1
        
        # Project type adjustments
        if task.project_type in ['enterprise', 'production', 'system']:
            scores[EffortLevel.HIGH] += 1
        
        return scores
    
    def suggest_model_tier(self, effort_level: EffortLevel, task: TaskContext) -> ModelTier:
        """Suggest appropriate model tier based on effort and context"""
        base_tier = ModelTier(self.config["model_mapping"][effort_level.value])
        
        # Priority upgrades
        if task.priority == "urgent":
            if base_tier == ModelTier.FAST:
                return ModelTier.BALANCED
            elif base_tier == ModelTier.BALANCED:
                return ModelTier.PREMIUM
        
        # Project type considerations
        if task.project_type == "production" and base_tier == ModelTier.FAST:
            return ModelTier.BALANCED
        
        return base_tier
    
    def estimate_resources(self, effort_level: EffortLevel, model_tier: ModelTier) -> Tuple[int, int, str]:
        """Estimate tokens, timeout, and cost tier"""
        tokens = self.config["token_estimates"][effort_level.value]
        timeout = self.config["timeouts"][effort_level.value]
        
        # Adjust for model tier
        if model_tier == ModelTier.PREMIUM:
            tokens = int(tokens * 1.2)  # Premium models might use more tokens
            timeout = int(timeout * 1.1)
        
        # Cost tier calculation
        cost_multiplier = self.config["cost_multipliers"][model_tier.value]
        relative_cost = tokens * cost_multiplier
        
        if relative_cost < 2000:
            cost_tier = "low"
        elif relative_cost < 10000:
            cost_tier = "medium"
        else:
            cost_tier = "high"
        
        return tokens, timeout, cost_tier
    
    def generate_reasoning(self, effort_level: EffortLevel, model_tier: ModelTier, 
                          task: TaskContext, confidence: float) -> str:
        """Generate human-readable reasoning"""
        effort_reasons = {
            EffortLevel.LOW: "Simple query or basic operation",
            EffortLevel.MEDIUM: "Multi-step task requiring analysis and implementation",
            EffortLevel.HIGH: "Complex task requiring deep reasoning and system design"
        }
        
        tier_reasons = {
            ModelTier.FAST: "fast, cost-efficient model",
            ModelTier.BALANCED: "balanced model for moderate complexity",
            ModelTier.PREMIUM: "premium model for best quality output"
        }
        
        confidence_note = ""
        if confidence < 0.7:
            confidence_note = " (Low confidence - consider manual review)"
        
        return f"{effort_reasons[effort_level]}. Recommending {tier_reasons[model_tier]}.{confidence_note}"
    
    def recommend(self, task: TaskContext) -> CapabilityRecommendation:
        """
        Main recommendation method - the hook entry point
        """
        # Classify effort level
        effort_level, confidence = self.classify_effort_level(task)
        
        # Suggest model tier
        model_tier = self.suggest_model_tier(effort_level, task)
        
        # Estimate resources
        tokens, timeout, cost_tier = self.estimate_resources(effort_level, model_tier)
        
        # Generate reasoning
        reasoning = self.generate_reasoning(effort_level, model_tier, task, confidence)
        
        # Collect metadata
        metadata = {
            "analysis_timestamp": None,  # Would be set by orchestrator
            "hook_version": "1.0.0",
            "priority": task.priority,
            "has_context": bool(task.context.strip()),
            "word_count": len(f"{task.description} {task.context}".split())
        }
        
        return CapabilityRecommendation(
            effort_level=effort_level,
            model_tier=model_tier,
            reasoning=reasoning,
            confidence=confidence,
            estimated_tokens=tokens,
            suggested_timeout=timeout,
            cost_tier=cost_tier,
            metadata=metadata
        )

# Hook interface functions for orchestrator integration
def capability_hook(task_description: str, context: str = "", 
                   priority: str = "normal", **kwargs) -> Dict:
    """
    Main hook function called by the orchestrator
    """
    recommender = CapabilityRecommender()
    task = TaskContext(
        description=task_description,
        context=context,
        priority=priority,
        user_id=kwargs.get('user_id'),
        project_type=kwargs.get('project_type'),
        deadline=kwargs.get('deadline')
    )
    
    recommendation = recommender.recommend(task)
    return recommendation.to_dict()

# CLI interface for testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Test CapabilityRecommender Hook')
    parser.add_argument('task', help='Task description to analyze')
    parser.add_argument('--context', default='', help='Additional context')
    parser.add_argument('--priority', choices=['urgent', 'normal', 'low'], 
                       default='normal', help='Task priority')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    
    args = parser.parse_args()
    
    result = capability_hook(args.task, args.context, args.priority)
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"Task: {args.task}")
        print(f"Effort Level: {result['effort_level']}")
        print(f"Model Tier: {result['model_tier']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print(f"Estimated Tokens: {result['estimated_tokens']}")
        print(f"Timeout: {result['suggested_timeout']}s")
        print(f"Cost Tier: {result['cost_tier']}")
        print(f"Reasoning: {result['reasoning']}")