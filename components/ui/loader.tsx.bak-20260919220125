import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "size-5",
  md: "size-10",
  lg: "size-14",
};

export function Loader({
  text = "Loading...",
  size = "md",
  className,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <Spinner className={cn(spinnerSizeMap[size], "text-muted-foreground")} />
      {text && <p className="field-legend text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
