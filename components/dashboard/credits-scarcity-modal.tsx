"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreditsScarcityModalProps {
  creditsRemaining: number;
  onClose?: () => void;
}

export function CreditsScarcityModal({ creditsRemaining, onClose }: CreditsScarcityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownForThisSession, setHasShownForThisSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only show if credits are between 1-3 and haven't shown this session
    if (creditsRemaining > 0 && creditsRemaining <= 3 && !hasShownForThisSession) {
      // Delay by 5 seconds to not interrupt user flow
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShownForThisSession(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [creditsRemaining, hasShownForThisSession]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleUpgrade = () => {
    handleClose();
    router.push("/pricing");
  };

  if (creditsRemaining <= 0 || creditsRemaining > 3) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">
              Only {creditsRemaining} {creditsRemaining === 1 ? 'credit' : 'credits'} left
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            You're running low on credits. Upgrade now to keep creating amazing designs!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Highlight starter plan */}
          <div className="p-3 sm:p-4 border-2 border-[#FF7043] rounded-lg bg-orange-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
              <div>
                <div className="font-semibold text-base sm:text-lg">Starter Plan</div>
                <div className="text-xs sm:text-sm text-gray-600">100 credits per month</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">$19</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Save 17% with annual
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:from-[#FF6034] hover:to-[#FF9716]"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}