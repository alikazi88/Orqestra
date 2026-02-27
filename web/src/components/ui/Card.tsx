import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-[2rem] border border-border bg-card p-6 transition-all duration-200",
                    glass ? "glass-card" : "shadow-[0_20px_40px_-15px_rgba(26,26,26,0.05)]",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";
