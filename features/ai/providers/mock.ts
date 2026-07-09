import type { AIProvider, WeatherProvider } from "@/features/ai/interfaces/providers";
import type { ProviderResult, UsageMetrics } from "@/features/ai/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const usage = (started: number, inputTokens = 0, outputTokens = 0): UsageMetrics => ({
  inputTokens,
  outputTokens,
  latencyMs: Date.now() - started,
  estimatedCost: 0,
});

function result<T>(data: T, started: number, inputTokens = 0, outputTokens = 0): ProviderResult<T> {
  return { data, provider: "mock", model: "deterministic-preview-v1", usage: usage(started, inputTokens, outputTokens) };
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  async chat(messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) {
    const started = Date.now();
    await delay(250);
    const prompt = messages.at(-1)?.content.toLowerCase() ?? "";
    const occasion = prompt.includes("wedding") ? "wedding" : prompt.includes("office") ? "office" : prompt.includes("festival") ? "festival" : "day";
    const content = occasion === "wedding"
      ? "For a wedding, consider a jewel-toned silk set with a graceful drape. Gold-toned accessories and a structured blouse keep the look polished."
      : occasion === "office"
        ? "For the office, choose breathable cotton or linen in a clear solid color. A straight silhouette and restrained accessories will feel refined all day."
        : occasion === "festival"
          ? "A rich magenta, emerald, or marigold look in silk or organza suits a festival beautifully. Keep one statement detail and let the fabric lead."
          : "Try a comfortable, balanced look in a color you already enjoy. A breathable fabric and clean silhouette make it easy to wear and repeat.";
    return result({ content, suggestions: ["Suggest colors", "Keep it under my budget", "Which fabric is best?"] }, started, Math.ceil(prompt.length / 4), Math.ceil(content.length / 4));
  }

  async estimate() {
    const started = Date.now();
    await delay(450);
    return result({
      confidence: 0,
      measurements: {},
      warnings: ["Computer vision is not connected. Review and enter measurements before saving."],
    }, started);
  }

  async generate() {
    const started = Date.now();
    await delay(450);
    return result({ imageUrl: null, message: "Image generation provider is ready to connect. No preview was generated." }, started);
  }
}

export class MockWeatherProvider implements WeatherProvider {
  readonly name = "mock";
  async current(location: string) {
    const started = Date.now();
    await delay(120);
    return result({ location, temperature: 28, humidity: 62, season: "Warm", forecast: [] }, started);
  }
}
