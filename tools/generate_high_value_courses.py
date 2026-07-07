import json
from datetime import datetime
import random

# Thématiques à haute valeur ajoutée
THEMATIQUES = [
    ("Intelligence Artificielle appliquée à la Santé", "Artificial Intelligence Applied to Healthcare", "Santé / Intelligence Artificielle"),
    ("Cybersécurité avancée pour entreprises africaines", "Advanced Cybersecurity for African Businesses", "Cybersécurité"),
    ("Énergies renouvelables et transition verte", "Renewable Energies and Green Transition", "Énergie / Environnement"),
    ("Droit du numérique et protection des données", "Digital Law and Data Protection", "Droit / Numérique"),
    ("Fintech, Blockchain et inclusion financière", "Fintech, Blockchain and Financial Inclusion", "Finance / Technologie"),
    ("Santé publique et épidémiologie en Afrique", "Public Health and Epidemiology in Africa", "Santé publique"),
    ("Ingénierie des matériaux avancés", "Advanced Materials Engineering", "Ingénierie"),
    ("Management interculturel et leadership africain", "Intercultural Management and African Leadership", "Management"),
    ("Éducation inclusive et EdTech", "Inclusive Education and EdTech", "Éducation / Technologie"),
    ("Agriculture intelligente et foodtech", "Smart Agriculture and Foodtech", "Agriculture / Technologie"),
    ("Robotique médicale et chirurgie assistée", "Medical Robotics and Assisted Surgery", "Santé / Robotique"),
    ("Mobilité durable et transports intelligents", "Sustainable Mobility and Smart Transport", "Transport / Environnement"),
    ("Entrepreneuriat social et innovation africaine", "Social Entrepreneurship and African Innovation", "Entrepreneuriat / Innovation"),
    ("Journalisme d’investigation et médias numériques", "Investigative Journalism and Digital Media", "Médias / Journalisme"),
    ("Tourisme durable et patrimoine africain", "Sustainable Tourism and African Heritage", "Tourisme / Culture"),
    ("Mode et design africain contemporain", "Contemporary African Fashion and Design", "Mode / Design"),
    ("Sport, performance et santé mentale", "Sport, Performance and Mental Health", "Sport / Santé"),
    ("Langues africaines et communication internationale", "African Languages and International Communication", "Langues / Communication"),
    ("Gouvernance, paix et sécurité en Afrique", "Governance, Peace and Security in Africa", "Gouvernance / Sécurité"),
    ("Climat, biodiversité et développement durable", "Climate, Biodiversity and Sustainable Development", "Environnement / Développement"),
]

LANGS = ["fr", "en", "ar", "pt", "es", "bm", "wo", "ha", "sw", "ln"]

OBJECTIFS_FR = [
    "Comprendre les enjeux clés du domaine.",
    "Identifier les applications concrètes en Afrique.",
    "Analyser les défis et opportunités.",
    "Développer des compétences pratiques.",
    "Explorer les perspectives d'avenir.",
]
OBJECTIFS_EN = [
    "Understand the key issues in the field.",
    "Identify real-world applications in Africa.",
    "Analyze challenges and opportunities.",
    "Develop practical skills.",
    "Explore future perspectives.",
]

MODULES_FR = [
    "Introduction et concepts fondamentaux",
    "Études de cas africains",
    "Outils et technologies clés",
    "Défis éthiques et réglementaires",
    "Perspectives et innovations futures",
]
MODULES_EN = [
    "Introduction and Key Concepts",
    "African Case Studies",
    "Key Tools and Technologies",
    "Ethical and Regulatory Challenges",
    "Future Perspectives and Innovations",
]

QUIZ_FR = [
    ("Quel est l'avantage principal de ce domaine ?", ["Automatisation", "Coût élevé", "Complexité accrue", "Moins de données"], "Automatisation"),
    ("Quel défi majeur en Afrique ?", ["Accès aux données", "Surcharge", "Trop de ressources", "Aucun"], "Accès aux données"),
]
QUIZ_EN = [
    ("What is the main advantage of this field?", ["Automation", "High cost", "Increased complexity", "Less data"], "Automation"),
    ("What is a major challenge in Africa?", ["Data access", "Overload", "Too many resources", "None"], "Data access"),
]

def make_multilang(val_fr, val_en):
    return {lang: val_fr if lang == "fr" else val_en if lang == "en" else "À traduire" for lang in LANGS}

def make_multilang_list(list_fr, list_en):
    return {lang: list_fr if lang == "fr" else list_en if lang == "en" else ["À traduire"] for lang in LANGS}

def make_module(title_fr, title_en):
    return {
        "title": make_multilang(title_fr, title_en),
        "contenu": make_multilang(f"Contenu du module : {title_fr}", f"Module content: {title_en}")
    }

def make_quiz(q_fr, opts_fr, ans_fr, q_en, opts_en, ans_en):
    return {
        "question": make_multilang(q_fr, q_en),
        "options": make_multilang_list(opts_fr, opts_en),
        "answer": make_multilang(ans_fr, ans_en)
    }

def generate_courses(n=100):
    courses = []
    for i in range(n):
        th_fr, th_en, domain = random.choice(THEMATIQUES)
        course_id = f"course_{i+1:03d}"
        title_fr = th_fr
        title_en = th_en
        description_fr = f"Un cours approfondi sur {th_fr.lower()} pour l'Afrique."
        description_en = f"An in-depth course on {th_en.lower()} for Africa."
        objectifs_fr = random.sample(OBJECTIFS_FR, 3)
        objectifs_en = random.sample(OBJECTIFS_EN, 3)
        modules = [make_module(mf, me) for mf, me in zip(MODULES_FR, MODULES_EN)]
        quiz = [make_quiz(qf, optsf, ansf, qe, optse, anse) for (qf, optsf, ansf), (qe, optse, anse) in zip(QUIZ_FR, QUIZ_EN)]
        course = {
            "id": course_id,
            "title": make_multilang(title_fr, title_en),
            "description": make_multilang(description_fr, description_en),
            "objectifs": make_multilang_list(objectifs_fr, objectifs_en),
            "modules": modules,
            "quiz": quiz,
            "domain": domain,
            "level": random.choice(["Débutant", "Intermédiaire", "Avancé"]),
            "createdAt": datetime.utcnow().isoformat() + "Z"
        }
        courses.append(course)
    return courses

if __name__ == "__main__":
    courses = generate_courses(100)
    with open("high_value_courses.json", "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)
    print("100 cours générés dans high_value_courses.json") 