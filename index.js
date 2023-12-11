const readline = require('readline');
const FileSystem = require('./fileSystem.js');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>',
});

let fileSystem = null;

function updatePrompt() {
    const currentDirPath = getCurrentDirPath(fileSystem.currentDirectory);
    rl.setPrompt(`${chalk.green(currentDirPath)}> `);
    rl.prompt();
}

function getCurrentDirPath(directory) {
    const components = [];
    while (directory) {
        components.unshift(directory.name);
        directory = directory.parent;
    }

    if (components.length > 0) {
        let s = components.shift()
        return s + components.join('/');
    }

    return '/';
}

function confirmExit() {
    rl.question('Do you want to save the state before exit? (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            console.log("Trying to save state")
            fileSystem.saveState();
            rl.close();
        } else {
            rl.close();
        }
    });
}

function confirmLoadState() {
    rl.question('Do you want to load previous state (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            console.log("Loading previous state");
            fileSystem = new FileSystem(true);
        } else {
            fileSystem = new FileSystem(false);
        }
        startCLI();
    });
}


confirmLoadState();

function startCLI() {
    updatePrompt();
    rl.on('line', (line) => {
        const args = line.trim().split(/\s+/);
        const command = args.shift();

        switch (command) {
            case 'mkdir':
                fileSystem.mkdir(args[0]);
                break;
            case 'cd':
                fileSystem.cd(args[0]);
                updatePrompt();
                break;
            case 'ls':
                fileSystem.ls(args[0]);
                break;
            case 'grep':
                fileSystem.grep(args[0], args[1]);
                break;
            case 'cat':
                fileSystem.cat(args[0]);
                break;
            case 'touch':
                fileSystem.touch(args[0]);
                break;
            case 'echo':
                fileSystem.echo(args.slice(1).join(' '), args[0]);
                break;
            case 'mv':
                fileSystem.mv(args[0], args[1]);
                break;
            case 'cp':
                fileSystem.cp(args[0], args[1]);
                break;
            case 'rm':
                fileSystem.rm(args[0]);
                break;
            case 'save':
                fileSystem.saveState();
                break;
            case 'load':
                fileSystem.loadState();
                break;
            case 'exit':
                confirmExit();
                break;
            case 'log':
                fileSystem.log();
                break;
            default:
                console.log('Unknown command. Type "help" for a list of commands.');
        }

        rl.prompt();
    }).on('close', () => {
        console.log('Exiting CLI...');
        process.exit(0);
    });
}


