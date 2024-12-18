pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/sivasai3949/naaviverse-8.git'
        BRANCH = '16-12-2024'
        DEPLOY_DIR = '/home/ubuntu/naaviverse-8/careers-backend-node-v.1'
        SSH_KEY = credentials('EC2-SSH-Key')
    }

    stages {
        stage('Use Existing Repository') {
            steps {
                script {
                    echo "Using the existing repository at ${DEPLOY_DIR}..."
                    // Check if the directory exists and list its contents
                    sh "ls -la ${DEPLOY_DIR}"
                    
                    // Pull latest changes if the repository already exists
                    sh "cd ${DEPLOY_DIR} && git pull origin ${BRANCH}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing dependencies..."
                    
                    // Ensure npm installs in the right directory
                    sh "cd ${DEPLOY_DIR} && npm install"
                }
            }
        }

        stage('Stop PM2 Application') {
            steps {
                script {
                    echo "Stopping PM2 application..."
                    sh "pm2 stop careers-backend || true"
                }
            }
        }

        stage('Restart PM2 Application') {
            steps {
                script {
                    echo "Starting PM2 application..."
                    sh "cd ${DEPLOY_DIR} && pm2 start careers-backend"
                }
            }
        }

        stage('Reload Nginx') {
            steps {
                script {
                    echo "Reloading Nginx..."
                    sh "sudo systemctl reload nginx"
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed."
        }

        success {
            echo "Deployment was successful!"
        }

        failure {
            echo "Deployment failed. Please check the logs."
        }
    }
}
