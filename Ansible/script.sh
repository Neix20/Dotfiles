
# References:

# Youtube
# https://www.youtube.com/watch?v=w9eCU4bGgjQ
# https://www.youtube.com/watch?v=SvcOwBFLVLM
# https://www.youtube.com/watch?v=Z7p9-m4cimg

# Docs
# https://spacelift.io/blog/ansible-playbooks
# https://github.com/leucos/ansible-tuto
# https://stackoverflow.com/questions/57919339/how-to-run-ansible-playbook-using-a-public-ssh-key

# Ping All The Hosts
ansible -i ./inventory/hosts ubuntu -m ping --user ubuntu

# Ansible Ad Hoc Command
ansible -i ./inventory/hosts ubuntu -m shell -a "ls -a" 
ansible -i ./inventory/hosts ubuntu -m shell -a "cat /usr/share/nginx/html/index.html" 

# Install Roles from Ansible Galaxy
ansible-galaxy install -r requirements.yml

# Run Playbook
ansible-playbook -i inventory ./playbooks/starter.yml
ansible-playbook -i inventory ./playbooks/nginx.yml

# Create Secret
ansible-vault create secret.yml
ansible-vault edit secret.yml
