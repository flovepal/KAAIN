
import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types/message";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Note: This is a placeholder - Supabase functionality will be added after connecting the integration
const fetchMessages = async (): Promise<Message[]> => {
  // This will be replaced with actual Supabase functionality
  return [];
};

// Note: This is a placeholder - Supabase functionality will be added after connecting the integration
const sendMessage = async (content: string): Promise<Message> => {
  // This will be replaced with actual Supabase functionality
  return {
    id: Date.now().toString(),
    content: content,
    created_at: new Date().toISOString(),
  };
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadMessages = async () => {
    try {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        title: "Error loading messages",
        description: "Please refresh the page",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadMessages();
    // This is where we would set up a Supabase subscription for real-time messages
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    setLoading(true);
    try {
      const newMessage = await sendMessage(content);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col bg-lemon-100/60 backdrop-blur-sm border-lemon-200 shadow-md rounded-xl h-[600px] max-h-[80vh] w-full max-w-2xl">
      <div className="flex items-center justify-center p-4 border-b border-lemon-200 bg-lemon-100">
        <h2 className="font-bold text-xl">Anonymous Chat</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto chat-scroll">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-lemon-200">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </Card>
  );
};

export default Chat;
