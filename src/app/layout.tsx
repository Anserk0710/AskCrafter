import "./globals.css";

export const metadata = {
  title: "FurniCraft — Custom Furniture",
  description: "Custom furniture sesuai desain & bahan pilihan Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#0b0f0e] text-[#e8efe9] antialiased">{children}</body>
    </html>
  );
}
