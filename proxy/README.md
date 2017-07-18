# Keycloak Security Proxy

The Keycloak Security Proxy docker image.

## Usage

This image is intended to be used with an existing `/tmp/conf/proxy.json` on the host machine. 
See [the proxy documentation](https://keycloak.gitbooks.io/documentation/server_installation/topics/proxy.html) 
for more details.

    docker run --rm --name keycloak-proxy -v /tmp/conf:/opt/jboss/conf -p 8180:8180 jboss/keycloak-proxy

A simplistic `proxy.json` could look like this (make sure to adjust `target-url`, `auth-server-url` and `secret`):

```json
{
   "target-url":"http://url-to-the-target-server.example.com",
   "bind-address":"0.0.0.0",
   "http-port":"8080",
   "applications":[
      {
         "base-path":"/",
         "adapter-config":{
            "realm":"jaeger",
            "auth-server-url":"http://url-to-keycloak.example.com/auth",
            "ssl-required":"external",
            "resource":"proxy-jaeger",
            "credentials":{
               "secret":"THE-SECRET-FROM-INSTALLATION-FILE"
            }
         },
         "constraints":[
            {
               "pattern":"/*",
               "roles-allowed":[
                  "user"
               ]
            }
         ]
      }
   ]
}```