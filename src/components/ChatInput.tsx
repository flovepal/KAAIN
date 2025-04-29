
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/types/message";
import { MessageSquare, Send, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, replyToId: string | null) => Promise<void>;
  loading: boolean;
  replyTo: Message | null;
  onCancelReply: () => void;
}

const ChatInput = ({ onSendMessage, loading, replyTo, onCancelReply }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when replying to a message
  useEffect(() => {
    if (replyTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please type a message before sending",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSendMessage(message, replyTo?.id || null);
      setMessage("");
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      {replyTo && (
        <div className="flex items-center mb-2 px-3 py-1 bg-lemon-100 rounded-md border border-lemon-300">
          <MessageSquare className="h-3 w-3 mr-2 text-lemon-600" />
          <span className="text-xs flex-1 truncate">
            Replying to: {replyTo.content}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0" 
            onClick={onCancelReply}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-white border-lemon-300 focus-visible:ring-lemon-400"
          disabled={loading}
          autoComplete="off"
        />
        <Button 
          type="submit" 
          className="bg-lemon-400 text-foreground hover:bg-lemon-500 flex items-center gap-1"
          disabled={loading || !message.trim()}
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
