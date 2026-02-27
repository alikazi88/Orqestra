import { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    ChevronLeft,
    Save,
    Layers,
    Square,
    Circle,
    Box,
    Maximize2,
    RotateCw,
    Trash2,
    Plus,
    Grab,
    Music,
    Users,
    Gamepad2,
    Monitor
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { LayoutObjectCard } from './LayoutObjectCard';

interface LayoutObject {
    id: string;
    type: 'zone' | 'furniture' | 'av';
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    color: string;
    icon?: any;
}

interface VenueLayoutStudioProps {
    venueId: string;
    onBack: () => void;
}

export const VenueLayoutStudio = ({ venueId, onBack }: VenueLayoutStudioProps) => {
    const [objects, setObjects] = useState<LayoutObject[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<SVGSVGElement>(null);

    const addObject = (type: LayoutObject['type'], label: string, color: string, icon?: any) => {
        const newObj: LayoutObject = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label,
            x: 100,
            y: 100,
            width: type === 'zone' ? 200 : 60,
            height: type === 'zone' ? 120 : 60,
            rotation: 0,
            color,
            icon
        };
        setObjects([...objects, newObj]);
        setSelectedId(newObj.id);
    };

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        const obj = objects.find(o => o.id === id);
        if (!obj) return;

        setSelectedId(id);
        setIsDragging(true);

        const CTM = canvasRef.current?.getScreenCTM();
        if (CTM) {
            setDragOffset({
                x: (e.clientX - CTM.e) / CTM.a - obj.x,
                y: (e.clientY - CTM.f) / CTM.d - obj.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedId) return;

        const CTM = canvasRef.current?.getScreenCTM();
        if (CTM) {
            const x = (e.clientX - CTM.e) / CTM.a - dragOffset.x;
            const y = (e.clientY - CTM.f) / CTM.d - dragOffset.y;

            setObjects(objects.map(obj =>
                obj.id === selectedId ? { ...obj, x, y } : obj
            ));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const rotateSelected = () => {
        if (!selectedId) return;
        setObjects(objects.map(obj =>
            obj.id === selectedId ? { ...obj, rotation: (obj.rotation + 45) % 360 } : obj
        ));
    };

    const deleteSelected = () => {
        if (!selectedId) return;
        setObjects(objects.filter(obj => obj.id !== selectedId));
        setSelectedId(null);
    };

    const selectedObject = objects.find(o => o.id === selectedId);

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-primary/5 transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Layout Studio</h2>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1">
                            Venue ID: <span className="text-primary">{venueId}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-border/60 font-bold h-10 px-5">
                        Export PDF
                    </Button>
                    <Button className="rounded-xl font-bold h-10 px-8 shadow-lg shadow-primary/20">
                        <Save className="mr-2 h-4 w-4" /> Save Layout
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Object Library */}
                <Card className="w-80 flex flex-col p-6 overflow-y-auto border-border/40">
                    <div className="flex items-center gap-2 mb-6">
                        <Layers className="h-4 w-4 text-primary" />
                        <h3 className="font-bold text-sm">Object Library</h3>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4 block">Zones</label>
                            <div className="grid grid-cols-1 gap-3">
                                <LayoutObjectCard
                                    type="Zone"
                                    label="Main Stage"
                                    icon={Gamepad2}
                                    color="bg-purple-500"
                                    onAdd={() => addObject('zone', 'Main Stage', '#8b5cf6')}
                                />
                                <LayoutObjectCard
                                    type="Zone"
                                    label="Dance Floor"
                                    icon={Box}
                                    color="bg-rose-500"
                                    onAdd={() => addObject('zone', 'Dance Floor', '#f43f5e')}
                                />
                                <LayoutObjectCard
                                    type="Zone"
                                    label="VIP Lounge"
                                    icon={Users}
                                    color="bg-amber-500"
                                    onAdd={() => addObject('zone', 'VIP Lounge', '#f59e0b')}
                                />
                            </div>
                        </section>

                        <section>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4 block">Furniture</label>
                            <div className="grid grid-cols-1 gap-3">
                                <LayoutObjectCard
                                    type="Furniture"
                                    label="Round Table"
                                    icon={Circle}
                                    color="bg-blue-500"
                                    onAdd={() => addObject('furniture', 'Round Table', '#3b82f6')}
                                />
                                <LayoutObjectCard
                                    type="Furniture"
                                    label="Banquet Table"
                                    icon={Square}
                                    color="bg-emerald-500"
                                    onAdd={() => addObject('furniture', 'Banquet Table', '#10b981')}
                                />
                            </div>
                        </section>

                        <section>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4 block">AV & Tech</label>
                            <div className="grid grid-cols-1 gap-3">
                                <LayoutObjectCard
                                    type="AV"
                                    label="LED Screen"
                                    icon={Monitor}
                                    color="bg-indigo-500"
                                    onAdd={() => addObject('av', 'LED Screen', '#6366f1')}
                                />
                                <LayoutObjectCard
                                    type="AV"
                                    label="Speaker Stack"
                                    icon={Music}
                                    color="bg-slate-700"
                                    onAdd={() => addObject('av', 'Speaker Stack', '#334155')}
                                />
                            </div>
                        </section>
                    </div>
                </Card>

                {/* Main Canvas Area */}
                <div className="flex-1 relative bg-muted/30 rounded-[32px] border-2 border-border/40 overflow-hidden group">
                    {/* SVG Canvas */}
                    <svg
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {objects.map((obj) => (
                            <g
                                key={obj.id}
                                transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}, ${obj.width / 2}, ${obj.height / 2})`}
                                onMouseDown={(e) => handleMouseDown(e, obj.id)}
                                className={cn(
                                    "cursor-grab active:cursor-grabbing group/obj",
                                    selectedId === obj.id ? "drop-shadow-2xl" : "drop-shadow-md"
                                )}
                            >
                                <rect
                                    width={obj.width}
                                    height={obj.height}
                                    rx={obj.type === 'zone' ? 16 : 8}
                                    fill={obj.color}
                                    fillOpacity={obj.type === 'zone' ? 0.15 : 1}
                                    stroke={obj.color}
                                    strokeWidth={selectedId === obj.id ? 3 : 1}
                                    className="transition-all duration-200"
                                />
                                {obj.type === 'zone' && (
                                    <rect
                                        width={obj.width}
                                        height={obj.height}
                                        rx={16}
                                        fill="none"
                                        stroke={obj.color}
                                        strokeWidth={1}
                                        strokeDasharray="4 4"
                                    />
                                )}
                                <text
                                    x={obj.width / 2}
                                    y={obj.height + 20}
                                    textAnchor="middle"
                                    className={cn(
                                        "text-[10px] font-black uppercase tracking-widest transition-opacity",
                                        selectedId === obj.id ? "opacity-100" : "opacity-0 group-hover/obj:opacity-100"
                                    )}
                                    fill="currentColor"
                                >
                                    {obj.label}
                                </text>

                                {selectedId === obj.id && (
                                    <rect
                                        width={obj.width + 10}
                                        height={obj.height + 10}
                                        x={-5}
                                        y={-5}
                                        rx={obj.type === 'zone' ? 20 : 12}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth={1}
                                        className="animate-pulse"
                                    />
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Canvas Controls Overlay */}
                    <div className="absolute bottom-8 right-8 flex gap-2">
                        <Button variant="outline" className="h-12 w-12 rounded-2xl bg-white shadow-xl p-0 hover:bg-primary/5 border-border/40">
                            <Maximize2 className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="h-12 w-12 rounded-2xl bg-white shadow-xl p-0 hover:bg-primary/5 border-border/40 text-primary">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Selection Controls Overlay */}
                    {selectedObject && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-2 bg-foreground/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-top-4 duration-300">
                            <div className="px-4 border-r border-white/10">
                                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">{selectedObject.type}</p>
                                <p className="text-sm font-bold text-white">{selectedObject.label}</p>
                            </div>
                            <Button
                                onClick={rotateSelected}
                                className="h-10 w-10 p-0 rounded-xl bg-transparent hover:bg-white/10 text-white"
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button
                                className="h-10 w-10 p-0 rounded-xl bg-transparent hover:bg-white/10 text-white"
                            >
                                <Grab className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <Button
                                onClick={deleteSelected}
                                className="h-10 w-10 p-0 rounded-xl bg-transparent hover:bg-red-500/20 text-red-400 group"
                            >
                                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
