import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";

interface LoginButtonProps {
  onLoginClick: () => void;
  children?: React.ReactNode;
}

export const LoginButton = observer((props: LoginButtonProps) => {
  return (
    <Button onClick={props.onLoginClick}>{props.children || "Войти"}</Button>
  );
});
