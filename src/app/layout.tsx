import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ForecastAI - Advanced Weather Intelligence',
  description: 'AI-powered weather forecasting with interactive charts and severe weather alerts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}