
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  getReciters,
  getSurahs,
  getSurahAudioUrl,
  getSurahsForMoshaf,
  getDefaultMoshafForReciter,
  findIslamSobhi,
  Reciter,
  Moshaf,
  Surah
} from "@/services/quranService";
import ReciterProfile from "@/components/ReciterProfile";
import AudioPlayerControls from "@/components/AudioPlayerControls";
import ReciterSelector from "@/components/ReciterSelector";
import SurahSelector from "@/components/SurahSelector";
import { Skeleton } from "@/components/ui/skeleton";

const QuranPlayer: React.FC = () => {
  // State
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [availableSurahs, setAvailableSurahs] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  // Fetch reciters from API
  const {
    data: reciters,
    isLoading: isLoadingReciters,
    error: recitersError
  } = useQuery({
    queryKey: ["reciters"],
    queryFn: getReciters
  });

  // Fetch surahs from API
  const {
    data: surahs,
    isLoading: isLoadingSurahs,
    error: surahsError
  } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs
  });

  // Set default reciter (Islam Sobhi) when data is loaded
  useEffect(() => {
    if (reciters && !selectedReciter) {
      // Try to find Islam Sobhi
      const islamSobhi = findIslamSobhi(reciters);
      
      // If found, set as selected reciter
      if (islamSobhi) {
        setSelectedReciter(islamSobhi);
        
        // Set default moshaf
        const defaultMoshaf = getDefaultMoshafForReciter(islamSobhi);
        if (defaultMoshaf) {
          setSelectedMoshaf(defaultMoshaf);
          
          // Set available surahs
          const surahList = getSurahsForMoshaf(defaultMoshaf);
          setAvailableSurahs(surahList);
          
          // Set first surah as selected
          if (surahList.length > 0) {
            setSelectedSurahId(surahList[0]);
          }
        }
      } 
      // If Islam Sobhi not found, use the first reciter
      else if (reciters.length > 0) {
        setSelectedReciter(reciters[0]);
        
        // Set default moshaf
        const defaultMoshaf = getDefaultMoshafForReciter(reciters[0]);
        if (defaultMoshaf) {
          setSelectedMoshaf(defaultMoshaf);
          
          // Set available surahs
          const surahList = getSurahsForMoshaf(defaultMoshaf);
          setAvailableSurahs(surahList);
          
          // Set first surah as selected
          if (surahList.length > 0) {
            setSelectedSurahId(surahList[0]);
          }
        }
      }
    }
  }, [reciters, selectedReciter]);

  // Update audio URL when selection changes
  useEffect(() => {
    if (selectedMoshaf && selectedSurahId) {
      const url = getSurahAudioUrl(selectedMoshaf.server, selectedSurahId);
      setAudioUrl(url);
    }
  }, [selectedMoshaf, selectedSurahId]);

  // Handle reciter change
  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    
    // Reset playback
    setIsPlaying(false);
    
    // Set default moshaf
    const defaultMoshaf = getDefaultMoshafForReciter(reciter);
    if (defaultMoshaf) {
      setSelectedMoshaf(defaultMoshaf);
      
      // Set available surahs
      const surahList = getSurahsForMoshaf(defaultMoshaf);
      setAvailableSurahs(surahList);
      
      // Set first surah as selected
      if (surahList.length > 0) {
        setSelectedSurahId(surahList[0]);
      } else {
        setSelectedSurahId(null);
      }
    } else {
      setSelectedMoshaf(null);
      setAvailableSurahs([]);
      setSelectedSurahId(null);
    }
  };

  // Handle moshaf change
  const handleMoshafChange = (moshaf: Moshaf) => {
    setSelectedMoshaf(moshaf);
    
    // Reset playback
    setIsPlaying(false);
    
    // Set available surahs
    const surahList = getSurahsForMoshaf(moshaf);
    setAvailableSurahs(surahList);
    
    // Set first surah as selected
    if (surahList.length > 0) {
      setSelectedSurahId(surahList[0]);
    } else {
      setSelectedSurahId(null);
    }
  };

  // Handle surah change
  const handleSurahChange = (surahId: number) => {
    setSelectedSurahId(surahId);
    setIsPlaying(true);
  };

  // Go to next surah
  const handleNextSurah = () => {
    if (selectedSurahId && availableSurahs.length > 0) {
      const currentIndex = availableSurahs.indexOf(selectedSurahId);
      const nextIndex = (currentIndex + 1) % availableSurahs.length;
      setSelectedSurahId(availableSurahs[nextIndex]);
      setIsPlaying(true);
    }
  };

  // Go to previous surah
  const handlePreviousSurah = () => {
    if (selectedSurahId && availableSurahs.length > 0) {
      const currentIndex = availableSurahs.indexOf(selectedSurahId);
      const prevIndex = (currentIndex - 1 + availableSurahs.length) % availableSurahs.length;
      setSelectedSurahId(availableSurahs[prevIndex]);
      setIsPlaying(true);
    }
  };

  // Find current surah name
  const getCurrentSurahName = (): string => {
    if (!selectedSurahId || !surahs) return "";
    
    const surah = surahs.find(s => s.id === selectedSurahId);
    return surah ? surah.arabic_name : `سورة ${selectedSurahId}`;
  };

  // Show error toast if API requests fail
  useEffect(() => {
    if (recitersError || surahsError) {
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive"
      });
    }
  }, [recitersError, surahsError]);

  // Currently selected surah index
  const currentSurahIndex = selectedSurahId 
    ? availableSurahs.indexOf(selectedSurahId)
    : -1;

  return (
    <div className="min-h-screen bg-quran flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slide-up">
            Quran Player
          </h1>
          <p className="text-lg text-muted-foreground font-arabic animate-slide-up animate-delay-100">
            مشغل القرآن الكريم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Reciter Profile */}
            {selectedReciter ? (
              <ReciterProfile reciter={selectedReciter} className="mb-8" />
            ) : isLoadingReciters ? (
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="w-40 h-8" />
                <Skeleton className="w-32 h-6" />
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No reciter selected</p>
              </div>
            )}

            {/* Selection controls */}
            <div className="space-y-4 bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
              {/* Reciter selection */}
              {isLoadingReciters ? (
                <div className="space-y-2">
                  <Skeleton className="w-40 h-4" />
                  <Skeleton className="w-full h-10" />
                </div>
              ) : reciters && reciters.length > 0 ? (
                <ReciterSelector
                  reciters={reciters}
                  selectedReciter={selectedReciter}
                  selectedMoshaf={selectedMoshaf}
                  onReciterChange={handleReciterChange}
                  onMoshafChange={handleMoshafChange}
                />
              ) : (
                <p className="text-muted-foreground">No reciters available</p>
              )}

              {/* Surah selection */}
              {isLoadingSurahs || !surahs ? (
                <div className="space-y-2">
                  <Skeleton className="w-40 h-4" />
                  <Skeleton className="w-full h-10" />
                </div>
              ) : selectedMoshaf && availableSurahs.length > 0 ? (
                <SurahSelector
                  surahs={surahs}
                  availableSurahIds={availableSurahs}
                  selectedSurahId={selectedSurahId}
                  onSurahChange={handleSurahChange}
                />
              ) : (
                <p className="text-muted-foreground">No surahs available</p>
              )}
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex items-center justify-center">
            {selectedReciter && selectedMoshaf && selectedSurahId ? (
              <AudioPlayerControls
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                onNext={handleNextSurah}
                onPrevious={handlePreviousSurah}
                title={getCurrentSurahName()}
                reciterName={selectedReciter.arabic_name || selectedReciter.name}
                currentIndex={currentSurahIndex}
                totalCount={availableSurahs.length}
              />
            ) : (
              <div className="bg-card rounded-2xl p-6 shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="w-32 h-6" />
                  <Skeleton className="w-48 h-8" />
                  <Skeleton className="w-40 h-6" />
                  <Skeleton className="w-full h-4" />
                  <div className="flex justify-center space-x-4 w-full">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranPlayer;
