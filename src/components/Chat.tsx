import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types/message";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase, getClientFingerprint } from "@/integrations/supabase/client";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const clientFingerprint = getClientFingerprint();

  const loadMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*, reply_to_message:messages!reply_to(*)')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Process messages to include isReplyTo property
      const processedMessages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        reply_to: msg.reply_to,
        client_fingerprint: msg.client_fingerprint,
        isReplyTo: msg.reply_to_message ? {
          id: msg.reply_to_message.id,
          content: msg.reply_to_message.content,
          created_at: msg.reply_to_message.created_at,
          reply_to: msg.reply_to_message.reply_to,
          client_fingerprint: msg.reply_to_message.client_fingerprint
        } : undefined
      }));

      setMessages(processedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error loading messages",
        description: "Please refresh the page",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        // When a new message is inserted, fetch it with its reply_to details if any
        if (payload.new) {
          const { data: newMessageWithReply } = await supabase
            .from('messages')
            .select('*, reply_to_message:messages!reply_to(*)')
            .eq('id', payload.new.id)
            .single();
            
          if (newMessageWithReply) {
            const processedMessage: Message = {
              id: newMessageWithReply.id,
              content: newMessageWithReply.content,
              created_at: newMessageWithReply.created_at,
              reply_to: newMessageWithReply.reply_to,
              client_fingerprint: newMessageWithReply.client_fingerprint,
              isReplyTo: newMessageWithReply.reply_to_message ? {
                id: newMessageWithReply.reply_to_message.id,
                content: newMessageWithReply.reply_to_message.content,
                created_at: newMessageWithReply.reply_to_message.created_at,
                reply_to: newMessageWithReply.reply_to_message.reply_to,
                client_fingerprint: newMessageWithReply.reply_to_message.client_fingerprint
              } : undefined
            };
            
            setMessages(prev => [...prev, processedMessage]);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string, replyToId: string | null) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('messages').insert({
        content,
        reply_to: replyToId,
        client_fingerprint: clientFingerprint
      });

      if (error) throw error;
      
      // Clear reply state after sending
      if (replyToId) {
        setReplyTo(null);
      }
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

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  return (
    <Card className="flex flex-col bg-lemon-100/60 backdrop-blur-sm border-lemon-200 shadow-md rounded-xl h-[600px] max-h-[80vh] w-full max-w-2xl">
      <div className="flex items-center justify-center p-4 border-b border-lemon-200 bg-lemon-100">
        <h2 className="font-bold text-xl">Anonymous Kaain</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto chat-scroll">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onReply={handleReply}
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-lemon-200">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          loading={loading}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
        />
      </div>
    </Card>
  );
};

export default Chat;
