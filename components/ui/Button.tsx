import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger";
    size?: "sm" | "md";
};

const base =
    "inline-flex items-center justify-center rounded-lg border text-sm font-medium " +
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-neutral-900 text-neutral-50 border-neutral-900 hover:bg-neutral-800",
    ghost: "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50",
    danger: "bg-white text-red-600 border-red-200 hover:bg-red-50",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
    sm: "h-9 px-3",
    md: "h-10 px-4",
};

export function Button({ variant = "ghost", size = "md", className = "", ...rest }: Props) {
    return (
        <button
            {...rest}
            className={[base, variants[variant], sizes[size], className].filter(Boolean).join(" ")}
        />
    );
}
