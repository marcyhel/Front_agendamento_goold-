/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

type GuestHeaderProps = {};

const GuestHeader: React.FC<GuestHeaderProps> = () => {
  const navigation = useRouter();

  const handleRegisterClick = () => {
    navigation.push("/register");
  };

  return (
    <header className="flex w-full h-[93px] min-h-[93px] items-center justify-between px-8 border-b border-[#D7D7D7] fixed z-10 bg-[#F6F4F1] ">
      <div className="brand_logo">
        <Image
          src="/logo.png"
          alt="Brand Logo"
          width={40}
          height={40}
          priority
        />
      </div>
      <Button
        type="button"
        className="#000000 text-white p-4 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
        onClick={handleRegisterClick}
      >
        Cadastre-se
      </Button>
    </header>
  );
};

export default GuestHeader;
