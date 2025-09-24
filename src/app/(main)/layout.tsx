import { MainSidebar } from "@/components/main-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Settings } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div>
                 <h1 className="text-lg font-semibold">DEMOSTRACIÓN</h1>
                 <p className="text-sm text-muted-foreground">Panel de Control de Sistema</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/40?u=admin" data-ai-hint="admin avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
