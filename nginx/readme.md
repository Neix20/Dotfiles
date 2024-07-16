
# Notes

## References

- [Deploying NGINX as an API Gateway: Part I](https://www.f5.com/company/blog/nginx/deploying-nginx-plus-as-an-api-gateway-part-1)
- [Deploying NGINX as an API Gateway: Part II](https://www.f5.com/company/blog/nginx/deploying-nginx-plus-as-an-api-gateway-part-2-protecting-backend-services)
- [Validating OAuth 2.0 Access Tokens with NGINX and NGINX Plus](https://www.f5.com/company/blog/nginx/validating-oauth-2-0-access-tokens-nginx)
- [Using OAuth2-Proxy with Nginx Subdomains](https://medium.com/devops-dudes/using-oauth2-proxy-with-nginx-subdomains-e453617713a)

## Repository

- [Nginx Basic Workshops](https://github.com/nginxinc/nginx-basics-workshops)
- [Nginx Ingress Workshop](https://github.com/nginxinc/nginx-ingress-workshops/blob/main/OSS/labs/LabGuide.md)
- [Nginx Configuration I](https://github.com/Neix20/nginx-conf-i)
- [Nginx Configuration II](https://github.com/Neix20/nginx-conf-ii)

## Authentication

### Basic

- <https://github.com/beevelop/docker-nginx-basic-auth/tree/latest>
- <https://github.com/xavijs/nginx-basic-auth>

### API Key

- <https://github.com/galvarado/nginx-api-gateway>

### Force WWW

```nginx
http {
  server {
    listen 80;
    server_name example.org;
    return 301 $scheme://www.example.org$request_uri;
  }

  server {
    listen 80;
    server_name www.example.org;
  }
}
```

### Force No-WWW

```nginx
server {
  listen 80;
  server_name example.org;
}

server {
  listen 80;
  server_name www.example.org;
  return 301 $scheme://example.org$request_uri;
}
```

### Basic Setup

```nginx
http {
  server {
    listen 80;
    listen [::]:80;
    server_name www.neix-chs.tech;
    
    location / {
      proxy_pass http://localhost:51234;
    }
  }
}
```

### API Key Authentication

```nginx
map $http_apikey $api_client_name {
  default "";

  "7B5zIqmRGXmrJTFmKa99vcit" "client_one";
  "QzVV6y1EmQFbbxOfRCwyJs35" "client_two";
  "mGcjH8Fv6U9y3BVF9H3Ypb9T" "client_six";
}

location /api/warehouse/ {
  # Policy configuration here (authentication, rate limiting, logging...)
  access_log /var/log/nginx/warehouse_api.log main;
  auth_request /_validate_apikey;

  # URI routing
  #
  location /api/warehouse/inventory {
    proxy_pass http://warehouse_inventory;
  }

  location /api/warehouse/pricing {
    proxy_pass http://warehouse_pricing;
  }

  return 404; # Catch-all
}
```

### HTTPS Setup with SSL Certificate

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name www.neix-chs.tech;
  return 302 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  listen [::]:443 ssl;

  ssl_certificate         /etc/letsencrypt/live/www.neix-chs.tech/fullchain.pem;
  ssl_certificate_key     /etc/letsencrypt/live/www.neix-chs.tech/privkey.pem;

  ssl_session_cache    shared:SSL:10m;
  ssl_session_timeout  5m;
  ssl_ciphers          HIGH:!aNULL:!MD5;
  ssl_protocols        TLSv1.2 TLSv1.3;

  server_name  www.neix-chs.tech;

  location / {
    proxy_pass http://localhost:51234;
    proxy_ssl_server_name on;
  }

  location /api/ {
    proxy_pass http://localhost:6969;
  }

}
```

### Load Balancer Setup

```nginx
events {}

http {
  upstream upstream-server {
    server server1:3000 weight=5;
    server server2:3001 weight=4;
    server server3:3002 weight=3;
  }

  server {
    listen 8080;

    location / {
      proxy_pass http://upstream-server;
    }
  }
}
```

### GZip Compression

```nginx
http {
  server {
    gzip  on;
    gzip_buffers 16 8k;
    gzip_comp_level 6;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
      text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
      text/javascript application/javascript application/x-javascript
      text/x-json application/json application/x-web-app-manifest+json
      text/css text/plain text/x-component
      font/opentype application/x-font-ttf application/vnd.ms-fontobject
      image/x-icon;
    gzip_disable  "msie6";
  }
}
```

### Basic Authentication with API-Key

```nginx
http {
  server {
    auth_basic "This is Protected";
    auth_basic_user_file /path/to/password-file;
  }
}
```

### Content-Caching

```nginx
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
open_file_cache_errors on;
```

```nginx
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### CORS

```csharp
location ~* \.(eot|ttf|woff) {
  add_header Access-Control-Allow-Origin *;
}
```

### MIME Types

```nginx
types {
  text/html html;
  text/css css;
  application/javascript js;
}
```

### URL Rewrite

```nginx
# 前缀匹配（Prefix Match）： `location /path/` 使用前缀匹配，匹配以 `/path/` 开头的请求路径。
location /images/ {
	# 匹配以 /images/ 开头的路径
	# 示例匹配：/images/photo.jpg 
	# 示例不匹配：/documents/file.txt
}

# 精确匹配（Exact Match）： 使用 `=` 前缀可以进行精确匹配，匹配与指定路径完全相同的请求。
location = /path {
	# 精确匹配 /path
	# 示例匹配：/path
	# 示例不匹配：/path/info
}

# 正则表达式匹配： 使用 `~` 或 `~*` 前缀可进行正则表达式匹配，区分大小写或不区分大小写。
location ~ ^/user/\d+/ {
	# 匹配形如 /user/123/ 的路径
	# 示例匹配：/user/456/ 
	# 示例不匹配：/user/john/
}

location ~* \.png$ {
	# 匹配以 .png 结尾的路径，不区分大小写
	# 示例匹配：/images/photo.PNG
	# 示例不匹配：/documents/file.jpg
}

# 最长前缀匹配： 在多个 `location` 中，Nginx 会选择最长的前缀匹配。如果存在两个 `location`，一个是 `/images/`，另一个是 `/images/data/`，请求 `/images/data/file.jpg` 会匹配到 `/images/data/`。
```

### Reverse Proxy

#### Setup I Copied Online

```nginx
location / {
  proxy_pass http://backend_server;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
  proxy_ssl_server_name on;
}
```

#### Basic NGINX Setup

```nginx
location / {
  proxy_pass http://backend_server;
}
```

#### Add Proxy Header

```nginx
location / {
  proxy_pass http://backend_server;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  # 其他代理相关配置...
}
```

#### Different Routes

```nginx
location /app/ {
  proxy_pass http://backend_server/app/;
  # 其他代理相关配置...
}
```

#### Enable Proxy Buffering

```nginx
location / {
  proxy_pass http://backend_server;
  proxy_buffering on;
  proxy_buffer_size 4k;
  proxy_buffers 4 4k;
  proxy_busy_buffers_size 8k;
  # 其他代理相关配置...
}
```

#### Web-Socket Connection

```nginx
location / {
  proxy_pass http://backend_server;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  # 其他代理相关配置...
}
```

#### Load Balancing

```nginx
upstream backend_servers {
  server backend1.example.com;
  server backend2.example.com;
  # 其他后端服务器...
}

server {
  location / {
    proxy_pass http://backend_servers;
    # 其他代理相关配置...
  }
}
```

#### Handle 404 Error

```nginx
location / {
  proxy_pass http://backend_server;
  error_page 502 503 504 /error.html;
  try_files /cart.html =404;
  # 其他代理相关配置...
}
```

#### Logging Practice

```nginx
location / {
  proxy_pass http://backend_server;
  access_log /var/log/nginx/proxy_access.log;
  error_log /var/log/nginx/proxy_error.log;
  # 其他代理相关配置...
}
```

#### CORS Check II

```nginx
server {
  listen 80;
  server_name your_domain.com;

  location / {
    # STEP1：配置基础的CORS头
    add_header 'Access-Control-Allow-Origin' '*'; # 指定允许访问资源的域。`'*'` 表示允许所有域，也可以指定具体的域。
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE'; # 指定允许的 HTTP 方法。
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range'; # 指定允许的请求头。

    # STEP2：处理OPTIONS请求
    # CORS 通常会发送一个 OPTIONS 预检请求（Preflight Request）来检查是否允许实际的请求
    if ($request_method = 'OPTIONS') {
      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
      add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';

      add_header 'Access-Control-Max-Age' 1728000;
      add_header 'Content-Type' 'text/plain; charset=utf-8';
      add_header 'Content-Length' 0;
      return 204;
    }
  }
}
```
