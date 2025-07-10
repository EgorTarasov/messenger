import { Toaster } from "sonner";
import { StrictMode } from "react";
import { routeTree } from "../routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { configure } from "mobx";
import "../index.css";

// mobx config
configure({
  useProxies: "never",
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
export const App = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
  return (
    <>
      <StrictMode>
        <RouterProvider router={router} />
        <Toaster />
      </StrictMode>
      ,
    </>
  );
};
