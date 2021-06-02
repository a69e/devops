pipeline {
    agent {
        dockerfile true
    }
    stages {
        stage ('check version') {
            steps {
                sh 'python --version'
            }
        }
    }
}