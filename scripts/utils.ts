import { promisify } from "node:util";
import { exec as execRaw } from "node:child_process";

export const exec = promisify(execRaw);

export type PkgJson = {
    name: string;
    version: string;
    dependencies: Map<string, string>;
};

/**
 * @returns a properly typed object of a package.json.
 */
export function parsePkgJson(content: string): PkgJson {
    const rawPkgJson = JSON.parse(content);
    const dependencies: Map<string, string> = new Map(
        Object.entries(rawPkgJson.dependencies ?? {}),
    );

    return { ...rawPkgJson, dependencies };
}

/**
 * @returns list of tags sorted by date: most recent tag appear first.
 */
export async function getSortedTags(): Promise<string[]> {
    const { stdout } = await exec('git tag --list "--sort=-*committerdate"');

    const trimmed = stdout.trim();

    if (trimmed === "") {
        return [];
    }

    const lastTags = trimmed.split("\n");

    return lastTags;
}

/**
 * @returns true if git detects differences for `dir` between `sinceTag` and HEAD.
 */
export async function hasChangedSince(sinceTag: string, dir: string): Promise<boolean> {
    const { stdout } = await exec(`git diff --quiet ${sinceTag}..HEAD ${dir} ; echo $?`);

    const changed = stdout.trim() === "1";

    return changed;
}

/**
 * @returns an array of formatted commits that modified files at path `dir` since tag `sinceTag`.
 */
export async function commitsSince(sinceTag: string, dir: string): Promise<string[]> {
    const { stdout } = await exec(`git log --follow ${sinceTag}..HEAD --format="%h: %s" -- ${dir}`);

    const trimmed = stdout.trim();

    if (trimmed === "") {
        return [];
    }

    const commits = trimmed.split("\n");

    return commits;
}

/**
 * @returns the content of file at `filePath` from tag `tag`.
 */
export async function getFileAt(tag: string, filePath: string) {
    const { stdout } = await exec(`git show ${tag}:${filePath}`);

    const fileContent = stdout.trim();

    return fileContent;
}
