pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'hedy123fth'
        BACKEND_IMAGE  = 'hedy123fth/gestion-backend'
        FRONTEND_IMAGE = 'hedy123fth/gestion-frontend'
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
                  docker build -t $BACKEND_IMAGE:latest ./gestion-academique-backend
                  docker build -t $FRONTEND_IMAGE:latest ./gestion-academique-frontend
                '''
            }
        }

        stage('Trivy Scan (FAIL only on CRITICAL)') {
            steps {
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    -v trivy-cache:/root/.cache/ \
                    aquasec/trivy:latest image \
                    --severity CRITICAL \
                    --exit-code 1 \
                    --no-progress \
                    $BACKEND_IMAGE:latest

                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    -v trivy-cache:/root/.cache/ \
                    aquasec/trivy:latest image \
                    --severity CRITICAL \
                    --exit-code 1 \
                    --no-progress \
                    $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PSW'
                )]) {
                    sh '''
                      echo "$DOCKER_PSW" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                  docker push $BACKEND_IMAGE:latest
                  docker push $FRONTEND_IMAGE:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
