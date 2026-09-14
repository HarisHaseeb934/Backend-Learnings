const fs = require("fs/promises");
const path = require("path");

const batchProcess = async () => {
  try {
    await fs.mkdir(path.join("data_logs"), { recursive: true });
    await Promise.all([
      fs.writeFile(path.join("data_logs", "t1.txt"), "File 1", "utf-8"),
      fs.writeFile(path.join("data_logs", "t2.txt"), "File 2", "utf-8"),
      fs.writeFile(path.join("data_logs", "t3.txt"), "File 3", "utf-8"),
    ]);
  } catch (err) {
    console.log(err);
  }
};

batchProcess()