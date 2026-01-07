pipeline {
  agent any

  environment {
    // DockerHub username (just the name, not email)
    DOCKERHUB_USER = "hedy123fth"

    // Image names
    BACKEND_IMAGE  = "hedy123fth/gestion-backend"
    FRONTEND_IMAGE = "hedy123fth/gestion-frontend"

    // Tag strategy
    TAG = "${BUILD_NUMBER}"
  }

  options {
    timestamps()
  }

  stages {

    stage('Checkout') {
      steps {
        // This fixes "fatal: not in a git directory"
        checkout scm
        sh 'ls -la'
      }
    }

    stage('Build (optional)') {
      steps {
        echo "Optional build step (you can remove if not needed)"
        // If you have Node apps and want a quick check:
        // sh 'cd backend && npm ci'
        // sh 'cd frontend && npm ci'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh """
          docker version
          docker compose version || true

          # Build with docker compose if you have docker-compose.yml at repo root
          docker compose build
          
          # If you DO NOT use compose, comment the line above and use:
          # docker build -t ${BACKEND_IMAGE}:${TAG} ./backend
          # docker build -t ${FRONTEND_IMAGE}:${TAG} ./frontend
        """
      }
    }

    stage('Trivy Scan (FAIL on CRITICAL only)') {
      steps {
        sh """
          # Scan filesystem (repo)
          # If CRITICAL found -> exit 1 -> pipeline fails
          # HIGH will be reported but won't fail the pipeline
          trivy fs --scanners vuln --severity CRITICAL --exit-code 1 .

          # (Optional) Scan built images too (CRITICAL only)
          # trivy image --severity CRITICAL --exit-code 1 ${BACKEND_IMAGE}:${TAG}
          # trivy image --severity CRITICAL --exit-code 1 ${FRONTEND_IMAGE}:${TAG}
        """
      }
    }

    stage('DockerHub Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh """
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
          """
        }
      }
    }

    stage('Tag & Push Images') {
      steps {
        sh """
          # If you built with docker compose, you need to know the local image names.
          # Usually compose creates images like: <folder>_<service>
          # So we re-tag them before push.

          # مثال: لو services اسمهم backend / frontend في docker-compose.yml
          # عدّل الأسماء حسب output متاع docker images
          
          # Try to detect images from compose (best-effort)
          docker images

          # --- IMPORTANT ---
          # Replace these two LOCAL names with your real built image names from "docker images"
          # Example local names: projetsemestriel-backend, projetsemestriel-frontend, etc.
          LOCAL_BACKEND_IMAGE="gestion-backend"
          LOCAL_FRONTEND_IMAGE="gestion-frontend"

          docker tag $LOCAL_BACKEND_IMAGE ${BACKEND_IMAGE}:${TAG}
          docker tag $LOCAL_BACKEND_IMAGE ${BACKEND_IMAGE}:latest

          docker tag $LOCAL_FRONTEND_IMAGE ${FRONTEND_IMAGE}:${TAG}
          docker tag $LOCAL_FRONTEND_IMAGE ${FRONTEND_IMAGE}:latest

          docker push ${BACKEND_IMAGE}:${TAG}
          docker push ${BACKEND_IMAGE}:latest

          docker push ${FRONTEND_IMAGE}:${TAG}
          docker push ${FRONTEND_IMAGE}:latest
        """
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
