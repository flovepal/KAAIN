
export interface Message {
  id: string;
  content: string;
  created_at: string;
  reply_to: string | null;
  client_fingerprint: string | null;
  isReplyTo?: Message; // For UI purposes to show the message being replied to
}
