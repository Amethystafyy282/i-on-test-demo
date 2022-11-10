import React from "react";
import clsx from "clsx";

interface ParagraphProps {
    className?: string;
    onClick?: () => void;
    text: string;
}

export const Paragraph = ({className, onClick, text}: ParagraphProps) => {
    return <div
        className={clsx(className)}
        onClick={onClick}
    >
        {text}
    </div>
}
