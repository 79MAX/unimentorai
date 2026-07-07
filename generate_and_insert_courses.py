import firebase_admin
from firebase_admin import credentials, firestore
import random
import uuid

# --- Config ---
N_COURSES = 1000
LANGS = ['fr', 'en']

# Domaines variés pour l'exemple
DOMAINS = [
    'Ingénierie', 'Médecine', 'Architecture', 'Génie civil', 'Travaux publics', 'Design',
    'Pilotage', 'Drones', 'Véhicules', 'Agronomie', 'Langues', 'Comptabilité',
    'Droit', 'Journalisme', 'Technologie', 'Robotics', 'IA', 'Outils bureautiques',
    'Transport', 'Logistique', 'Tourisme', 'Cosmétologie', 'Mode', 'Sport', 'Finance',
    'Éducation', 'Santé', 'Environnement', 'Énergie', 'Entrepreneuriat', 'Communication'
]

LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert']

# --- Générateurs de contenu ---
def random_title(domain, idx):
    return {
        'fr': f"{domain} : Cours avancé n°{idx+1}",
        'en': f"{domain}: Advanced Course #{idx+1}"
    }

def random_description(domain, idx):
    return {
        'fr': f"Ce cours approfondit les concepts clés du domaine {domain}. (Cours n°{idx+1})",
        'en': f"This course covers key concepts in {domain}. (Course #{idx+1})"
    }

def random_objectifs(domain):
    return {
        'fr': [
            f"Comprendre les bases du {domain}",
            f"Maîtriser les outils essentiels du {domain}",
            f"Réaliser un projet pratique en {domain}"
        ],
        'en': [
            f"Understand the basics of {domain}",
            f"Master essential tools in {domain}",
            f"Complete a practical project in {domain}"
        ]
    }

def random_modules(domain):
    n = random.randint(3, 6)
    modules = []
    for i in range(n):
        modules.append({
            'title': {
                'fr': f"Module {i+1} : {domain}",
                'en': f"Module {i+1}: {domain}"
            },
            'contenu': {
                'fr': f"Contenu du module {i+1} en {domain}.",
                'en': f"Content of module {i+1} in {domain}."
            }
        })
    return modules

def random_quiz(domain):
    return [
        {
            'question': {
                'fr': f"Question sur le {domain}",
                'en': f"Question about {domain}"
            },
            'reponses': {
                'fr': ["Réponse 1", "Réponse 2", "Réponse 3"],
                'en': ["Answer 1", "Answer 2", "Answer 3"]
            },
            'bonne_reponse': 0
        }
    ]

def main():
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    titles_set = set()
    batch = db.batch()
    batch_size = 0
    batch_limit = 400  # Firestore batch write limit
    total_inserted = 0

    for idx in range(N_COURSES):
        domain = random.choice(DOMAINS)
        level = random.choice(LEVELS)
        # Générer un titre unique
        while True:
            title = random_title(domain, idx)
            title_key = (title['fr'], title['en'])
            if title_key not in titles_set:
                titles_set.add(title_key)
                break
            idx += 1  # Pour éviter boucle infinie
        course = {
            'id': str(uuid.uuid4()),
            'title': title,
            'description': random_description(domain, idx),
            'objectifs': random_objectifs(domain),
            'modules': random_modules(domain),
            'quiz': random_quiz(domain),
            'domain': domain,
            'level': level,
            'createdAt': firestore.SERVER_TIMESTAMP,
        }
        doc_ref = db.collection('courses').document(course['id'])
        batch.set(doc_ref, course)
        batch_size += 1
        total_inserted += 1
        if batch_size >= batch_limit:
            batch.commit()
            print(f"{total_inserted} cours insérés...")
            batch = db.batch()
            batch_size = 0
    if batch_size > 0:
        batch.commit()
        print(f"{total_inserted} cours insérés (finalisé)")
    print(f"Insertion terminée : {total_inserted} cours générés et insérés dans Firestore.")

if __name__ == '__main__':
    main() 