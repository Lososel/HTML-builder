const fs = require("fs/promises");
const path = require("path");

async function listFilesInSecretFolder() {
  const folderPath = path.join(__dirname, "secret-folder");

  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = path.join(folderPath, entry.name);

        const stats = await fs.stat(filePath);

        const fileName = path.basename(entry.name, path.extname(entry.name));
        const fileExtension = path.extname(entry.name).slice(1);

        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error("Error reading the folder:", err.message);
  }
}

listFilesInSecretFolder();
