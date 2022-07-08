# Nodeclean

Handy Global CLI utility for removing those pesky node_module folders. Simply run `nodeclean` in a parent folder and let it do its thing.

```
npm install @bpleco/nodeclean -g
```

## Options

- `-p --path` - Provide a parent directory as a path to nodeclean [default process.cwd()]
- `-d --depth` - Depth of subdirectories to search in [defaults 2]
- `-l --last-edit` - Only detect node_modules folders where the parent hasn't been edited in X amount of days. Pass 0 to delete regardless of last edit [default 7]
- `-b --build-dir` - Search for a build directory to also delete whilst looking for node_modules [default null]
- `-q --quick` - Doesn't take the time to calculate disk space used by folder, faster but hardly noticeable unless lots of folders to delete [default false]

## Examples

### Delete node_modules within 2 subdirectories of parent and that subdirectory hasn't been edited with the last 7 days

```bash
nodeclean
```

### Delete node_modules within 2 subdirectories of parent and that subdirectory hasn't been edited with the last 3 days

```bash
nodeclean -l 3
```

### Delete node_modules within 5 subdirectories of parent and ignore the last time they were edited

```bash
nodeclean -d 5 -l 0
```

### Delete node_modules within 25 subdirectories of parent and clean up build directories named 'dist' whilst there

```bash
nodeclean -d 5 -l 0 -b dist
```

I wrote this CLI program as a fun first open source program. I was also tired of having gigabytes of node_module folders lying around on my computer. I hope you find it useful.

If you find any issues or bugs please let me know via Github issues.
