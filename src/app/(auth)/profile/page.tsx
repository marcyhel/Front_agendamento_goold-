"use client";

import ProfileForm from "@/components/forms/profile";
import Header from "@/components/header";

export default function ProfilePage() {
  return (
    <div className="flex w-full h-full flex-col">
      <Header
        title="Minha conta"
        subtitle="Ajuste informações da sua conta de forma simples"
      />

      <div className="flex w-full h-full flex-col overflow-auto p-6 items-center">
        <div className="flex w-fit h-fit my-6 p-8 border rounded-sm border-[#D7D7D7]  bg-white ">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
