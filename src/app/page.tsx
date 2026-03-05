import { NavigationBar } from '@/components/landing/NavigationBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { VoiceHighlightSection } from '@/components/landing/VoiceHighlightSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ScenariosSection } from '@/components/landing/ScenariosSection';
import { AppPreviewSection } from '@/components/landing/AppPreviewSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { FloatingSosButton } from '@/components/landing/FloatingSosButton';

export default function Home() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-pink-100 selection:text-pink-900">
            <NavigationBar />

            <HeroSection />
            <SocialProofSection />
            <FeaturesSection />
            <VoiceHighlightSection />
            <HowItWorksSection />
            <ScenariosSection />
            <AppPreviewSection />
            <SecuritySection />
            <PricingSection />
            <FaqSection />
            <CtaSection />

            <Footer />
            <FloatingSosButton />
        </main>
    );
}
