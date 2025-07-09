import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { ChatList } from "@/entities/chats";
import { getUser, getUsersByUsername, UserAvatar } from "@/entities/user";
import { useNavigate } from "@tanstack/react-router";


interface ChatSidebarProps {
    children: React.ReactNode;
}

export const ChatSidebar = ({ children }: ChatSidebarProps) => {
    const navigate = useNavigate();

    const filterUsers = async (username: string) => {
        return await getUsersByUsername(username);
    };

    const handleNewChat = async (newChatID: string) => {
        navigate({ to: `/home/${newChatID}` });
    };

    return (
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
                {children}
            </SidebarContent>
        </Sidebar>
    );
};