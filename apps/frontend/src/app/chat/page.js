"use client";

import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">💬 Chat Room</h1>
      <ChatWindow matchId={1} userId={1} />
    </main>
  );
}