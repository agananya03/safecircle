import { SOSButton } from "@/components/sos/SOSButton";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import { FakeCallOverlay } from "@/components/fake-call/FakeCallOverlay";
import { FakeCallActive } from "@/components/fake-call/FakeCallActive";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeCircle",
  description: "Discreet safety network for women",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ec4899",
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
            <Toaster closeButton />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
