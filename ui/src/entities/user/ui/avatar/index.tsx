import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "../../model/userStore";
import { observer } from "mobx-react-lite";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getUserAvatar } from "../../api/user";

export const UserAvatar = observer(() => {
  const navigete = useNavigate()
  const user = userStore.currentUser;
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  useEffect(
    () => {
      getUserAvatar(user!).then(
        (v: string) => {
          setAvatarUrl(v)
        }
      )
    }, []
  )


  const handleProfileClick = () => {
    // Handle profile/settings action here
    console.log("Opening user profile/settings");
    navigete({ to: "/me" })
    // You can navigate to settings page, open modal, etc.
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const isCorrectModifier = isMac ? event.metaKey : event.ctrlKey;

    if (isCorrectModifier && event.key.toLowerCase() === 'u') {
      event.preventDefault();
      handleProfileClick();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center space-x-3 p-2">
          <Avatar>
            <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>
              {user ? getFallback(user.name) : "CN"}
            </AvatarFallback>
          </Avatar>
          <h4>{user?.name || "Username"}</h4>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            Profile
            <DropdownMenuShortcut>{getSettingsShortcut()}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const getFallback = (username: string): string => {
  return username[0];
};

const getSettingsShortcut = (): string => {
  const platform = navigator.platform.toLowerCase();
  const isMac = platform.includes("mac");
  return isMac ? "⌘U" : "Ctrl+U";
};