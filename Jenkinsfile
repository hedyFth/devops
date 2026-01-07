pipeline {
  agent any

  environment {
    // DockerHub images
    DOCKERHUB_USER   = "hedy123fth"
    BACKEND_IMAGE    = "hedy123fth/gestion-backend"
    FRONTEND_IMAGE   = "hedy123fth/gestion-frontend"
    TAG              = "latest"

    // Build contexts (folders in your repo)
    BACKEND_DIR      = "gestion-academique-backend"
    FRONTEND_DIR     = "gestion-academique-frontend"
  }

  options {
    timestamps()
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'ls -la'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh '''
          set -e

          echo "== Docker version =="
          docker version

          echo "== Build images with docker build (most reliable) =="
          docker build -t ${BACKEND_IMAGE}:${TAG}  ./${BACKEND_DIR}
          docker build -t ${FRONTEND_IMAGE}:${TAG} ./${FRONTEND_DIR}

          echo "== (Optional) If you also want compose build, fallback automatically =="
          if docker compose version >/dev/null 2>&1; then
            echo "docker compose is available"
            docker compose build || true
          elif docker-compose version >/dev/null 2>&1; then
            echo "docker-compose is available"
            docker-compose build || true
          else
            echo "No compose found (ok, we already built with docker build)."
          fi
        '''
      }
    }

    stage('Trivy Scan (FAIL on CRITICAL only)') {
      steps {
        sh '''
          set -e

          echo "== Trivy scan using Trivy container (no need to install trivy in Jenkins) =="
          TRIVY_IMAGE="aquasec/trivy:latest"

          echo "Scan BACKEND image (fail only on CRITICAL)"
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v trivy-cache:/root/.cache/ \
            ${TRIVY_IMAGE} image \
            --severity CRITICAL \
            --exit-code 1 \
            --no-progress \
            ${BACKEND_IMAGE}:${TAG}

          echo "Scan FRONTEND image (fail only on CRITICAL)"
          docker run --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v trivy-cache:/root/.cache/ \
            ${TRIVY_IMAGE} image \
            --severity CRITICAL \
            --exit-code 1 \
            --no-progress \
            ${FRONTEND_IMAGE}:${TAG}

          echo "✅ Trivy: no CRITICAL vulnerabilities found."
        '''
      }
    }

    stage('DockerHub Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
          sh '''
            set -e
            echo "$DOCKERHUB_PSW" | docker login -u "$DOCKERHUB_USR" --password-stdin
          '''
        }
      }
    }

    stage('Push Images') {
      steps {
        sh '''
          set -e
          docker push ${BACKEND_IMAGE}:${TAG}
          docker push ${FRONTEND_IMAGE}:${TAG}
        '''
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
    cleanup {
      cleanWs()
    }
  }
}
