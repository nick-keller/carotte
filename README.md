# Carotte 🥕

A modern RabbitMQ UI for the management plugin.

## Quick start

```
npm i
npm start
```

## CORS issues

CORS is not enabled by default with the management plugin, either update your
rabbit configuration or use a proxy:

```
npx local-cors-proxy --proxyUrl http://localhost:15672 --proxyPartial ""
```

Now instead of hitting `http://localhost:15672` the app can hit
`http://localhost:8010`.
