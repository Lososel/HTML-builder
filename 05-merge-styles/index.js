const fs = require("fs/promises");
const path = require("path");

async function mergeStyles() {
  const stylesDir = path.join(__dirname, "styles");
  const outputDir = path.join(__dirname, "project-dist");
  const outputFile = path.join(outputDir, "bundle.css");

  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(stylesDir, { withFileTypes: true });

  const cssFiles = entries
    .filter(entry => entry.isFile() && path.extname(entry.name) === ".css")
    .map(entry => path.join(stylesDir, entry.name));

  const styles = await Promise.all(
    cssFiles.map(async file => {
      const content = await fs.readFile(file, "utf-8");
      return content;
    })
  );

  await fs.writeFile(outputFile, styles.join("\n"));

  console.log("Styles merged successfully into bundle.css!");
}

mergeStyles();
