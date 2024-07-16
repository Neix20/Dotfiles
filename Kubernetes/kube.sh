# Step 1: Initialize Kubernetes Master (Master Node)
kubeadm init --apiserver-advertise-address $(hostname -i)

# Step 1: Initialize Kubernetes Master (Master Node)
kubeadm init --apiserver-advertise-address $(hostname -i) --pod-network-cidr 10.5.0.0/16

# Step 2: Join cluster of Master Node (Worker Node)
kubeadm join 192.168.0.8:6443 --token 4ede68.qd30xcf63fadytam --discovery-token-ca-cert-hash sha256:e41e52037eda36cf6b528998e99da895e34904171889db3ceb771b183a1447c4 

# Step 3: Initialize Cluster Networking (Master Node)
kubectl apply -n kube-system -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 |tr -d '\n')"

192.168.0.8 server.kubernetes.local server  
192.168.0.6 node-0.kubernetes.local node-0 10.200.0.0/24
192.168.0.5 node-1.kubernetes.local node-1 10.200.1.0/24

machine=$(cat <<-END
192.168.0.8 server.kubernetes.local server  
192.168.0.6 node-0.kubernetes.local node-0 10.200.0.0/24
192.168.0.5 node-1.kubernetes.local node-1 10.200.1.0/24
END
)

echo "$machine" >> machines.txt

# Install MiniCube

curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64

# Start Minikube Cluster
minikube start

# Run a test container image that includes a webserver
kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080

# View Deployments
kubectl get deployments

# View Pods
kubectl get pods

# View Cluster Events
kubectl get events

# View Logs
kubectl logs

# Create Service
kubectl expose deployment hello-node --type=LoadBalancer --port=8080

# View Service
kubectl get services

# Run Command
minikube service hello-node

# List addons
minikube addons list

# Delete Resources
kubectl delete service hello-node
kubectl delete deployment hello-node

# Stop Minikube Cluster
minikube stop

# Deploy App On Kubernetes
kubectl action resource

# View Nodes
kubectl get nodes

# Deployment
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1

# View Deployments
kubectl get deployments

# Kubernetes Proxy
kubectl proxy

# list resources
kubectl get

# show detailed information about a resource
kubectl describe

# Get Nodes Operating System
kubectl describe nodes

# Get Operating Informations
uname -mov

# print the logs from a container in a pod
kubectl logs

# execute a command on a container in a pod
kubectl exec

# Look for Existing Pods
kubectl get pods

# View What Docker Containers are within pods
kubectl describe pods

# Label Pods
kubectl describe deployment

# Scaling an app
kubectl scale deployments/kubernetes-bootcamp --replicas=4

#region Pods
# Check Number of Pods
kubectl get pods -o wide

# Run Container
kubectl run nginx --image=nginx

# Imperative Way
kubectl apply -f pod-definition.yml
a
# Get Detailed information for Specific Pods
kubectl describe pod webapp

# Delete Pod
kubectl delete pod webapp
#endregion

#region Replica Set
# Cannot move a running pod from one node to the other !!!
# Replica Set
kubectl scale --replicas=6 -f replicaset-definition.yml

# Create File
kubectl create -f replicaset-definition.yml

kubectl get replicaset

kubectl delete replicaset myapp-replicaset

kubectl replace -f replicaset-definition.yml

# Edit Existing Replicaset Configuration File
kubectl edit replicaset new-replica-set

# Get Configuration file
kubectl get rs new-replica-set -o yaml

# Scale Replicaset
kubectl scale rs new-replica-set --replicas 5

# Scale Number of Pods to 2
kubectl scale rs new-replica-set --replicas 2
#endregion

#region Deployment
kubectl create -f deployment-definition.yml
kubectl get deployments
kubectl get replicaset
kubectl get pods

# View All Created Instances
kubectl get all

kubectl apply -f deployment-definition.yml

kubectl set image deployment/myapp-deployment nginx-containernginx:1.9.1
#endregion

#region Services
kubectl create -f service-definition.yml

kubectl get services

curl http://192.168.0.1:30008

curl http://192.12.230.3:6443
#endregion

kubectl exec -it <container-id> /bin/sh

kubectl create namespace ns-go-p-th-ms01
kubectl create namespace ns-go-p-ph-ms01
