import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/SiteHeaders";
import { ToastContainer } from "react-toastify";


export const metadata = {
  title: "Sumaiya Home",
  description: "It's a carpet manufacture company",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {/* <NavbarDashboard/> */}
                {children}
              </main>
          </SidebarInset>  
          <ToastContainer position="top-right" autoClose={3000} theme="light" />  
        </SidebarProvider>
      </body>
    </html>
  );
}
