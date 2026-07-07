import json
import os
from google.cloud import firestore

# Chemin vers le fichier de credentials Firebase (service account)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "serviceAccountKey.json"  # <-- Le credentials doit être à la racine du projet

# Charger les cours
with open("high_value_courses.json", encoding="utf-8") as f:
    courses = json.load(f)

# Connexion à Firestore
db = firestore.Client()
batch = db.batch()

for course in courses:
    doc_ref = db.collection("courses").document(course["id"])
    batch.set(doc_ref, course)

batch.commit()
print(f"✅ Importation terminée : {len(courses)} cours importés dans Firestore.") 