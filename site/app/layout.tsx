// Root layout — minimal passthrough.
// All html/body/lang setup is handled in app/[locale]/layout.tsx.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children as React.ReactElement;
}
