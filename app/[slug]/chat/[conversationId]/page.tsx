'use client';
import { useParams } from 'next/navigation';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { useMessages } from '@/hooks/useMessages';
import { useChat } from '@/hooks/useChat';

export default function ConversationPage() {
  const { slug, conversationId } = useParams<{
    slug: string;
    conversationId: string;
  }>();
  const { data: messages = [], isLoading } = useMessages(slug, conversationId);
  const chat = useChat(slug);

  function handleSend(content: string) {
    chat.mutate({ conversationId, content });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isSending={chat.isPending}
      />
      <MessageInput onSend={handleSend} disabled={chat.isPending} />
    </div>
  );
}
