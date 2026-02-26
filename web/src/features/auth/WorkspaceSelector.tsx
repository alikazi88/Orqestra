import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Briefcase, ChevronRight, Loader2, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } '../../stores/useAuthStore';

export const WorkspaceSelector = ({ onSelect }: { onSelect: (workspace: any) => void }) => {
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchWorkspaces = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from('users')
                .select('workspace_id, workspaces(*)')
                .eq('id', user.id);

            if (!error && data) {
                setWorkspaces(data.map(d => d.workspaces));
            }
            setLoading(false);
        };

        fetchWorkspaces();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground font-medium">Loading your workspaces...</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-12 px-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">Select a Workspace</h2>
                <p className="text-muted-foreground text-sm">Choose an existing workspace or create a new one to get started.</p>
            </div>

            <div className="flex flex-col gap-4">
                {workspaces.map((ws) => (
                    <button
                        key={ws.id}
                        onClick={() => onSelect(ws)}
                        className="group block w-full text-left transition-transform active:scale-[0.98]"
                    >
                        <Card className="p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-premium transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{ws.name}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                        {ws.subscription_tier || 'Starter'} Tier
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Card>
                    </button>
                ))}

                <button className="group block w-full text-left transition-transform active:scale-[0.98]">
                    <Card className="p-5 flex items-center justify-between border-dashed border-2 bg-muted/20 hover:bg-muted/40 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white text-muted-foreground border border-border flex items-center justify-center">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Create New Workspace</h4>
                                <p className="text-xs text-muted-foreground">Start a fresh project for your team</p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
                    </Card>
                </button>
            </div>
        </div>
    );
};

import { ArrowRight } from 'lucide-react';
