/**
 * **CAUTION**: This script should only be executed if `check-versions` was run without returning
 * any errors.
 */
import { statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { Command } from "commander";

import { exec, getFileAt, getSortedTags, parsePkgJson } from "@/utils";

// This script makes the assumption that every member of the workspace are contained at the root of
// `PACKAGES_PATH`.
const PACKAGES_PATH = "./packages";

export async function createTag(name: string, message?: string) {
    await exec(`git tag -a "${name}" ${message ? `-m "${message}"` : ""}`);

    return name;
}

export async function pushTag(name: string) {
    await exec(`git push origin ${name}`);
}

async function getReleaseTag(sinceTag: string): Promise<string> {
    const pkgPaths = (await readdir(PACKAGES_PATH))
        .map((dir) => join("packages", dir))
        .filter((path) => statSync(path).isDirectory());

    const updates: string[] = [];

    for (const path of pkgPaths) {
        const pkgJsonPath = join(path, "package.json");

        const oldPkgJson = parsePkgJson(await getFileAt(sinceTag, pkgJsonPath));
        const newPkgJson = parsePkgJson((await readFile(pkgJsonPath)).toString());

        if (oldPkgJson.version !== newPkgJson.version) {
            updates.push(`${newPkgJson.name}-v${newPkgJson.version}`);
        }
    }

    const releaseTag = updates.join(",");

    return releaseTag;
}

(async () => {
    console.log("Starting create-release...");

    type Options = {
        commit?: string;
        push: boolean;
    };

    const opts = new Command()
        .name("check-version")
        .option("--commit <commit>")
        .option("--push", undefined, false)
        .parse()
        .opts<Options>();

    const latestTag = opts.commit ?? (await getSortedTags())[0];

    if (!latestTag) {
        console.log("ERROR: Couldn't find any tag and no commit was provided.");
        process.exit(1);
    }

    const releaseTag = await getReleaseTag(latestTag);

    await createTag(releaseTag);

    if (opts.push) {
        await pushTag(releaseTag);
    }
})();
