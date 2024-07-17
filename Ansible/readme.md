
# Ansible

This directory is used for me to familiarize myself with Ansible Playbooks

## Commonly Used Modules For Ansible

### File Operations

```yaml
- name: Copy a file
  copy:
    src: /path/to/source
    dest: /path/to/destination
```

```yaml
- name: Remove a file
  file:
    path: /path/to/file
    state: absent
```

```yaml
- name: Create a Directory
  file:
    path: /path/to/directory
    state: directory
```

```yaml
- name: Remove Directory
  file:
    path: /path/to/directory
    state: absent
```

```yaml
- name: Update file permissions
  file:
    path: /path/to/file
    mode: '0755'
```

```yaml
- name: Create a new file
  ansible.builtin.file:
    path: /path/to/myfile.txt
    state: touch
```

### HTTP Method

```yaml
- name: Make HTTP Get Request
  uri:
    url: https://swapi.dev/api/people/
    return_content: yes
  register: swapi
- debug:
  var: swapi
```

### Archiving Operation

```yaml
- name: Unpackage deploy.tar.gz
  # Comment
  ansible.builtin.unarchive:
    src: /opt/deploy.tar.gz
    dest: /opt/my-app
```

### Shell Operations

```yaml
- name: Check processes
  shell: ps aux | grep some_process
  register: process_list
- debug:
    var: process_list.stdout
```

```yaml
- name: Check service status
  service:
    name: some_service
    state: started
```

### Task Schedule Operations

```yaml
- name: Schedule a cron job
  cron:
    name: "My cron job"
    minute: "0"
    hour: "2"
    job: "/path/to/command"
```

### Install File

```yaml
- name: "Install Nginx to version {{ nginx_version }}"
  ansible.builtin.apt:
    name: "nginx={{ nginx_version }}"
    state: present
```

### Line In File

```yaml
- name: Insert a line after a specific pattern
  lineinfile:
    path: /home/ubuntu/file.txt
    line: "This is the new line"
    insertafter: "^Pattern to match"
```

### File Templating

```yaml
- name: Copy the Nginx configuration file to the host
  template:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/sites-available/default
```
