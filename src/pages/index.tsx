import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Desktop from "@/components/Desktop/Desktop";
import Window from "@/components/Desktop/Window";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="main">
      <Desktop />
    </div>
  );
}
