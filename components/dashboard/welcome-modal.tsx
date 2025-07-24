"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WelcomeModalProps {
  onClose?: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleStartCreating = () => {
    handleClose();
    router.push("/");
  };

  const handleGetMoreCredits = () => {
    handleClose();
    router.push("/pricing");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF7043] to-[#FFA726] rounded-full mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              🎉 Welcome to SVG AI! You've got 6 FREE credits
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm sm:text-base">
              That's enough to create 3 amazing SVGs or 6 unique icons!
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Pricing Preview */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Card className="p-2 sm:p-4 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-600">Free</div>
              <div className="text-lg sm:text-2xl font-bold mt-1">6 credits</div>
              <div className="text-xs text-gray-500 mt-1">One-time</div>
            </Card>
            <Card className="p-2 sm:p-4 text-center border-[#FF7043] relative">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF7043] text-white text-xs">
                Popular
              </Badge>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Starter</div>
              <div className="text-lg sm:text-2xl font-bold mt-1">$19/mo</div>
              <div className="text-xs text-gray-500 mt-1">100 credits</div>
            </Card>
            <Card className="p-2 sm:p-4 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-600">Pro</div>
              <div className="text-lg sm:text-2xl font-bold mt-1">$39/mo</div>
              <div className="text-xs text-gray-500 mt-1">350 credits</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              onClick={handleStartCreating}
              className="w-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:from-[#FF6034] hover:to-[#FF9716]"
            >
              Start Creating for Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleGetMoreCredits}
              className="w-full"
            >
              Get More Credits
            </Button>
          </div>

          {/* Icon Generator Link */}
          <div className="text-center pt-2">
            <Link 
              href="/ai-icon-generator" 
              className="text-sm text-gray-600 hover:text-[#FF7043] inline-flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              Try our AI Icon Generator
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}