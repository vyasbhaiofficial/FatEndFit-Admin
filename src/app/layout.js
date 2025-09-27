import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "./MainLayout";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "fatEndfit Admin Panel",
  description:
    "Body Detoxification Admin Panel - Manage your fitness and wellness platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/image/logo.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/image/logo.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/image/logo.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}
