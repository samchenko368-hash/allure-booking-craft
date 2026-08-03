import { createContext, useContext, useMemo } from "react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type FlipCardRotate = "x" | "y";

type FlipCardContextValue = { rotate: FlipCardRotate };

const FlipCardContext = createContext<FlipCardContextValue | null>(null);

const ROTATION_CLASS = {
  x: { hover: "group-hover/card:[transform:rotateX(180deg)]" },
  y: { hover: "group-hover/card:[transform:rotateY(180deg)]" },
} as const;

function useFlipCard() {
  const context = useContext(FlipCardContext);
  if (!context) {
    throw new Error("FlipCard.Front and FlipCard.Back must be used within FlipCard.");
  }
  return context;
}

type FlipCardRootProps = ComponentProps<"div"> & { rotate?: FlipCardRotate };

function FlipCardRoot({ rotate = "y", className, children, ...props }: FlipCardRootProps) {
  const value = useMemo(() => ({ rotate }), [rotate]);

  return (
    <FlipCardContext.Provider value={value}>
      <div className={cn("group/card [perspective:1400px]", className)} {...props}>
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]",
            ROTATION_CLASS[rotate].hover,
          )}
        >
          {children}
        </div>
      </div>
    </FlipCardContext.Provider>
  );
}

type FlipCardFaceProps = ComponentProps<"div">;

function FlipCardFront({ className, ...props }: FlipCardFaceProps) {
  useFlipCard();
  return (
    <div
      className={cn("absolute inset-0 [backface-visibility:hidden]", className)}
      {...props}
    />
  );
}

function FlipCardBack({ className, ...props }: FlipCardFaceProps) {
  const { rotate } = useFlipCard();
  return (
    <div
      className={cn(
        "absolute inset-0 [backface-visibility:hidden]",
        rotate === "x" ? "[transform:rotateX(180deg)]" : "[transform:rotateY(180deg)]",
        className,
      )}
      {...props}
    />
  );
}

const FlipCard = Object.assign(FlipCardRoot, {
  Front: FlipCardFront,
  Back: FlipCardBack,
});

export default FlipCard;
export { FlipCard, FlipCardBack, FlipCardFront, FlipCardRoot };
