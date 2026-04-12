import { connectDB } from '../db';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import { ProductInstance } from '../models/ProductInstance';
import { getIntegrationData } from './integrationService';

export async function sendChat(
  conversationId: string,
  projectId: string,
  userContent: string,
) {
  await connectDB();

  const convo = await Conversation.findById(conversationId).lean();
  if (!convo || convo.projectId.toString() !== projectId)
    throw new Error('Not found');

  const instance = await ProductInstance.findById(
    convo.productInstanceId,
  ).lean();

  // Gather integration context
  const steps: string[] = [];
  let integrationContext = '';

  if (instance?.integrations?.shopify?.enabled) {
    steps.push('Checking Shopify orders...');
    const data = await getIntegrationData('shopify');
    integrationContext += `\nShopify context: ${JSON.stringify(data)}`;
  }
  if (instance?.integrations?.crm?.enabled) {
    steps.push('Checking CRM records...');
    const data = await getIntegrationData('crm');
    integrationContext += `\nCRM context: ${JSON.stringify(data)}`;
  }

  // Call AI
  steps.push('Thinking...');
  const aiReply = await callAI(userContent, integrationContext);

  // Persist messages
  await Message.create({
    conversationId,
    role: 'user',
    content: userContent,
    steps: [],
  });
  await Message.create({
    conversationId,
    role: 'assistant',
    content: aiReply,
    steps,
  });

  return { reply: aiReply, steps };
}

async function callAI(userContent: string, context: string) {
  const res = await fetch(`${process.env.AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-flash-1.5', // free tier on OpenRouter
      messages: [
        { role: 'system', content: `You are an AI sales assistant.${context}` },
        { role: 'user', content: userContent },
      ],
    }),
  });
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? 'No response.';
}
