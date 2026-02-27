import { useState } from 'react';
import {
    ClipboardCheck, Plus, CheckCircle2,
    Lightbulb, Star,
    ThumbsUp, ThumbsDown, Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface DebriefItem {
    id: string;
    category: 'went-well' | 'improve' | 'action-item';
    text: string;
    votes: number;
    resolved: boolean;
}

let nextId = 1;

const CATEGORIES = {
    'went-well': { label: 'What Went Well', icon: ThumbsUp, color: 'text-accent-green', bg: 'bg-accent-green/10' },
    'improve': { label: 'What to Improve', icon: ThumbsDown, color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
    'action-item': { label: 'Action Items', icon: Lightbulb, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
};

export const AIDebriefSession = () => {
    const [items, setItems] = useState<DebriefItem[]>([
        { id: 'a1', category: 'went-well', text: 'Venue setup completed 2 hours ahead of schedule', votes: 5, resolved: false },
        { id: 'a2', category: 'went-well', text: 'Guest check-in flow was seamless with QR codes', votes: 8, resolved: false },
        { id: 'a3', category: 'went-well', text: 'Catering service feedback was overwhelmingly positive', votes: 6, resolved: false },
        { id: 'a4', category: 'improve', text: 'Sound system had feedback issues during the keynote', votes: 4, resolved: false },
        { id: 'a5', category: 'improve', text: 'Bar ran out of premium options by 10 PM', votes: 3, resolved: false },
        { id: 'a6', category: 'improve', text: 'Parking coordination caused 20-min delays at entry', votes: 7, resolved: false },
        { id: 'a7', category: 'action-item', text: 'Book sound engineer for independent testing next time', votes: 4, resolved: false },
        { id: 'a8', category: 'action-item', text: 'Increase bar inventory by 30% for next event', votes: 3, resolved: true },
        { id: 'a9', category: 'action-item', text: 'Arrange valet parking with dedicated coordinator', votes: 6, resolved: false },
    ]);

    const [newText, setNewText] = useState('');
    const [newCategory, setNewCategory] = useState<DebriefItem['category']>('action-item');

    const addItem = () => {
        if (!newText.trim()) return;
        setItems(prev => [...prev, { id: String(nextId++), category: newCategory, text: newText, votes: 0, resolved: false }]);
        setNewText('');
    };

    const toggleResolved = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, resolved: !i.resolved } : i));
    const upvote = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
    const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-yellow to-orange-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <ClipboardCheck className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">AI Debrief Session</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Lessons learned & action items</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                {(['went-well', 'improve', 'action-item'] as const).map(cat => {
                    const cfg = CATEGORIES[cat];
                    const Icon = cfg.icon;
                    const count = items.filter(i => i.category === cat).length;
                    return (
                        <div key={cat} className="intelly-card p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", cfg.bg)}>
                                    <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{cfg.label}</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter italic">{count}</span>
                        </div>
                    );
                })}
            </div>

            {/* Add New */}
            <div className="intelly-card p-5 flex items-center gap-3">
                <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DebriefItem['category'])}
                    className="bg-muted/50 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest border-0 focus:ring-1 focus:ring-primary/20"
                >
                    {Object.entries(CATEGORIES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                    ))}
                </select>
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add a lesson learned or action item..."
                    className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                />
                <button onClick={addItem} className="h-8 w-8 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center hover:-translate-y-0.5 transition-transform">
                    <Plus className="h-3 w-3" />
                </button>
            </div>

            {/* Items by Category */}
            {(['went-well', 'improve', 'action-item'] as const).map(cat => {
                const cfg = CATEGORIES[cat];
                const Icon = cfg.icon;
                const catItems = items.filter(i => i.category === cat).sort((a, b) => b.votes - a.votes);
                if (catItems.length === 0) return null;

                return (
                    <div key={cat} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", cfg.color)} />
                            <h3 className="text-sm font-black uppercase tracking-widest">{cfg.label}</h3>
                        </div>
                        {catItems.map(item => (
                            <div key={item.id} className={cn("intelly-card p-4 flex items-center gap-4 group", item.resolved && "opacity-50")}>
                                <button
                                    onClick={() => upvote(item.id)}
                                    className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Star className="h-3 w-3" />
                                    <span className="text-[9px] font-black">{item.votes}</span>
                                </button>
                                {cat === 'action-item' && (
                                    <button onClick={() => toggleResolved(item.id)}>
                                        <CheckCircle2 className={cn("h-4 w-4", item.resolved ? "text-accent-green" : "text-muted-foreground/30")} />
                                    </button>
                                )}
                                <span className={cn("text-xs font-medium flex-1", item.resolved && "line-through")}>{item.text}</span>
                                <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all">
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
