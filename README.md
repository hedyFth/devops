# 🚀 Projet DevOps – Déploiement CI/CD d’une Application de Gestion Académique

## 📌 Présentation du projet
Ce projet consiste à mettre en place une **chaîne DevOps complète** pour le déploiement et la gestion d’une application web de **Gestion Académique**.

L’objectif est d’appliquer les bonnes pratiques DevOps modernes :
- conteneurisation,
- intégration continue,
- orchestration Kubernetes,
- déploiement automatisé,
- monitoring,
- GitOps.

---

## 🧱 Architecture de l’application
L’application est composée de trois services principaux :

- **Frontend** : application web
- **Backend** : API REST
- **Base de données** : MongoDB

Ces services sont déployés dans un **cluster Kubernetes**.

---

## 🧰 Technologies utilisées
- Docker & Docker Compose  
- Jenkins (CI)  
- Kubernetes (Docker Desktop)  
- Helm  
- Prometheus & Grafana  
- ArgoCD (GitOps)  
- GitHub  

---

## 📁 Structure du projet

ProjetSemestriel/
├── gestion-academique-backend/
│ └── Dockerfile
├── gestion-academique-frontend/
│ └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── k8s/ # Manifestes Kubernetes bruts (pédagogiques)
├── helm/
│ └── gestion-academique/ # Helm Chart (déploiement principal)
│ ├── Chart.yaml
│ ├── values.yaml
│ └── templates/
└── README.md

---

## 🔹 Étape 1 – Conteneurisation (Docker)
- Création des **Dockerfiles** pour le frontend et le backend
- Construction des images Docker
- Test local de l’application avec Docker Compose

Commande :
```bash
docker-compose up --build
🔹 Étape 2 – Intégration Continue (Jenkins)

Un pipeline Jenkins est utilisé pour :

Cloner le dépôt GitHub

Construire les images Docker

Pousser les images vers Docker Hub

📄 Fichier concerné :

Jenkinsfile
🔹 Étape 3 – Déploiement Kubernetes (YAML)

Création manuelle des manifestes Kubernetes pour :

MongoDB + Persistent Volume

Backend

Frontend

Services (ClusterIP / NodePort)

📁 Dossier :

k8s/

Ces fichiers sont conservés à titre pédagogique.
🔹 Étape 4 – Helm

Helm est utilisé pour :

Centraliser la configuration Kubernetes

Simplifier les mises à jour

Faciliter les déploiements reproductibles

Commandes :
helm install gestion ./helm/gestion-academique
helm upgrade gestion ./helm/gestion-academique
🔹 Étape 5 – Monitoring (Prometheus & Grafana)

Installation de Prometheus via Helm

Visualisation des métriques Kubernetes avec Grafana

Accès Grafana :
kubectl port-forward svc/mon-grafana 3000:80 -n monitoring
➡️ http://localhost:3000

🔹 Étape 6 – GitOps avec ArgoCD

Le déploiement est automatisé via ArgoCD selon le principe GitOps.

Le dépôt GitHub est la source de vérité

ArgoCD surveille le Helm Chart

Toute modification Git est automatiquement synchronisée

Résultat :

Application Healthy

État Synced

▶️ Démarrer le projet après redémarrage du PC

Lancer Docker Desktop (Kubernetes activé)

Vérifier le cluster :
kubectl get nodes
Vérifier ArgoCD :
kubectl get pods -n argocd
kubectl port-forward -n argocd svc/argocd-server 8088:443

Accéder à ArgoCD :
➡️ https://localhost:8088
Accéder à l’application :
http://localhost:30080
✅ Résultats obtenus

Déploiement automatique de l’application

Cluster Kubernetes fonctionnel

Monitoring opérationnel

Déploiement GitOps avec ArgoCD

🎓 Conclusion

Ce projet démontre la mise en œuvre d’une chaîne DevOps moderne et complète, intégrant :

CI/CD

Kubernetes

Helm

Monitoring

GitOps

Il constitue une implémentation réaliste conforme aux standards professionnels.
👤 Auteur

Hedy Fathallah
Projet DevOps – Gestion Académique
