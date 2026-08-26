'use client';

import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  MouseEvent,
  useState,
  useSyncExternalStore,
  memo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';

type MouseHandlers = {
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
};

interface CustomTooltipProps {
  children: ReactElement<MouseHandlers>;
  content: ReactNode | (() => ReactNode);
}

const emptySubscribe = () => () => {};

function CustomTooltip({
  children,
  content,
}: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const updateCoords = useCallback((e: MouseEvent<HTMLElement>) => {
    const x = e.clientX + 12;
    const y = e.clientY + 12;

    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const safeX = Math.max(8, Math.min(x, winWidth - 230));
    const safeY = Math.max(8, Math.min(y, winHeight - 90));

    setCoords({
      x: safeX,
      y: safeY,
    });
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent<HTMLElement>) => {
    updateCoords(e);
    setIsVisible(true);
    children.props.onMouseEnter?.(e);
  }, [children.props, updateCoords]);

  const handleMouseLeave = useCallback((e: MouseEvent<HTMLElement>) => {
    setIsVisible(false);
    children.props.onMouseLeave?.(e);
  }, [children.props]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    updateCoords(e);
    children.props.onMouseMove?.(e);
  }, [children.props, updateCoords]);

  return (
    <>
      {cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseMove: handleMouseMove,
      })}

      {mounted &&
        isVisible &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none bg-zinc-950 border border-indigo-500/30 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.8)] px-3 py-2 animate-in fade-in duration-75"
            style={{
              left: coords.x,
              top: coords.y,
              minWidth: 'max-content',
            }}
          >
            {typeof content === 'function' ? content() : content}
          </div>,
          document.body
        )}
    </>
  );
}

export default memo(CustomTooltip);