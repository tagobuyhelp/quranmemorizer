import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, onRatingChange, maxRating = 5, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= rating;
        
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "transition-colors focus:outline-none hover:scale-110 transform",
              isActive ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-yellow-500"
            )}
            onClick={() => onRatingChange(starValue)}
          >
            <Star 
              className={cn(sizeClasses[size], isActive && "fill-current")} 
            />
          </button>
        );
      })}
    </div>
  );
}
