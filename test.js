const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");

const TEST_FILE = "./test/test.md";

fs.writeFileSync(
  TEST_FILE,
  `# markdown-backup
![alt](https://github.githubassets.com/images/icons/emoji/unicode/1f44b.png)`,
  "utf8"
);

childProcess.spawnSync("./markdown-backup.js", ["test/**.md"], {
  stdio: "inherit",
});

const output = fs.readFileSync(TEST_FILE, "utf8");

assert.strictEqual(
  output,
  `# markdown-backup
![alt](./images/0.png)`
);
