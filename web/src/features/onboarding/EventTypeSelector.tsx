import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
    Users,
    Music,
    Briefcase,
    Utensils,
    Sparkles,
    Heart,
    Loader2,
    Check
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface EventTypeSelectorProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

const EVENT_TYPES = [
    { id: 'corporate', label: 'Conferences', icon: Briefcase },
    { id: 'concert', label: 'Music & Festivals', icon: Music },
    { id: 'wedding', label: 'Weddings', icon: Heart },
    { id: 'gala', label: 'Galas & Dinners', icon: Utensils },
    { id: 'private', label: 'Private Parties', icon: Sparkles },
    { id: 'trade', label: 'Exhibitions', icon: Users },
];

export const EventTypeSelector = ({ onNext, onBack, initialData }: EventTypeSelectorProps) => {
    const [selected, setSelected] = useState<string[]>(initialData?.specialties || []);
    const [loading, setLoading] = useState(false);

    const toggleType = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onNext({ specialties: selected });
            setLoading(false);
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {EVENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected.includes(type.id);
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleType(type.id)}
                            className={cn(
                                "p-6 rounded-3xl border-2 text-center transition-all relative group flex flex-col items-center gap-3",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                    : "border-border hover:border-primary/30"
                            )}
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-sm">{type.label}</span>

                            {isSelected && (
                                <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" type="button" className="flex-1 h-14" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit" className="flex-2 h-14 font-bold" disabled={loading || selected.length === 0}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Continue to Vendors'}
                </Button>
            </div>
        </form>
    );
};
