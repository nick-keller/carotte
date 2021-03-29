# Carotte 🥕

A modern RabbitMQ UI for the management plugin.

## Using it

### Online

Go to [https://carotte.netlify.app](https://carotte.netlify.app)

### Locally

```
npm i
npm start
```

## CORS issues

CORS is not enabled by default with the management plugin, you have a few options:

### CORS browser extension (easiest)

Install any CORS extension to your browser and enable it:

- [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)

### Local proxy (easy)

Run a proxy locally:

```
npx local-cors-proxy --proxyUrl http://localhost:15672 --proxyPartial "" --port 8010
```

Now instead of hitting `http://localhost:15672` the app can hit
`http://localhost:8010` without any issues.

### Update RabbitMQ config (best)

Update your RabbitMQ configuration to [support CORS](https://www.rabbitmq.com/management.html#cors)
