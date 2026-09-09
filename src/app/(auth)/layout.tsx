import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-neutral-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
