// image-picker.tsx
// A shadcn/ui-style ImagePicker component
// Dependencies: class-variance-authority, next/image, lucide-react

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { ImageIcon, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const imagePickerVariants = cva(
  [
    "group relative flex flex-col items-center justify-center",
    "rounded-lg border-2 border-dashed border-input",
    "bg-muted/40 transition-colors duration-200",
    "cursor-pointer outline-none",
    "hover:border-primary/60 hover:bg-muted/60",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "data-[has-value=true]:border-solid data-[has-value=true]:border-input data-[has-value=true]:bg-transparent",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-24 w-24 rounded-md",
        md: "h-36 w-36 rounded-lg",
        lg: "h-48 w-48 rounded-xl",
        full: "h-full w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImagePickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof imagePickerVariants> {
  /** Controlled image URL (e.g. existing upload from server) */
  value?: string | null;
  /** Called with the selected File, or null when cleared */
  onChange?: (file: File | null) => void;
  /** Native <input accept="…"> value. Defaults to "image/*" */
  accept?: string;
  /** Custom placeholder rendered when no image is selected */
  placeholder?: React.ReactNode;
  /** Disables all interaction */
  disabled?: boolean;
  /** Forwarded to the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ImagePicker = React.forwardRef<HTMLDivElement, ImagePickerProps>(
  (
    {
      value,
      onChange,
      accept = "image/*",
      size,
      placeholder,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = React.useState<string | null>(value ?? null);

    // Sync external value changes (e.g. form reset)
    React.useEffect(() => {
      setPreview(value ?? null);
    }, [value]);

    // Revoke object URL on unmount / replacement to avoid memory leaks
    const prevObjectUrl = React.useRef<string | null>(null);
    React.useEffect(() => {
      return () => {
        if (prevObjectUrl.current) {
          URL.revokeObjectURL(prevObjectUrl.current);
        }
      };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0];
      if (!file) return;

      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
      }
      const objectUrl = URL.createObjectURL(file);
      prevObjectUrl.current = objectUrl;
      setPreview(objectUrl);
      onChange?.(file);

      // Reset input so the same file can be re-selected
      e.currentTarget.value = "";
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
        prevObjectUrl.current = null;
      }
      setPreview(null);
      onChange?.(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inputRef.current?.click();
      }
    };

    const hasValue = Boolean(preview);

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={hasValue ? "Change image" : "Upload image"}
        aria-disabled={disabled}
        data-has-value={hasValue}
        data-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        className={cn(imagePickerVariants({ size }), className)}
        {...props}
      >
        {/* Hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          onChange={handleFileChange}
        />

        {/* Image preview */}
        {hasValue ? (
          <>
            <Image
              src={preview!}
              alt="Selected image preview"
              fill
              className="rounded-[inherit] object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Upload className="h-5 w-5 text-white" aria-hidden="true" />
            </div>

            {/* Clear button */}
            {!disabled && (
              <button
                type="button"
                aria-label="Remove image"
                onClick={handleClear}
                className={cn(
                  "absolute right-1 top-1 z-10",
                  "flex h-5 w-5 items-center justify-center rounded-full",
                  "bg-foreground/80 text-background",
                  "opacity-0 transition-opacity group-hover:opacity-100",
                  "hover:bg-foreground focus-visible:opacity-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </>
        ) : (
          /* Placeholder */
          (placeholder ?? <DefaultPlaceholder size={size} />)
        )}
      </div>
    );
  },
);

ImagePicker.displayName = "ImagePicker";

// ---------------------------------------------------------------------------
// Default Placeholder
// ---------------------------------------------------------------------------

function DefaultPlaceholder({
  size,
}: {
  size?: VariantProps<typeof imagePickerVariants>["size"];
}) {
  const iconSize =
    size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center text-muted-foreground">
      <ImageIcon className={iconSize} aria-hidden="true" />
      {size !== "sm" && (
        <span className={cn("font-medium leading-tight", textSize)}>
          Upload image
        </span>
      )}
    </div>
  );
}

export { ImagePicker, imagePickerVariants };