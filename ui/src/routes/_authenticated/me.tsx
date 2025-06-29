import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/entities/user";
import { EditProfileForm } from "@/entities/user/ui/editProfileForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/me")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: "/home", replace: true });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <EditProfileForm >
            <>
              <Button onClick={handleGoBack}>Назад</Button>
              <LogoutButton onLogoutClick={handleLogout} />
            </>
          </EditProfileForm>
        </div>
        <div className="flex flex-col gap-4 md:justify-start md:items-start items-stretch">

        </div>
      </div>

    </>
  );
}