const path = require('path');
const { program, Option } = require('commander');
const { readFileSync, writeFileSync } = require('fs');
const semverInc = require('semver/functions/inc');
const semverParse = require('semver/functions/parse');

const types = ['major', 'minor', 'patch'];
const t = new Option('-t, --type <type>').choices(types).makeOptionMandatory();
program.addOption(t);
program.parse();

console.log('Options: ', program.opts());

const read = path => JSON.parse(readFileSync(path, 'utf-8'));
const write = (path, obj) => writeFileSync(path, JSON.stringify(obj, null, 2));

const rootName = path.resolve(__dirname, 'package.json');
const serverName = path.resolve(__dirname, 'server', 'package.json');
const clientName = path.resolve(__dirname, 'client', 'package.json');

const root = read(rootName);
const oldVersion = semverParse(root.version);
if (!oldVersion) throw new Error('Could not read old version');

const newVersion = semverInc(oldVersion, program.opts().type);
root.version = newVersion;
write(rootName, root);

const server = read(serverName);
server.version = newVersion;
write(serverName, server);

const client = read(serverName);
client.version = newVersion;
write(clientName, client);
