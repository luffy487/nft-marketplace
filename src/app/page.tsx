"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main
      className="flex min-h-screen items-center justify-center p-6 sm:p-12 md:p-24 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 text-center max-w-full md:max-w-5xl px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">
          Welcome to the world of One Piece
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-white mb-4">
          Explore exclusive digital treasures from the legendary world of One
          Piece. Discover, collect, and trade unique NFTs featuring your
          favorite characters and iconic moments.
        </p>
        <button
          className="bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md hover:bg-red-800 transition-colors duration-300"
          onClick={() => router.push("/marketplace")}
        >
          Start Your Adventure
        </button>
      </div>
    </main>
  );
}
