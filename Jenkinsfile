pipeline {
    agent {
        dockerfile true
    }
    stages ('check version') {
        stage {
            steps {
                sh 'python --version'
            }
        }
    }
}