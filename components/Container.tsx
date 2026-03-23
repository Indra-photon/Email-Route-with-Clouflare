import React from "react";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <main className={`w-full relative ${className} max-w-7xl mx-auto`}>
      {children}
    </main>
  );
};
