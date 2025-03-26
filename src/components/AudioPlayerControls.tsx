
import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AudioPlayerControlsProps {
  audioUrl: string;
  onNext: () => void;
  onPrevious: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  title: string;
  reciterName: string;
  currentIndex: number;
  totalCount: number;
}

const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  audioUrl,
  onNext,
  onPrevious,
  isPlaying,
  setIsPlaying,
  title,
  reciterName,
  currentIndex,
  totalCount
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false);

  // Update audio element when audio URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsLoading(true);
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [audioUrl, setIsPlaying]);

  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error("Error replaying audio:", error);
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(false);
        onNext();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [isRepeat, onNext, setIsPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Format time (e.g., 3:45)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Volume icon based on current volume
  const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-2xl p-6 shadow-lg animate-scale-in transition-all-cubic">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="text-center animate-slide-up animate-delay-100">
          <p className="text-muted-foreground text-sm">
            Playing {currentIndex + 1} of {totalCount}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center font-arabic mt-4 animate-slide-up animate-delay-200">
          {title}
        </h2>
        <p className="text-md text-muted-foreground font-arabic animate-slide-up animate-delay-300">
          {reciterName}
        </p>
      </div>

      {/* Time slider */}
      <div className="mb-4 flex items-center space-x-2 animate-slide-up animate-delay-300">
        <span className="text-xs text-muted-foreground w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10">
          {!isLoading ? formatTime(duration) : "--:--"}
        </span>
      </div>

      {/* Playback controls */}
      <div className="flex justify-center items-center space-x-4 mb-6 animate-slide-up animate-delay-300">
        <Button
          onClick={onPrevious}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          disabled={isLoading}
        >
          <SkipBack className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant="default"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-md transition-all",
            isLoading && "animate-pulse-subtle"
          )}
          disabled={isLoading}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button
          onClick={onNext}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          disabled={isLoading}
        >
          <SkipForward className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Volume and repeat controls */}
      <div className="flex items-center justify-between animate-slide-up animate-delay-300">
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
          >
            <VolumeIcon className="h-4 w-4" />
            <span className="sr-only">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20"
          />
        </div>

        <Button
          onClick={() => setIsRepeat(!isRepeat)}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full hover:bg-primary/10 transition-all",
            isRepeat ? "text-primary bg-primary/10" : "text-muted-foreground"
          )}
        >
          <Repeat className="h-4 w-4" />
          <span className="sr-only">
            {isRepeat ? "Disable repeat" : "Enable repeat"}
          </span>
        </Button>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" className="hidden">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayerControls;
