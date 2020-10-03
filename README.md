# markdown-backup

Download remote images in markdown files and store them locally.

Images are stored in an `images` directory created by the tool itself.

**This application mutates your existing files.** Make sure to backup your files before giving it a go. I'm not resposible for loss of data. Take care and be well my friend.

There's a [guide on how to use it to with roam-to-git](#roam-to-git)


## Example

```
$ tree test
test
└── test.md

0 directories, 1 file

$ cat test/test.md
# markdown-backup
![alt](https://github.githubassets.com/images/icons/emoji/unicode/1f44b.png)

$ markdown-backup.js "test/*.md"
File path: test/*.md
Processing: test/test.md
Downloading: https://github.githubassets.com/images/icons/emoji/unicode/1f44b.png
Done!

$ tree test
test
├── images
│   └── 0.png
└── test.md

1 directory, 2 files

$ cat test/test.md
# markdown-backup
![alt](./images/0.png)
```

## Install

```
$ npm install -g markdown-backup
```

## Use

```
$ markdown-backup "**/*.md"
```

## [roam-to-git](https://github.com/MatthieuBizien/roam-to-git)

Add `markdown-download` after the `Run backup` step in `.github/workflows/main.yml`.

Should look like this:

```yaml
name: "Roam Research backup"

on:
  push:
    branches:
      - master
  schedule:
    -   cron: "0 0 * * *"

jobs:
  backup:
    runs-on: ubuntu-latest
    name: Backup
    timeout-minutes: 15
    steps:
      -   uses: actions/checkout@v2
      -   name: Set up Python 3.8
          uses: actions/setup-python@v1
          with:
            python-version: 3.8
      -   name: Install Python dependencies
          run: pip install git+https://github.com/MatthieuBizien/roam-to-git.git
      -   name: Set up Node
          uses: actions/setup-node@v2-beta
      -   name: Run backup
          run: roam-to-git --skip-git .
          env:
            ROAMRESEARCH_USER: ${{ secrets.ROAMRESEARCH_USER }}
            ROAMRESEARCH_PASSWORD: ${{ secrets.ROAMRESEARCH_PASSWORD }}
            ROAMRESEARCH_DATABASE: ${{ secrets.ROAMRESEARCH_DATABASE }}
      -   name: Download markdown images
          run: npx markdown-backup "markdown/**/*.md"
      -   name: Commit changes
          uses: elstudio/actions-js-build/commit@v3
          with:
            commitMessage: Automated snapshot
```
