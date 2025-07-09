import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/entities/chats/ui/chatSidebar.tsx";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home")({
  component: ChatLayout,
});

function ChatLayout() {
  const params = useParams({ strict: false });
  const currentChatId = params.chatId;

  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-hidden">
        <div className="flex h-full">
          <ChatSidebar currentChatID={currentChatId} />
          <main className="flex-1 overflow-hidden h-full relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider >
  );
}