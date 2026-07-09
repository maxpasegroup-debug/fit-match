import type { AIProvider, WeatherProvider } from "@/features/ai/interfaces/providers";
import { MockAIProvider, MockWeatherProvider } from "@/features/ai/providers/mock";

const aiProviders = new Map<string, AIProvider>([["mock", new MockAIProvider()]]);
const weatherProviders = new Map<string, WeatherProvider>([["mock", new MockWeatherProvider()]]);

export function getAIProvider(name = "mock"): AIProvider {
  const provider = aiProviders.get(name);
  if (!provider) throw new Error(`AI provider '${name}' is not registered.`);
  return provider;
}

export function getWeatherProvider(name = "mock"): WeatherProvider {
  const provider = weatherProviders.get(name);
  if (!provider) throw new Error(`Weather provider '${name}' is not registered.`);
  return provider;
}

export function registerAIProvider(provider: AIProvider) {
  aiProviders.set(provider.name, provider);
}
