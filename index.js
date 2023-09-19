#!/usr/bin/env node

import browserSync from "browser-sync";
import command from "./cli.js";
import {config} from "./config.js";
import fs from "fs";

command.parse(process.argv);

const options = command.opts();

const blankModeStyle = {
    match: /<link rel="stylesheet" media="all" href="https:\/\/cdn\.myshoptet\.com.*>/i,
    fn: function () {
        return "";
    },
};

const blankModeScript = {
    match: /<script src="https:\/\/cdn.myshoptet.com.*>/i,
    fn: function () {
        return "";
    },
};

const productionStyle = {
    match: /<link rel="stylesheet" href="\/user\/documents\/style.css">/i,
    fn: function () {
        return "";
    },
};

const productionScript = {
    match: /<script type="text\/javascript" src="\/user\/documents\/script.js"><\/script>/i,
    fn: function () {
        return "";
    },
};

const scriptStyle = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        const scriptContent = fs.readFileSync("./src/script.js", "utf8");
        const styleContent = fs.readFileSync("./src/style.css", "utf8");

        return (
            "<script>" +
            scriptContent +
            "</script><style>" +
            styleContent +
            "</style>" +
            match
        );
    }
};

const rewriteRules = [
    {...(options.production && productionStyle)},
    {...(options.production && productionScript)},
    {...scriptStyle},
    {...(options.blankMode && blankModeStyle)},
    {...(options.blankMode && blankModeScript)},
];

const bs = browserSync.create();
bs.init({
    proxy: {target: options.remote ?? config.defaultUrl},
    host: options.host ?? config.defaultHost,
    open: options.mode === "production" ? false : "local",
    watch: options.mode !== "production" ? options.watch : false,
    files:
        options.mode !== "production"
            ? [
                options.folder
                    ? "./" + options.folder + "/*"
                    : config.defaultFolder + "/*",
            ]
            : [],
    serveStatic: [options.folder ?? config.defaultFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    port: options.port ?? config.defaultPort,
    notify: options.notify,
});
