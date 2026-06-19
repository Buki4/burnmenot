'use client';

import { useEffect } from 'react';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

// optional import of default css
import 'mobile-drag-drop/default.css';

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only apply polyfill in browser
    if (typeof window !== 'undefined') {
      polyfill({
        // use this to make use of the scroll behaviour
        dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
        holdToDrag: 200, // hold for 200ms to start dragging
      });
      
      // Prevent scrolling while dragging
      window.addEventListener('touchmove', function() {}, {passive: false});
    }
  }, []);

  return <>{children}</>;
}
