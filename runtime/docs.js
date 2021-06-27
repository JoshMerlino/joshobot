"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const extract_zip_1 = __importDefault(require("extract-zip"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = require("path");
async function runtime(app) {
    const insomnia = path_1.resolve("insomnia.json");
    if (!fs_1.existsSync(insomnia))
        return;
    const binary = path_1.resolve("lib/insomnia-viewer.zip");
    const insomniaViewer = path_1.resolve("lib/insomnia-viewer-site");
    await node_fetch_1.default("https://github.com/JoshMerlino/insomnia-viewer/archive/refs/heads/site.zip")
        .then(resp => resp.arrayBuffer())
        .then(resp => promises_1.writeFile(binary, Buffer.from(resp), "binary"));
    await extract_zip_1.default(binary, { dir: path_1.resolve(insomniaViewer, "..") });
    app.use("/insomnia.json", (_req, res) => res.sendFile(insomnia));
    app.use("/docs", express_1.default.static(insomniaViewer));
    app.use("/docs/**", (_req, res) => res.sendFile(path_1.resolve(insomniaViewer, "index.html")));
}
exports.default = runtime;
//# sourceMappingURL=docs.js.map