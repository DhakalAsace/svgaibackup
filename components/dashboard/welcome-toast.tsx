"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

export function WelcomeToast() {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast only for new users
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      toast({
        title: "🎉 6 Free Credits Added!",
        description: "Welcome to SVG AI! Start creating amazing designs.",
        duration: 5000,
      });
    }
  }, [toast]);

  return null;
}