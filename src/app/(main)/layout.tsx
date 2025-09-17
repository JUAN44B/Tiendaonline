import { MainSidebar } from "@/components/main-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <MainSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
