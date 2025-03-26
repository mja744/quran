
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Reciter, Moshaf } from "@/services/quranService";

interface ReciterSelectorProps {
  reciters: Reciter[];
  selectedReciter: Reciter | null;
  selectedMoshaf: Moshaf | null;
  onReciterChange: (reciter: Reciter) => void;
  onMoshafChange: (moshaf: Moshaf) => void;
}

const ReciterSelector: React.FC<ReciterSelectorProps> = ({
  reciters,
  selectedReciter,
  selectedMoshaf,
  onReciterChange,
  onMoshafChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter reciters by search term
  const filteredReciters = searchTerm
    ? reciters.filter(
        reciter =>
          reciter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reciter.arabic_name && 
           reciter.arabic_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : reciters;

  // Handle reciter change
  const handleReciterChange = (reciterId: string) => {
    const reciter = reciters.find(r => r.id.toString() === reciterId);
    if (reciter) {
      onReciterChange(reciter);
    }
  };

  // Handle moshaf change
  const handleMoshafChange = (moshafId: string) => {
    if (selectedReciter) {
      const moshaf = selectedReciter.moshaf.find(m => m.id.toString() === moshafId);
      if (moshaf) {
        onMoshafChange(moshaf);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 animate-fade-in">
      {/* Reciter selection */}
      <div>
        <label htmlFor="reciter-select" className="block text-sm font-medium text-muted-foreground mb-1">
          القارئ (Reciter)
        </label>
        <Select
          value={selectedReciter?.id.toString()}
          onValueChange={handleReciterChange}
        >
          <SelectTrigger id="reciter-select" className="w-full">
            <SelectValue placeholder="اختر القارئ (Select reciter)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>القراء (Reciters)</SelectLabel>
              {filteredReciters.map(reciter => (
                <SelectItem 
                  key={reciter.id} 
                  value={reciter.id.toString()} 
                  className="font-arabic"
                >
                  {reciter.arabic_name || reciter.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Moshaf selection (only if reciter is selected) */}
      {selectedReciter && selectedReciter.moshaf.length > 1 && (
        <div>
          <label htmlFor="moshaf-select" className="block text-sm font-medium text-muted-foreground mb-1">
            الرواية (Narration)
          </label>
          <Select
            value={selectedMoshaf?.id.toString()}
            onValueChange={handleMoshafChange}
          >
            <SelectTrigger id="moshaf-select" className="w-full">
              <SelectValue placeholder="اختر الرواية (Select narration)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>الروايات (Narrations)</SelectLabel>
                {selectedReciter.moshaf.map(moshaf => (
                  <SelectItem 
                    key={moshaf.id} 
                    value={moshaf.id.toString()}
                    className="font-arabic"
                  >
                    {moshaf.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ReciterSelector;
