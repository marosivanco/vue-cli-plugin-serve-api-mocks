# vue-cli-plugin-serve-api-mocks

> vue-cli plugin for API mocks serving

## Description

When creating frontend of an app, the services are typically not implemented (yet). This plugin lets you create and serve mocks of the services, providing easy mapping of HTTP methods and URLs to files on filesystem. With the plugin, the frontend app becomes self-contained in the sense, that you can view and test mocked scenarios.

For instace, to create a mock of the service:

`HTTP GET /api/applications`

which returns:
```HTTP 200
Content-Type: application/json; charset=UTF-8
```

you would create in your project following directory structure:
```
api/
    applications/
                 GET.json
```
with GET.json that would become the response:
```json
[
  {
    "id": 123456,
    "state": "APPROVED",
    ...
  },
  {
    "id": 123457,
    "state": "REJECTED",
    ...
  }
  ...
]
```
To add a sub-resource for:
`HTTP GET /api/applications/{id}`

you would simply create a sub-directory with the concrete id:
```
api/
    applications/
                 123456/
                        GET.json
                 GET.json
```
Similarly, you can create responses for other methods (POST.json, PUT.json, ...) or other content types (GET.pdf, GET.png, ...).

## Configuration

Configuration is handled via the `pluginOptions["serve-api-mocks"]` property of either the `vue.config.js`
file, or the `"vue"` field in `package.json`.

- **path**

  Required. Base URL path where API is located (for instance `/api`).

- **extensions**

  Optional. Array of extensions that the plugin should check while looking for the right mock. The default is `["json", "jpg", "html", "pdf", "png", "txt"]`.

- **routes**

  Optional. Array of route configs.

- **route.method**

  Optional. HTTP method the route matches. If not specified, the route matches all methods.

- **route.path**

  Optional. Path the route matches. Default: `"/"`.

- **route.relative**

  Optional. If relative, the path is joined with the base. Default: `true`.

- **route.callback**

  Function with following signature: `callback(req, res, next)`.

### Example Configuration

```js
// Inside vue.config.js
module.exports = {
  // ...other vue-cli plugin options...
  pluginOptions: {
    "serve-api-mocks": {
      base: "/api",
      routes: [
        {
					method: "PUT",
					path: "/*",
          callback(req, res) {
            res
              .status(200)
              .send("OK")
              .end();
          },
        },
        {
          path: "/redirect_uri",
          relative: false,
          callback(req, res) {
            res
              .status(200)
              .send("OK")
              .end();
          },
        },
      ],
    },
  },
};
```

## Installing in an Already Created Project

```sh
vue add serve-api-mocks
```
