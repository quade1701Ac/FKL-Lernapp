import './globals.css';
import AuthGate from './AuthGate';

export const metadata = {
  title: 'LagerLogik Lernapp',
  description: 'Lernapp für Fachkraft für Lagerlogistik'
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body><AuthGate>{children}</AuthGate></body>
    </html>
  );
}
