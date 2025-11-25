import React from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen w-full antialiased"
      style={{ 
        backgroundColor: '#FFFFFF',
        color: '#000000',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
}

