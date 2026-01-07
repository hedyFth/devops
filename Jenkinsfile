pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    DOCKERHUB_USER  = "${DOCKERHUB_CREDS_USR}"
    DOCKERHUB_PASS  = "${DOCKERHUB_CREDS_PSW}"

    BACKEND_IMAGE  = "${DOCKERHUB_USER}/gestion-backend:latest"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/gestion-frontend:latest"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        bat 'docker build -t %BACKEND_IMAGE%  ./gestion-academique-backend'
        bat 'docker build -t %FRONTEND_IMAGE% ./gestion-academique-frontend'
      }
    }

    stage('Trivy Scan') {
      steps {
        // Scan backend
        bat 'docker run --rm aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 1 %BACKEND_IMAGE%'

        // Scan frontend
        bat 'docker run --rm aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 1 %FRONTEND_IMAGE%'
      }
    }

    stage('DockerHub Login') {
      steps {
        bat 'echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin'
      }
    }

    stage('Push Images') {
      steps {
        bat 'docker push %BACKEND_IMAGE%'
        bat 'docker push %FRONTEND_IMAGE%'
      }
    }
  }

  post {
    always {
      bat 'docker logout'
    }
  }
}
