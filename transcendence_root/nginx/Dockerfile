FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
# RUN apt install -y openssl
# COPY default /etc/nginx/sites-enabled/default
CMD ["nginx", "-g", "daemon off;"]