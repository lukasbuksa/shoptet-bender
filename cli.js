import { Command } from 'commander';
import { packageInfo } from './config.js';

const command = new Command();

command
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

command
    .option('-r, --remote <url>', 'URL of the remote Eshop with https:// prefix')
    .option('-w, --watch', 'watch for changes and reload the page', true)
    .option('-b, --blankMode', 'simulate the blank template.', false)
    .option('-n, --notify', 'display pop-over notifications in the browser', false)
    .option('-hs, --host', 'sets the URL of host');

export default command;
