import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(({ id, title, description }) => (
        <div
          key={id}
          className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg px-4 py-3 max-w-sm"
        >
          {title && <p className="font-medium">{title}</p>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      ))}
    </div>
  );
}
