import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      {children}
    </div>
  );
}
