import { useState } from 'react';
import {
    Palette, Sparkles, Plus, Trash2,
    Image, Layers, Tag, Shuffle,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface MoodItem {
    id: string;
    type: 'color' | 'texture' | 'reference' | 'note';
    value: string;
    label: string;
    zone?: string;
}

const PRESET_PALETTES = [
    { name: 'Royal Opulence', colors: ['#1A0A2E', '#D4AF37', '#8B0000', '#FFFFFF', '#2C1810'] },
    { name: 'Garden Romance', colors: ['#F5E6D3', '#D4A5A5', '#9BC1BC', '#5C4033', '#F0E68C'] },
    { name: 'Modern Minimal', colors: ['#FAFAFA', '#1A1A1A', '#E5E5E5', '#C0C0C0', '#333333'] },
    { name: 'Boho Sunset', colors: ['#E07A5F', '#F2CC8F', '#81B29A', '#3D405B', '#F4F1DE'] },
    { name: 'Ocean Breeze', colors: ['#0077B6', '#48CAE4', '#90E0EF', '#CAF0F8', '#023E8A'] },
    { name: 'Terracotta & Sage', colors: ['#C67B5C', '#6B8F71', '#E8D5B7', '#3E2723', '#F5F0EB'] },
];

const TEXTURES = [
    'Silk & Satin', 'Raw Jute', 'Velvet', 'Marble',
    'Brass & Gold Leaf', 'Wood Grain', 'Linen',
    'Crystal & Glass', 'Rattan & Cane', 'Sequin & Mirror'
];

const ZONES = [
    'Entrance & Lobby', 'Main Stage', 'Seating Area',
    'Bar & Lounge', 'Photo Station', 'Dance Floor',
    'Dining Area', 'Outdoor Area'
];

const VENDOR_CATEGORIES = [
    'Florist', 'Lighting Designer', 'Furniture Rental',
    'Fabric & Draping', 'Props & Staging', 'Signage & Print'
];

let nextId = 1;
const genId = () => `mood-${nextId++}`;

export const MoodBoardStudio = () => {
    const [items, setItems] = useState<MoodItem[]>([]);
    const [palette, setPalette] = useState<string[]>(PRESET_PALETTES[0].colors);
    const [paletteName, setPaletteName] = useState(PRESET_PALETTES[0].name);
    const [activeZone, setActiveZone] = useState<string>('All Zones');
    const [showPaletteMenu, setShowPaletteMenu] = useState(false);

    const addItem = (type: MoodItem['type'], value: string, label: string) => {
        setItems(prev => [...prev, { id: genId(), type, value, label, zone: activeZone === 'All Zones' ? undefined : activeZone }]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const randomizePalette = () => {
        const idx = Math.floor(Math.random() * PRESET_PALETTES.length);
        setPalette(PRESET_PALETTES[idx].colors);
        setPaletteName(PRESET_PALETTES[idx].name);
    };

    const filteredItems = activeZone === 'All Zones'
        ? items
        : items.filter(i => !i.zone || i.zone === activeZone);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-accent-pink via-primary to-accent-blue rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                        <Palette className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Mood Board Studio</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Curate your event's visual DNA</p>
                    </div>
                </div>
            </div>

            {/* Color Palette Section */}
            <div className="intelly-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Color Palette</h3>
                        <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{paletteName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={randomizePalette}
                            className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/20 hover:bg-muted/50 transition-colors flex items-center gap-2"
                        >
                            <Shuffle className="h-3 w-3" />
                            Shuffle
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowPaletteMenu(!showPaletteMenu)}
                                className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#1a1a1a] text-white flex items-center gap-2"
                            >
                                Presets <ChevronDown className="h-3 w-3" />
                            </button>
                            {showPaletteMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border/10 p-3 z-50">
                                    {PRESET_PALETTES.map(p => (
                                        <button
                                            key={p.name}
                                            onClick={() => { setPalette(p.colors); setPaletteName(p.name); setShowPaletteMenu(false); }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex gap-1">
                                                {p.colors.map(c => (
                                                    <div key={c} className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-4">
                    {palette.map((color, i) => (
                        <div key={i} className="group flex-1">
                            <div
                                className="aspect-square rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform border-4 border-white"
                                style={{ backgroundColor: color }}
                                onClick={() => addItem('color', color, `Color ${color}`)}
                            />
                            <p className="text-[9px] font-black uppercase tracking-widest text-center mt-2 opacity-40">{color}</p>
                        </div>
                    ))}
                    <button
                        onClick={() => addItem('color', '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), 'Custom Color')}
                        className="aspect-square flex-1 rounded-2xl border-2 border-dashed border-border/20 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                        <Plus className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Textures & Materials */}
            <div className="intelly-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Textures & Materials</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {TEXTURES.map(tex => {
                        const isSelected = items.some(i => i.type === 'texture' && i.value === tex);
                        return (
                            <button
                                key={tex}
                                onClick={() => isSelected ? removeItem(items.find(i => i.type === 'texture' && i.value === tex)!.id) : addItem('texture', tex, tex)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    isSelected
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {tex}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Zone Tagging */}
            <div className="intelly-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Tag className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Zone Assignment</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveZone('All Zones')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeZone === 'All Zones' ? "bg-[#1a1a1a] text-white shadow-lg" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        All Zones
                    </button>
                    {ZONES.map(zone => (
                        <button
                            key={zone}
                            onClick={() => setActiveZone(zone)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeZone === zone ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {zone}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vendor Product Mapping */}
            <div className="intelly-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Image className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Vendor Product Mapping</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {VENDOR_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => addItem('reference', cat, cat)}
                            className="p-4 rounded-2xl border border-border/10 hover:border-primary/20 hover:bg-primary/5 transition-all text-left group"
                        >
                            <span className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">{cat}</span>
                            <p className="text-[9px] font-bold opacity-40 mt-1">Tap to add to board</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Board Canvas */}
            <div className="intelly-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black tracking-tighter uppercase italic">
                        Your Mood Board
                        {activeZone !== 'All Zones' && <span className="text-primary ml-2 text-sm">— {activeZone}</span>}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{filteredItems.length} items</span>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                        <div className="text-center">
                            <Palette className="h-10 w-10 mx-auto mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Select colors, textures & vendors above to build your board</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="group relative rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                            >
                                {item.type === 'color' ? (
                                    <div className="aspect-square" style={{ backgroundColor: item.value }}>
                                        <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase tracking-widest text-white/80 mix-blend-difference">{item.value}</span>
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "aspect-square flex items-center justify-center p-3",
                                        item.type === 'texture' ? "bg-gradient-to-br from-muted/80 to-muted" : "bg-gradient-to-br from-primary/5 to-accent-blue/5"
                                    )}>
                                        <div className="text-center">
                                            {item.type === 'texture' ? <Layers className="h-5 w-5 mx-auto mb-2 opacity-30" /> : <Image className="h-5 w-5 mx-auto mb-2 opacity-30" />}
                                            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                                        </div>
                                    </div>
                                )}
                                {item.zone && (
                                    <span className="absolute top-1 left-1 text-[7px] font-black uppercase tracking-widest bg-black/50 text-white px-1.5 py-0.5 rounded-full">{item.zone.split(' ')[0]}</span>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-2.5 w-2.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
