import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/Providers/AuthSessionProvider";
import { Toaster } from "react-hot-toast";
import RecoilProvider from "@/Providers/RecoilProvider";
import SocketProvider from "@/Contexts/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
            <AuthSessionProvider>
              {children}
              <Toaster />
            </AuthSessionProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}