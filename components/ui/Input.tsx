import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: Props) {
    return (
        <input
            {...rest}
            className={[
                "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-neutral-300",
                "placeholder:text-neutral-400",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
}
