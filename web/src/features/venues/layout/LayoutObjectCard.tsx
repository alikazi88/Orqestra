import type { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

interface LayoutObjectCardProps {
    type: string;
    icon: LucideIcon;
    label: string;
    color: string;
    onAdd: () => void;
}

export const LayoutObjectCard = ({ type, icon: Icon, label, color, onAdd }: LayoutObjectCardProps) => {
    return (
        <button
            onClick={onAdd}
            className="w-full group text-left transition-transform active:scale-95"
        >
            <Card className="p-3 border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-3">
                <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    color
                )}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-xs font-black tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{type}</p>
                </div>
            </Card>
        </button>
    );
};
