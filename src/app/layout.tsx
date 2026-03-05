import { SOSButton } from "@/components/sos/SOSButton";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import { FakeCallOverlay } from "@/components/fake-call/FakeCallOverlay";
import { FakeCallActive } from "@/components/fake-call/FakeCallActive";
import { VoiceCommandListener } from "@/components/voice/VoiceCommandListener";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeCircle",
  description: "Discreet safety network for women",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeCircle",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ec4899",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents iOS input auto-zoom which hurts mobile UX
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            {children}
            <SOSButton />
            <FakeCallOverlay />
            <FakeCallActive />
            <VoiceCommandListener />
            <PwaInstallPrompt />
            <Toaster closeButton />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
