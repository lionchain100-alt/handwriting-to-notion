import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Handwriting to Notion',
  description: 'Convert handwritten notes into Notion-ready structured content.'
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
