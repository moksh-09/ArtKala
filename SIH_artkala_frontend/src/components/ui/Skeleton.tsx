import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx("animate-pulse rounded-lg bg-[#E8DFD5]/60", className)
      )}
      {...props}
    />
  );
}
