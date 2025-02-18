import './globals.css';
import { ThemeProvider } from '@//components/theme-provider';
import type React from 'react';

export const metadata = {
  title: 'Social to Mealie',
  description: 'Convert social media recipes to Mealie format',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
