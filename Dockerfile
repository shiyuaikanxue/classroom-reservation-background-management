FROM 172.22.121.50/dockerhub/library/nginx:1.25-alpine-slim

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html

EXPOSE 80
