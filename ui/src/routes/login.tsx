import { LoginForm } from "@/entities/user/";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm
        onSuccess={() => {
          navigate({ to: "/home" });
        }}
      />
    </div>
  );
}
