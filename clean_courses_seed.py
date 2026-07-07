import json
import random
import uuid
import os

DEST = "courses_seed_clean.json"

LANGS = ["fr", "en", "ar", "sw", "ha", "yo", "am", "zu", "ig", "ff"]
DOMAINS = [
    "Technologie", "Santé", "Environnement", "Économie", "Droit", "Sciences", "Arts", "Management", "Agriculture", "Éducation",
    "Finance", "Transport", "Tourisme", "Énergie", "Sport", "Urbanisme", "Marketing", "Psychologie", "Biologie", "Innovation",
    "Ingénierie", "Médecine", "Architecture", "Génie Civil", "Travaux Publics", "Construction", "Design", "Aéronautique", "Automobile",
    "Agronomie", "Langues", "Comptabilité", "Expertise Comptable", "Ponts et Chaussées", "Bâtiment", "Pilotage", "Robotique", "IA", "Chimie"
]
LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Expert"]
TITRES_FR = [
    "Introduction à ", "Fondamentaux de ", "Bases de ", "Gestion de ", "Approche moderne de ", "Panorama de ", "Pratique de ", "Stratégies pour ", "Enjeux de ", "Techniques de ",
    "Spécialité : ", "Méthodologie de ", "Projet avancé en ", "Certification en ", "Expertise en "
]
SUJETS = [
    "l'ingénierie des ponts", "la construction de routes", "la médecine d'urgence", "l'architecture durable", "le génie civil avancé", "la fabrication de drones", "le pilotage d'avion", "la conception automobile", "l'agronomie moderne", "l'expertise comptable internationale",
    "la robotique médicale", "le design d'intérieur", "la gestion de chantiers", "la chimie industrielle", "la programmation embarquée", "la cybersécurité avancée", "la linguistique appliquée", "la traduction professionnelle", "la gestion hospitalière", "la biotechnologie",
    "la gestion de projets publics", "la construction de bâtiments intelligents", "la modélisation 3D", "la maintenance aéronautique", "la gestion des infrastructures", "la pathologie clinique", "la finance d'entreprise", "la fiscalité internationale", "la gestion de cabinet médical", "la gestion de laboratoires",
    "la conception de véhicules électriques", "la gestion de l'eau potable", "la gestion des déchets hospitaliers", "la sécurité des chantiers", "la gestion de crise sanitaire", "la gestion de la biodiversité", "la gestion de la mobilité urbaine", "la gestion de la logistique internationale", "la gestion de la qualité", "la gestion de la supply chain",
    "la gestion de la production industrielle", "la gestion de la construction navale", "la gestion de la construction ferroviaire", "la gestion de la construction aéroportuaire", "la gestion de la construction portuaire", "la gestion de la construction de tunnels", "la gestion de la construction de barrages", "la gestion de la construction de centrales électriques", "la gestion de la construction de centrales nucléaires", "la gestion de la construction de centrales solaires",
    "la gestion de la construction de centrales éoliennes", "la gestion de la construction de centrales hydrauliques", "la gestion de la construction de centrales géothermiques", "la gestion de la construction de centrales biomasse", "la gestion de la construction de centrales marémotrices", "la gestion de la construction de centrales thermiques", "la gestion de la construction de centrales à charbon", "la gestion de la construction de centrales à gaz", "la gestion de la construction de centrales à pétrole", "la gestion de la construction de centrales à biogaz",
    "la gestion de la construction de centrales à hydrogène", "la gestion de la construction de centrales à fusion nucléaire", "la gestion de la construction de centrales à fission nucléaire", "la gestion de la construction de centrales à énergie renouvelable", "la gestion de la construction de centrales à énergie fossile", "la gestion de la construction de centrales à énergie mixte", "la gestion de la construction de centrales à énergie alternative", "la gestion de la construction de centrales à énergie propre", "la gestion de la construction de centrales à énergie verte", "la gestion de la construction de centrales à énergie bleue"
]

def generer_cours(n=1000):
    nouveaux = []
    for _ in range(n):
        sujet = random.choice(SUJETS)
        titre_fr = random.choice(TITRES_FR) + sujet
        titre_en = titre_fr.replace("Introduction à ", "Introduction to ").replace("Fondamentaux de ", "Fundamentals of ").replace("Bases de ", "Basics of ").replace("Gestion de ", "Management of ").replace("Approche moderne de ", "Modern Approach to ").replace("Panorama de ", "Overview of ").replace("Pratique de ", "Practice of ").replace("Stratégies pour ", "Strategies for ").replace("Enjeux de ", "Challenges of ").replace("Techniques de ", "Techniques of ").replace("Spécialité : ", "Specialty: ").replace("Méthodologie de ", "Methodology of ").replace("Projet avancé en ", "Advanced Project in ").replace("Certification en ", "Certification in ").replace("Expertise en ", "Expertise in ")
        titre = {lang: titre_fr if lang == "fr" else titre_en for lang in LANGS}
        desc = {lang: f"Cours de haut niveau sur {sujet} ({lang}). Ce cours respecte les standards internationaux de pédagogie, de qualité et de fiabilité, avec des cas pratiques, des études de cas, des évaluations et des ressources multimédias." for lang in LANGS}
        course_id = str(uuid.uuid4())
        course = {
            "id": course_id,
            "title": titre,
            "description": desc,
            "domain": random.choice(DOMAINS),
            "level": random.choice(LEVELS),
            "tags": [sujet, "international", "afrique", "haute qualité", "pédagogie"],
            "languages": LANGS,
            "certification": True,
            "accessibility": "accessible",
            "pedagogical_quality": "excellence",
            "translation_status": "complet",
            "african_context": "inclus"
        }
        nouveaux.append(course)
    # Charger l'existant
    if os.path.exists(DEST):
        try:
            with open(DEST, "r", encoding="utf-8") as f:
                existants = json.load(f)
        except:
            existants = []
    else:
        existants = []
    # Éviter les doublons par id ou titre fr/en
    ids = {c["id"] for c in existants}
    titres = {(c["title"]["fr"], c["title"]["en"]) for c in existants}
    ajout = 0
    for c in nouveaux:
        if c["id"] not in ids and (c["title"]["fr"], c["title"]["en"]) not in titres:
            existants.append(c)
            ids.add(c["id"])
            titres.add((c["title"]["fr"], c["title"]["en"]))
            ajout += 1
    with open(DEST, "w", encoding="utf-8") as f:
        json.dump(existants, f, ensure_ascii=False, indent=2)
    print(f"✅ {ajout} nouveaux cours générés et ajoutés à {DEST} (total: {len(existants)})")

if __name__ == "__main__":
    generer_cours(1000) 