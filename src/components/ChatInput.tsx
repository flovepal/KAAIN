
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  loading: boolean;
}

const ChatInput = ({ onSendMessage, loading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

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
      await onSendMessage(message);
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
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-white border-lemon-300 focus-visible:ring-lemon-400"
        disabled={loading}
        autoComplete="off"
      />
      <Button 
        type="submit" 
        className="bg-lemon-400 text-foreground hover:bg-lemon-500"
        disabled={loading || !message.trim()}
      >
        Send
      </Button>
    </form>
  );
};

export default ChatInput;
