#!/usr/bin/env node

import browserSync from "browser-sync";
import command from "./cli.js";
import { config } from "./config.js";

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

const scriptStyle = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        if (options.mode === "production") {
            console.log("<script src='" +
            options.media +
            "script.js'></script><link rel='stylesheet' href='" +
            options.media +
            "style.css'>" +
            match)
            return (
                "<script src='" +
                options.media +
                "script.js'></script><link rel='stylesheet' href='" +
                options.media +
                "style.css'>" +
                match
            );
        } else {
            return (
                '<script src="/script.js"></script><link rel="stylesheet" href="/style.css">' +
                match
            );
        }
    },
};

const rewriteRules = [
    { ...scriptStyle }
];

const bs = browserSync.create();
bs.init({
    proxy: { target: options.remote ?? config.defaultUrl },
    host: options.host ?? config.defaultHost,
    open: false,
    watch: options.watch,
    files: [
        options.folder
            ? "./" + options.folder + "/*"
            : config.defaultFolder + "/*",
    ],
    serveStatic: [options.folder ?? config.defaultFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    port: options.port ?? config.defaultPort,
    notify: options.notify,
});
