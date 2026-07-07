import firebase_admin
from firebase_admin import credentials, firestore

# Liste des langues attendues
LANGS = [
    'fr', 'en', 'ar', 'sw', 'ha', 'wo', 'am', 'pt', 'es', 'bm'
]

# Champs multilingues à vérifier
MULTILINGUAL_FIELDS = [
    'title', 'description', 'objectifs'  # Ajouter d'autres champs si besoin
]

def main():
    # Initialisation Firebase
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    courses_ref = db.collection('courses')
    courses = courses_ref.stream()

    total_courses = 0
    incomplete_courses = []

    for course in courses:
        total_courses += 1
        data = course.to_dict()
        course_id = course.id
        missing = {}
        for field in MULTILINGUAL_FIELDS:
            field_data = data.get(field, {})
            # Pour objectifs, qui peut être une liste de strings par langue
            if field == 'objectifs' and isinstance(field_data, dict):
                for lang in LANGS:
                    if lang not in field_data or not field_data[lang]:
                        missing.setdefault(field, []).append(lang)
            # Pour title/description, qui sont des dicts
            elif isinstance(field_data, dict):
                for lang in LANGS:
                    if lang not in field_data or not field_data[lang]:
                        missing.setdefault(field, []).append(lang)
            else:
                missing.setdefault(field, []).extend(LANGS)
        if missing:
            incomplete_courses.append({
                'id': course_id,
                'title': data.get('title', {}).get('fr', 'Sans titre'),
                'missing': missing
            })

    print(f"Total cours analysés : {total_courses}")
    print(f"Cours incomplets : {len(incomplete_courses)}")
    for c in incomplete_courses:
        print(f"\nCours ID: {c['id']} | Titre: {c['title']}")
        for field, langs in c['missing'].items():
            print(f"  Champ '{field}' : langues manquantes : {', '.join(langs)}")

    if not incomplete_courses:
        print("\nTous les cours sont complets pour toutes les langues cibles !")

if __name__ == '__main__':
    main() 