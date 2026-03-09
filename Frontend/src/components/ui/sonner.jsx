import { Toaster as SonnerLib } from "sonner";

export function Toaster() {
  return (
    <SonnerLib
      position="top-center"
      richColors
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  );
}
