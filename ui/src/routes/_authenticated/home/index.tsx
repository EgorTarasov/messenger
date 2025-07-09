import { Button } from "@/components/ui/button";
import { CreateChatButton } from "@/entities/chats";
import { getUser, getUsersByUsername } from "@/entities/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/home/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const { isMobile, setOpenMobile } = useSidebar();

  const filterUsers = async (username: string) => {
    return await getUsersByUsername(username);
  };

  const handleNewChat = async (newChatID: string) => {
    navigate({ to: `/home/${newChatID}` });
  };

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(true);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1>Выберите или создайте чат!</h1>
        <CreateChatButton
          currentUser={currentUser!}
          filterUsers={filterUsers}
          handleSuccess={handleNewChat}
        >
          <Button>Создать чат!</Button>
        </CreateChatButton>
      </div>
    </div>
  );
}