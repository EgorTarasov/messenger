import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ChatList } from "@/entities/chats";
import { getUsersByUsername, UserAvatar } from "@/entities/user";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home")({
  component: ChatLayout,
});

function ChatLayout() {
  const navigate = useNavigate();
  const filterUsers = async (username: string) => {
    return await getUsersByUsername(username);
  };

  const handleNewChat = async (newChatID: string) => {
    navigate({ to: `/home/${newChatID}` });
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <UserAvatar />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarGroupContent>
                <ChatList
                  filterUsers={filterUsers}
                  handleNewChat={handleNewChat}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="w-full h-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
