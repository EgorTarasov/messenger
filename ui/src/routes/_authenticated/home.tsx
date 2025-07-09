import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/entities/chats/ui/chatSidebar.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home")({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden">
        <div className="flex h-full">
          <ChatSidebar>
            <></>
          </ChatSidebar>
          <main className="flex-1 overflow-hidden h-full">
            <Outlet />
          </main>
        </div>

      </div>
    </SidebarProvider >
  );
}