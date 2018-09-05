const Express = require("express");
const FS = require("fs");
const Path = require("path");

function rewrite(apiPath, extensions, req, next) {
	const url = req.url.split("?");
	const b = `${url[0]}/${req.method}`;
	const mapped = extensions.some(ext => {
		const resourcePath = `${b}.${ext}`;
		const filePath = Path.posix.join(apiPath, resourcePath);
		if (FS.existsSync(filePath)) {
			req.url = resourcePath;
			return true;
		}
		return false;
	});
	console.log(req.method, req.originalUrl, "→", mapped ? req.url : "not found");
	req.method = "GET";
	next();
}
module.exports = (api, projectOptions) => {
	api.configureDevServer((app, server) => {
		const config = projectOptions.pluginOptions["serve-api-mocks"];
		config.routes.forEach(route => {
			const relative = route.relative === undefined ? true : route.relative;
			let path = route.path || "/";
			if (relative) {
				path = Path.posix.join(config.base, path);
			}
			if (route.method) {
				app[route.method.toLowerCase()](path, route.callback);
			} else {
				app.use(path, route.callback);
			}
		});
		console.log(`\nserve-api-mocks: ${config.base}\n`);
		const apiPath = api.resolve(`.${config.base}`);
		const extensions = config.extensions || ["json", "jpg", "html", "pdf", "png", "txt"];
		app.use(config.base, (req, res, next) => rewrite(apiPath, extensions, req, next));
		// configure static api resources
		app.use(config.base, Express.static(apiPath));
	});
};
