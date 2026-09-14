const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

class DirectoryWatcher extends EventEmitter {
  constructor() {
    super();
  }

  async watchAndCopy(sourceFile, targetDir) {
    const targetFile = path.join(targetDir, "file.txt");
    try {
      if (!fs.existsSync(sourceFile)) {
        throw new Error("Source file missing");
      }
      // const data = await fs.readFile(sourceFile, "utf-8");
      await fs.promises.mkdir(path.join(targetDir), { recursive: true });
      const targetFile = path.join(targetDir, `mirror_${Date.now()}.txt`);
      await fs.promises.copyFile(sourceFile, targetFile);
    //   console.log("running");
      this.emit("copied", {
        originalPath: sourceFile,
        newPath: path.join(targetDir, "mirror.txt"),
        copiedAt: new Date(),
      });
    } catch (error) {
      this.emit("error", error);
    }
  }
}

const dw = new DirectoryWatcher();
dw.on("copied", ({ originalPath, newPath, copiedAt }) => {
  console.log(`File Orignal Path: ${originalPath}`);
  console.log(`File New Path: ${newPath}`);
  console.log(`Caopied At: ${copiedAt}`);
});

dw.on("error", (error) => {
  console.log(error.message);
});

dw.watchAndCopy("raw_access.log", __dirname);
