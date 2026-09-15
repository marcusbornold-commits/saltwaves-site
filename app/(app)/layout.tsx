export const metadata = { robots: { index: false, follow: false } };
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
