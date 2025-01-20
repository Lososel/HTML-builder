const fs = require("fs/promises");
const path = require("path");

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error("Error copying directory:", err.message);
  }
}

async function clearDir(dir) {
  try {
    await fs.access(dir);

    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        await fs.unlink(entryPath);
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Error clearing directory:", err.message);
    }
  }
}

async function main() {
  const src = path.join(__dirname, "files");
  const dest = path.join(__dirname, "files-copy");

  await clearDir(dest);

  await copyDir(src, dest);

  console.log("Directory copied successfully!");
}

main();
