import { Difficulty, Realism, WorldType, Trait, Language } from './types';

export const TRANSLATIONS = {
  ar: {
    title: "الراوي الذكي",
    startNewGame: "بدء لعبة جديدة",
    continueGame: "استكمال اللعبة",
    setupTitle: "إعدادات القصة",
    playerName: "اسم اللاعب",
    difficulty: "مستوى الصعوبة",
    year: "العام (مثال: 2024 أو 300 ق.م)",
    realism: "مستوى الواقعية",
    trait: "ميزة الولادة",
    country: "دولة الولادة",
    worldType: "نوع العالم",
    startingAge: "العمر عند البداية (0 - 20 سنة)",
    startGame: "ابدأ الرحلة",
    loading: "جاري نسج الأحداث...",
    whatDo: "ماذا ستفعل الآن؟",
    customActionPlaceholder: "اكتب فعلاً خاصاً...",
    submitAction: "نفذ الفعل",
    traitWarning: "المستويات الصعبة جداً والمستحيلة لا تسمح بميزات إضافية.",
    resetConfirm: "هل أنت متأكد؟ سيتم حذف تقدمك الحالي.",
    footer: "تم التطوير بواسطة ليث – seven_code7",
    versionNote: "الإصدار v1.3 — تحسينات نهائية وتنسيق النصوص",
    
    // Stats & HUD
    age: "العمر",
    daysLived: "أيام الحياة",
    health: "الصحة",
    wealth: "الثروة",
    inventory: "الحقيبة",
    achievements: "الإنجازات",
    yearsOld: "سنة",
    days: "يوم",
    gold: "ذهب",
    items: "الأدوات",
    emptyInventory: "حقيبتك فارغة...",
    noAchievements: "لم تحقق إنجازات بعد...",
    newAchievementUnlocked: "تم فتح إنجاز جديد!",
    itemAdded: "تمت إضافة:",
    itemRemoved: "فقدت:",
    close: "إغلاق",

    // Game Over
    gameOver: "انتهت اللعبة",
    youDied: "لقد فارقت الحياة...",
    restart: "ابدأ حياة جديدة",
    finalScore: "النتيجة النهائية",

    // Enum Options Groups
    difficultyOptions: {
      [Difficulty.VERY_EASY]: "سهل جدًا",
      [Difficulty.EASY]: "سهل",
      [Difficulty.MEDIUM]: "وسط",
      [Difficulty.HARD]: "صعب",
      [Difficulty.VERY_HARD]: "صعب جدًا",
      [Difficulty.IMPOSSIBLE]: "مستحيل",
    },

    realismOptions: {
      [Realism.HIGH]: "واقعية كثيرة",
      [Realism.MEDIUM]: "واقعية متوسطة",
      [Realism.LOW]: "واقعية قليلة",
    },

    worldTypeOptions: {
      [WorldType.HISTORICAL]: "عالم تاريخي",
      [WorldType.REALISTIC]: "عالم واقعي",
      [WorldType.FANTASY]: "عالم خيالي",
      [WorldType.POST_APOCALYPTIC]: "ما بعد الكارثة",
      [WorldType.CYBERPUNK]: "سايبربانك",
    },

    traitOptions: {
      [Trait.INTELLIGENCE]: "الذكاء",
      [Trait.PRECISION]: "الدقة",
      [Trait.RELIGIOUS]: "الالتزام الديني",
      [Trait.CHARISMATIC]: "محبوب",
      [Trait.STRONG]: "قوي",
      [Trait.NONE]: "بدون ميزة",
    }
  },
  tr: {
    title: "Akıllı Anlatıcı",
    startNewGame: "Yeni Oyun Başlat",
    continueGame: "Oyuna Devam Et",
    setupTitle: "Hikaye Ayarları",
    playerName: "Oyuncu Adı",
    difficulty: "Zorluk Seviyesi",
    year: "Yıl (ör: 2024 veya M.Ö. 300)",
    realism: "Gerçekçilik Seviyesi",
    trait: "Doğuş Özelliği",
    country: "Doğum Ülkesi",
    worldType: "Dünya Türü",
    startingAge: "Başlangıç Yaşı (0 - 20 Yıl)",
    startGame: "Yolculuğa Başla",
    loading: "Olaylar kurgulanıyor...",
    whatDo: "Şimdi ne yapacaksın?",
    customActionPlaceholder: "Özel bir eylem yaz...",
    submitAction: "Uygula",
    traitWarning: "Çok zor ve imkansız seviyeler ek özelliklere izin vermez.",
    resetConfirm: "Emin misiniz? Mevcut ilerlemeniz silinecek.",
    footer: "Seven_code7 – Leys tarafından geliştirilmiştir",
    versionNote: "Sürüm v1.3 — Nihai iyileştirmeler ve metin biçimlendirme",

    // Stats & HUD
    age: "Yaş",
    daysLived: "Yaşanan Gün",
    health: "Sağlık",
    wealth: "Servet",
    inventory: "Çanta",
    achievements: "Başarılar",
    yearsOld: "Yıl",
    days: "Gün",
    gold: "Altın",
    items: "Eşyalar",
    emptyInventory: "Çantan boş...",
    noAchievements: "Henüz başarı yok...",
    newAchievementUnlocked: "Yeni Başarı Kilidi Açıldı!",
    itemAdded: "Eklendi:",
    itemRemoved: "Kaybedildi:",
    close: "Kapat",

    // Game Over
    gameOver: "Oyun Bitti",
    youDied: "Hayatını Kaybettin...",
    restart: "Yeni Bir Hayata Başla",
    finalScore: "Final Skoru",

    difficultyOptions: {
      [Difficulty.VERY_EASY]: "Çok Kolay",
      [Difficulty.EASY]: "Kolay",
      [Difficulty.MEDIUM]: "Orta",
      [Difficulty.HARD]: "Zor",
      [Difficulty.VERY_HARD]: "Çok Zor",
      [Difficulty.IMPOSSIBLE]: "İmkansız",
    },

    realismOptions: {
      [Realism.HIGH]: "Yüksek Gerçekçilik",
      [Realism.MEDIUM]: "Orta Gerçekçilik",
      [Realism.LOW]: "Düşük Gerçekçilik",
    },

    worldTypeOptions: {
      [WorldType.HISTORICAL]: "Tarihi Dünya",
      [WorldType.REALISTIC]: "Gerçekçi Dünya",
      [WorldType.FANTASY]: "Fantastik Dünya",
      [WorldType.POST_APOCALYPTIC]: "Kıyamet Sonrası",
      [WorldType.CYBERPUNK]: "Siberpunk",
    },

    traitOptions: {
      [Trait.INTELLIGENCE]: "Zeka",
      [Trait.PRECISION]: "Hassasiyet",
      [Trait.RELIGIOUS]: "Dini Bağlılık",
      [Trait.CHARISMATIC]: "Karizmatik",
      [Trait.STRONG]: "Güçlü",
      [Trait.NONE]: "Özellik Yok",
    }
  }
};