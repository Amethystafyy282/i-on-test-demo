import React from "react";
import clsx from "clsx";

interface ButtonProps {
    className?: string;
    isActive?: boolean;
    onClick?: () => void;
    text: string;
}

export const Button = ({className, onClick, text, isActive}: ButtonProps) => {
    return <div
        className={clsx("rounded-md p-2", isActive
            ? "bg-gray-400 hover:bg-gray-500"
            : "bg-gray-300 hover:bg-gray-400", className)}
        onClick={onClick}
    >
        {text}
    </div>
}
