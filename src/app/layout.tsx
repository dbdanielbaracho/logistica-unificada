import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Plataforma Logística Unificada', description: 'Ambiente de desenvolvimento de serviços logísticos' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
