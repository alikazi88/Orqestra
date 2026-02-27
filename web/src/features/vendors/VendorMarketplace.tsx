import { useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { VendorCard } from './VendorCard';
import { VendorFilters } from './VendorFilters';
import { RFQModal } from './RFQModal';
import { VendorComparison } from './VendorComparison';
import { ContractSignModal } from './ContractSignModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
    Users,
    Sparkles,
    MessageSquare,
    ChevronRight,
    Laptop,
    Utensils,
    Paintbrush,
    ShieldCheck,
    BarChart3,
    X,
    ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const MOCK_VENDORS = [
    {
        id: '4e752eb9-1511-49b1-8903-4b1d99e78179',
        name: 'Floral Dreams Decor',
        category: 'Decor',
        city: 'Mumbai',
        tier: '1A',
        photos: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800'],
        riskScore: 95,
        verified: true,
        pricing_min: 75000,
    },
    {
        id: 'c52d3386-6b9c-4fc3-9ba2-7aaa26b4b536',
        name: 'Gourmet Galore Catering',
        category: 'F&B',
        city: 'Delhi',
        tier: '1B',
        photos: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'],
        riskScore: 88,
        verified: true,
        pricing_min: 120000,
    },
    {
        id: '414d5e32-7709-4b1c-9a28-da7bbc2bfae6',
        name: 'Precision AV & Sound',
        category: 'AV & Tech',
        city: 'Bangalore',
        tier: '1A',
        photos: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'],
        riskScore: 92,
        verified: true,
        pricing_min: 45000,
    },
    {
        id: '18ff6e0d-36cd-44b3-959a-99d0e4066b5e',
        name: 'Elite Event Security',
        category: 'Security',
        city: 'Mumbai',
        tier: '2',
        photos: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'],
        riskScore: 75,
        verified: false,
        pricing_min: 25000,
    },
    {
        id: 'c53d0239-0575-41b9-b3a6-7c80aab9c67a',
        name: 'Lux Vista Productions',
        category: 'AV & Tech',
        city: 'Mumbai',
        tier: '1A',
        photos: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'],
        riskScore: 97,
        verified: true,
        pricing_min: 150000,
    },
    {
        id: '59e0dc5e-1bea-422d-80d1-cca6b62f9cad',
        name: 'Saffron Spirits',
        category: 'F&B',
        city: 'Goa',
        tier: '1B',
        photos: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'],
        riskScore: 84,
        verified: true,
        pricing_min: 55000,
    }
];

export const VendorMarketplace = () => {
    const { workspace } = useAuthStore();
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [isRFQOpen, setIsRFQOpen] = useState(false);
    const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const [vendorForContract, setVendorForContract] = useState<any>(null);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

    const filteredVendors = useMemo(() => {
        return MOCK_VENDORS.filter(vendor => {
            const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !activeCategory || vendor.category === activeCategory;
            const matchesTier = selectedTiers.length === 0 || selectedTiers.includes(vendor.tier);

            return matchesSearch && matchesCategory && matchesTier;
        });
    }, [searchQuery, activeCategory, selectedTiers]);

    const handleRFQRequest = (vendor: any) => {
        setSelectedVendor(vendor);
        setIsRFQOpen(true);
    };

    const handleRFQSubmitted = (rfq: any) => {
        console.log('RFQ Submitted:', rfq);
    };

    const handleToggleCompare = (vendor: any) => {
        setSelectedForComparison(prev => {
            const isAlreadySelected = prev.find(v => v.id === vendor.id);
            if (isAlreadySelected) {
                return prev.filter(v => v.id !== vendor.id);
            }
            if (prev.length >= 3) return prev;
            return [...prev, vendor];
        });
    };

    const handleExecuteContract = (vendorId: string) => {
        const vendor = MOCK_VENDORS.find(v => v.id === vendorId);
        if (vendor) {
            setVendorForContract(vendor);
            setIsContractModalOpen(true);
        }
    };

    const handleSigned = async (signatureData: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('generate-signed-contract', {
                body: {
                    vendor: vendorForContract,
                    signatureData,
                    workspaceId: workspace?.id,
                    event: { name: 'Gala Night 2026' } // Mock event context for now
                }
            });

            if (error) throw error;

            console.log('Contract generated successfully:', data.url);

            // Success flow
            setIsContractModalOpen(false);
            setVendorForContract(null);
            setSelectedForComparison([]);
            setIsComparisonOpen(false);

            // Trigger a success notification or toast here if available
        } catch (error) {
            console.error('Error generating contract:', error);
            throw error;
        }
    };

    const toggleTier = (tier: string) => {
        setSelectedTiers(prev =>
            prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
        );
    };

    const resetFilters = () => {
        setSearchQuery('');
        setActiveCategory(null);
        setSelectedTiers([]);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-32">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-black tracking-tight text-foreground">Vendor marketplace</h1>
                            <Badge variant="info" className="h-6 px-3 bg-primary/10 text-primary border-primary/20 font-bold">
                                Direct RFQ
                            </Badge>
                        </div>
                    </div>
                    <p className="text-muted-foreground font-medium text-lg lg:max-w-xl">
                        Connect with 2000+ verified vendors. Request quotes, compare portfolios,
                        and manage contracts with Orqestra's AI-powered risk scoring.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-2xl border border-border">
                    {[
                        { icon: Paintbrush, label: 'Decor' },
                        { icon: Utensils, label: 'F&B' },
                        { icon: Laptop, label: 'AV & Tech' },
                    ].map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveCategory(cat.label === activeCategory ? null : cat.label)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                                cat.label === activeCategory
                                    ? "bg-primary text-white shadow-lg shadow-primary/10 border-primary"
                                    : "bg-white text-foreground border border-border hover:shadow-md"
                            )}
                        >
                            <cat.icon className={cn("h-3.5 w-3.5", cat.label === activeCategory ? "text-white" : "text-primary")} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Left Sidebar Filters */}
                <aside className="lg:col-span-3">
                    <VendorFilters
                        search={searchQuery}
                        onSearchChange={setSearchQuery}
                        category={activeCategory}
                        onCategoryChange={setActiveCategory}
                        selectedTiers={selectedTiers}
                        onTierChange={toggleTier}
                        onReset={resetFilters}
                    />
                </aside>

                {/* Vendor Grid */}
                <div className="lg:col-span-9">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
                            {activeCategory ? `${activeCategory} Partners` : 'Verified Partners'}
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </h2>
                        <div className="flex gap-2">
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-2 rounded-full flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                AI Match Priority: On
                            </span>
                        </div>
                    </div>

                    {filteredVendors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredVendors.map((vendor) => (
                                <VendorCard
                                    key={vendor.id}
                                    vendor={vendor}
                                    onRFQ={handleRFQRequest}
                                    isSelected={!!selectedForComparison.find(v => v.id === vendor.id)}
                                    onToggleCompare={handleToggleCompare}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-muted/20 rounded-[40px] border-2 border-dashed border-border">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No vendors found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Try adjusting your filters or search terms to find the perfect vendor for your event.
                            </p>
                            <Button onClick={resetFilters} variant="outline" className="mt-6 rounded-xl">
                                Clear all filters
                            </Button>
                        </div>
                    )}

                    <div className="mt-12 p-10 rounded-[40px] bg-foreground text-white flex flex-col items-center justify-center text-center gap-6 shadow-2xl shadow-foreground/20">
                        <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center">
                            <MessageSquare className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black mb-2 tracking-tight">Need a Bulk RFQ?</h3>
                            <p className="text-white/60 max-w-md mx-auto font-medium">
                                Send your event brief to multiple vendors at once. Our AI will filter the best 5 matches for your budget and timeline.
                            </p>
                        </div>
                        <button className="h-14 px-8 bg-primary rounded-2xl font-black text-sm hover:scale-[1.02] transition-all flex items-center gap-3 shadow-lg shadow-primary/20">
                            Launch Bulk RFQ Engine
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comparison Floating Bar */}
            {selectedForComparison.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-full duration-500">
                    <div className="bg-foreground text-background px-6 py-4 rounded-[32px] shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {selectedForComparison.map((v) => (
                                    <div key={v.id} className="h-10 w-10 rounded-full border-2 border-foreground overflow-hidden">
                                        <img src={v.photos[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                                {selectedForComparison.length} {selectedForComparison.length === 1 ? 'Partner' : 'Partners'} Selected
                            </div>
                        </div>

                        <div className="h-8 w-px bg-white/20" />

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedForComparison([])}
                                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                            <Button
                                onClick={() => setIsComparisonOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-10 px-6 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-primary/40 group"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Benchmark
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {selectedVendor && (
                <RFQModal
                    vendor={selectedVendor}
                    isOpen={isRFQOpen}
                    onClose={() => setIsRFQOpen(false)}
                    onSubmitted={handleRFQSubmitted}
                />
            )}

            {isComparisonOpen && (
                <VendorComparison
                    vendors={selectedForComparison}
                    onClose={() => setIsComparisonOpen(false)}
                    onSelect={handleExecuteContract}
                />
            )}

            {vendorForContract && (
                <ContractSignModal
                    isOpen={isContractModalOpen}
                    onClose={() => setIsContractModalOpen(false)}
                    vendor={vendorForContract}
                    onSigned={handleSigned}
                />
            )}
        </div>
    );
};
