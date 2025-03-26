
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

// Fallback data for when the API fails
const fallbackReciters: Reciter[] = [
  {
    id: 1,
    name: "Islam Sobhi",
    arabic_name: "إسلام صبحي",
    count: 114,
    rewaya: "Hafs A'n Assem",
    moshaf: [
      {
        id: 1,
        name: "Quran",
        surah_list: "1-114",
        surah_total: "114",
        server: "https://server10.mp3quran.net/sobhi"
      }
    ],
    Server: "https://server10.mp3quran.net/sobhi"
  },
  {
    id: 2,
    name: "Abdul Basit Abdul Samad",
    arabic_name: "عبد الباسط عبد الصمد",
    count: 114,
    rewaya: "Hafs A'n Assem",
    moshaf: [
      {
        id: 2,
        name: "Murattal",
        surah_list: "1-114",
        surah_total: "114",
        server: "https://server7.mp3quran.net/basit"
      }
    ],
    Server: "https://server7.mp3quran.net/basit"
  },
  {
    id: 3,
    name: "Mishary Rashid Alafasy",
    arabic_name: "مشاري راشد العفاسي",
    count: 114,
    rewaya: "Hafs A'n Assem",
    moshaf: [
      {
        id: 3,
        name: "Quran",
        surah_list: "1-114",
        surah_total: "114",
        server: "https://server8.mp3quran.net/afs"
      }
    ],
    Server: "https://server8.mp3quran.net/afs"
  }
];

const fallbackSurahs: Surah[] = Array.from({ length: 114 }, (_, i) => ({
  id: i + 1,
  name: `Surah ${i + 1}`,
  arabic_name: getSurahArabicName(i + 1),
  ayat: 0
}));

// Helper function to get Arabic surah names
function getSurahArabicName(index: number): string {
  const arabicNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
  ];
  
  return index > 0 && index <= arabicNames.length ? `سورة ${arabicNames[index - 1]}` : `سورة ${index}`;
}

// Cache for storing API responses
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to cache API responses
async function fetchWithCache<T>(url: string, fallbackData: T): Promise<T> {
  const now = Date.now();
  
  // Return cached data if it exists and is not expired
  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    return cache[url].data as T;
  }
  
  try {
    // Use the custom fetch with timeout
    // Type cast to add the timeout property
    const fetchOptions = { 
      timeout: 5000 
    } as RequestInit & { timeout: number };
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}, using fallback data`);
      return fallbackData;
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
    console.log("Using fallback data instead");
    return fallbackData;
  }
}

// API functions
export async function getReciters(): Promise<Reciter[]> {
  try {
    const response = await fetchWithCache<{ reciters: Reciter[] }>(
      "https://www.mp3quran.net/api/v3/reciters?language=ar",
      { reciters: fallbackReciters }
    );
    return response.reciters;
  } catch (error) {
    console.error("Failed to fetch reciters:", error);
    return fallbackReciters;
  }
}

export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetchWithCache<{ surahs: Surah[] }>(
      "https://www.mp3quran.net/api/v3/suwar?language=ar",
      { surahs: fallbackSurahs }
    );
    return response.surahs;
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    return fallbackSurahs;
  }
}

// Helper function to get surah audio URL
export function getSurahAudioUrl(server: string, surahId: number): string {
  // Ensure surah ID is padded with leading zeros to 3 digits
  const paddedSurahId = surahId.toString().padStart(3, '0');
  return `${server}/${paddedSurahId}.mp3`;
}

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
