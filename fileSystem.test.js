// import FileSystem from './fileSystem.js';
const FileSystem = require('./fileSystem.js');

describe('FileSystem', () => {
    let fileSystem;

    beforeEach(() => {
        fileSystem = new FileSystem();
        // Mock console.log to spy on its calls
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore the original console.log after each test
        consoleSpy.mockRestore();
    });

    test('mkdir creates a new directory', () => {
        fileSystem.mkdir('newDir');
        expect(fileSystem.currentDirectory.contents['newDir'].type).toBe('directory');
    });

    test('cd changes the current directory', () => {
        fileSystem.mkdir('newDir');
        fileSystem.cd('newDir');
        expect(fileSystem.currentDirectory.name).toBe('newDir');
    });


    // Add similar tests for other functionalities such as grep, cat, touch, echo, mv, etc.

    // test('mv moves a file to another location', () => {
    //     fileSystem.mkdir('dir1');
    //     fileSystem.touch('file.txt');
    //     fileSystem.mv('file.txt', 'dir1');
    //     expect(fileSystem.currentDirectory.contents['file.txt']).toBeUndefined();
    //     expect(fileSystem.currentDirectory.contents['dir1'].contents['file.txt'].type).toBe('file');
    // });

    test('cp copies a file to another location', () => {
        fileSystem.mkdir('dir1');
        fileSystem.touch('file.txt');
        fileSystem.cp('file.txt', 'dir1');
        expect(fileSystem.currentDirectory.contents['dir1'].contents['file.txt'].type).toBe('file');
    });

    test('rm removes a file or directory', () => {
        fileSystem.mkdir('dir1');
        fileSystem.touch('file.txt');
        fileSystem.rm('file.txt');
        expect(fileSystem.currentDirectory.contents['file.txt']).toBeUndefined();
        fileSystem.rm('dir1');
        expect(fileSystem.currentDirectory.contents['dir1']).toBeUndefined();
    });

    test('grep searches for a pattern in a file', () => {
        fileSystem.touch('file.txt');
        fileSystem.echo('Hello, world!', 'file.txt');

        // Call grep
        fileSystem.grep('Hello', 'file.txt');

        // Check if console.log was called with the expected results
        expect(consoleSpy).toHaveBeenCalledWith('Hello, world!');
    });

    test('cat displays the contents of a file and echo writes to the file', () => {
        fileSystem.touch('file.txt');
        fileSystem.echo('Content of the file.', 'file.txt');

        // Call cat
        fileSystem.cat('file.txt');

        // Check if console.log was called with the expected results
        expect(consoleSpy).toHaveBeenCalledWith('Content of the file.\n');
    });

    test('touch creates a new empty file', () => {
        // Call touch
        fileSystem.touch('newFile.txt');

        // Check if the file was created
        expect(fileSystem.currentDirectory.contents['newFile.txt'].type).toBe('file');
    });

});
