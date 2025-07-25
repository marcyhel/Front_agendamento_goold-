import Sidebar from "@/components/sidebar";
import { ProfileProvider } from "@/context/profile.context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="box-border flex flex-col w-full h-full overflow-hidden">
      <ProfileProvider>
        <Sidebar>
          <div className=" overflow-y-auto">{children}</div>
        </Sidebar>
      </ProfileProvider>

    </div>
  );
}
