"use client";

import React from "react";
import { cn } from "@/lib/utils";

type GridSystemProps = {
  children: React.ReactNode;
  guideWidth?: number;
  unstable_useContainer?: boolean;
  className?: string;
  showGrid?: boolean;
};

type GridProps = {
  children: React.ReactNode;
  columns: number;
  rows: number;
  className?: string;
  gap?: number;
  showGrid?: boolean;
  rowSizes?: string;
};

type GridCellProps = {
  children?: React.ReactNode;
  column: string;
  row: string;
  solid?: boolean;
  className?: string;
  hideBorders?: boolean | {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
};

function GridSystem({ children, guideWidth = 1, unstable_useContainer, className, showGrid = true }: GridSystemProps) {
  return (
    <div className={cn("w-full", unstable_useContainer && "", className)}>
      {children}
    </div>
  );
}

function GridComponent({ children, columns, rows, className, gap = 0, showGrid = true, rowSizes }: GridProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: rowSizes || `repeat(${rows}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {/* Grid lines background */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(163 163 163 / 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(163 163 163 / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: `calc(100% / ${columns}) calc(100% / ${rows})`,
            backgroundPosition: '0 0',
          }}
        >
          {/* Right border */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300/40"></div>
          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-300/40"></div>
        </div>
      )}
      {children}
    </div>
  );
}

function GridCell({ children, column, row, solid, className, hideBorders }: GridCellProps) {
  const getBorderStyles = () => {
    if (!hideBorders) return {};
    
    if (typeof hideBorders === 'boolean') {
      return {
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
      };
    }
    
    return {
      ...(hideBorders.top && { borderTop: 'none' }),
      ...(hideBorders.right && { borderRight: 'none' }),
      ...(hideBorders.bottom && { borderBottom: 'none' }),
      ...(hideBorders.left && { borderLeft: 'none' }),
    };
  };

  return (
    <div
      className={cn(
        "relative z-10",
        solid && "bg-white border border-neutral-200",
        className
      )}
      style={{
        gridColumn: column,
        gridRow: row,
        ...getBorderStyles(),
      }}
    >
      {children}
    </div>
  );
}

// Compound component pattern
export const Grid = Object.assign(GridComponent, {
  System: GridSystem,
  Cell: GridCell,
});