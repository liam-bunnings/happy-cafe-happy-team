import '../styles/globals.css';

export const metadata = {
  title: 'Restaurant Menu System',
  description: 'A system for restaurant menu management and pre-ordering',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
