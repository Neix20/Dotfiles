#region Kubernetes Pods

# Get all pods in the current namespace
kubectl get pods

# Get pods in all namespaces
kubectl get pods --all-namespaces

# Get pods with more details 
kubectl get pods -o wide

# Get the yaml for a pod
kubectl get pod <pod> -o yaml

# Inspect a pod
kubectl describe pods <pod>

# Get pods sorted by a metric
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Get pods with their labels
kubectl get pods --show-labels

# Get pods that match a label
kubectl get pods -l <label>=<value>

# Forward traffic from a localhost port to a pod port
kubectl port-forward <pod> <localhost-port>:<pod-port>

# Run a command on a pod
kubectl exec <pod> -- <command>

# Run a command on a container in a pod
kubectl exec <pod> -c <container> -- <command>

#endregion

#region Kubernetes Deployments

# Get all deployments in the current namespace
kubectl get deployment

# Get deployments in all namespaces
kubectl get deployment --all-namespaces

# Get deployments with more details 
kubectl get deployment -o wide

# Get the yaml for a deployment
kubectl get deployment <deployment> -o yaml

# Inspect a deployment
kubectl describe deployment <deployment>

# Get deployment's labels
kubectl get deployment --show-labels

# Get deployments that match a label
kubectl get deployment -l <label>=<value>

#endregion

#region Kubernetes Services

# Get all services in the current namespace
kubectl get services

# Get services in all namespaces
kubectl get service --all-namespaces

# Get services with more details 
kubectl get service -o wide

# Get the yaml for a services
kubectl get service <service> -o yaml

# Inspect a service
kubectl describe service <service>

# Get service's labels
kubectl get service --show-labels

# Get services that match a label
kubectl get service -l <label>=<value>

#endregion

#region Kubernetes Ingress

# Get all ingress in the current namespace
kubectl get ingress

# Get ingress in all namespaces
kubectl get ingress --all-namespaces

# Get ingress with more details 
kubectl get ingress -o wide

# Get the yaml for a ingress
kubectl get ingress <ingress> -o yaml

# Inspect a ingress
kubectl describe ingress <ingress>

# Get ingress labels
kubectl get ingress --show-labels

# Get ingress that match a label
kubectl get ingress -l <label>=<value>

#endregion

#region Creating Kubernetes Resources

# Create a kubernetes resource from a file
kubectl apply -f ./<manifest>.yaml

# Create kubernetes resources from multiple files
kubectl apply -f ./<manifest>.yaml -f ./<manifest>.yaml

# Create resources from all manifest files in a directory
kubectl apply -f ./<directory>

# Create resource from a url
kubectl apply -f <url_to_manifest>

# Start a single instance of an image
kubectl create deployment <deployment_name> --image=<image>

#endregion
