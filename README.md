# Nodeclean

Handy Global CLI utility for removing those pesky node_module folders. Simply run `nodeclean` in a parent folder and let it do its thing.

By default the command will filter 2 subdirectories of the current working directory and delete any node_module folders where the parent hasn't been edited in the last week.

CLI tool will always ask for confirmation before deleting and show you a list of file paths that will be deleted.

```
npm install @bpleco/nodeclean -g
```

## Options

- `-p --path` provide a parent directory as a path to nodeclean **default process.cwd()**
- `-d --depth` depth of subdirectories to search in **defaults 2**
- `-l --last-edit` only detect node_modules folders where the parent hasn't been edited in X amount of days. Pass 0 to delete regardless of last edit **default 7**
- `-b --build-dir` search for a build directory to also delete whilst looking for node_modules **default null**
- `-q --quick` doesn't take the time to calculate disk space used by folder, faster but hardly noticeable unless lots of folders to delete **default false**

## Examples

##### Delete node_modules within 2 subdirectories of parent and that subdirectory hasn't been edited with the last 7 days

```bash
nodeclean
```

##### Delete node_modules within 2 subdirectories of parent and that subdirectory hasn't been edited within the last 3 days

```bash
nodeclean -l 3
```

##### Delete node_modules within 5 subdirectories of parent and ignore the last time they were edited

```bash
nodeclean -d 5 -l 0
```

##### Delete node_modules within 25 subdirectories of parent and clean up build directories named 'dist' whilst there

```bash
nodeclean -d 5 -l 0 -b dist
```

## Final Thoughts

I wrote this CLI program as a fun first open source program. I was also tired of having gigabytes of node_module folders lying around on my computer. I hope you find it useful.

If you find any issues or bugs please let me know via Github issues.
