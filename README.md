# 🚀 Projet DevOps – Déploiement CI/CD d’une application de Gestion Académique

## 📌 Présentation
Ce projet a pour objectif de mettre en place une **chaîne DevOps complète** pour le déploiement, l’orchestration, le monitoring et le GitOps d’une application web de **Gestion Académique**.

L’application est composée de :
- un **Frontend** (application web),
- un **Backend** (API REST),
- une **Base de données MongoDB**.

Le projet couvre toutes les étapes modernes du DevOps : **Docker, Jenkins, Kubernetes, Helm, Prometheus/Grafana et ArgoCD**.

---

## 🎯 Objectifs du projet
- Conteneuriser une application web
- Automatiser le build et le push des images Docker
- Déployer l’application sur Kubernetes
- Gérer les déploiements avec Helm
- Mettre en place le monitoring
- Implémenter une approche **GitOps** avec ArgoCD

---

## 🏗️ Architecture globale

Développeur
|
|--> GitHub (code + Helm)
|
|--> Jenkins (CI)
| - Build images Docker
| - Push Docker Hub
|
|--> ArgoCD (GitOps)
|
|--> Kubernetes Cluster
- Frontend
- Backend
- MongoDB
- Monitoring

yaml
Copy code

---

## 🧰 Technologies utilisées
- **Docker & Docker Compose**
- **Jenkins**
- **Kubernetes (Docker Desktop)**
- **Helm**
- **Prometheus & Grafana**
- **ArgoCD**
- **GitHub**

---

## 📁 Structure du projet

ProjetSemestriel/
├── gestion-academique-backend/
│ └── Dockerfile
├── gestion-academique-frontend/
│ └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── k8s/ # Manifests Kubernetes bruts (pédagogique)
├── helm/
│ └── gestion-academique/ # Helm Chart (utilisé en production)
│ ├── Chart.yaml
│ ├── values.yaml
│ └── templates/
└── README.md

yaml
Copy code

---

## 🔹 Étape 1 – Conteneurisation (Docker)

- Création de Dockerfiles pour le frontend et le backend
- Construction des images Docker
- Test local avec Docker Compose

Commande :
```bash
docker-compose up --build
🔹 Étape 2 – Intégration Continue (Jenkins)
Un pipeline Jenkins est mis en place pour :

Cloner le dépôt GitHub

Construire les images Docker

Pousser les images vers Docker Hub

📄 Fichier :

Jenkinsfile

🔹 Étape 3 – Kubernetes (YAML)
Déploiement manuel initial avec des manifestes Kubernetes :

MongoDB + PVC

Backend

Frontend

Services (ClusterIP / NodePort)

📁 Dossier :

k8s/

Ces fichiers sont conservés à des fins pédagogiques.

🔹 Étape 4 – Helm
Helm est utilisé pour :

Centraliser la configuration

Faciliter les mises à jour

Industrialiser les déploiements Kubernetes

Commandes utilisées :

bash
Copy code
helm install gestion ./helm/gestion-academique
helm upgrade gestion ./helm/gestion-academique
🔹 Étape 5 – Monitoring (Prometheus & Grafana)
Installation via Helm du stack Prometheus

Visualisation des métriques du cluster Kubernetes

Accès Grafana via port-forward

Commande :

bash
Copy code
kubectl port-forward svc/mon-grafana 3000:80 -n monitoring
🔹 Étape 6 – GitOps avec ArgoCD
Principe GitOps
Le dépôt GitHub devient la source de vérité.
ArgoCD synchronise automatiquement le cluster Kubernetes avec le contenu du dépôt.

Déploiement
ArgoCD installé dans le namespace argocd

Application ArgoCD créée avec :

Repository GitHub

Path : helm/gestion-academique

Mode : Helm

Synchronisation automatique

Résultat :

Status : Synced

Health : Healthy

▶️ Démarrer le projet après redémarrage
Lancer Docker Desktop (Kubernetes activé)

Vérifier le cluster :

bash
Copy code
kubectl get nodes
Vérifier ArgoCD :

bash
Copy code
kubectl get pods -n argocd
Ouvrir ArgoCD :

bash
Copy code
kubectl port-forward -n argocd svc/argocd-server 8088:443
👉 https://localhost:8088

Accéder à l’application :

arduino
Copy code
http://localhost:30080
✅ Résultats obtenus
Application déployée automatiquement

Cluster Kubernetes opérationnel

Monitoring fonctionnel

Déploiement GitOps via ArgoCD

🎓 Conclusion
Ce projet met en œuvre une chaîne DevOps complète et moderne, couvrant :

CI/CD

Orchestration Kubernetes

Helm

Monitoring

GitOps

Il représente une implémentation réaliste et professionnelle d’un environnement DevOps.

👤 Auteur
Hedy Fathallah
Projet DevOps – Gestion Académique
