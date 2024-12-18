pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/sivasai3949/naaviverse-8.git'
        BRANCH = '16-12-2024'
        DEPLOY_DIR = '/home/ubuntu/naaviverse-8/careers-backend-node-v.1'
        SSH_KEY = credentials('EC2-SSH-Key')
    }

    stages {
        stage('Clone or Pull Repository') {
            steps {
                script {
                    echo "Cloning or pulling the repository..."
                    def exists = fileExists("${DEPLOY_DIR}")
                    if (exists) {
                        echo "Repository already exists, pulling latest changes..."
                        sh "cd ${DEPLOY_DIR} && git pull origin ${BRANCH}"
                    } else {
                        echo "Cloning the repository..."
                        sh "git clone -b ${BRANCH} ${GIT_REPO} ${DEPLOY_DIR}"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing dependencies..."

                    // Print the contents of the directory to verify that package.json exists
                    sh "ls -la ${DEPLOY_DIR}"

                    // Print the current working directory before running npm install
                    sh "pwd"

                    // Run npm install in the correct directory
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
