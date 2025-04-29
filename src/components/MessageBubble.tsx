
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { Copy, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message) => void;
}

const MessageBubble = ({ message, onReply }: MessageBubbleProps) => {
  const [showControls, setShowControls] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Message has been copied to your clipboard",
          duration: 2000,
        });
      })
      .catch((error) => {
        console.error("Could not copy text: ", error);
        toast({
          title: "Copy failed",
          description: "Could not copy text to clipboard",
          variant: "destructive",
          duration: 2000,
        });
      });
  };
  
  return (
    <div 
      className="flex flex-col w-full mb-4 animate-message-appear"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {message.isReplyTo && (
        <div className="flex justify-center w-full mb-1">
          <div className="max-w-xs md:max-w-md px-3 py-1 bg-lemon-100/70 rounded-lg text-xs text-muted-foreground italic border border-lemon-200/50">
            Replying to: {message.isReplyTo.content}
          </div>
        </div>
      )}
      
      <div className="flex justify-center w-full">
        <div className="relative max-w-xs md:max-w-md px-4 py-2 bg-white rounded-2xl shadow-sm border border-lemon-200">
          <p className="text-sm text-center break-words">{message.content}</p>
          <div className="text-[10px] text-muted-foreground text-center mt-1">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {showControls && (
            <div className="absolute -bottom-3 right-2 flex space-x-1">
              <button 
                onClick={handleCopy}
                className="bg-lemon-100 hover:bg-lemon-200 p-1 rounded-full border border-lemon-300 text-xs transition-colors"
                aria-label="Copy"
              >
                <Copy className="h-3 w-3" />
              </button>
              <button 
                onClick={() => onReply(message)}
                className="bg-lemon-100 hover:bg-lemon-200 p-1 rounded-full border border-lemon-300 text-xs transition-colors"
                aria-label="Reply"
              >
                <MessageSquare className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
