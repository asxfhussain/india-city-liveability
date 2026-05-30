import "./globals.css";

export const metadata = {
  title: "India City Liveability Comparator",
  description: "Compare cost of living, air quality, jobs, weather & internet across Indian cities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}