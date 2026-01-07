import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'groupes',
        loadComponent: () => import('./pages/admin/groupes/groupes.component').then(m => m.GroupesComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/admin/students/students.component').then(m => m.StudentsComponent)
      },
      {
        path: 'teachers',
        loadComponent: () => import('./pages/admin/teachers/teachers.component').then(m => m.TeachersComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/admin/courses/courses.component').then(m => m.CoursesComponent)
      }
    ]
  },
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TEACHER'] },
    loadComponent: () => import('./pages/teacher/layout/teacher-layout.component').then(m => m.TeacherLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/teacher/dashboard/dashboard.component').then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'my-courses',
        loadComponent: () => import('./pages/teacher/my-courses/my-courses.component').then(m => m.MyCoursesComponent)
      },
      {
        path: 'course-students/:courseId',
        loadComponent: () => import('./pages/teacher/course-students/course-students.component').then(m => m.CourseStudentsComponent)
      },
      {
        path: 'assessments',
        loadComponent: () => import('./pages/teacher/assessments/assessments.component').then(m => m.AssessmentsComponent)
      },
      {
        path: 'grades',
        loadComponent: () => import('./pages/teacher/grades/grades.component').then(m => m.GradesComponent)
      }
    ]
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    loadComponent: () => import('./pages/student/layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/student/dashboard/dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/student/courses/courses.component').then(m => m.CoursesComponent)
      },
      {
        path: 'course-details/:courseId',
        loadComponent: () => import('./pages/student/course-details/course-details.component').then(m => m.CourseDetailsComponent)
      },
      {
        path: 'my-enrollments',
        loadComponent: () => import('./pages/student/my-enrollments/my-enrollments.component').then(m => m.MyEnrollmentsComponent)
      },
      {
        path: 'my-grades',
        loadComponent: () => import('./pages/student/my-grades/my-grades.component').then(m => m.MyGradesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
