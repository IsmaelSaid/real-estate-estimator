import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'semantic-ui-css/semantic.min.css'
import './style.css'
import {AuthProvider} from "@/app/Providers";

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
      <AuthProvider>
      {children}
      </AuthProvider>
      </body>
    </html>
  );
}
