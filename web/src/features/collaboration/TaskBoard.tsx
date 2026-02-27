import { useEffect, useState } from 'react';
import {
    Plus, Clock, AlertCircle,
    CheckCircle2, Circle,
    ArrowRight, ChevronRight,
    SquareCheck, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/useAuthStore';
import type { UserRole } from './TeamCommandCenter';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'blocked' | 'done';
    priority: 'low' | 'medium' | 'high' | 'critical';
    due_date: string | null;
    dependencies: string[];
    assigned_to: string | null;
}

const COLUMN_CONFIG = [
    { id: 'todo', label: 'Backlog', icon: Circle, color: 'text-muted-foreground' },
    { id: 'in_progress', label: 'In Flight', icon: ArrowRight, color: 'text-accent-blue' },
    { id: 'blocked', label: 'Blocked', icon: AlertCircle, color: 'text-accent-pink' },
    { id: 'done', label: 'Resolved', icon: CheckCircle2, color: 'text-accent-green' }
];

export const TaskBoard = ({ eventId, role = 'director' }: { eventId?: string, role?: UserRole }) => {
    const { workspace } = useAuthStore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'kanban' | 'critical'>('kanban');

    useEffect(() => {
        if (workspace?.id) {
            fetchTasks();
            const channel = subscribeToTasks();
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [workspace?.id, eventId]);

    const subscribeToTasks = () => {
        const channel = supabase
            .channel('task_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `workspace_id=eq.${workspace.id}${eventId ? `&event_id=eq.${eventId}` : ''}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setTasks(prev => [payload.new as Task, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setTasks(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t));
                    } else if (payload.eventType === 'DELETE') {
                        setTasks(prev => prev.filter(t => t.id === payload.old.id));
                    }
                }
            )
            .subscribe();

        return channel;
    };

    const fetchTasks = async () => {
        setLoading(true);
        let query = supabase.from('tasks').select('*').eq('workspace_id', workspace.id);
        if (eventId) {
            query = query.eq('event_id', eventId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) {
            setTasks(data as Task[]);
        }
        setLoading(false);
    };

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', taskId);

        if (!error) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        }
    };

    // AI Critical Path Logic
    const getIsBottleneck = (task: Task) => {
        // A bottleneck is a task that's not done/blocked but has other tasks depending on it
        const hasDependents = tasks.some(t => t.dependencies.includes(task.id));
        return hasDependents && (task.status === 'blocked' || task.status === 'in_progress');
    };

    const getCriticalityScore = (task: Task) => {
        let score = 0;
        if (task.priority === 'critical') score += 10;
        if (task.priority === 'high') score += 5;
        if (getIsBottleneck(task)) score += 15;
        // Count how many tasks indirectly depend on this
        const dependentCount = tasks.filter(t => t.dependencies.includes(task.id)).length;
        score += (dependentCount * 5);
        return score;
    };

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    const filteredTasks = viewMode === 'critical'
        ? [...tasks].sort((a, b) => getCriticalityScore(b) - getCriticalityScore(a)).slice(0, 5)
        : tasks;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/5">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'kanban' ? "bg-white text-[#1a1a1a] shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('critical')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'critical' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        AI Critical Path
                    </button>
                </div>

                <button className="h-10 w-10 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {COLUMN_CONFIG.map(col => (
                        <div key={col.id} className="flex flex-col gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <col.icon className={cn("h-3 w-3", col.color)} />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{col.label}</h4>
                                </div>
                                <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-md">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {filteredTasks.filter(t => t.status === col.id).map(task => (
                                    <TaskCard key={task.id} task={task} isBottleneck={getIsBottleneck(task)} onStatusChange={updateTaskStatus} role={role} />
                                ))}
                                {tasks.filter(t => t.status === col.id).length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-border/10 rounded-[2rem] flex items-center justify-center opacity-20">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-accent-pink/5 border border-accent-pink/10 rounded-[2.5rem] p-8 mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 bg-accent-pink rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-accent-pink/20">
                                <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tighter uppercase italic">Bottleneck Detection</h3>
                                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">AI identified critical path risks</p>
                            </div>
                        </div>
                    </div>
                    {filteredTasks.map(task => (
                        <div key={task.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/5 flex items-center gap-8 group hover:-translate-y-1 transition-all">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                                getIsBottleneck(task) ? "bg-accent-pink shadow-accent-pink/20 rotate-6" : "bg-muted shadow-sm"
                            )}>
                                {getIsBottleneck(task) ? <AlertCircle className="h-6 w-6 text-white" /> : <SquareCheck className="h-6 w-6 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                        task.priority === 'critical' ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        {task.priority}
                                    </span>
                                    {getIsBottleneck(task) && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-accent-pink text-white px-2 py-0.5 rounded-md animate-pulse">
                                            Blocking Dependents
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-lg font-black tracking-tight leading-none group-hover:text-primary transition-colors">{task.title}</h4>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Impact Score</p>
                                <p className="text-2xl font-black italic text-primary">{getCriticalityScore(task)}</p>
                            </div>
                            <ChevronRight className="h-6 w-6 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ task, isBottleneck, onStatusChange, role }: { task: Task, isBottleneck: boolean, onStatusChange: (id: string, s: Task['status']) => void, role: UserRole }) => {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-border/5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
            {isBottleneck && (
                <div className="absolute top-0 right-0 p-4">
                    <div className="h-2 w-2 bg-accent-pink rounded-full animate-ping" />
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    task.priority === 'critical' ? "bg-red-500" :
                        task.priority === 'high' ? "bg-accent-pink" :
                            task.priority === 'medium' ? "bg-accent-blue" : "bg-accent-green"
                )} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Priority {task.priority}</span>
            </div>

            <p className="text-sm font-black tracking-tight leading-snug mb-6 group-hover:text-primary transition-colors">
                {task.title}
            </p>

            <div className="flex items-center justify-between border-t border-border/10 pt-4 mt-2">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted overflow-hidden border border-border/5 shadow-inner">
                        <img src={`https://ui-avatars.com/api/?name=${task.assigned_to || 'U'}&background=random`} alt="Assigned" />
                    </div>
                </div>
                {task.due_date && (
                    <div className="flex items-center gap-1 opacity-40">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase">
                            {new Date(task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                )}
            </div>

            {/* Quick Actions (Simulated) */}
            {role !== 'client' && (
                <div className="absolute inset-0 bg-[#1a1a1a]/95 flex items-center justify-center gap-4 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'done'); }}
                        className="h-10 w-10 bg-accent-green rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                        <SquareCheck className="h-5 w-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'blocked'); }}
                        className="h-10 w-10 bg-accent-pink rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                        <AlertCircle className="h-5 w-5" />
                    </button>
                    <button className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
};
