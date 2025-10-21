import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";


export const metadata = {
  title: "Namaste Jharkhand",
  description: "Namaste Jharkhand Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
