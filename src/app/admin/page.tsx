import AdminAuthForm from "@/components/forms/admin";
import Image from "next/image";

export default function AdminAuth() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <Image
        src="/logo.png"
        alt="Brand Logo"
        width={60}
        height={60}
        priority
      />
      <h2 className="font-semibold text-[28px] text-black">Login Admin</h2>
      <div className="md:h-min md:w-min md:min-w-[600px] w-full h-full md:rounded-md bg-white p-5 flex flex-col">
        <AdminAuthForm />
      </div>
    </div>
  );
}
