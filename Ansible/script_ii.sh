
# Install Ansible
apt -y install ansible

# Ansible Get Number of Modules
ansible-doc -l | wc -l > /root/modules

# Ping All File In Hosts
ansible all -m ping

# Run Ad Hoc Command
ansible all -m shell -a 'hostname'

ansible servers -i /root/hosts -m ping

# List All Hosts in Ansible
ansible-inventory -i /root/hosts --list

# Graph Output
ansible-inventory -i /root/hosts --graph

# Yaml Output
ansible-inventory -i /root/hosts --list -y

# Get Servers Uptime
ansible servers -i /root/hosts -m shell -a 'uptime'

# Get Servers OS Version
ansible -i /root/hosts <host-name> -m shell -a 'uname -a'
ansible -i /root/hosts ubuntu -m shell -a 'uname -a'
ansible -i /root/hosts servers  -m shell -a 'uname -a'

ansible servers -i /root/hosts -m file -a 'path=/opt/deployment state=directory'
ansible servers -i /root/hosts -m shell -a 'cd /opt && mkdir deployment'

ansible servers -i /root/hosts -m copy -a 'src=/root/configfile.cfg dest=/opt/deployment'

# Run Playbooks
ansible-playbook -i /root/hosts /root/deploy.yml

# Ansible Galaxy
ansible-galaxy init update

ansible-playbook -i /root/hosts /root/playbooks/environment.yml --tags=update
ansible-playbook -i /root/hosts /root/playbooks/environment.yml --tags=insert

