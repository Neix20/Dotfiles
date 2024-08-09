#region Docker Swarm

# Initalize Docker Swarm
docker swarm init --advertise-addr 127.0.0.1

docker swarm init --advertise-addr $(hostname -i)

# Docker Stack File
docker stack deploy --compose-file docker-stack.yml vote

# Check Docker Services
docker stack services vote

# Stop Docker Stack
docker stack rm vote

# Redeploy Docker Stack
docker stack deploy --compose-file docker-stack.yml vote

# Check Container
docker inspect $docker_id

# List all Information about Container
docker info

#endregion

docker run --name=redis -d redis:alpine

docker run --name=redis --network test-network -d redis:alpine

docker run --name clickcounter -p 8085:5000 --network test-network -d kodekloud/click-counter
docker run --name clickcounter -p 8085:5000 --link redis -d kodekloud/click-counter

docker network create test-network

docker rm -f $(docker ps -aq)

docker run --name=mysql-db -e MYSQL_ROOT_PASSWORD=db_pass123 -d mysql
docker run --name=mysql-db -e MYSQL_ROOT_PASSWORD=db_pass123 -v /opt/data:/var/lib/mysql -d mysql

docker run --name=alpine-2 --network none -d alpine

docker network create --driver bridge --subnet 182.18.0.1/24 --gateway 182.18.0.1 wp-mysql-network

docker run --name=mysql-db -e MYSQL_ROOT_PASSWORD=db_pass123 --network wp-mysql-network -d mysql:5.6

docker run --name=webapp -e DB_Host=mysql-db -e DB_Password=db_pass123 --network wp-mysql-network -d kodekloud/simple-webapp-mysql

docker run -d -p 5000:5000 --name my-registry -v /registry/data:/var/lib/registry --restart always registry:2

docker run -p 4000:80 --name simple-react-app -d txe1/simple-react-app

# Pull Image From Hub
docker pull nginx:latest
docker pull httpd:latest

# Tag Images

docker tag nginx:latest localhost:5000/nginx:latest
docker tag httpd:latest localhost:5000/httpd:latest

# Push to Local Registry
docker push localhost:5000/nginx:latest
docker push localhost:5000/httpd:latest

# Remove Local Images
docker image remove alpine:3.6

# Check Images in Docker Registry
curl -X GET localhost:5000/v2/_catalog

docker pull localhost:5000/nginx
docker pull localhost:5000/httpd

# Docker Build Image
docker build -t yourusername/example-node-app .
docker build -t txe1/simple-react-app .

# Tag Image
docker tag yourusername/example-node-app yourdockerhubusername/example-node-app:v1
docker tag txe1/simple-react-app txe1/simple-react-app:v1

# Push To Server
docker push yourusername/example-node-app:v1
docker push txe1/simple-react-app:v1
