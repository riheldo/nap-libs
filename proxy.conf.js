const PROXY_CONFIG = {
    "/noapi": {
        "target": "http://localhost:3001",
        "bypass": function (req, res, proxyOptions) {
            req.headers["unicorn-app"] = "onenet";
        }
    }
}

module.exports = PROXY_CONFIG;