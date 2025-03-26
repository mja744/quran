import { toast } from "@/components/ui/use-toast";

// Types for API responses
export interface Reciter {
  id: number;
  name: string;
  arabic_name?: string;
  letter?: string;
  rewaya?: string;
  count: number;
  moshaf: Moshaf[];
  Server: string;
}

export interface Moshaf {
  id: number;
  name: string;
  surah_list: string;
  surah_total: string;
  server: string;
}

export interface Surah {
  id: number;
  name: string;
  arabic_name: string;
  ayat: number;
}

// Cache for storing API responses
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to cache API responses
async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  
  // Return cached data if it exists and is not expired
  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    return cache[url].data as T;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    cache[url] = {
      data,
      timestamp: now
    };
    
    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    toast({
      title: "Error",
      description: "Failed to fetch data. Please try again later.",
      variant: "destructive"
    });
    throw error;
  }
}

// API functions
export async function getReciters(): Promise<Reciter[]> {
  const response = await fetchWithCache<{ reciters: Reciter[] }>(
    "https://www.mp3quran.net/api/v3/reciters?language=ar"
  );
  return response.reciters;
}

export async function getSurahs(): Promise<Surah[]> {
  const response = await fetchWithCache<{ surahs: Surah[] }>(
    "https://www.mp3quran.net/api/v3/suwar?language=ar"
  );
  return response.surahs;
}

// Helper function to get surah audio URL
export function getSurahAudioUrl(server: string, surahId: number): string {
  // Ensure surah ID is padded with leading zeros to 3 digits
  const paddedSurahId = surahId.toString().padStart(3, '0');
  return `${server}/${paddedSurahId}.mp3`;
}

// Initialize the list of default surahs
const surahsList: Surah[] = Array.from({ length: 114 }, (_, i) => ({
  id: i + 1,
  name: `Surah ${i + 1}`,
  arabic_name: `سورة ${i + 1}`,
  ayat: 0
}));

// Helper function to get all available surahs for a reciter's moshaf
export function getSurahsForMoshaf(moshaf: Moshaf): number[] {
  if (!moshaf.surah_list) return [];
  
  // If the surah_list is a range (e.g., "1-114")
  if (moshaf.surah_list.includes('-')) {
    const [start, end] = moshaf.surah_list.split('-').map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  
  // If the surah_list is a comma-separated list
  return moshaf.surah_list.split(',').map(Number);
}

export function getDefaultMoshafForReciter(reciter: Reciter): Moshaf | null {
  // Find a moshaf that has surah list "1-114" if available
  const fullMoshaf = reciter.moshaf.find(m => m.surah_list === "1-114");
  if (fullMoshaf) return fullMoshaf;
  
  // Otherwise, return the first moshaf
  return reciter.moshaf[0] || null;
}

// Filter the list to find Islam Sobhi
export function findIslamSobhi(reciters: Reciter[]): Reciter | undefined {
  return reciters.find(r => 
    r.name.toLowerCase().includes("islam sobhi") || 
    (r.arabic_name && r.arabic_name.includes("إسلام صبحي"))
  );
}
