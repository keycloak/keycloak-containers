# SSL Certificates

See [How to issue and renew Let's Encrypt certificates with OVH DNS API](http://blog.fgribreau.com/2017/03/how-to-issue-and-renew-lets-encrypt.html).

### to issue (the first time)
sudo -E /Users/FG/.acme.sh/acme.sh --issue -d killbug.today -d www.killbug.today -d api.killbug.today -d support.killbug.today -d blog.killbug.today -d app.killbug.today --dns dns_ovh


### to renew (the time after)

sudo -E /Users/FG/.acme.sh/acme.sh --renew -d killbug.today -d www.killbug.today -d api.killbug.today -d support.killbug.today -d blog.killbug.today -d app.killbug.today --dns dns_ovh


### if you have some INVALID_CREDENTIALS issue

```
sblm /Users/FG/.acme.sh/account.conf
# remove everything related with OVH API.
```

### send them to CleverCloud

```
cat /Users/FG/.acme.sh/killbug.today/fullchain.cer /Users/FG/.acme.sh/killbug.today/killbug.today.key | keybase pgp encrypt clevercloud
open https://keybase.io/encrypt
# select "clevercloud"

```
