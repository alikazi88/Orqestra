import React from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    icon?: React.ReactNode;
    className?: string;
}

export const StatCard = ({ title, value, trend, icon, className }: StatCardProps) => {
    const isPositive = trend && trend > 0;

    return (
        <Card className={cn("flex flex-col gap-2 p-5", className)}>
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted-foreground p-2">
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-0.5 text-xs font-semibold",
                        isPositive ? "text-primary" : "text-red-500"
                    )}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(trend)}% vs last month
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">{value}</h3>
            </div>
        </Card>
    );
};
