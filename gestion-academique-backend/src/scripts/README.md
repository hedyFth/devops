# Script de Seed - Remplissage de la Base de Données

Ce script permet de remplir la base de données avec des données de test.

## Utilisation

1. Assurez-vous que votre fichier `.env` contient la variable `MONGO_URI` avec l'URL de connexion à MongoDB.

2. Exécutez le script :
```bash
npm run seed
```

ou directement :
```bash
node src/scripts/seed.js
```

## Ce que le script crée

- **4 Groupes** : GL5-1, GL5-2, GL4-1, DSI5-1
- **1 Administrateur** : admin@school.com
- **4 Enseignants** : prof1@school.com à prof4@school.com
- **8 Étudiants** : student1@school.com à student8@school.com
- **6 Cours** : Répartis entre les enseignants
- **Inscriptions** : Étudiants inscrits dans différents cours
- **Évaluations** : DS, Examens, TP, Projets pour chaque cours
- **Notes** : Notes aléatoires entre 8 et 18 pour chaque évaluation

## Fichiers générés

Après l'exécution, deux fichiers seront créés à la racine du projet backend :

1. **COMPTES_TEST.txt** : Fichier texte formaté avec tous les comptes
2. **COMPTES_TEST.json** : Fichier JSON avec les données structurées

## Important

⚠️ Le script **supprime toutes les données existantes** avant de créer les nouvelles données de test.

⚠️ Les mots de passe sont stockés en clair dans les fichiers générés pour faciliter les tests. En production, changez tous les mots de passe.


