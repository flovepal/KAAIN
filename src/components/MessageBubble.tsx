
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className="flex justify-center w-full mb-4 animate-message-appear">
      <div className="max-w-xs md:max-w-md px-4 py-2 bg-white rounded-2xl shadow-sm border border-lemon-200">
        <p className="text-sm text-center break-words">{message.content}</p>
        <div className="text-[10px] text-muted-foreground text-center mt-1">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
