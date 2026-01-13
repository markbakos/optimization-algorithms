import React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className = "", ...rest } = props;
    return (
        <div
            {...rest}
            className={[
                "rounded-2xl border border-neutral-200 bg-neutral-50/70 shadow-sm",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className = "", ...rest } = props;
    return <div {...rest} className={["p-5", className].filter(Boolean).join(" ")} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className = "", ...rest } = props;
    return <div {...rest} className={["p-5 pt-0", className].filter(Boolean).join(" ")} />;
}
