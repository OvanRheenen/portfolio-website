import "./globals.css";
import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import { Header, Footer } from "@app/components/layout";
import { Analytics } from "@vercel/analytics/next";

const catamaran = Catamaran({
	variable: '--font-catamaran',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Portfolio - Nina Merk",
  description: "Works, about and contact info of Nina Merk, a multidisciplinary artist.",
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
