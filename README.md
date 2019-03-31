# googlemaps_pf_vuejs

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

In order to let the app work with the NGINX backend in a cross-domain Paulusfeesten environment, add the following CORS data to NGINX:

#-- Add following custom info to allow origin url's
map $http_origin $cors_header {
   default     ""; #empty causes the Access-Control-Allow-Origin header to be empty
#    "~^https?://[^/]+localhost(:[0-9]+)?$" "$http_origin";   
    "~^https?://[^/]+\.paulusfeesten\.be(:[0-9]+)?$" "$http_origin";   
}
#-- End Custom

server {
    location / {

		#-- Add following custom header info
        add_header 'Access-Control-Allow-Origin' $cors_header;
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Headers' 'Content-Type,Accept';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';

        #-- End Custom
    }
