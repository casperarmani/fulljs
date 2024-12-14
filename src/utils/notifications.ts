import { toast } from '@/components/ui/use-toast';

export function showError(message: string): void {
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });
}

export function showSuccess(message: string): void {
  toast({
    title: "Success",
    description: message,
  });
}