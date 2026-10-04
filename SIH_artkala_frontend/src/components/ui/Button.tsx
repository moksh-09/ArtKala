"use client";

import React, { forwardRef, ButtonHTMLAttributes, useRef, useCallback } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "artisan";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as React.RefObject<HTMLButtonElement>) || innerRef;

    // Ripple effect on click
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current || (e.currentTarget as HTMLButtonElement);
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background =
          variant === "primary" || variant === "secondary" || variant === "artisan"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(200, 90, 50, 0.08)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        ripple.style.pointerEvents = "none";

        button.style.position = "relative";
        button.style.overflow = "hidden";
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 700);

        onClick?.(e);
      },
      [onClick, variant, buttonRef]
    );

    const baseStyles =
      "inline-flex items-center justify-center font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

    const variants = {
      primary:
        "bg-[#C85A32] text-white hover:bg-[#B24E29] shadow-[0_1px_3px_rgba(200,90,50,0.2)] hover:shadow-[0_4px_16px_rgba(200,90,50,0.25)] active:bg-[#9B4120] active:shadow-none active:scale-[0.97]",
      secondary:
        "bg-[#3F5E4D] text-white hover:bg-[#334D3F] shadow-[0_1px_3px_rgba(63,94,77,0.2)] hover:shadow-[0_4px_16px_rgba(63,94,77,0.25)] active:bg-[#283C31] active:scale-[0.97]",
      outline:
        "border border-[#D6CEBE] text-[#1A1816] bg-transparent hover:bg-[#F5F1EC] hover:border-[#A8A29E] active:bg-[#EBE5DC] active:scale-[0.97]",
      ghost:
        "text-[#1A1816] hover:bg-[#F5F1EC] active:bg-[#EBE5DC] active:scale-[0.97]",
      artisan:
        "bg-[#1A1816] text-white hover:bg-[#2E2A27] shadow-[0_1px_3px_rgba(26,24,22,0.2)] hover:shadow-[0_4px_16px_rgba(26,24,22,0.2)] active:scale-[0.97]",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-sm rounded-xl gap-2.5",
    };

    return (
      <>
        <style jsx global>{`
          @keyframes ripple-expand {
            to {
              transform: scale(1);
              opacity: 0;
            }
          }
        `}</style>
        <button
          ref={buttonRef}
          disabled={disabled || isLoading}
          onClick={handleClick}
          className={twMerge(
            clsx(baseStyles, variants[variant], sizes[size], className)
          )}
          {...props}
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          {children}
        </button>
      </>
    );
  }
);

Button.displayName = "Button";
