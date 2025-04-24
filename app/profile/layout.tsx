import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | SVG AI",
  description: "Manage your SVG AI account settings",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
