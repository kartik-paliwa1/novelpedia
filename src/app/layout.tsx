import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-provider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'NovelPedia',
  description: 'NovelPedia - Your Ultimate Destination for Web Novels',
  icons: {
    icon: '/favicon.ico', // ✅ relative to the `public/` folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
