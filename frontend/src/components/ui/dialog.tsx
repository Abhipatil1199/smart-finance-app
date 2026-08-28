import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Root ─────────────────────────────────────────────────────────────── */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

/* ─── Backdrop ─────────────────────────────────────────────────────────── */

function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        "transition-opacity duration-200",
        className
      )}
      {...props}
    />
  );
}

/* ─── Popup (the actual panel) ──────────────────────────────────────── */

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogPrimitive.Popup.Props & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed z-50 overflow-y-auto bg-card text-card-foreground shadow-xl outline-none",
          // Mobile: bottom sheet
          "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl",
          // Desktop: centered modal
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
          // Animations
          "data-[starting-style]:translate-y-full data-[starting-style]:sm:translate-y-[calc(-50%+1rem)] data-[starting-style]:sm:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-full data-[ending-style]:sm:translate-y-[calc(-50%+1rem)] data-[ending-style]:sm:scale-95 data-[ending-style]:opacity-0",
          "transition-all duration-300 sm:duration-200",
          className
        )}
        {...props}
      >
        {/* Mobile drag handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/20 sm:hidden" />

        {children}

        {showClose ? (
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              />
            }
          >
            <XIcon className="size-4" />
          </DialogClose>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

/* ─── Header / Title / Description ──────────────────────────────────── */

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-2", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ─── Body / Footer ─────────────────────────────────────────────────── */

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("px-6 py-4", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 px-6 pb-6 pt-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
