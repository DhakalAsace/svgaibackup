import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SVG AI",
  description: "Sign in to your SVG AI account to manage your vector graphics.",
};

export default function LoginPage() {
  return (
    <main className="container max-w-6xl py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm />
      </div>
    </main>
  );
}
