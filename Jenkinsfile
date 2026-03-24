pipeline {
    agent any

    tools {
        nodejs 'NodeJS'   // Must match Jenkins config name
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run') {
            steps {
                sh 'npm start'
            }
        }
    }
}
