import { cn } from "@/lib/utils";

export function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-black/10 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
      {children}
    </div>
  );
}