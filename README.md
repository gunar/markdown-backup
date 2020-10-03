# markdown-backup

Download remote images in markdown files and store them locally.

**This application mutates your existing files.** Make sure to backup your files before giving it a go. I'm not resposible for loss of data. Take care and be well my friend.

Images are stored in an `images` directory created by the tool itself.

## Example

```
$ tree test
test
└── test.md

0 directories, 1 file

$ markdown-backup.js "test/*.md"
File path: test/*.md
Processing: test/test.md
Done!

$ tree test
test
├── images
│   └── 0.png
└── test.md

1 directory, 2 files
```

## Install

```
$ npm install -g markdown-backup
```

## Use

```
$ markdown-backup "**/*.md"
```
