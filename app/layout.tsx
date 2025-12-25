import "./globals.css";
import { Poppins } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header, Sidebar } from "./ui";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', 
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">
    <body className={`${poppins.variable} antialiased`} >
      <SidebarProvider>
        <Sidebar />
        <main className="p-5 w-full">
          <Header />
          {children} 
        </main>
        <Toaster />
      </SidebarProvider>
    </body>
  </html>
  
}
