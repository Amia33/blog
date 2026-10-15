import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const forbidden = [
  "This is synthetic demonstration text only.",
  "moon-paper-7",
  "$argon2id$v=19$m=65536,p=4,t=3$aS1XLID7VoYvpONnc5rqTQ$OwWXUhMNUIpg2D82TrONy+RQd0TsHzvqgQjahSzHQBc",
];

async function files(directory, required = false) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (required) throw error;
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? files(file) : [file];
    }),
  );
  return nested.flat();
}

test("protected demo body and answer hash do not enter public generated output", async () => {
  const publicFiles = [
    ...(await files(path.join(root, ".velite"), true)),
    ...(await files(path.join(root, ".next/server/app"))),
    ...(await files(path.join(root, ".next/static"))),
    ...(await files(path.join(root, "public/static"), true)),
  ];
  assert.ok(publicFiles.length > 0, "No generated public output was scanned");

  for (const file of publicFiles) {
    let contents;
    try {
      contents = await readFile(file, "utf8");
    } catch {
      continue;
    }
    for (const sentinel of forbidden) {
      assert.equal(
        contents.includes(sentinel),
        false,
        `Found gated sentinel in ${file}`,
      );
    }
  }
});
