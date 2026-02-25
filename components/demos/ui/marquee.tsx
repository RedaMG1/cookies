import { cn } from "@/lib/utils";

export function Marquee({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex w-max animate-marquee gap-8">
        {children}
        {children}
      </div>
    </div>
  );
}