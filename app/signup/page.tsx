import { SignUpForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your SVG AI account to save and manage your vector graphics.",
};

export default function SignUpPage() {
  return (
    <main className="container max-w-6xl py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SignUpForm />
      </div>
    </main>
  );
}
