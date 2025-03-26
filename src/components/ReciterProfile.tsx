
import React from "react";
import { Reciter } from "@/services/quranService";
import { cn } from "@/lib/utils";

interface ReciterProfileProps {
  reciter: Reciter;
  className?: string;
}

const ReciterProfile: React.FC<ReciterProfileProps> = ({ reciter, className }) => {
  // Use a generic avatar placeholder if no specific image is available
  const avatarUrl = `/lovable-uploads/8d8f8add-0402-42de-a678-780f08f48955.png`;

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative w-32 h-32 rounded-full overflow-hidden animate-scale-in shadow-lg">
        <img
          src={avatarUrl}
          alt={reciter.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide animate-slide-up">
          {reciter.name}
        </h2>
        {reciter.arabic_name && (
          <p className="text-lg font-arabic animate-slide-up animate-delay-100">
            {reciter.arabic_name}
          </p>
        )}
        {reciter.rewaya && (
          <p className="text-sm text-muted-foreground animate-slide-up animate-delay-200">
            {reciter.rewaya}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReciterProfile;
