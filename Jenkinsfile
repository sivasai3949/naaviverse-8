pipeline {
    // Define the agent to run the pipeline on, 'any' means it can run on any available agent.
    agent any
    
    // Define environment variables to be used across the pipeline stages
    environment {
        // GIT_REPO stores the GitHub repository URL
        GIT_REPO = 'https://github.com/sivasai3949/naaviverse-8.git'
        
        // BRANCH stores the branch that should be used for deployment
        // It is currently set to '16-12-2024', but it can be dynamically updated.
        BRANCH = '16-12-2024' 
        
        // DEPLOY_DIR is the directory on the EC2 instance where the code will be deployed.
        DEPLOY_DIR = '/home/ubuntu/naaviverse-8/careers-backend-node-v.1'
        
        // SSH_KEY is a Jenkins credential that stores the private SSH key to connect to the EC2 instance
        // Make sure to create and configure this in Jenkins Credentials.
        SSH_KEY = credentials('EC2-SSH-Key')  
    }

    // Define the stages that make up the pipeline.
    stages {
        // Stage for cloning the repository from GitHub or pulling the latest changes
        stage('Clone or Pull Repository') {
            steps {
                script {
                    // Print message indicating the clone or pull step is starting
                    echo "Cloning or pulling the repository..."
                    
                    // Check if the directory exists
                    def exists = fileExists("${DEPLOY_DIR}")
                    
                    if (exists) {
                        echo "Repository already exists, pulling latest changes..."
                        // If the repository already exists, pull the latest changes from the specified branch
                        sh "cd ${DEPLOY_DIR} && git pull origin ${BRANCH}"
                    } else {
                        echo "Cloning the repository..."
                        // If the repository does not exist, clone the repository from the specified branch
                        sh "git clone -b ${BRANCH} ${GIT_REPO} ${DEPLOY_DIR}"
                    }
                }
            }
        }

        // Stage to stop the currently running PM2 application
        stage('Stop PM2 Application') {
            steps {
                script {
                    // Print message indicating the stop step is starting
                    echo "Stopping PM2 application..."
                    
                    // Stop the 'careers-backend' PM2 application if it's running
                    // The '|| true' part ensures that if PM2 is not running, the script doesn't fail.
                    sh "pm2 stop careers-backend || true" 
                }
            }
        }

        // Stage for installing the dependencies (i.e., running `npm install`)
        stage('Install Dependencies') {
            steps {
                script {
                    // Print message indicating the dependency installation step is starting
                    echo "Installing dependencies..."
                    
                    // Change to the directory where the backend application is located and install dependencies
                    sh "cd ${DEPLOY_DIR} && npm install"
                }
            }
        }

        // Stage to restart the PM2 application after dependencies are installed
        stage('Restart PM2 Application') {
            steps {
                script {
                    // Print message indicating the restart step is starting
                    echo "Starting PM2 application..."
                    
                    // Change to the directory where the backend application is located and start the PM2 application again
                    sh "cd ${DEPLOY_DIR} && pm2 start careers-backend"
                }
            }
        }

        // Stage for reloading Nginx to apply any changes made during deployment
        stage('Reload Nginx') {
            steps {
                script {
                    // Print message indicating the reload step is starting
                    echo "Reloading Nginx..."
                    
                    // Reload Nginx to apply any changes made to the configuration (e.g., changes in the backend or reverse proxy settings)
                    sh "sudo systemctl reload nginx"
                }
            }
        }
    }

    // Post block to handle actions after the pipeline execution
    post {
        // Always block: runs after the pipeline, regardless of whether it succeeds or fails
        always {
            echo "Pipeline completed."
        }
        
        // Success block: runs if the pipeline was successful
        success {
            echo "Deployment was successful!"
        }
        
        // Failure block: runs if the pipeline fails
        failure {
            echo "Deployment failed. Please check the logs."
        }
    }
}
