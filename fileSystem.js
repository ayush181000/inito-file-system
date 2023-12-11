const chalk = require("chalk");
const fs = require('fs');

module.exports = class FileSystem {
    constructor(loadState = false) {
        if (loadState) {
            this.loadState();
        } else {
            this.root = this.createDirectory("/");
        }
        this.currentDirectory = this.root;
    }

    log() {
        console.log('Current File System State:');
        console.log(this.root);
    }

    saveState() {
        const circularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return '[Circular Reference]';
                    }
                    seen.add(value);

                    if (value.type === 'directory') {
                        return {
                            type: 'directory',
                            name: value.name,
                            contents: value.contents,
                            parent: value.parent ? value.parent.name : null,
                        };
                    } else if (value.type === 'file') {
                        return {
                            type: 'file',
                            name: value.name,
                            content: value.content,
                        };
                    }
                }
                return value;
            };
        };

        const state = JSON.stringify(this.root, circularReplacer(), 2);
        fs.writeFileSync('filesystem_state.json', state, 'utf-8');
        console.log('File system state saved successfully.');
    }

    loadState() {
        try {
            const state = fs.readFileSync('filesystem_state.json', 'utf-8');
            const parsedState = JSON.parse(state, (key, value) => {
                if (key === 'parent' && value) {
                    return this.findItem(value);
                }
                return value;
            });

            if (parsedState && parsedState.type === 'directory') {
                this.root = this.reconstructFileSystem(parsedState);
                console.log('File system state loaded successfully.');
            } else {
                console.log('Invalid file system state format.');
            }
        } catch (err) {
            console.log('Error loading file system state:', err.message);
        }
    }

    reconstructFileSystem(data) {
        const reconstructItem = (itemData) => {
            if (itemData.type === 'directory') {
                const reconstructedDir = this.createDirectory(itemData.name);

                // Ensure contents is an object
                reconstructedDir.contents = itemData.contents || {};

                // Recursively reconstruct contents
                for (const itemName in reconstructedDir.contents) {
                    reconstructedDir.contents[itemName] = reconstructItem(reconstructedDir.contents[itemName]);
                    reconstructedDir.contents[itemName].parent = reconstructedDir;
                }

                return reconstructedDir;
            } else if (itemData.type === 'file') {
                return this.createFile(itemData.name, itemData.content);
            }

            return null; // Invalid item type
        };

        return reconstructItem(data);
    }

    createDirectory(name) {
        return {
            type: "directory",
            name: name,
            contents: {},
        };
    }

    createFile(name, content = "") {
        return {
            type: "file",
            name: name,
            content: content,
        };
    }

    getPathComponents(path) {
        return path.split("/").filter((component) => component !== "");
    }

    findItem(path) {
        const components = this.getPathComponents(path);
        let current = this.currentDirectory;

        for (const component of components) {
            if (component === "..") {
                current = current.parent || current;
            } else if (component === "~") {
                current = this.root;
            } else {
                current = current.contents[component];
                if (!current || (current.type !== "file" && current.type !== "directory")) {
                    return null; // Not a valid file or directory path
                }
            }
        }

        return current;
    }

    mkdir(name) {
        if (!name) {
            console.log("Invalid directory name");
            return;
        }

        if (this.currentDirectory.contents[name]) {
            console.log(`Directory '${name}' already exists`);
            return;
        }

        this.currentDirectory.contents[name] = this.createDirectory(name);
        this.currentDirectory.contents[name].parent = this.currentDirectory;
    }

    cd(path) {
        const target = this.findItem(path);

        if (target && target.type === "directory") {
            this.currentDirectory = target;
        } else {
            console.log("Invalid directory path");
        }
    }

    ls(path = "") {
        const target = this.findItem(path);
        const directory = target || this.currentDirectory;

        Object.keys(directory.contents).forEach((item) => {
            const itemPath = path === '/' ? `/${item}` : `${path}/${item}`;
            if (directory.contents[item].type === "file") {
                console.log(chalk.yellow(itemPath));
            } else if (directory.contents[item].type === "directory") {
                console.log(chalk.green(itemPath));
            }
        });
    }

    cat(path) {
        const target = this.findItem(path);

        if (target) {
            if (target.type === "file") {
                console.log(target.content);
            } else if (target.type === "directory") {
                Object.keys(target.contents).forEach((item) => {
                    const itemPath = path === '/' ? `/${item}` : `${path}/${item}`;
                    console.log(`\nContents of ${itemPath}:\n`);
                    this.cat(itemPath); // Recursive call for files in the directory
                });
            } else {
                console.log("Invalid file or directory path");
            }
        } else {
            console.log("Invalid file or directory path");
        }
    }

    touch(name) {
        if (!name) {
            console.log("Invalid file name");
            return;
        }

        if (this.currentDirectory.contents[name]) {
            console.log(`File '${name}' already exists`);
            return;
        }

        this.currentDirectory.contents[name] = this.createFile(name);
    }

    echo(content, path) {
        const target = this.findItem(path);

        if (target && target.type === "file") {
            target.content = content + '\n'; // Overwrite the existing content
        } else {
            const components = this.getPathComponents(path);
            const filename = components.pop();
            const directoryPath = components.join('/');

            const directory = this.findItem(directoryPath);

            if (directory && directory.type === "directory") {
                directory.contents[filename] = this.createFile(filename, content + '\n');
            } else {
                console.log("Invalid file path");
            }
        }
    }

    mv(sourcePath, destinationPath) {
        const source = this.findItem(sourcePath);
        const destination = this.findItem(destinationPath);

        if (source && destination && destination.type === 'directory') {
            // Ensure source and destination are not the same
            if (source === destination) {
                console.log('Source and destination are the same.');
                return;
            }

            // Ensure the source is not an ancestor of the destination
            let ancestor = destination;
            while (ancestor) {
                if (ancestor === source) {
                    console.log('Destination is a subdirectory of the source.');
                    return;
                }
                ancestor = ancestor.parent;
            }

            // Move the source to the destination
            if (source.parent.contents[source.name]) {
                destination.contents[source.name] = source;
                delete source.parent.contents[source.name];
                source.parent = destination;

                console.log(`Moved ${source.type} "${source.name}" to ${destinationPath}`);
            } else {
                console.log(`Error: ${sourcePath} not found.`);
            }
        } else {
            console.log('Invalid source or destination path.');
        }
    }


    cp(sourcePath, destinationPath) {
        const source = this.findItem(sourcePath);
        const destination = this.findItem(destinationPath);

        if (source && destination && destination.type === 'directory') {
            const copy = deepClone(source);
            destination.contents[source.name] = copy;

            console.log(`Copied ${source.type} "${source.name}" to ${destinationPath}`);
        } else {
            console.log('Invalid source or destination path');
        }
    }

    rm(path) {
        const target = this.findItem(path);

        if (target) {
            if (target.type === "directory") {
                delete target.parent.contents[target.name];
            } else {
                delete this.currentDirectory.contents[target.name];
            }
        } else {
            console.log("Invalid file or directory path");
        }
    }

    grep(pattern, path) {
        const target = this.findItem(path);

        if (target && target.type === "file") {
            const lines = target.content.split("\n");
            const matchingLines = lines.filter((line) => line.includes(pattern));
            matchingLines.forEach((line) => console.log(line));
        } else {
            console.log("Invalid file path");
        }
    }
}

function deepClone(obj, clonedObjects = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (clonedObjects.has(obj)) {
        return clonedObjects.get(obj);
    }

    const clone = Array.isArray(obj) ? [] : {};

    clonedObjects.set(obj, clone);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key], clonedObjects);
        }
    }

    return clone;
}
