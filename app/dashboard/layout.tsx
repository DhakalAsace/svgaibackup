import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | SVG AI",
  description: "Manage your SVG designs",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
