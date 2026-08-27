import './globals.css';

export const metadata = {
  title: 'LagerLogik Lernapp',
  description: 'Lernapp für Fachkraft für Lagerlogistik'
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
