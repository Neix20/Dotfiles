// TypeScript type definitions for CapabilityRecommender Hook

export enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum ModelTier {
  FAST = 'fast',
  BALANCED = 'balanced', 
  PREMIUM = 'premium'
}

export enum Priority {
  URGENT = 'urgent',
  NORMAL = 'normal',
  LOW = 'low'
}

export interface TaskContext {
  description: string;
  context?: string;
  priority?: Priority;
  userId?: string;
  projectType?: string;
  deadline?: string;
  tags?: string[];
}

export interface CapabilityRecommendation {
  effortLevel: EffortLevel;
  modelTier: ModelTier;
  reasoning: string;
  confidence: number; // 0-1
  estimatedTokens: number;
  suggestedTimeout: number; // seconds
  costTier: 'low' | 'medium' | 'high';
  metadata?: {
    analysisTimestamp?: string;
    hookVersion?: string;
    priority?: Priority;
    hasContext?: boolean;
    wordCount?: number;
    [key: string]: any;
  };
}

export interface HookConfig {
  patterns: {
    low: string[];
    medium: string[];
    high: string[];
  };
  modelMapping: Record<string, string>;
  tokenEstimates: Record<string, number>;
  timeouts: Record<string, number>;
  costMultipliers: Record<string, number>;
  projectTypeAdjustments?: Record<string, {
    minTier?: ModelTier;
    effortBoost?: number;
    costPreference?: string;
  }>;
  priorityAdjustments?: Record<string, {
    tierUpgrade?: boolean;
    timeoutMultiplier?: number;
    costPreference?: string;
  }>;
  confidenceThresholds?: {
    high: number;
    medium: number;
    low: number;
  };
  fallbackBehavior?: {
    lowConfidence?: string;
    unknownPatterns?: string;
    emptyDescription?: string;
  };
  featureFlags?: {
    enableProjectTypeBoost?: boolean;
    enablePriorityUpgrades?: boolean;
    enableConfidenceAdjustments?: boolean;
    enableCostOptimization?: boolean;
  };
}

// Hook function interface
export type CapabilityHookFunction = (
  taskDescription: string,
  context?: string,
  priority?: Priority,
  options?: {
    userId?: string;
    projectType?: string;
    deadline?: string;
    [key: string]: any;
  }
) => Promise<CapabilityRecommendation>;

// Orchestrator integration interface
export interface OrchestrationContext {
  task: TaskContext;
  recommendation: CapabilityRecommendation;
  selectedModel?: {
    name: string;
    tier: ModelTier;
    maxTokens: number;
    costPerToken: number;
  };
  executionPlan?: {
    steps: string[];
    parallelExecution: boolean;
    retryPolicy: {
      maxRetries: number;
      backoffMs: number;
    };
  };
}

// Model selection interface
export interface ModelSelector {
  getAvailableModels(tier: ModelTier): string[];
  selectOptimalModel(
    tier: ModelTier,
    estimatedTokens: number,
    priority: Priority
  ): string;
  getCostEstimate(model: string, tokens: number): number;
}

// Feedback interface for continuous improvement
export interface HookFeedback {
  taskId: string;
  originalRecommendation: CapabilityRecommendation;
  actualExecution: {
    modelUsed: string;
    actualTokens: number;
    executionTime: number;
    success: boolean;
    quality?: number; // 1-10 rating
  };
  userFeedback?: {
    satisfactionRating: number; // 1-5
    wasRecommendationAccurate: boolean;
    suggestedImprovement?: string;
  };
}

// Analytics interface
export interface HookAnalytics {
  recommendations: {
    total: number;
    byEffortLevel: Record<EffortLevel, number>;
    byModelTier: Record<ModelTier, number>;
    averageConfidence: number;
  };
  accuracy: {
    effortLevelAccuracy: number;
    modelTierAccuracy: number;
    tokenEstimationError: number; // percentage
  };
  costs: {
    totalEstimated: number;
    totalActual: number;
    savings: number;
  };
  performance: {
    averageHookLatency: number;
    cacheHitRate: number;
  };
}

// Export default hook instance type
export interface CapabilityRecommenderHook {
  recommend(task: TaskContext): Promise<CapabilityRecommendation>;
  updateConfig(newConfig: Partial<HookConfig>): void;
  getAnalytics(): HookAnalytics;
  provideFeedback(feedback: HookFeedback): void;
}