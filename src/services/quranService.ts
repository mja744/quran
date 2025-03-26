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

// Hardcoded data for Islam Sobhi and popular reciters
const hardcodedReciters: Reciter[] = [
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
        server: "https://islamsobhi.com/Quran"
      }
    ],
    Server: "https://islamsobhi.com/Quran"
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
  },
  {
    id: 4,
    name: "Maher Al Muaiqly",
    arabic_name: "ماهر المعيقلي",
    count: 114,
    rewaya: "Hafs A'n Assem",
    moshaf: [
      {
        id: 4,
        name: "Quran",
        surah_list: "1-114",
        surah_total: "114",
        server: "https://server12.mp3quran.net/maher"
      }
    ],
    Server: "https://server12.mp3quran.net/maher"
  },
  {
    id: 5,
    name: "Mahmoud Khalil Al-Hussary",
    arabic_name: "محمود خليل الحصري",
    count: 114,
    rewaya: "Hafs A'n Assem",
    moshaf: [
      {
        id: 5,
        name: "Quran",
        surah_list: "1-114",
        surah_total: "114",
        server: "https://server13.mp3quran.net/husr"
      }
    ],
    Server: "https://server13.mp3quran.net/husr"
  }
];

// All surahs with their names
const hardcodedSurahs: Surah[] = Array.from({ length: 114 }, (_, i) => ({
  id: i + 1,
  name: `Surah ${i + 1}`,
  arabic_name: getSurahArabicName(i + 1),
  ayat: getSurahAyatCount(i + 1)
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

// Helper function to get known ayat counts for each surah
function getSurahAyatCount(index: number): number {
  const ayatCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,  // 1-10
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,   // 11-20
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,      // 21-30
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,        // 31-40
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,         // 41-50
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,         // 51-60
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,         // 61-70
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,         // 71-80
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20,         // 81-90
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11,             // 91-100
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3,                // 101-110
    5, 4, 5, 6                                     // 111-114
  ];
  
  return index > 0 && index <= ayatCounts.length ? ayatCounts[index - 1] : 0;
}

// Helper function to get surah audio URL
export function getSurahAudioUrl(server: string, surahId: number): string {
  // Special case for Islam Sobhi
  if (server.includes("islamsobhi.com")) {
    // Islam Sobhi's website uses different format
    return `${server}/${surahId.toString().padStart(3, '0')}.mp3`;
  }
  
  // Default format for other reciters
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

// API functions - now using hardcoded data instead of failing API
export async function getReciters(): Promise<Reciter[]> {
  // Since the API is failing, we'll use our hardcoded data
  console.log("Using hardcoded reciters data instead of API");
  return Promise.resolve(hardcodedReciters);
}

export async function getSurahs(): Promise<Surah[]> {
  // Since the API is failing, we'll use our hardcoded data
  console.log("Using hardcoded surahs data instead of API");
  return Promise.resolve(hardcodedSurahs);
}
