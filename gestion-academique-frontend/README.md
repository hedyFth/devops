# Gestion Académique - Frontend Angular

Application frontend Angular pour la gestion académique (projet semestriel).

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Backend Node/Express/MongoDB en cours d'exécution sur `http://localhost:5000`

## Installation

```bash
cd gestion-academique-frontend
npm install
```

## Configuration

L'URL de l'API backend est configurée dans `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:5000/api'
```

## Démarrage

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## Structure du Projet

```
src/app/
  core/
    models/          # Modèles TypeScript (User, Student, Course, etc.)
    services/        # Services HTTP (AuthService, CourseService, etc.)
    guards/          # Guards de routage (AuthGuard, RoleGuard)
    interceptors/    # Intercepteurs HTTP (TokenInterceptor)
    utils/           # Utilitaires (Storage)
  shared/
    components/      # Composants réutilisables (Navbar, Sidebar, Loader, etc.)
  pages/
    auth/            # Pages d'authentification (Login, Register)
    admin/           # Pages Admin (CRUD Groupes, Students, Teachers, Courses)
    teacher/         # Pages Teacher (MyCourses, Assessments, Grades)
    student/         # Pages Student (Courses, Enrollments, MyGrades)
```

## Rôles et Routes

### ADMIN
- `/admin/dashboard` - Tableau de bord
- `/admin/groupes` - Gestion des groupes
- `/admin/students` - Gestion des étudiants
- `/admin/teachers` - Gestion des enseignants
- `/admin/courses` - Gestion des cours

### TEACHER
- `/teacher/dashboard` - Tableau de bord
- `/teacher/my-courses` - Mes cours
- `/teacher/course-students/:courseId` - Étudiants inscrits à un cours
- `/teacher/assessments` - Gestion des évaluations
- `/teacher/grades` - Gestion des notes

### STUDENT
- `/student/dashboard` - Tableau de bord
- `/student/courses` - Liste des cours disponibles
- `/student/course-details/:courseId` - Détails d'un cours
- `/student/my-enrollments` - Mes inscriptions
- `/student/my-grades` - Mes notes

## Authentification

L'application utilise JWT pour l'authentification. Le token est stocké dans `localStorage` et ajouté automatiquement à chaque requête HTTP via le `TokenInterceptor`.

### Inscription
- Accès: `/register`
- Champs: email, password, role (ADMIN/TEACHER/STUDENT)

### Connexion
- Accès: `/login`
- Champs: email, password
- Redirection automatique selon le rôle après connexion

## Sécurité

- **AuthGuard**: Protège les routes nécessitant une authentification
- **RoleGuard**: Vérifie que l'utilisateur a le rôle requis pour accéder à une route
- **TokenInterceptor**: Ajoute automatiquement le token JWT aux requêtes HTTP
- Gestion des erreurs 401 (déconnexion automatique)

## Fonctionnalités

### Admin
- CRUD complet pour Groupes, Students, Teachers, Courses
- Interface avec modales pour ajout/modification
- Confirmation avant suppression

### Teacher
- Consultation des cours
- Gestion des évaluations (création, modification, suppression)
- Saisie des notes par évaluation
- Consultation des étudiants inscrits

### Student
- Consultation des cours disponibles
- Inscription aux cours
- Consultation des évaluations
- Consultation des notes avec calcul de moyenne pondérée

## Technologies Utilisées

- Angular 20+
- TypeScript
- RxJS
- Reactive Forms
- CSS (pas de framework UI externe)

## Notes

- L'application est une SPA (Single Page Application)
- Toutes les requêtes HTTP passent par l'API REST du backend
- Les erreurs sont affichées de manière explicite à l'utilisateur
- Les formulaires utilisent la validation Angular Reactive Forms
