import { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { BrandProfile } from './BrandProfile';
import { BudgetRange } from './BudgetRange';
import { EventTypeSelector } from './EventTypeSelector';
import { VendorImport } from './VendorImport';
import { TeamInvite } from './TeamInvite';
import { useAuthStore } from '../../stores/useAuthStore';
import { supabase } from '../../lib/supabase';

const STEPS = [
    { id: 1, title: 'Brand Identity', subtitle: 'Tell us about your visual profile.' },
    { id: 2, title: 'Budget Scope', subtitle: 'Define your typical event investment.' },
    { id: 3, title: 'Event Specialization', subtitle: 'What kind of experiences do you build?' },
    { id: 4, title: 'Vendor Network', subtitle: 'Connect your preferred partners.' },
    { id: 5, title: 'Grow the Team', subtitle: 'Invite your core collaborators.' },
];

export const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<any>({});
    const { workspace, setWorkspace } = useAuthStore();

    const handleNext = async (stepData: any) => {
        const newData = { ...data, ...stepData };
        setData(newData);

        if (step === 5) {
            await finalizeOnboarding(newData);
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(Math.max(1, step - 1));
    };

    const finalizeOnboarding = async (finalData: any) => {
        if (!workspace) return;

        try {
            // Update workspace with comprehensive onboarding info
            const { data: updatedWs, error } = await supabase
                .from('workspaces')
                .update({
                    brand_profile: {
                        website: finalData.website,
                        primaryColor: finalData.primaryColor,
                        industry: finalData.industry,
                        specialties: finalData.specialties
                    },
                    settings: {
                        budget_tier: finalData.tier,
                        onboarding_completed: true,
                        onboarding_data: {
                            importMethod: finalData.importMethod,
                            invitedCount: finalData.invitedEmails?.length || 0
                        }
                    }
                })
                .eq('id', workspace.id)
                .select()
                .single();

            if (error) throw error;

            setWorkspace(updatedWs);
            onComplete();
        } catch (err) {
            console.error('Onboarding finalization failed:', err);
        }
    };

    const currentStepInfo = STEPS[step - 1];

    return (
        <OnboardingLayout
            currentStep={step}
            totalSteps={STEPS.length}
            title={currentStepInfo.title}
            subtitle={currentStepInfo.subtitle}
        >
            {step === 1 && <BrandProfile onNext={handleNext} initialData={data} />}
            {step === 2 && <BudgetRange onNext={handleNext} onBack={handleBack} initialData={data} />}
            {step === 3 && <EventTypeSelector onNext={handleNext} onBack={handleBack} initialData={data} />}
            {step === 4 && <VendorImport onNext={handleNext} onBack={handleBack} />}
            {step === 5 && <TeamInvite onComplete={handleNext} onBack={handleBack} />}
        </OnboardingLayout>
    );
};
