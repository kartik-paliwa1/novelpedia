import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = 'src';
const ALIAS = '@';

async function fixImports() {
  const files = await getFiles(SRC_DIR);
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      await processFile(file);
    }
  }
}

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function processFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  const fileDir = path.dirname(filePath);

  // Regex to find relative imports
  const importRegex = /from\s+['"](\..*?)['"]/g;
  let hasChanges = false;

  const newContent = content.replace(importRegex, (match, relativePath) => {
    try {
      // Resolve the absolute path of the imported module
      const absolutePath = path.resolve(fileDir, relativePath);

      // Make it relative to the src directory
      const srcPath = path.relative(path.resolve(SRC_DIR), absolutePath);

      // Create the new alias path
      let aliasPath = path.join(ALIAS, srcPath).replace(/\\/g, '/');

      // Remove .ts, .tsx, .js extensions
      aliasPath = aliasPath.replace(/\.(tsx|ts|js)$/, '');

      hasChanges = true;
      console.log(`Replacing '${relativePath}' with '${aliasPath}' in ${filePath}`);
      return `from '${aliasPath}'`;
    } catch (e) {
      console.error(`Could not resolve path: ${relativePath} in file: ${filePath}`);
      return match; // Return original match if resolution fails
    }
  });

  if (hasChanges) {
    await fs.writeFile(filePath, newContent, 'utf8');
  }
}

fixImports().catch(console.error);
