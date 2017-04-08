### KillBug

To start it locally see `npm run`.

-------------------------------------------------------------------------------------------------------



- `clone`
- `npm install`
- Ask FG for environment variables and you local app_id
- `npm run start-dev` (this will start the backend server in development mode)
- Add `127.0.0.1 killbug.local` to your `/etc/hosts` :)
- `open http://killbug.local/`

Then open another console and run the above command to build the client.js script tag for local development

- `cd tag && npm run build-watch`

Now we need to start a dummy client, so open another console to start the dummy client:

- `npm run start-demo-client`


# Database

ALTER ROLE <your_login_role> SET search_path TO killbugtoday_auth;
