import { connectDB } from '../db';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

export async function getConversation(id: string, projectId: string) {
  await connectDB();
  return Conversation.findOne({ _id: id, projectId }).lean();
}

export async function getMessages(conversationId: string) {
  await connectDB();
  return Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
}

export async function updateConversationTitle(id: string, title: string) {
  await connectDB();
  return Conversation.findByIdAndUpdate(id, { title }, { new: true }).lean();
}
