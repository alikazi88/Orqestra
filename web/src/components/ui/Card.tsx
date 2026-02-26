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
                    "rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-200",
                    glass && "glass-card",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";
