import './globals.css';
import './forklift-rush.css';
import './order-question.css';
import './shift-simulator.css';
import './warehouse-tycoon.css';
import './document-workshop.css';
import './purchasing-duel.css';
import './mobile-fixes.css';
import './auth-mobile-fix.css';
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
