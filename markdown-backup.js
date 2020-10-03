#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const pReplace = require("string-replace-async");
const fetch = require("node-fetch");

if (process.argv.length !== 3) {
  console.log("Usage: markdown-backup ./dir/*.md");
  process.exit(0);
}

const [, , filePath] = process.argv;

console.log(`File path: ${filePath}`);

const fileNames = glob.sync(filePath);

Promise.all(
  fileNames.map(async (filePath, index) => {
    console.log(`Processing: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");
    const { dir: fileDir } = path.parse(filePath);
    const imagesDir = `${fileDir}/images`
    try {
      fs.mkdirSync(imagesDir);
    } catch (e) {
      // It's okay if the directory already exists
      if (e.code === "EEXIST") {
      } else {
        console.log(e);
        process.exit(1);
      }
    }

    const transformed = await pReplace(
      content,
      /!\[[^\]]*\]\(([^)]*)\)/g,
      async (match, url, ...rest) => {
        const res = await fetch(url);
        const contentType = res.headers.get("content-type");
        const extension = contentType.split("/")[1];
        const destImagePath = `${imagesDir}/${index}.${extension}`;
        const dest = fs.createWriteStream(destImagePath);
        await res.body.pipe(dest);
        await new Promise((res, rej) => {
          dest.on("finish", res);
        });
        return match.replace(url, `./${path.relative(fileDir, destImagePath)}`);
      }
    );
    fs.writeFileSync(filePath, transformed, "utf8");
  })
)
  .then(() => console.log("Done!"))
  .catch(console.error);
