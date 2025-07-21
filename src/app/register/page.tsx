import SignUpFormWrapper from "@/components/forms/register/register_form_wrapper";
import GuestHeader from "@/components/header/header_unautorize";

const RegistrationPage = () => {
  return (
    <section className="flex flex-col w-full h-screen ">
      <GuestHeader />
      <main className="flex flex-col w-full  items-center justify-center gap-4 pt-[150px] pb-[100px] ">
        <h2 className="font-semibold text-[28px] text-black">Cadastre-se</h2>
        <article className="md:h-min md:w-min md:min-w-[400px] w-full h-full md:rounded-md bg-white border border-[#D7D7D7] p-5 flex flex-col  ">
          <SignUpFormWrapper />
        </article>
      </main>
    </section>
  );
};

export default RegistrationPage;
