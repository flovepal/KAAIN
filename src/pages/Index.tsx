
import React from "react";
import Chat from "@/components/Chat";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-lemon-50 via-lemon-100 to-lemon-200">
      <header className="w-full py-6 px-4">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-lemon-gradient">
            Lemon Chat
          </h1>
          <p className="text-center mt-2 text-muted-foreground">
            An anonymous chat space - just start typing!
          </p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl px-4 pb-10 flex items-start justify-center">
        <Chat />
      </main>
      
      <footer className="w-full py-4 border-t border-lemon-200">
        <div className="container max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Lemon Chat - Anonymous messaging for everyone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
