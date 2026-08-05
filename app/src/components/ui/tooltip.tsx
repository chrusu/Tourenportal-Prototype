import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Custom, mouse-anchored tooltip (intentionally not Radix's Popper-based
 * positioning, which anchors to the trigger element's bounding box and can
 * flip to overlap neighbouring rows/content).
 *
 * The tooltip always opens near the pointer, preferring (in this order):
 * top-right, top-left, bottom-right, bottom-left of the cursor — whichever
 * of these first has enough room in the viewport. This keeps a moving
 * pointer from ever "landing" on the tooltip itself when e.g. moving up
 * toward the element above (the tooltip is also `pointer-events-none`, so
 * even at the edges it never intercepts the pointer).
 */

interface Point {
  x: number;
  y: number;
}

interface TooltipContextValue {
  open: boolean;
  point: Point | null;
  requestOpen: (point: Point) => void;
  requestClose: () => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const TooltipDelayContext = React.createContext<number>(200);

interface TooltipProviderProps {
  delayDuration?: number;
  skipDelayDuration?: number;
  children?: React.ReactNode;
}

function TooltipProvider({ delayDuration = 200, children }: TooltipProviderProps) {
  return (
    <TooltipDelayContext.Provider value={delayDuration}>{children}</TooltipDelayContext.Provider>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const delayDuration = React.useContext(TooltipDelayContext);
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState<Point | null>(null);
  const timeoutRef = React.useRef<number>();

  const requestOpen = React.useCallback(
    (p: Point) => {
      setPoint(p);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setOpen(true), delayDuration);
    },
    [delayDuration]
  );

  const requestClose = React.useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const value = React.useMemo(
    () => ({ open, point, requestOpen, requestClose }),
    [open, point, requestOpen, requestClose]
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

function useTooltipContext(component: string): TooltipContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error(`${component} must be used within a <Tooltip>`);
  return ctx;
}

function composeHandlers<E>(
  original: ((e: E) => void) | undefined,
  ours: (e: E) => void
): (e: E) => void {
  return (e: E) => {
    original?.(e);
    ours(e);
  };
}

interface TooltipTriggerProps {
  /** Present for API compatibility; the trigger always clones its child. */
  asChild?: boolean;
  children: React.ReactElement;
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children }, forwardedRef) => {
    const { requestOpen, requestClose } = useTooltipContext("TooltipTrigger");

    const handlePointerEnter = (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      requestOpen({ x: e.clientX, y: e.clientY });
    };
    const handlePointerLeave = (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      requestClose();
    };
    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      requestOpen({ x: rect.right, y: rect.top });
    };
    const handleBlur = () => requestClose();

    return React.cloneElement(children, {
      ref: forwardedRef,
      onPointerEnter: composeHandlers(children.props.onPointerEnter, handlePointerEnter),
      onPointerLeave: composeHandlers(children.props.onPointerLeave, handlePointerLeave),
      onFocus: composeHandlers(children.props.onFocus, handleFocus),
      onBlur: composeHandlers(children.props.onBlur, handleBlur),
    });
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

type Placement = "top-right" | "top-left" | "bottom-right" | "bottom-left";

const CURSOR_GAP = 14;
const VIEWPORT_PADDING = 8;

interface TooltipContentProps {
  className?: string;
  children: React.ReactNode;
  /** Accepted for backward compatibility; placement is otherwise automatic. */
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children }, forwardedRef) => {
    const { open, point } = useTooltipContext("TooltipContent");
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
    const [placement, setPlacement] = React.useState<Placement>("top-right");

    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // Reset measurement whenever the tooltip (re-)opens so stale sizing from
    // a previous tooltip instance is never used for the new placement.
    React.useLayoutEffect(() => {
      if (!open) {
        setSize(null);
        return;
      }
    }, [open]);

    React.useLayoutEffect(() => {
      if (!open || !point || !innerRef.current) return;
      const rect = innerRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }, [open, point, children]);

    React.useLayoutEffect(() => {
      if (!size || !point) return;
      const fitsRight = point.x + CURSOR_GAP + size.width <= window.innerWidth - VIEWPORT_PADDING;
      const fitsLeft = point.x - CURSOR_GAP - size.width >= VIEWPORT_PADDING;
      const fitsTop = point.y - CURSOR_GAP - size.height >= VIEWPORT_PADDING;
      const fitsBottom = point.y + CURSOR_GAP + size.height <= window.innerHeight - VIEWPORT_PADDING;

      // Priority: top-right, top-left, bottom-right, bottom-left.
      if (fitsTop && fitsRight) setPlacement("top-right");
      else if (fitsTop && fitsLeft) setPlacement("top-left");
      else if (fitsBottom && fitsRight) setPlacement("bottom-right");
      else if (fitsBottom && fitsLeft) setPlacement("bottom-left");
      else setPlacement("top-right");
    }, [size, point]);

    if (!open || !point) return null;

    const width = size?.width ?? 0;
    const height = size?.height ?? 0;
    let top: number;
    let left: number;
    if (placement === "top-right") {
      top = point.y - CURSOR_GAP - height;
      left = point.x + CURSOR_GAP;
    } else if (placement === "top-left") {
      top = point.y - CURSOR_GAP - height;
      left = point.x - CURSOR_GAP - width;
    } else if (placement === "bottom-right") {
      top = point.y + CURSOR_GAP;
      left = point.x + CURSOR_GAP;
    } else {
      top = point.y + CURSOR_GAP;
      left = point.x - CURSOR_GAP - width;
    }

    // Clamp within the viewport as a last resort (e.g. very large tooltip).
    if (size) {
      const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - VIEWPORT_PADDING - width);
      const maxTop = Math.max(VIEWPORT_PADDING, window.innerHeight - VIEWPORT_PADDING - height);
      left = Math.min(Math.max(left, VIEWPORT_PADDING), maxLeft);
      top = Math.min(Math.max(top, VIEWPORT_PADDING), maxTop);
    }

    return createPortal(
      <div
        ref={setRefs}
        role="tooltip"
        style={{ position: "fixed", top, left, visibility: size ? "visible" : "hidden" }}
        className={cn(
          // SAC CI/CD look: sharp corners, red border, white surface.
          "z-50 max-w-xs overflow-hidden border border-sac-red bg-white px-2.5 py-1.5 text-xs font-light text-sac-black shadow-sm",
          // Never intercept the pointer, so it always reaches whatever is
          // actually underneath (e.g. the element above when moving up).
          "pointer-events-none",
          className
        )}
      >
        {children}
      </div>,
      document.body
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
