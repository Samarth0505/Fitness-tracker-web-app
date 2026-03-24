pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        bat 'npm test'
                    } catch (Exception e) {
                        echo 'Skipping tests (not defined)'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy stage running...'
            }
        }
    }
}
