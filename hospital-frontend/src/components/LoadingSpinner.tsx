import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex justify-center items-center min-h-[100px] w-full ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
}
