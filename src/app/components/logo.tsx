import { cn } from "@/lib/utils";
import React from "react";

const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-8 h-8", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
      fill="currentColor"
      className="text-primary/20"
    />
    <path
      d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="hsl(var(--primary-foreground))"
      fontSize="8"
      fontFamily="Inter, sans-serif"
      fontWeight="bold"
    >
      CM
    </text>
  </svg>
);

export default Logo;
