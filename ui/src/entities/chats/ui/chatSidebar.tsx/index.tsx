import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { ChatList } from "@/entities/chats";
import { getUser, getUsersByUsername, UserAvatar } from "@/entities/user";
import { useNavigate } from "@tanstack/react-router";

interface ChatSidebarProps {
    children?: React.ReactNode;
    currentChatID?: string
}

export const ChatSidebar = ({ children, currentChatID }: ChatSidebarProps) => {
    const navigate = useNavigate();
    const { isMobile, setOpenMobile } = useSidebar();

    const filterUsers = async (username: string) => {
        return await getUsersByUsername(username);
    };

    const handleNewChat = async (newChatID: string) => {
        if (isMobile) {
            setOpenMobile(false);
        }
        navigate({ to: `/home/${newChatID}` });
    };

    const onCurrentChatID = () => {
        setOpenMobile(false);
    }

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
                            currentChatID={currentChatID}
                            onCurrentChatID={onCurrentChatID}
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