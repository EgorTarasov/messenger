import { Separator } from "@/components/ui/separator";
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
import { getUser, getUsersByUsername, UserAvatar } from "@/entities/user";
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
          <SidebarHeader className="bg-white">
            <UserAvatar />
            <Separator />
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarGroupContent>
                <ChatList
                  currentUser={getUser()!}
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
