import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "terracotta" | "green" | "sand" | "neutral" | "verified";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "sand",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center font-medium tracking-wide rounded-full select-none";

  const variants = {
    terracotta: "bg-[#F7EAE5] text-[#C85A32] border border-[#F0D5CC]",
    green: "bg-[#EBF1ED] text-[#3F5E4D] border border-[#D5E3DA]",
    sand: "bg-[#F4EFEA] text-[#78716C] border border-[#E8DFD5]",
    neutral: "bg-[#1C1917] text-white",
    verified: "bg-[#EBF1ED] text-[#2D4F3E] border border-[#C5D9CC]",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </span>
  );
}
