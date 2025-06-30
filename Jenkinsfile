pipeline {
    agent {
        docker {
            image 'node:22'
            args '-u root:root'
        }
    }

    parameters {
        text(
            name: 'ENV_VARS',
            defaultValue: '# Paste your .env content here\n# Example:\n# KEY1=value1\n# KEY2=value2',
            description: 'Paste your .env content here'
        )
        string(name: 'NODE_ENV', defaultValue: 'production', description: 'Node environment')
        string(name: 'REMOTE_USER', defaultValue: 'root', description: 'Remote server user')
        string(name: 'REMOTE_HOST', defaultValue: '194.238.16.105', description: 'Remote server host')
        string(name: 'REMOTE_PORT', defaultValue: '2222', description: 'Remote server SSH port')
        string(name: 'REMOTE_PATH', defaultValue: '/var/www/daarib.com', description: 'Remote deployment path')
        string(name: 'NEW_API_URL', defaultValue: 'https://admin.daarib.com/api', description: 'API URL')
    }

    environment {
        NODE_ENV     = "${params.NODE_ENV ?: 'production'}"
        REMOTE_USER  = "${params.REMOTE_USER ?: 'root'}"
        REMOTE_HOST  = "${params.REMOTE_HOST ?: '194.238.16.105'}"
        REMOTE_PORT  = "${params.REMOTE_PORT ?: '2222'}"
        REMOTE_PATH  = "${params.REMOTE_PATH ?: '/var/www/daarib.com'}"
        NEW_API_URL  = "${params.NEW_API_URL ?: 'https://admin.daarib.com/api'}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Validate ENV_VARS') {
            steps {
                script {
                    if (params.ENV_VARS == null || params.ENV_VARS.trim() == '') {
                        error 'ENV_VARS parameter is empty. Please provide valid .env content.'
                    }
                }
            }
        }

        stage('Create .env file') {
            steps {
                script {
                    writeFile file: '.env', text: params.ENV_VARS
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Update Configs') {
            steps {
                sh '''
                    echo "Updating .env API URL..."
                    sed -i'' "s|^NEXT_PUBLIC_API_BASE_URL=.*|NEXT_PUBLIC_API_BASE_URL=$NEW_API_URL|g" .env
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm cache clean --force'
                sh 'npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                sh '''
                    echo "Archiving necessary files..."
                    tar -czf nextjs-app.tar.gz \
                        .next public package.json package-lock.json .env \
                        jsconfig.json postcss.config.mjs tailwind.config.js next.config.mjs
                '''
            }
        }

        stage('Deploy to Server') {
            steps {
                script {
                    sshagent(credentials: ['jenkins_ssh_key']) {
                        sh '''
                            # Ensure remote host is trusted
                            mkdir -p ~/.ssh
                            ssh-keyscan -p ${REMOTE_PORT} -H ${REMOTE_HOST} >> ~/.ssh/known_hosts

                            # Install rsync if needed
                            if ! command -v rsync &> /dev/null; then
                                echo "🔧 Installing rsync on Jenkins agent..."
                                apt-get update && apt-get install -y rsync
                            fi

                            echo "📦 Uploading archive to server..."
                            rsync -avz -e "ssh -p ${REMOTE_PORT}" nextjs-app.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

                            echo "🚀 Connecting and deploying on remote server..."
                            ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
                                set -e

                                cd ${REMOTE_PATH}

                                echo "📂 Extracting files..."
                                tar -xzf nextjs-app.tar.gz
                                rm -f nextjs-app.tar.gz

                                echo "📦 Installing dependencies..."
                                export NODE_ENV=${NODE_ENV}
                                export NODE_PATH=.
                                npm install --omit=dev

                                echo "🔁 Restarting service..."
                                systemctl restart daarib.service || echo "⚠️ Skipping restart if not a service"

                                echo "✅ Deployment complete."
                            ENDSSH
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment successful.'
        }
        failure {
            echo '❌ Build or deployment failed.'
        }
    }
}
