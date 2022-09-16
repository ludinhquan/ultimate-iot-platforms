#!/bin/bash

mkdir -p ~/tmp
cd ~/tmp

# Install Docker
echo "Installing Docker"
curl -fsSL https://get.docker.com -o get-docker.sh
DRY_RUN=1 sh ./get-docker.sh

# Install Minikube
echo "Installing Minikube"
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install Kubernetes
echo "Installing Kubernetes"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm 
echo "Installing Helm"
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh

# Install Telepresence
echo "Installing Telepresence"
sudo curl -fL https://app.getambassador.io/download/tel2/linux/amd64/latest/telepresence -o /usr/local/bin/telepresence
sudo chmod a+x /usr/local/bin/telepresence


# Install Tilt
echo "Installing Tilt"
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash

# Start cluster
minikube start
minikube addons enable ingress

# Install traffic manager, see docs https://www.telepresence.io/docs/v2.5/install/helm/
helm repo add datawire https://app.getambassador.io
helm repo update
helm install traffic-manager --namespace default datawire/telepresence
