# Carotte 🥕

A modern RabbitMQ UI for the management plugin.

## Key features

- Multiple connections support
- Bulk actions on queues
- Queue completion ETA based on average rate
- Full JSON support for publish and get
- Smooth user experience and documentation integration

## Using it

### Solution 1: Online (best)

Go to [https://carotte.netlify.app](https://carotte.netlify.app)

### Solution 2: Locally (hack)

Clone repository then:

```
npm i
npm start
```

## CORS issues

CORS is not enabled by default with the management plugin, you have a few options:

### Solution 1: CORS browser extension (easiest)

Install any CORS extension to your browser and enable it:

- [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)

### Solution 2: Local proxy (easy)

Run a proxy locally:

```
npx local-cors-proxy --proxyUrl http://localhost:15672 --proxyPartial "" --port 8010
```

Now instead of hitting `http://localhost:15672` the app can hit
`http://localhost:8010` without any issues.

### Solution 3: Update RabbitMQ config (best)

Update your RabbitMQ configuration to [support CORS](https://www.rabbitmq.com/management.html#cors)
