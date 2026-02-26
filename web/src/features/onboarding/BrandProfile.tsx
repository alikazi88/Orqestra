import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Palette, Globe, Camera, Loader2 } from 'lucide-react';

interface BrandProfileProps {
    onNext: (data: any) => void;
    initialData?: any;
}

export const BrandProfile = ({ onNext, initialData }: BrandProfileProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        website: initialData?.website || '',
        primaryColor: initialData?.primaryColor || '#8FB755',
        industry: initialData?.industry || 'Corporate Events',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate minor delay for premium feel
        setTimeout(() => {
            onNext(formData);
            setLoading(false);
        }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <div className="h-24 w-24 rounded-3xl bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
                        <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-xl shadow-lg border border-border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <Camera className="h-4 w-4 text-primary" />
                    </div>
                </div>
                <p className="text-sm font-bold mt-4">Upload Workspace Logo</p>
                <p className="text-xs text-muted-foreground">Recommended: 400x400 PNG or SVG</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Website URL"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    icon={<Globe className="h-5 w-5" />}
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground ml-1">Primary Brand Color</label>
                    <div className="flex gap-3">
                        <div
                            className="h-12 w-16 rounded-xl border border-border cursor-pointer transition-transform active:scale-95"
                            style={{ backgroundColor: formData.primaryColor }}
                        />
                        <Input
                            placeholder="#FFFFFF"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground ml-1">Main Industry Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Corporate Events', 'Weddings', 'Concerts', 'Exhibitions', 'Tech Meetups', 'Sports'].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setFormData({ ...formData, industry: item })}
                            className={cn(
                                "px-4 py-3 rounded-2xl border text-sm font-medium transition-all",
                                formData.industry === item
                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                    : "border-border hover:border-primary/30 text-muted-foreground"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full h-14 text-base font-bold mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Continue to Budget Setup'}
            </Button>
        </form>
    );
};

import { cn } from '../../utils/cn';
