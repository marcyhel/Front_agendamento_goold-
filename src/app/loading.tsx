'use client';
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col bg-[#F6F4F1] w-screen h-screen justify-center items-center">
      <Image
        src="/logo.png"
        alt="Brand Logo"
        width={40}
        height={40}
        priority
      />
      <div className="mt-4">Carregando</div>

    </div>
  );
}