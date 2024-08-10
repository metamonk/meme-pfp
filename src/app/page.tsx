"use client"

import Generator from "@/components/generator"

export default function Home() {
  return (
    <main className="flex flex-col items-center relative z-0 my-16">
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-4">
        <Generator />
      </div>
    </main>
  );
}
