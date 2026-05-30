import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const functionRoot = path.resolve(".vercel/output/functions/__server.func");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".mjs")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getRelativeTslibImport(filePath) {
  const tslibPath = path.join(functionRoot, "_libs", "tslib.mjs");
  let relativePath = path.relative(path.dirname(filePath), tslibPath);
  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }
  return relativePath.split(path.sep).join("/");
}

async function main() {
  const rootStats = await stat(functionRoot).catch(() => null);
  if (!rootStats?.isDirectory()) {
    console.log("Fixed Vercel runtime imports: skipped (no Vercel function output found)");
    return;
  }

  const files = await walk(functionRoot);
  let rewrittenFiles = 0;
  await Promise.all(
    files.map(async (filePath) => {
      const source = await readFile(filePath, "utf8");
      if (
        !source.includes('from "tslib"') &&
        !source.includes("from 'tslib'") &&
        !source.includes('import "tslib"') &&
        !source.includes("import 'tslib'")
      ) {
        return;
      }

      const replacement = getRelativeTslibImport(filePath);
      const updated = source
        .replaceAll('from "tslib"', `from "${replacement}"`)
        .replaceAll("from 'tslib'", `from '${replacement}'`)
        .replaceAll('import "tslib"', `import "${replacement}"`)
        .replaceAll("import 'tslib'", `import '${replacement}'`);

      if (updated !== source) {
        await writeFile(filePath, updated, "utf8");
        rewrittenFiles += 1;
      }
    }),
  );

  console.log(`Fixed Vercel runtime imports (${rewrittenFiles} files)`);
}

await main();
