import json
import sys
import os
from collections import defaultdict

# --- Config ---
LANGS = ["fr", "en", "ar", "pt", "ha", "sw", "wo", "am", "bm", "es"]
MODULES_DEFAULT = [
    {"id": "mod1", "title": {"fr": "Introduction", "en": "Introduction"}},
    {"id": "mod2", "title": {"fr": "Concepts clés", "en": "Key Concepts"}},
    {"id": "mod3", "title": {"fr": "Applications", "en": "Applications"}}
]
QUIZ_DEFAULT = [
    {"question": {"fr": "Question exemple ?", "en": "Sample question?"},
     "options": {"fr": ["Réponse 1", "Réponse 2", "Réponse 3"], "en": ["Answer 1", "Answer 2", "Answer 3"]},
     "answer": {"fr": "Réponse 1", "en": "Answer 1"}}
]

# --- Fonctions utilitaires ---
def enrich_course(course):
    # Générer description si absente
    for lang in LANGS:
        if "description" not in course or lang not in course.get("description", {}):
            if "description" not in course:
                course["description"] = {}
            course["description"][lang] = f"{course['title'].get(lang, course['title'].get('fr', ''))} : description à compléter."
    # Générer objectifs si absents
    if "objectifs" not in course:
        course["objectifs"] = {}
    for lang in LANGS:
        if lang not in course["objectifs"]:
            course["objectifs"][lang] = [
                f"Objectif 1 ({lang}) à compléter.",
                f"Objectif 2 ({lang}) à compléter.",
                f"Objectif 3 ({lang}) à compléter."
            ]
    # Générer modules si absents
    if "modules" not in course or not course["modules"]:
        course["modules"] = MODULES_DEFAULT
    # Générer quiz si absent
    if "quiz" not in course or not course["quiz"]:
        course["quiz"] = QUIZ_DEFAULT
    # Accessibilité par défaut
    course["accessible"] = course.get("accessible", True)
    return course

def generate_arb(courses, lang):
    arb = {"@@locale": lang}
    for c in courses:
        cid = c["id"]
        arb[f"{cid}_title"] = c["title"].get(lang, c["title"].get("fr", ""))
        arb[f"{cid}_description"] = c["description"].get(lang, c["description"].get("fr", ""))
        for i, obj in enumerate(c["objectifs"][lang]):
            arb[f"{cid}_objectif_{i+1}"] = obj
        for m, mod in enumerate(c["modules"]):
            arb[f"{cid}_module_{m+1}_title"] = mod["title"].get(lang, mod["title"].get("fr", ""))
            if "contenu" in mod:
                arb[f"{cid}_module_{m+1}_contenu"] = mod["contenu"].get(lang, mod["contenu"].get("fr", ""))
        for q, quiz in enumerate(c["quiz"]):
            arb[f"{cid}_quiz_{q+1}_question"] = quiz["question"].get(lang, quiz["question"].get("fr", ""))
            for o, opt in enumerate(quiz["options"][lang]):
                arb[f"{cid}_quiz_{q+1}_option_{o+1}"] = opt
            arb[f"{cid}_quiz_{q+1}_answer"] = quiz["answer"].get(lang, quiz["answer"].get("fr", ""))
    return arb

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_courses_from_json.py courses_seed.json")
        sys.exit(1)
    infile = sys.argv[1]
    with open(infile, encoding="utf-8") as f:
        data = json.load(f)
    courses = data["courses"]
    enriched = []
    for c in courses:
        enriched.append(enrich_course(c))
    # Sauvegarde JSON Firestore enrichi
    with open("courses_enriched.json", "w", encoding="utf-8") as f:
        json.dump({"courses": enriched}, f, ensure_ascii=False, indent=2)
    # Génération ARB par langue
    os.makedirs("arb_out", exist_ok=True)
    for lang in LANGS:
        arb = generate_arb(enriched, lang)
        with open(f"arb_out/intl_{lang}.arb", "w", encoding="utf-8") as f:
            json.dump(arb, f, ensure_ascii=False, indent=2)
    print("Génération terminée :\n- courses_enriched.json\n- arb_out/intl_xx.arb pour chaque langue")

if __name__ == "__main__":
    main() 
 
 