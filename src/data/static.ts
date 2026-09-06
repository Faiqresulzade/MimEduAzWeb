/**
 * Backend-dən idarə olunmayan statik məzmun (spec §5.4, §5.6, §6.6, §6.7).
 * Çox nadir dəyişdiyi üçün frontend-də sabit massiv kimi saxlanılır.
 */

export interface HomeSection {
  number: string;
  title: string;
  text: string;
  to: string;
}

export const homeSections: HomeSection[] = [
  {
    number: '01',
    title: 'Təlimlər',
    text: 'Canlı, onlayn və video formatda təlimlər. Sertifikat daxildir.',
    to: '/telimler',
  },
  {
    number: '02',
    title: 'Resurs Bankı',
    text: 'Müəllimlərin hazırladığı iş vərəqləri, testlər və təqdimatlar.',
    to: '/resurslar',
  },
  {
    number: '03',
    title: 'Prompt Kitabxanası',
    text: 'Dərs planı, sual dəsti və valideyn rəyi üçün hazır promptlar.',
    to: '/promptlar',
  },
  {
    number: '04',
    title: 'Haqqımızda',
    text: 'Platformanın işləmə məntiqi və müəllim rəyləri.',
    to: '/haqqimizda',
  },
];

export interface Testimonial {
  name: string;
  role: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Nigar Əliyeva',
    role: 'Riyaziyyat müəllimi · Bakı',
    text: 'Hazırladığım iş vərəqlərini bura yükləyirəm. İlk ay ərzində materiallarım 400 dəfədən çox endirildi — həm gəlir, həm də geri bildirim gətirdi.',
  },
  {
    name: 'Elvin Məmmədov',
    role: 'Fizika müəllimi · Gəncə',
    text: 'Canlı təlimdən sonra dərs planlarımı süni intellektlə hazırlamağa başladım. Sertifikatı məktəb rəhbərliyi koda görə yoxladı.',
  },
  {
    name: 'Günel Həsənova',
    role: 'İbtidai sinif müəllimi · Sumqayıt',
    text: 'Resurs Bankından götürdüyüm testləri elə həmin gün sinifdə işlətdim. Sinif və fənn üzrə filtr axtarışı bir neçə saniyə çəkir.',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Təlimə yazılmaq üçün nə lazımdır?',
    answer:
      'Qeydiyyat və ödəniş. Canlı təlimdə yer sayı 25 nəfərlə məhduddur, onlayn və video formatlarda məhdudiyyət yoxdur.',
  },
  {
    question: 'Sertifikat rəsmi qəbul edilir?',
    answer:
      'Sertifikat platformanın verdiyi iştirak sənədidir və koda görə hər kəs tərəfindən yoxlanıla bilər. Məktəb rəhbərliyi yoxlama səhifəsindən istifadə edə bilər.',
  },
  {
    question: 'Resursları kim yoxlayır?',
    answer:
      'Yüklənən hər material moderasiya növbəsinə düşür. Fənn üzrə moderator 48 saat içində təsdiqləyir və ya səbəbini yazaraq geri qaytarır.',
  },
  {
    question: 'Ödənişli resursdan nə qədər gəlir götürürəm?',
    answer:
      'Satışın 80%-i müəllifə gedir, 20% platforma komissiyasıdır. Aylıq abunə ödənişi yoxdur.',
  },
  {
    question: 'Endirdiyim materialı dərsdə necə istifadə edə bilərəm?',
    answer:
      'Öz sinfinizdə sərbəst işlədə bilərsiniz. Müəllif adını saxlamaq şərti ilə çap edib paylaya da bilərsiniz; kommersiya məqsədi ilə yenidən satış qadağandır.',
  },
  {
    question: 'Telefonla işləyir?',
    answer:
      'Bəli. Platforma mobil əvvəlcə qurulub — təlimə yazılmaq, resurs endirmək və sertifikat yoxlamaq telefondan tam işləyir.',
  },
];

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  text: string;
}

export const prompts: PromptItem[] = [
  {
    id: 'p1',
    title: 'Dərs planı promptu',
    description: '45 dəqiqəlik dərsin tam strukturunu çıxarır.',
    text: 'Sən təcrübəli fənn müəllimisən. {sinif}-ci sinif {fənn} dərsi üçün {mövzu} mövzusunda 45 dəqiqəlik dərs planı hazırla. Məqsədlər, motivasiya sualı, tədqiqat mərhələsi və qiymətləndirmə meyarlarını ayrıca göstər.',
  },
  {
    id: 'p2',
    title: 'Sual dəsti promptu',
    description: 'Çətinlik səviyyəsinə görə balanslanmış 12 sual.',
    text: '{mövzu} üzrə 12 sual yaz: 4 asan, 4 orta, 4 çətin. Hər sualın yanında düzgün cavabı və hansı bacarığı yoxladığını qeyd et.',
  },
  {
    id: 'p3',
    title: 'Valideyn rəyi promptu',
    description: 'Semestr sonu üçün hörmətli tonda qısa rəy mətni.',
    text: 'Şagirdin bu semestrdəki güclü tərəfləri: {güclü}. İnkişaf sahələri: {zəif}. Bunları valideynə hörmətli, konkret və həvəsləndirici tonda 150 sözlük mətndə yaz.',
  },
];

export interface AboutStep {
  number: string;
  title: string;
  text: string;
}

export const aboutSteps: AboutStep[] = [
  {
    number: '01',
    title: 'Öyrənin',
    text: 'Canlı, onlayn və ya video təlimə yazılın. Hər təlimin sonunda koda görə yoxlanıla bilən sertifikat verilir.',
  },
  {
    number: '02',
    title: 'Yaradın',
    text: 'Öyrəndiyinizi öz sinfiniz üçün materiala çevirin — iş vərəqi, test, təqdimat və ya metodik vəsait.',
  },
  {
    number: '03',
    title: 'Paylaşın',
    text: 'Materialı platformaya yükləyin. Fənn üzrə moderator 48 saat içində yoxlayıb Resurs Bankına buraxır.',
  },
  {
    number: '04',
    title: 'İstifadə edin',
    text: 'Digər müəllimlərin materiallarını fənn və sinif üzrə filtrləyib endirin, dərsdə birbaşa işlədin.',
  },
  {
    number: '05',
    title: 'Satın',
    text: 'Materialınızı ödənişli təyin edin. Satışın 80%-i sizin, 20%-i platformanındır — aylıq abunə haqqı yoxdur.',
  },
];
