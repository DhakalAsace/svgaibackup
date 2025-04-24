"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ApplyMigrationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const checkProfilesTable = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/apply-migration', {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.tableExists) {
        setStatus('Profiles table already exists');
        toast({
          title: "Profiles Table Check",
          description: "Profiles table already exists in the database.",
        });
      } else {
        setStatus('Profiles table does not exist. Click to create it.');
      }
    } catch (error) {
      console.error('Error checking profiles table:', error);
      setStatus('Error checking profiles table');
      toast({
        title: "Error",
        description: "Failed to check profiles table status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyProfilesMigration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/apply-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ migrationType: 'profiles' }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus('Profiles migration applied successfully');
        toast({
          title: "Success",
          description: "Profiles table created successfully.",
        });
      } else {
        setStatus(`Error: ${data.error}`);
        toast({
          title: "Error",
          description: data.error || "Failed to apply migration",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error applying migration:', error);
      setStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message || "Failed to apply migration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySvgPermissionsMigration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/apply-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ migrationType: 'svg_permissions' }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus('SVG permissions migration applied successfully');
        toast({
          title: "Success",
          description: "SVG designs table permissions updated successfully.",
        });
      } else {
        setStatus(`Error: ${data.error}`);
        toast({
          title: "Error",
          description: data.error || "Failed to apply SVG permissions migration",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error applying SVG permissions migration:', error);
      setStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message || "Failed to apply SVG permissions migration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={checkProfilesTable} 
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check Profiles Table
          </Button>
          
          <Button 
            variant="default" 
            onClick={applyProfilesMigration} 
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Profiles Migration
          </Button>

          <Button 
            variant="default" 
            onClick={applySvgPermissionsMigration} 
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update SVG Permissions
          </Button>
        </div>
        
        {status && (
          <div className="text-sm p-2 border rounded bg-muted">
            Status: {status}
          </div>
        )}
      </div>
    </div>
  );
}
