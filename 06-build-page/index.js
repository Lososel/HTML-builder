const fs = require("fs/promises");
const path = require("path");

async function buildPage() {
  const projectDist = path.join(__dirname, "project-dist");
  const templateFile = path.join(__dirname, "template.html");
  const componentsDir = path.join(__dirname, "components");
  const stylesDir = path.join(__dirname, "styles");
  const assetsSrcDir = path.join(__dirname, "assets");
  const assetsDestDir = path.join(projectDist, "assets");

  await fs.mkdir(projectDist, { recursive: true });

  let templateContent = await fs.readFile(templateFile, "utf-8");
  const componentTags = templateContent.match(/{{\s*\w+\s*}}/g) || [];

  for (const tag of componentTags) {
    const componentName = tag.replace(/{{\s*|\s*}}/g, "");
    const componentFile = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await fs.readFile(componentFile, "utf-8");
      templateContent = templateContent.replace(tag, componentContent);
    } catch (err) {
      console.error(`Component file not found: ${componentName}.html`);
    }
  }

  await fs.writeFile(path.join(projectDist, "index.html"), templateContent);

  const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });
  const styles = await Promise.all(
    styleFiles
      .filter(file => file.isFile() && path.extname(file.name) === ".css")
      .map(async file => fs.readFile(path.join(stylesDir, file.name), "utf-8"))
  );

  await fs.writeFile(path.join(projectDist, "style.css"), styles.join("\n"));

  async function copyAssets(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  await copyAssets(assetsSrcDir, assetsDestDir);

  console.log("Page built successfully!");
}

buildPage().catch(err => console.error("Error building page:", err));
