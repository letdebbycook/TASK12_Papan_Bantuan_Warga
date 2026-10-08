import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});



export const viewport: Viewport = {
  themeColor: "#fcfbf9",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://warga-bantu.vercel.app"),
  title: {
    default: "Papan Bantuan Warga — Saling Bantu, Saling Jaga",
    template: "%s | Papan Bantuan Warga",
  },
  description:
    "Platform dampak sosial di mana warga memposting permintaan bantuan darurat (donor darah, kursi roda, tabung oksigen, sembako) dan relawan dapat langsung merespons.",
  keywords: [
    "bantuan warga",
    "donor darah",
    "tabung oksigen",
    "kursi roda",
    "relawan",
    "gotong royong",
    "solidaritas sosial",
    "Indonesia",
  ],
  authors: [{ name: "Komunitas Warga Bantu" }],
  creator: "Komunitas Warga Bantu",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://warga-bantu.vercel.app",
    title: "Papan Bantuan Warga — Saling Bantu, Saling Jaga",
    description:
      "Platform dampak sosial untuk saling membantu kebutuhan darurat, peminjaman alat kesehatan, dan relawan di lingkungan warga.",
    siteName: "Papan Bantuan Warga",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papan Bantuan Warga — Saling Bantu, Saling Jaga",
    description:
      "Platform gotong royong tanggap darurat warga. Cepat, transparan, dan langsung terhubung dengan relawan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Papan Bantuan Warga",
    url: "https://warga-bantu.vercel.app",
    logo: "https://warga-bantu.vercel.app/icon.png",
    description:
      "Platform dampak sosial gotong royong warga untuk saling membantu kebutuhan darurat dan bantuan sosial.",
    sameAs: ["https://twitter.com/wargabantu", "https://instagram.com/wargabantu"],
  };

  return (
    <html
      lang="id"
      className={`${inter.variable} antialiased`}
    >

      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#171717] font-sans selection:bg-[#4338ca] selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


