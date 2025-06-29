import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { userStore } from "../../model/userStore";

interface LogoutButtonProps {
  onLogoutClick: () => void;
  children?: React.ReactNode;
}

export const LogoutButton = observer((props: LogoutButtonProps) => {
  const onLogOut = () => {
    userStore.logout();
    props.onLogoutClick();
  };

  return <Button onClick={onLogOut}> {props.children || "Выйти"} </Button>;
});
