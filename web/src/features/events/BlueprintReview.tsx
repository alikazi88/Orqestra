import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
    CheckCircle2,
    Clock,
    IndianRupee,
    ListTodo,
    ArrowRight,
    ShieldCheck,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface BlueprintReviewProps {
    blueprint: any;
    onConfirm: () => void;
    onCancel: () => void;
}

export const BlueprintReview = ({ blueprint, onConfirm, onCancel }: BlueprintReviewProps) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'tasks' | 'budget' | 'runsheet'>('tasks');

    const handleLaunch = () => {
        setLoading(true);
        setTimeout(onConfirm, 1500);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md animate-in fade-in duration-300" />

            <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-[40px] border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-foreground">AI Blueprint Ready</h2>
                            <p className="text-sm text-muted-foreground">Review and audit your generated event strategy.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onCancel} disabled={loading}>Adjust Parameters</Button>
                        <Button onClick={handleLaunch} disabled={loading} className="px-8 font-bold">
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Launch Command Center'}
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 border-r border-border p-6 space-y-2 bg-muted/5">
                        {[
                            { id: 'tasks', label: 'Task List', icon: ListTodo, count: blueprint.tasks.length },
                            { id: 'budget', label: 'Budget Plan', icon: IndianRupee, count: blueprint.budgetLines.length },
                            { id: 'runsheet', label: 'Run Sheet', icon: Clock, count: blueprint.runSheet.length },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "w-full p-4 rounded-2xl flex items-center justify-between group transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon className="h-5 w-5" />
                                    <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                                </div>
                                <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === tab.id ? "rotate-90" : "group-hover:translate-x-1")} />
                            </button>
                        ))}
                    </div>

                    {/* List View */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <ListTodo className="h-5 w-5 text-primary" />
                                    Generated Action Items
                                </h3>
                                {blueprint.tasks.map((task: any, i: number) => (
                                    <div key={i} className="group p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <CheckCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                            <div>
                                                <p className="font-bold text-sm">{task.title}</p>
                                                <p className="text-xs text-muted-foreground">Due: {task.daysOffset} days from launch</p>
                                            </div>
                                        </div>
                                        <Badge variant={task.priority === 'critical' ? 'danger' : 'info'}>{task.priority}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'budget' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5 text-primary" />
                                    Financial Intelligence
                                </h3>
                                {blueprint.budgetLines.map((line: any, i: number) => (
                                    <div key={i} className="p-4 rounded-2xl border border-border flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <IndianRupee className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{line.category}</p>
                                                <p className="text-xs text-muted-foreground">Estimated Allocation</p>
                                            </div>
                                        </div>
                                        <p className="font-bold">₹{line.estimated.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'runsheet' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Live Implementation Timeline
                                </h3>
                                <div className="relative pl-8 space-y-8">
                                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border border-dashed" />
                                    {blueprint.runSheet.map((item: any, i: number) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[21px] h-4 w-4 rounded-full bg-white border-2 border-primary shadow-sm z-10" />
                                            <div className="p-4 rounded-2xl border border-border bg-white shadow-sm flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-sm">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">Event Day Milestone</p>
                                                </div>
                                                <Badge variant="info" className="font-mono text-xs">{item.time}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Multi-tenant Isolation Verified</span>
                        <span className="mx-2">·</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>Ready for Workspace Persistence</span>
                    </div>
                    <p className="text-xs font-bold text-primary">v1.2 AI Oracle Active</p>
                </div>
            </div>
        </div>
    );
};
