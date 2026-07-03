export const metadata = {
  title: "Orivana Studio",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
