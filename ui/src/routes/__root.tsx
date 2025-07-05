import { LoginButton } from "@/entities/user";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// Error component with login button using Tailwind CSS
const NotFoundComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="text-lg text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <LoginButton
        onLoginClick={() => {
          navigate({ to: "/login" });
        }}
      />
    </div>
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
  notFoundComponent: NotFoundComponent,
});
