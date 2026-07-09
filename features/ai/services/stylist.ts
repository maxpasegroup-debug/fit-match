import { getAIProvider } from "@/features/ai/providers/registry";
import { defaultPrompts } from "@/features/ai/prompts";
import { assertFeatureAvailable } from "@/features/ai/services/configuration";
import { recordUsage } from "@/features/ai/services/usage";
import { prisma } from "@/lib/db/prisma";

export async function sendStylistMessage(userId: string, message: string, conversationId?: string) {
  const configuration = await assertFeatureAvailable(userId, "STYLIST");
  const conversation = conversationId
    ? await prisma.aIConversation.findFirstOrThrow({ where: { id: conversationId, userId } })
    : await prisma.aIConversation.create({ data: { userId, provider: configuration.provider, title: message.slice(0, 60) } });
  await prisma.aIConversationMessage.create({ data: { conversationId: conversation.id, role: "USER", content: message } });
  const history = await prisma.aIConversationMessage.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: "asc" }, take: 20 });
  const provider = getAIProvider(configuration.provider);
  const result = await provider.chat([
    { role: "system", content: defaultPrompts.stylist },
    ...history.map((item) => ({ role: item.role === "USER" ? "user" as const : "assistant" as const, content: item.content })),
  ]);
  const assistant = await prisma.aIConversationMessage.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", content: result.data.content, metadata: { suggestions: result.data.suggestions } },
  });
  await recordUsage({ userId, feature: "STYLIST", result, conversationId: conversation.id });
  return { conversationId: conversation.id, message: assistant, suggestions: result.data.suggestions };
}
