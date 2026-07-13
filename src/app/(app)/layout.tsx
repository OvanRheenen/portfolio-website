import "./globals.css";
import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import { Header, Footer } from "@app/components/layout";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@app/lib/site";

const catamaran = Catamaran({
	variable: '--font-catamaran',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nina Merk — Mixed Media Artist and Set Designer",
    template: "%s — Nina Merk",
  },
  description:
    "Selected works by Nina Merk, a mixed media artist and set designer.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Nina Merk",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${catamaran.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
			<Analytics />
    </html>
  );
}
