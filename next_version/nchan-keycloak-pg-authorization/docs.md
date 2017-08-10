# Nchan + Keycloak

## Restricted channels with Nchan

Pour ajouter une autorisation sur un channel, il faut ajouter une entrée `nchan_authorize_request` et préciser vers quelle `location` va s'effectuer l'autorisation.

```
location = /auth/pub {
  nchan_publisher;
  nchan_channel_id pub_auth;

  nchan_authorize_request /authorized;
}
```

Ici on précise que c'est `/authorized` qui va accepter ou non la connexion.

Côté utilisateur, lorsqu'il va vouloir ouvrir une Websocket vers `/auth/pub`, il va devoir également préciser son `access_token` en query param (ou autre).

`/authorized` fait le proxy vers Keycloak pour vérifier la validité du token.

En fonction du statut de retour, Nchan va accepter ou non la connexion.

```
location /authorized {
  proxy_pass http://localhost:8080/auth/realms/killbug/protocol/openid-connect/userinfo;

  proxy_pass_request_body off;

  proxy_set_header Authorization "Bearer ${arg_access_token}";

  proxy_set_header Content-Length "";
  proxy_set_header X-Subscriber-Type $nchan_subscriber_type;
  proxy_set_header X-Publisher-Type $nchan_publisher_type;
  proxy_set_header X-Prev-Message-Id $nchan_prev_message_id;
  proxy_set_header X-Channel-Id $nchan_channel_id;
  proxy_set_header X-Original-URI $request_uri;
  proxy_set_header X-Forwarded-For $remote_addr;
}
```
