import type { ChatMessage, ChatResponse, MeasurementResult, ProviderResult, TryOnResult, WeatherResult } from "@/features/ai/types";

export interface AITextProvider {
  readonly name: string;
  chat(messages: ChatMessage[], context?: Record<string, unknown>): Promise<ProviderResult<ChatResponse>>;
}

export interface MeasurementProvider {
  readonly name: string;
  estimate(input: { frontImage: string; sideImage: string }): Promise<ProviderResult<MeasurementResult>>;
}

export interface VirtualTryOnProvider {
  readonly name: string;
  generate(input: { sourceImage: string; productId: string }): Promise<ProviderResult<TryOnResult>>;
}

export interface WeatherProvider {
  readonly name: string;
  current(location: string): Promise<ProviderResult<WeatherResult>>;
}

export type AIProvider = AITextProvider & MeasurementProvider & VirtualTryOnProvider;
