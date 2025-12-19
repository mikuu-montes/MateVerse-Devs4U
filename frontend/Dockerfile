FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html
RUN echo '<html><head><meta http-equiv="refresh" content="0; url='\''./Login Usuario/index.html'\''" /></head></html>' > /usr/share/nginx/html/index.htm
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]