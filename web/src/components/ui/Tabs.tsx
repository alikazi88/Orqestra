import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ defaultValue, children, className }: { defaultValue: string; children: ReactNode; className?: string }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn("flex items-center justify-center", className)}>{children}</div>
);

export const TabsTrigger = ({ value, children, className }: { value: string; children: ReactNode; className?: string }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');
    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                isActive ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:bg-white/50",
                className
            )}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children, className }: { value: string; children: ReactNode; className?: string }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');
    if (context.activeTab !== value) return null;

    return (
        <div className={cn("animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
            {children}
        </div>
    );
};
