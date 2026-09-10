import { Customer, PublicService, OfferItem, MonetizationAd, CustomPage, ServiceCategory, OwnerSettings } from '../types';
import { appConfig } from '../config';

export const initialCategories: ServiceCategory[] = [
  {
    id: 'fluids',
    name: 'الزيوت والسوائل (Fluids & Oils)',
    nameEn: 'Fluids & Lubricants',
    order: 1,
    iconName: 'Droplet',
    defaultItems: [
      'زيت المحرك التخليقي (Engine Oil)',
      'زيت ناقل الحركة الأوتوماتيك (Gearbox Fluid)',
      'سائل الفرامل والهيدروليك (Brake Fluid DOT4)',
      'سائل تبريد المحرك والمبرد (Radiator Coolant)',
      'زيت الباور ستيرنج (Power Steering Fluid)'
    ]
  },
  {
    id: 'filters',
    name: 'الفلاتر والمنقيات (Filters)',
    nameEn: 'Filters System',
    order: 2,
    iconName: 'Filter',
    defaultItems: [
      'فلتر زيت المحرك الأصلي (Oil Filter)',
      'فلتر هواء المحرك (Air Filter)',
      'فلتر تكييف المقصورة الكربون (Cabin AC Filter)',
      'فلتر الوقود والبنزين (Fuel Filter)'
    ]
  },
  {
    id: 'ignition_mechanical',
    name: 'الميكانيكا ومنظومة الإشعال (Mechanical & Ignition)',
    nameEn: 'Ignition & Mechanical',
    order: 3,
    iconName: 'Zap',
    defaultItems: [
      'بوجيهات الإشعال إيريديوم (Spark Plugs)',
      'موبينات الإشعال (Ignition Coils)',
      'سير الكاتينة والمجموعة (Timing & Serp Belts)',
      'طلمبة المياه ومروحة التبريد (Water Pump)',
      'تنظيف البوابة وحساسات الشكمان (Throttle & O2 Sensors)'
    ]
  },
  {
    id: 'brakes_suspension',
    name: 'الفرامل والعفشة والتعليق (Brakes & Suspension)',
    nameEn: 'Brakes & Suspension',
    order: 4,
    iconName: 'Disc',
    defaultItems: [
      'تيل فرامل أمامي وخلفي (Brake Pads)',
      'طنابير الفرامل والديسكات (Brake Rotors)',
      'مساعدين أمامي وخلفي (Shock Absorbers)',
      'جلب مقصات وبيض دركسيون (Control Arms & Ball Joints)',
      'ضبط زوايا إلكتروني وترصيص (Wheel Alignment & Balancing)'
    ]
  },
  {
    id: 'electrical_ac',
    name: 'الكهرباء والتكييف والبطارية (Electrical & AC)',
    nameEn: 'Electrical & AC',
    order: 5,
    iconName: 'Activity',
    defaultItems: [
      'بطارية السيارة الجافة (12V Battery)',
      'شحن فريون تكييف أصلي R134a (AC Gas Recharge)',
      'دينامو الشحن والمارش (Alternator & Starter)',
      'فحص كمبيوتر الأعطال OBD-II (Computer Diagnostics)'
    ]
  },
  {
    id: 'body_doko',
    name: 'السمكرة والدوكو والعناية (Body & Detailing)',
    nameEn: 'Body & Detailing',
    order: 6,
    iconName: 'Sparkles',
    defaultItems: [
      'رش بوية فرن ميتاليك (Oven Paint Spray)',
      'سمكرة وتعديل على البارد PDR (Paintless Dent Repair)',
      'طبقة نانو سيراميك 9H (Nano Ceramic Coating)',
      'تلميع وإزالة الخدوش بوليش (Polishing & Compounding)'
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'المهندس أحمد حسام الدين الشاذلي',
    phone: '01012345678',
    nationalId: '28911010104598',
    carModel: 'Toyota Corolla 2023 - 1.6L Auto',
    plateNumber: 'أ ب ج ٤٥٨٩',
    vin: 'NMTBZ3BE40R129480',
    odometer: 48500,
    carPhotoUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
    notes: 'عميل مميز - يفضل استخدام زيوت تويوتا الأصلية 5W-30 وفلاتر يابانية معتمدة.',
    createdAt: '2025-01-10T10:30:00Z',
    updatedAt: '2025-02-15T14:20:00Z',
    services: [
      {
        id: 'srv-101',
        name: 'زيت المحرك التخليقي 10,000 كم + الفلتر الأصلي',
        nameEn: 'Synthetic 10,000km Engine Oil + OEM Filter',
        category: 'fluids',
        status: 'good',
        serviceDate: '2025-02-10',
        nextDueDate: '2025-08-10',
        nextOdometer: 58500,
        notes: 'تم تزويد زيت 5W-30 تخليقي بالكامل مع تغيير فلتر الزيت وغسيل المحرك خارجياً.',
        cost: 2150
      },
      {
        id: 'srv-102',
        name: 'تيل فرامل أمامي وخلفي أصلي',
        nameEn: 'Front & Rear Brake Pads',
        category: 'brakes_suspension',
        status: 'critical',
        serviceDate: '2024-04-12',
        nextDueDate: '2025-02-01',
        nextOdometer: 49000,
        notes: 'تنبيه: تيل الفرامل الأمامي مستهلك بنسبة ٨٥٪ ويصدر صفيراً ويجب تغييره فوراً حفاظاً على الطنابير.',
        cost: 1850
      },
      {
        id: 'srv-103',
        name: 'شحن فريون وتطهير دورة التكييف',
        nameEn: 'AC Freon Recharge & Antibacterial Flush',
        category: 'electrical_ac',
        status: 'medium',
        serviceDate: '2024-06-15',
        nextDueDate: '2025-04-15',
        notes: 'تم فحص ضغط الكومبروسر، التبريد جيد ولكن فلتر الصالون يحتاج تنظيف أو تغيير قبل الصيف.',
        cost: 650
      },
      {
        id: 'srv-104',
        name: 'بوجيهات إيريديوم وموبينات الإشعال',
        nameEn: 'Iridium Spark Plugs',
        category: 'ignition_mechanical',
        status: 'good',
        serviceDate: '2024-11-20',
        nextDueDate: '2026-11-20',
        nextOdometer: 88500,
        notes: 'تم تركيب 4 شمعات إيريديوم دنسو أصلية وتم فحص الكويلات بحالة ممتازة.',
        cost: 1400
      }
    ]
  },
  {
    id: 'cust-2',
    fullName: 'الدكتور محمود عبد العزيز النجار',
    phone: '01123456789',
    carModel: 'Hyundai Tucson 2021 GDI Turbo',
    plateNumber: 'ق ر ط ٩٦٣٢',
    vin: 'KMHD881CBMU749102',
    odometer: 72300,
    carPhotoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    notes: 'فحص دوري كامل قبل السفر إلى الساحل الشمالي.',
    createdAt: '2025-01-22T11:00:00Z',
    updatedAt: '2025-02-18T16:45:00Z',
    services: [
      {
        id: 'srv-201',
        name: 'زيت ناقل الحركة الأوتوماتيك DCT',
        nameEn: 'Dual Clutch Transmission Fluid',
        category: 'fluids',
        status: 'medium',
        serviceDate: '2024-03-01',
        nextDueDate: '2025-03-01',
        nextOdometer: 75000,
        notes: 'موصى بتغيير زيت الفتيس مع الفلتر عند بلوغ 75 ألف كم.',
        cost: 3200
      },
      {
        id: 'srv-202',
        name: 'طبقة حماية نانو سيراميك وتلميع صالون',
        nameEn: 'Nano Ceramic 9H & Detailing',
        category: 'body_doko',
        status: 'good',
        serviceDate: '2025-01-25',
        nextDueDate: '2026-01-25',
        notes: 'ضمان سنة كاملة مع جلسة صيانة مجانية بعد 6 أشهر.',
        cost: 4500
      }
    ]
  },
  {
    id: 'cust-3',
    fullName: 'الأستاذة سارة وائل إبراهيم',
    phone: '01234567890',
    carModel: 'Kia Sportage 2022 GT-Line',
    plateNumber: 'م ص ر ١١٢٢',
    vin: 'KNDPX3A25N7109283',
    odometer: 34100,
    carPhotoUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80',
    notes: 'تم فحص البطارية وإجراء غسيل هيدروجيني للمحرك.',
    createdAt: '2025-02-01T09:15:00Z',
    updatedAt: '2025-02-19T12:00:00Z',
    services: [
      {
        id: 'srv-301',
        name: 'بطارية السيارة 70 أمبير جافة',
        nameEn: 'Dry 70Ah Car Battery',
        category: 'electrical_ac',
        status: 'good',
        serviceDate: '2025-02-01',
        nextDueDate: '2027-02-01',
        notes: 'بطارية فارتا ألمانية بضمان معتمد لمدة سنتين.',
        cost: 3800
      },
      {
        id: 'srv-302',
        name: 'فلاتر الهواء والتكييف والبنزين',
        nameEn: 'Full Filters Set',
        category: 'filters',
        status: 'good',
        serviceDate: '2025-02-01',
        nextDueDate: '2025-08-01',
        nextOdometer: 44000,
        notes: 'تم استبدال كامل الفلاتر بقطع كورية موبيس أصلية.',
        cost: 950
      }
    ]
  }
];

export const initialPublicServices: PublicService[] = [
  {
    id: 'srv-card-1',
    title: 'غسيل وتلميع ديتيلينج احترافي',
    titleEn: 'Car Wash & Detailing',
    shortDesc: 'غسيل رغوي نانو، تنظيف الشاسيه والمحرك بالبخار، وإزالة التكلسات بدقة متناهية.',
    shortDescEn: 'Nano foam wash, undercarriage steam cleaning, engine bay detailing, and decontamination.',
    fullDesc: 'نستخدم أفضل رغوة كيميائية متعادلة PH لعدم الإضرار بطبقة اللقلق أو دهان السيارة، مع غسيل داخلي للمقصورة وتنظيف الجنوط بمواد مزيلة لبرادة الفرامل، وتجفيف بألياف ميكروفايبر فائقة النعومة.',
    fullDescEn: 'Premium pH-neutral foam bath, safe microfiber hand wash, wheel iron decontamination, steam engine degreasing, and luxury interior conditioning.',
    icon: 'Sparkles',
    active: true,
    priceEstimate: 'يبدأ من 250 ج.م',
    duration: '45 - 90 دقيقة',
    warranty: 'نظافة ولمعان مضمون 100%',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-card-2',
    title: 'تنظيف فرش وصالون وتعقيم بالبخار',
    titleEn: 'Carpet & Interior Deep Clean',
    shortDesc: 'غسيل الكراسي والفرش بالدريل الدوار، إزالة البقع الصعبة وتعقيم التكييف بالأوزون.',
    shortDescEn: 'Rotary drill brush upholstery extraction, tough stain removal, and ozone AC sterilization.',
    fullDesc: 'معالجة الجلد وتغذيته بكريمات ألمانية، فك وتنظيف الموكيت والدواسات بضغط البخار الساخن عند ١٤٠ درجة مئوية للقضاء على ٩٩.٩٪ من البكتيريا والروائح الكريهة وترك مقصورة سيارتك برائحة فندقية منعشة.',
    fullDescEn: 'German leather conditioning, deep steam extraction for carpets and headliners, antimicrobial ozone treatment, and premium cabin fragrance.',
    icon: 'Sofa',
    active: true,
    priceEstimate: 'يبدأ من 600 ج.م',
    duration: '2 - 3 ساعات',
    warranty: 'إزالة البقع بدون تغيير ألوان الفرش',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-card-3',
    title: 'دوكو ورش بوية فرن كمبيوتر',
    titleEn: 'Doko & Paint Oven Spray',
    shortDesc: 'مطابقة درجات الألوان بالكمبيوتر بدقة 100% مع فرن حراري إيطالي لضمان لمعان المصنع.',
    shortDescEn: 'Computerized spectrophotometer paint matching inside an Italian heated spray booth.',
    fullDesc: 'نستخدم أفضل خامات البويات الأوروبية (Standox / Glasurit) مع طبقات ورنيش حماية ضد أشعة الشمس فوق البنفسجية والعوامل الجوية، مع معالجة الخدوش والصدمات دون أي فروقات في الدرجة اللونية.',
    fullDescEn: 'Equipped with computerized color mixing spectrometers and Italian climate-controlled spray booths using premium Standox clear coats with lifetime UV warranty.',
    icon: 'Palette',
    active: true,
    priceEstimate: 'يبدأ من 900 ج.م للقطعة',
    duration: '24 - 48 ساعة',
    warranty: 'ضمان 5 سنوات ضد التقشير والبهتان',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-card-4',
    title: 'ضبط ميكانيكا وصيانة شاملة',
    titleEn: 'Mechanical Tuning & Maintenance',
    shortDesc: 'صيانة دورية للمحركات، الفتيس، طلمبات البنزين، سيور الكاتينة وتغيير الزيوت المعتمدة.',
    shortDescEn: 'Comprehensive engine overhaul, transmission maintenance, timing belt replacement, and fluid checks.',
    fullDesc: 'فريق من أمهر مهندسي وفنيي الميكانيكا لصيانة جميع أنواع السيارات اليابانية، الكورية، الألمانية، والصينية. نلتزم بجداول الصيانة الموصى بها من الشركات الصانعة وباستخدام قطع الغيار الأصلية فقط.',
    fullDescEn: 'Master technicians equipped with specialized torque tools, factory service manuals, and genuine OEM parts for Japanese, Korean, German, and American vehicles.',
    icon: 'Wrench',
    active: true,
    priceEstimate: 'كشف ميكانيكا 200 ج.م',
    duration: 'حسب نوع الصيانة',
    warranty: 'ضمان على المصنعيات وقطع الغيار',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-card-5',
    title: 'سمكرة وتعديل شاسيه على البارد',
    titleEn: 'Body Repair & Dent Removal',
    shortDesc: 'استعدال الصدمات بتقنية PDR بدون رش بوية، ضبط استقامة الشاسيه بالليزر.',
    shortDescEn: 'Paintless Dent Repair (PDR) and computerized laser chassis bench straightening.',
    fullDesc: 'نحافظ على دهان الفابريكا الأصلي لسيارتك باستخدام أحدث معدات الشفط والاستعدال على البارد (PDR)، مع جهاز شد واستعدال الشاسيهات بالليزر لإعادة أبعاد الهيكل إلى المعايير القياسية للشركة المصنعة.',
    fullDescEn: 'Preserve your car\'s original factory paint with advanced PDR rods, glue pulling systems, and hydraulic chassis jig alignment systems.',
    icon: 'Hammer',
    active: true,
    priceEstimate: 'يبدأ من 300 ج.م للصدمة',
    duration: 'نفس اليوم لمعظم الصدمات',
    warranty: 'استعادة شكل الفابريكا الأصلي',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-card-6',
    title: 'فحص كمبيوتر الأعطال وتكييف السيارة',
    titleEn: 'Computer Diagnostics & AC Service',
    shortDesc: 'كشف شامل بحساسات OBD2 الأصلية، برمجة الكنترول وشحن فريون أوتوماتيكي مع كشف تسريب.',
    shortDescEn: 'OEM OBD2 diagnostics, ECU live stream calibration, and automated AC recovery and recharge.',
    fullDesc: 'أحدث أجهزة الفحص (Launch / Autel / Bosch) لقراءة أكواد الأعطال في جميع وحدات التحكم (المحرك، الفتيس، ABS، الإيرباج، BCM)، مع ماكينة روبوتيك أوتوماتيكية لتفريغ زيت وشحن فريون التكييف بدقة بالجرام.',
    fullDescEn: 'State-of-the-art diagnostic scanners providing live data stream analysis, error code clearance, key programming, and computerized digital AC freon flush.',
    icon: 'Cpu',
    active: true,
    priceEstimate: 'كشف كمبيوتر شامل 300 ج.م',
    duration: '20 - 40 دقيقة',
    warranty: 'تقرير فحص رقمي مفصل ومطبوع',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80'
  }
];

export const initialOffers: OfferItem[] = [
  {
    id: 'offer-1',
    title: 'باقة الصيانة الذهبية الشاملة',
    titleEn: 'Golden Comprehensive Service Package',
    subtitle: 'تغيير زيت تخليقي 10,000 كم + فلتر الزيت + فحص كمبيوتر وتكييف مجاناً',
    subtitleEn: '10k Synthetic Oil + OEM Filter + Free Computer Scan & AC Test',
    badge: 'خصم 30% لفترة محدودة',
    discountPercent: 30,
    expiryDate: '2025-04-30',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&auto=format&fit=crop&q=80',
    active: true,
    ctaText: 'احجز العرض الآن عبر واتساب',
    ctaLink: 'https://wa.me/201001234567?text=مرحبا، أود حجز عرض باقة الصيانة الذهبية'
  },
  {
    id: 'offer-2',
    title: 'عرض النانو سيراميك وتلميع البودي',
    titleEn: 'Nano Ceramic 9H Paint Protection Deal',
    subtitle: 'طبقة حماية ألمانية 9H تدوم 3 سنوات مع معالجة الخدوش وغسيل المحرك مجاناً',
    subtitleEn: 'German 9H protective coating + 3-stage paint correction + free engine bay wash',
    badge: 'وفر 1500 جنيه',
    discountPercent: 25,
    expiryDate: '2025-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1000&auto=format&fit=crop&q=80',
    active: true,
    ctaText: 'استفد بالعرض ونسق موعدك',
    ctaLink: 'https://wa.me/201001234567?text=مرحبا، أود الاستفسار عن عرض النانو سيراميك'
  },
  {
    id: 'offer-3',
    title: 'خصم خاص على صيانة العفشة والفرامل',
    titleEn: 'Suspension & Brake Maintenance Special',
    subtitle: 'خصم 20% على مصنعيات تركيب التيل والمساعدين وضبط الزوايا بالليزر',
    subtitleEn: '20% off labor on brake pads, shocks, and 3D laser wheel alignment',
    badge: 'عرض الصيف',
    discountPercent: 20,
    expiryDate: '2025-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
    active: true,
    ctaText: 'احجز فحص عفشة مجاني',
    ctaLink: 'https://wa.me/201001234567?text=مرحبا، أود حجز فحص العفشة والفرامل'
  }
];

export const initialAds: MonetizationAd[] = [
  {
    id: 'ad-1',
    sponsorName: 'Motul & Castrol Oils Egypt — الزيوت التخليقية المعتمدة',
    title: 'عرض خاص للورش: زيوت محركات 5W-30 التخليقية بالكامل + فلاتر هدايا',
    subtitle: 'شحنات فورية معتمدة من الوكيل مباشرة مع خصم 15% على الكراتين وضمان أصلية 100%',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://wa.me/201001234567?text=استفسار من إعلان زيوت موتوكاسترول عن عروض الزيوت التخليقية',
    durationSeconds: 10,
    active: true,
    badgeText: 'راعي رسمي للزيوت وقطع الغيار',
    clicks: 214,
    bannerHeight: 'standard',
  },
  {
    id: 'ad-2',
    sponsorName: 'البرنس لقطع غيار السيارات الأصلية (Bosch & Denso)',
    title: 'بوجيهات إيريديوم، تيل فرامل بريمبو، وسيور كاتينة أصلية لجميع الموديلات',
    subtitle: 'توصيل فوري لجميع الورش والمراكز في القاهرة والجيزة بخصم خاص لأصحاب الورش والمراكز',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://wa.me/201001234567?text=استفسار من إعلان منصة أوتوماستر عن قطع الغيار الأصلية',
    durationSeconds: 10,
    active: true,
    badgeText: 'موزع معتمد لقطع الغيار',
    clicks: 178,
    bannerHeight: 'standard',
  },
  {
    id: 'ad-3',
    sponsorName: 'أوتو ستار للإطارات والبطاريات الألمانية (Varta & Michelin)',
    title: 'أقوى العروض على إطارات ميشلان، بريدجستون، وبطاريات فارتا الجافة',
    subtitle: 'تركيب وترصيص بالنيتروجين مجاناً وضمان استبدال فوري لمدة عامين كاملين',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://wa.me/201001234567?text=استفسار عن عروض الإطارات وبطاريات فارتا',
    durationSeconds: 12,
    active: true,
    badgeText: 'عرض الإطارات والبطاريات',
    clicks: 135,
    bannerHeight: 'standard',
  }
];

export const initialCustomPages: CustomPage[] = [
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'سياسة الخصوصية والأمان والعزل السحابي (Zero-Leakage)',
    titleEn: 'Privacy, Security & Zero-Leakage Policy',
    content: `نحن في مركز الأهرام لصيانة السيارات نلتزم بأقصى معايير الأمان وحماية البيانات الشخصية لعملائنا الكرام.
1. الأمان والعزل الطرفي الفائق (Zero-Server Client Isolation):
تطبيقنا مصمم وفق أحدث معايير الـ PWA المعزولة طرفياً، حيث يتم تشفير ومعالجة بيانات سجلات الصيانة محلياً، مع شهادة الأمان (Zero-Leakage Certified PWA) التي تضمن عدم وجود أي تسريب للبيانات أو التتبع التجسسي عبر الإنترنت.
2. البيانات المجمعة:
نقوم بتسجيل الاسم، ورقم الهاتف، وموديل السيارة، ورقم اللوحة، ورقم الشاسيه (VIN)، وقراءات عداد الكيلومترات فقط لأغراض إصدار الفواتير الرسمية، وحفظ تاريخ الصيانة، وإرسال تنبيهات الصيانة المجدولة عبر واتساب بناءً على طلب العميل.
3. معالجة الصور وضغطها محلياً:
جميع صور فحص السيارات يتم ضغطها ومعالجتها طرفياً في متصفحك الخاص بدقة متناهية ودون إرسالها إلى خوادم تتبع خارجية.
4. حق التعديل والحذف الكامل:
يحق لأي عميل مراجعة سجله الرقمي أو طلب حذف بيانات سيارته بالكامل من النظام في أي وقت عبر إدارة المركز مباشرة.`,
    contentEn: `Al-Ahram Auto Care is committed to the highest standards of data security and client privacy protection.
1. Ultra-Secure Client Isolation (Zero-Leakage Certified PWA):
Our application is engineered with pure zero-server client isolation, ensuring your service logs and vehicle records remain completely encrypted without background data leakage or third-party tracking telemetry.
2. Collected Operational Data:
We record customer full names, phone numbers, vehicle plate numbers, VINs, and odometer readings strictly for certified maintenance logging, invoice generation, and customer WhatsApp reminder scheduling.
3. Local Image Compression:
All vehicle inspection photographs are compressed locally on the client device preserving privacy and minimal memory footprint without exposure to public trackers.
4. Right to Access & Erasure:
Customers maintain full rights to inspect, export, update, or permanently delete their vehicle records at any time by contacting our workshop front desk.`,
    isSystem: true,
    showInFooter: true,
    updatedAt: '2025-01-01'
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'الشروط والأحكام والضمان',
    titleEn: 'Terms of Service & Warranty',
    content: `1. شروط الضمان: تسري فترات الضمان المحددة في فواتير الصيانة على قطع الغيار الأصلية والمصنعيات وفق الكيلومترات أو المدة الموضحة أيهما أقرب.
2. الكشف المسبق: يتم إخطار العميل بجميع التكاليف التقديرية للأعطال قبل البدء في التنفيذ.
3. استلام السيارة: يتم تسليم السيارة بعد تجربة الأداء والتأكد من مطابقة جميع معايير الأمان وتقديم تقرير الفحص الرقمي.`,
    contentEn: `1. Warranty Coverage: Warranty periods specified on invoices apply to genuine parts and labor based on specified mileage or duration.
2. Prior Approval: Customers are informed of estimated repairs and parts pricing prior to commencing mechanical work.
3. Vehicle Delivery: Vehicles are delivered after thorough road testing and computerized safety verification.`,
    isSystem: true,
    showInFooter: true,
    updatedAt: '2025-01-01'
  },
  {
    id: 'page-cookies',
    slug: 'cookies',
    title: 'سياسة ملفات الارتباط والتخزين المؤقت',
    titleEn: 'Cookies & Storage Policy',
    content: `هذا التطبيق مصمم بنظام العزل الفائق (Client-Side Isolation) ولا يقوم بحفظ أي ملفات تتبع تجسسية أو ملفات تعريف ارتباط خارجية. يتم استخدام التخزين المؤقت فقط لحفظ تفضيلات المظهر (الوضع الليلي) واللغة فقط لا غير.`,
    contentEn: `This Progressive Web App uses client-side isolation and does not use third-party tracking cookies. Local storage is strictly limited to theme (dark/light) and language preferences.`,
    isSystem: true,
    showInFooter: true,
    updatedAt: '2025-01-01'
  }
];

export const initialOwnerSettings: OwnerSettings = {
  workshopName: appConfig.workshopDefault.name,
  workshopNameEn: appConfig.workshopDefault.nameEn,
  slogan: appConfig.workshopDefault.slogan,
  sloganEn: appConfig.workshopDefault.sloganEn,
  about: appConfig.workshopDefault.about,
  aboutEn: appConfig.workshopDefault.aboutEn,
  phone: appConfig.workshopDefault.phone,
  whatsapp: appConfig.workshopDefault.whatsapp,
  address: appConfig.workshopDefault.address,
  addressEn: appConfig.workshopDefault.addressEn,
  googleMapsUrl: appConfig.workshopDefault.googleMapsUrl,
  logoUrl: appConfig.workshopDefault.logoUrl,
  bannerUrl: appConfig.workshopDefault.bannerUrl,
  primaryColor: appConfig.workshopDefault.primaryColor,
  secondaryColor: appConfig.workshopDefault.secondaryColor,
  adminPasskey: '123', // Default key as requested
  adminEmail: appConfig.workshopDefault.adminEmail,
};
