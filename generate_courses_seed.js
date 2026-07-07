const fs = require('fs');

const categories = [
  { fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
  { fr: "Programmation", en: "Programming" },
  { fr: "Cloud & DevOps", en: "Cloud & DevOps" },
  { fr: "Entrepreneuriat", en: "Entrepreneurship" },
  { fr: "Cybersécurité", en: "Cybersecurity" },
  { fr: "Soft Skills", en: "Soft Skills" },
  { fr: "Finance", en: "Finance" },
  { fr: "Santé Digitale", en: "Digital Health" },
  { fr: "Éducation", en: "Education" },
  { fr: "Marketing Digital", en: "Digital Marketing" }
];

const levels = [
  { fr: "Débutant", en: "Beginner" },
  { fr: "Intermédiaire", en: "Intermediate" },
  { fr: "Avancé", en: "Advanced" }
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const courses = [];
for (let i = 1; i <= 100; i++) {
  const cat = randomFrom(categories);
  const lvl = randomFrom(levels);
  courses.push({
    id: `course_${i}`,
    title_fr: `${cat.fr} - Module ${i}`,
    title_en: `${cat.en} - Module ${i}`,
    description_fr: `Cours ${i} sur ${cat.fr}, niveau ${lvl.fr}.`,
    description_en: `Course ${i} on ${cat.en}, ${lvl.en} level.`,
    objectives_fr: [
      `Objectif 1 du cours ${i}`,
      `Objectif 2 du cours ${i}`,
      `Objectif 3 du cours ${i}`
    ],
    objectives_en: [
      `Objective 1 of course ${i}`,
      `Objective 2 of course ${i}`,
      `Objective 3 of course ${i}`
    ],
    level: `${lvl.fr} / ${lvl.en}`,
    duration_hours: 8 + (i % 12),
    category: cat.fr,
    certifying: true
  });
}

fs.writeFileSync('courses_seed.json', JSON.stringify(courses, null, 2));
console.log('✅ Fichier courses_seed.json généré avec 100 cours.'); 
