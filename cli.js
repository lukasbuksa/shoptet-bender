import { Command } from 'commander';
import { packageInfo } from './config.js';

const command = new Command();

command
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

command
    .option('-r, --remote <url>', 'URL of the remote Eshop with https:// prefix')
    .option('-hs, --host <url>', 'sets the URL of host')
    .option('-p, --port <number>', 'sets the port number')
    .option('-m, --mode <mode>', 'sets the mode of package')
    .option('-w, --watch', 'watch for changes and reload the page', true)
    .option('-b, --blankMode', 'simulate the blank template.', false)
    .option('-n, --notify', 'display pop-over notifications in the browser', false)
    .option('-v, --production', 'enable production mode scripts rewrites', false);

export default command;

