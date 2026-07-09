export type AIProviderName = "mock" | (string & {});

export type UsageMetrics = {
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedCost: number;
};

export type ProviderResult<T> = {
  data: T;
  provider: AIProviderName;
  model?: string;
  usage: UsageMetrics;
};

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };
export type ChatResponse = { content: string; suggestions: string[] };

export type MeasurementResult = {
  confidence: number;
  measurements: Record<string, number>;
  warnings: string[];
};

export type TryOnResult = { imageUrl: string | null; message: string };

export type WeatherResult = {
  location: string;
  temperature: number;
  humidity: number;
  season: string;
  forecast: Array<{ day: string; temperature: number; condition: string }>;
};
