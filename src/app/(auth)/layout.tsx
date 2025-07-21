import Sidebar from "@/components/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="box-border flex flex-col w-full h-full overflow-hidden">
      <Sidebar>
        <div className=" overflow-y-auto">{children}</div>
      </Sidebar>
    </div>
  );
}
