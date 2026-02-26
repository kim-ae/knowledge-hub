import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Kim7s Knowledge Hub',
  description: 'Curated collection of technical articles and resources.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
