import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/core/lib/auth_config"; // ajuste o caminho se necessário

import LoginForm from "@/components/forms/auth";
import GuestHeader from "@/components/header/header_unautorize";

const LandingPage = async () => {
  const session = await getServerSession(authOptions);


  if (session) {
    redirect("/reservation");
  }

  return (
    <section className="flex flex-col w-full h-full">
      <GuestHeader />
      <main className="flex flex-col w-full h-full items-center justify-center gap-4">
        <h2 className="font-semibold text-[28px] text-black">
          Entre na sua conta
        </h2>
        <article className="md:h-min md:w-min md:min-w-[400px] w-full h-full md:rounded-sm bg-white border border-[#D7D7D7] p-5 flex flex-col max-w-[400px]">
          <LoginForm />
        </article>
      </main>
    </section>
  );
};

export default LandingPage;
