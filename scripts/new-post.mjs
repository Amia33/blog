import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { access, mkdir, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashDemoAnswer } from "../lib/demo-answer.ts";
import {
  isValidPostDate,
  isValidPostSlug,
  resolveCoverPath,
  resolvePostPath,
  slugifyTitle,
} from "../lib/content/post-scaffold.ts";

const root = process.cwd();
const protectedMode = process.argv.includes("--demo-gated");
const args = process.argv.slice(2).filter((arg) => arg !== "--demo-gated");
const postsDirectory = path.join(
  root,
  "content/posts",
  protectedMode ? "protected" : "public",
);

function yaml(value) {
  return JSON.stringify(value);
}

function promptHidden(promptText) {
  return new Promise((resolve) => {
    stdout.write(`${promptText}: `);
    stdin.setRawMode?.(true);
    let value = "";
    const onData = (chunk) => {
      const char = chunk.toString("utf8");
      if (char === "\u0003") process.exit(130);
      if (char === "\r" || char === "\n") {
        stdin.off("data", onData);
        stdin.setRawMode?.(false);
        stdout.write("\n");
        resolve(value);
        return;
      }
      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };
    stdin.on("data", onData);
    stdin.resume();
  });
}

const rl = createInterface({ input: stdin, output: stdout });
try {
  const title = args[0] ?? (await rl.question("Title: ")).trim();
  const initialSlug = slugifyTitle(title);
  const slug =
    (
      await rl.question(`Slug${initialSlug ? ` (${initialSlug})` : ""}: `)
    ).trim() || initialSlug;
  if (!isValidPostSlug(slug))
    throw new Error("Use an explicit ASCII slug such as my-post.");

  const date =
    (
      await rl.question(`Date (${new Date().toISOString().slice(0, 10)}): `)
    ).trim() || new Date().toISOString().slice(0, 10);
  if (!isValidPostDate(date))
    throw new Error("Date must be a valid YYYY-MM-DD date.");
  const summary = (await rl.question("Summary: ")).trim();
  const category = (await rl.question("Category (lowercase-ascii): ")).trim();
  const tags = (await rl.question("Tags (comma-separated): "))
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const cover = protectedMode
    ? ""
    : (await rl.question("Cover path under content/assets/public: ")).trim();

  if (!title || title.length > 120)
    throw new Error("Title is required and must be 120 characters or fewer.");
  if (!summary || summary.length > 240)
    throw new Error("Summary is required and must be 240 characters or fewer.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category))
    throw new Error(
      "Category must use lowercase ASCII words separated by hyphens.",
    );
  if (tags.length === 0 || tags.some((tag) => /[\r\n]/.test(tag)))
    throw new Error("Enter at least one valid tag.");

  let coverField = "";
  if (!protectedMode) {
    const coverRoot = await realpath(path.join(root, "content/assets/public"));
    const coverPath = resolveCoverPath(root, cover);
    const resolvedCover = await realpath(coverPath);
    if (!resolvedCover.startsWith(`${coverRoot}${path.sep}`))
      throw new Error("Cover must be inside content/assets/public.");
    await access(resolvedCover);
    coverField = `cover: ${path.relative(postsDirectory, resolvedCover).split(path.sep).join("/")}\n`;
  }

  let frontmatter = `---\ntitle: ${yaml(title)}\nslug: ${slug}\ndate: ${date}\nsummary: ${yaml(summary)}\ncategory: ${category}\ntags:\n${tags.map((tag) => `  - ${yaml(tag)}`).join("\n")}\n${coverField}`;
  let body = `\n## ${title}\n\nWrite your fictional sample post here.\n`;

  if (protectedMode) {
    const question = (await rl.question("Synthetic demo question: ")).trim();
    rl.close();
    const answer = await promptHidden("Synthetic demo answer (will be hashed)");
    if (!question || !answer || answer.length > 256)
      throw new Error(
        "Question and a 1-256 character synthetic answer are required.",
      );
    const answerHash = await hashDemoAnswer(answer);
    frontmatter += `question: ${yaml(question)}\nanswerHash: ${yaml(answerHash)}\n`;
    body = `\nThis is a fictional demo body. This public file and its verifier are visible in Git; do not put real or confidential material here.\n`;
  }

  frontmatter += "---\n";
  await mkdir(postsDirectory, { recursive: true });
  const file = resolvePostPath(root, slug, protectedMode);
  await writeFile(file, `${frontmatter}${body}`, { flag: "wx" });
  console.log(`Created ${path.relative(root, file)}`);
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Could not create post.",
  );
  process.exitCode = 1;
} finally {
  rl.close();
}
