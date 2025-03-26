
import React from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Surah } from "@/services/quranService";

interface SurahSelectorProps {
  surahs: Surah[];
  availableSurahIds: number[];
  selectedSurahId: number | null;
  onSurahChange: (surahId: number) => void;
}

const SurahSelector: React.FC<SurahSelectorProps> = ({
  surahs,
  availableSurahIds,
  selectedSurahId,
  onSurahChange
}) => {
  // Filter surahs to only show available ones for this reciter
  const filteredSurahs = surahs.filter(surah => 
    availableSurahIds.includes(surah.id)
  );

  // Handle surah change
  const handleSurahChange = (surahId: string) => {
    onSurahChange(parseInt(surahId, 10));
  };

  return (
    <div className="animate-fade-in">
      <label htmlFor="surah-select" className="block text-sm font-medium text-muted-foreground mb-1">
        السورة (Surah)
      </label>
      <Select
        value={selectedSurahId?.toString()}
        onValueChange={handleSurahChange}
      >
        <SelectTrigger id="surah-select" className="w-full">
          <SelectValue placeholder="اختر السورة (Select surah)" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>السور (Surahs)</SelectLabel>
            {filteredSurahs.map(surah => (
              <SelectItem 
                key={surah.id} 
                value={surah.id.toString()}
                className="font-arabic"
              >
                {surah.arabic_name} ({surah.id})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SurahSelector;
