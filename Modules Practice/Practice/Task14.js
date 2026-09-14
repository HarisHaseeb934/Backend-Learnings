const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function storeSecret(username, secretText) {
  let userId = crypto.randomUUID();
  let salt = crypto.randomBytes(16).toString("hex");

  let hash = crypto
    .createHash("sha256")
    .update(secretText + salt)
    .digest("hex");
  let jsonData = JSON.stringify({
    userId,
    username,
    salt,
    hash,
    createdAt: new Date(),
  });

  let fileName = `${username}.json`;
  let fileDir = path.join("secrets");

  try {
    if (!fs.existsSync(fileDir)) {
      await fs.promises.mkdir(fileDir, {recursive: true});
    }

    await fs.promises.writeFile(path.join(fileDir, fileName), jsonData, "utf-8")
  } catch (error) {
    console.log(error.message);
  }
}

storeSecret("haris", "mySuperSecretPassword123")