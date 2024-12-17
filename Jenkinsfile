pipeline {
    agent any

    environment {
        // Define the path to your backend project
        BACKEND_PATH = '/home/ubuntu/naaviverse-8/careers-backend-node-v.1'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the latest changes from the GitHub repository
                git branch: '16-12-2024', url: 'https://github.com/sivasai3949/naaviverse-8.git'
            }
        }

        stage('Stop PM2') {
            steps {
                // Stop the backend service using PM2 before updating the application
                dir("${env.BACKEND_PATH}") {
                    sh 'pm2 stop careers-backend || true' // Stops PM2 process, '|| true' ensures it doesn't fail if PM2 isn't running
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install dependencies with npm
                dir("${env.BACKEND_PATH}") {
                    sh 'npm install'
                }
            }
        }

        stage('Restart PM2') {
            steps {
                // Restart the backend service using PM2 after updates
                dir("${env.BACKEND_PATH}") {
                    sh 'pm2 restart careers-backend'
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
