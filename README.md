# File System App

A simple in-memory file system with command-line interface functionalities.

## Table of Contents

- [File System App](#file-system-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [Commands](#commands)
  - [Testing](#testing)

## Introduction

The File System App is an in-memory file system that supports various command-line interface operations such as creating directories, navigating through directories, listing contents, searching for patterns in files, displaying file contents, creating and copying files, and more.

## Features

- **mkdir**: Create a new directory.
- **cd**: Change the current directory.
- **ls**: List the contents of the current directory.
- **grep**: Search for a specified pattern in a file.
- **cat**: Display the contents of a file.
- **touch**: Create a new empty file.
- **echo**: Write text to a file.
- **mv**: Move a file or directory to another location.
- **cp**: Copy a file or directory to another location.
- **rm**: Remove a file or directory.

## Getting Started

To get started with the File System App, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ayush181000/inito-file-system
   ```

2. Change directory

   ```bash
   cd inito-file-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the app:

   ```bash
   npm start
   ```

## Usage

Once the app is running, you can use the command-line interface to interact with the file system. Refer to the Commands section for a list of available commands.

## Commands

- **mkdir [directoryName]**: Create a new directory.
- **cd [path]**: Change the current directory.
- **ls**: List the contents of the current directory.
- **grep [pattern] [file]**: Search for a specified pattern in a file.
- **cat [file]**: Display the contents of a file.
- **touch [fileName]**: Create a new empty file.
- **echo [text] > [file]**: Write text to a file.
- **mv [source] [destination]**: Move a file or directory to another location.
- **cp [source] [destination]**: Copy a file or directory to another location.
- **rm [file/directory]**: Remove a file or directory.

## Testing

To run tests, use the following command:

```bash
npm test
```
