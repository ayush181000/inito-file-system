In this simplified version, the file system is represented using a plain JavaScript object (`fileSystem`). The object has the following structure:

1. **Root Directory:**

   - The root directory is represented by the `'/'` key in the object.
   - It contains a plain object with properties to represent a directory.
   - Properties include:
     - `type`: A string indicating the type of the item ('directory' in this case).
     - `contents`: An object that represents the items (files and subdirectories) within the directory.
     - `parent`: A reference to the parent directory. For the root directory, this is set to `null` as it has no parent.

2. **Directories and Files:**
   - Each directory or file within the file system is represented as a property of the `contents` object.
   - Directories are represented by plain objects with similar properties (type, contents, parent).
   - Files are represented similarly, but they may have additional properties like `content` to store file content.

Here's a simplified example of the structure:

```javascript
const fileSystem = {
  '/': {
    type: 'directory',
    contents: {
      'docs': {
        type: 'directory',
        contents: {
          'readme.txt': {
            type: 'file',
            content: 'This is a readme file.',
            parent: /* reference to 'docs' directory */,
          },
        },
        parent: /* reference to '/' directory */,
      },
    },
    parent: null,
  },
};
```
