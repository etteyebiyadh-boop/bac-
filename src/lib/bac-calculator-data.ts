export interface Subject {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  coef: number;
}

export interface BacSectionData {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  subjects: Subject[];
}

export const BAC_SECTIONS_CALC: BacSectionData[] = [
  {
    id: "maths",
    nameEn: "Mathematics",
    nameFr: "Mathématiques",
    nameAr: "الرياضيات",
    subjects: [
      { id: "math", nameEn: "Mathematics", nameFr: "Mathématiques", nameAr: "الرياضيات", coef: 4 },
      { id: "phys", nameEn: "Physics", nameFr: "Sciences Physiques", nameAr: "العلوم الفيزيائية", coef: 4 },
      { id: "svt", nameEn: "SVT", nameFr: "SVT", nameAr: "علوم الحياة والأرض", coef: 1 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 1 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 1 },
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 1 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 1 },
      { id: "inf", nameEn: "Computer Science", nameFr: "Informatique", nameAr: "الإعلامية", coef: 1 },
      { id: "opt", nameEn: "Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  },
  {
    id: "sciences",
    nameEn: "Experimental Sciences",
    nameFr: "Sciences Expérimentales",
    nameAr: "العلوم التجريبية",
    subjects: [
      { id: "svt", nameEn: "SVT", nameFr: "SVT", nameAr: "علوم الحياة والأرض", coef: 4 },
      { id: "phys", nameEn: "Physics", nameFr: "Sciences Physiques", nameAr: "العلوم الفيزيائية", coef: 4 },
      { id: "math", nameEn: "Mathematics", nameFr: "Mathématiques", nameAr: "الرياضيات", coef: 3 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 1 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 1 },
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 1 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 1 },
      { id: "inf", nameEn: "Computer Science", nameFr: "Informatique", nameAr: "الإعلامية", coef: 1 },
      { id: "opt", nameEn: "Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  },
  {
    id: "technique",
    nameEn: "Technical Sciences",
    nameFr: "Sciences Techniques",
    nameAr: "العلوم التقنية",
    subjects: [
      { id: "tech", nameEn: "Technical", nameFr: "Technique", nameAr: "التقنية", coef: 4 },
      { id: "phys", nameEn: "Physics", nameFr: "Sciences Physiques", nameAr: "العلوم الفيزيائية", coef: 4 },
      { id: "math", nameEn: "Mathematics", nameFr: "Mathématiques", nameAr: "الرياضيات", coef: 3 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 1 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 1 },
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 1 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 1 },
      { id: "inf", nameEn: "Computer Science", nameFr: "Informatique", nameAr: "الإعلامية", coef: 1 },
      { id: "opt", nameEn: "Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  },
  {
    id: "econ",
    nameEn: "Economy & Mgmt",
    nameFr: "Économie & Gestion",
    nameAr: "الاقتصاد والتصرف",
    subjects: [
      { id: "econ", nameEn: "Economy", nameFr: "Économie", nameAr: "الاقتصاد", coef: 5 },
      { id: "gest", nameEn: "Mgmt", nameFr: "Gestion", nameAr: "التصرف", coef: 5 },
      { id: "math", nameEn: "Mathematics", nameFr: "Mathématiques", nameAr: "الرياضيات", coef: 2 },
      { id: "hg", nameEn: "History-Geo", nameFr: "Histoire-Géo", nameAr: "التاريخ والجغرافيا", coef: 2 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 1 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 1 },
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 1 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 1 },
      { id: "inf", nameEn: "Computer Science", nameFr: "Informatique", nameAr: "الإعلامية", coef: 1 },
      { id: "opt", nameEn: "Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  },
  {
    id: "lettres",
    nameEn: "Letters",
    nameFr: "Lettres",
    nameAr: "الآداب",
    subjects: [
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 4 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 4 },
      { id: "hg", nameEn: "History-Geo", nameFr: "Histoire-Géo", nameAr: "التاريخ والجغرافيا", coef: 3 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 3 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 2 },
      { id: "lat", nameEn: "Latin/Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "inf", nameEn: "Computer Science", nameFr: "Informatique", nameAr: "الإعلامية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  },
  {
    id: "info",
    nameEn: "Computer Science",
    nameFr: "Informatique",
    nameAr: "علوم الإعلامية",
    subjects: [
      { id: "algo", nameEn: "Algorithm & Prog", nameFr: "Algo & Prog", nameAr: "الخوارزميات والبرمجة", coef: 4 },
      { id: "tic", nameEn: "TIC", nameFr: "TIC", nameAr: "تكنولوجيات المعلومات", coef: 2 },
      { id: "phys", nameEn: "Physics", nameFr: "Sciences Physiques", nameAr: "العلوم الفيزيائية", coef: 1.5 },
      { id: "math", nameEn: "Mathematics", nameFr: "Mathématiques", nameAr: "الرياضيات", coef: 3 },
      { id: "fr", nameEn: "French", nameFr: "Français", nameAr: "الفرنسية", coef: 1 },
      { id: "en", nameEn: "English", nameFr: "Anglais", nameAr: "الإنجليزية", coef: 1 },
      { id: "ar", nameEn: "Arabic", nameFr: "Arabe", nameAr: "العربية", coef: 1 },
      { id: "ph", nameEn: "Philosophy", nameFr: "Philosophie", nameAr: "الفلسفة", coef: 1 },
      { id: "opt", nameEn: "Option", nameFr: "Option", nameAr: "المادة الاختيارية", coef: 1 },
      { id: "spo", nameEn: "Sport", nameFr: "Sport", nameAr: "التربية البدنية", coef: 1 },
    ]
  }
];
