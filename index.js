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
    try {
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
                case 'help':
                    help();
                    break;
                default:
                    console.log('Unknown command. Type "help" for a list of commands.');
            }

            rl.prompt();
        }).on('close', () => {
            console.log('Exiting CLI...');
            process.exit(0);
        });
    } catch (error) {
        console.log("Wrong prompt. Please check commands list.")
    }

}

function help() {
    console.log(`
      The File System App provides the following commands:

      - mkdir [directoryName]: Create a new directory.
      - cd [path]: Change the current directory.
      - ls: List the contents of the current directory.
      - grep [pattern] [file]: Search for a specified pattern in a file.
      - cat [file]: Display the contents of a file.
      - touch [fileName]: Create a new empty file.
      - echo [text] > [file]: Write text to a file.
      - mv [source] [destination]: Move a file or directory to another location.
      - cp [source] [destination]: Copy a file or directory to another location.
      - rm [file/directory]: Remove a file or directory.
      - help: Display information about available commands.

      Usage:
      - To use a command, type it in the terminal. For example:
        - mkdir newDirectory
      - For more detailed information on a specific command, type:
        - <command> --help

      Examples:
      - Create a new directory: mkdir myFolder
      - Change the current directory: cd path/to/directory
      - List the contents of the current directory: ls
      - Search for a pattern in a file: grep "pattern" file.txt
      - Display the contents of a file: cat file.txt
      - Create a new empty file: touch newFile.txt
      - Write text to a file: echo "Hello, world!" > greeting.txt
      - Move a file or directory: mv source.txt destination/
      - Copy a file or directory: cp source.txt destination/
      - Remove a file or directory: rm file.txt
      - Display help information: help
    `);
}
