import { readdir, readFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { join } from "node:path";

import { Command } from "commander";

import {
    commitsSince,
    getFileAt,
    getSortedTags,
    hasChangedSince,
    parsePkgJson,
    PkgJson,
} from "@/utils";

// This script makes the assumption that every member of the workspace are contained at the root of
// `PACKAGES_PATH`.
const PACKAGES_PATH = "./packages";

type Pkg = {
    path: string;
    oldPkgJson: PkgJson;
    newPkgJson: PkgJson;
    shouldBumpReasons: string[];
    newCommits?: string[];
};

/**
 * @returns an array of `Pkg` that depend on package `name`.
 */
function getPkgsDependOn(name: string, pkgs: Pkg[]): Pkg[] {
    return pkgs.filter((pkg) => pkg.newPkgJson.dependencies.get(name));
}

function tabLevel(level: number) {
    let tab = "";
    for (let i = 0; i < level; i++) {
        tab += "    ";
    }
    return tab;
}

function containsError(pkgs: Pkg[]): boolean {
    return pkgs.filter((pkg) => pkg.shouldBumpReasons.length > 0).length > 0;
}

(async () => {
    console.log("Starting check-versions...");

    type Options = {
        showCommits: boolean;
        commit?: string;
    };

    const opts = new Command()
        .name("check-version")
        .option("--show-commits", undefined, false)
        .option("--commit <commit>")
        .parse()
        .opts<Options>();

    const latestTag = opts.commit ?? (await getSortedTags())[0];

    if (!latestTag) {
        console.log("ERROR: Couldn't find any tag and no commit was provided.");
        process.exit(1);
    }

    const pkgs: Pkg[] = await Promise.all(
        (
            await readdir(PACKAGES_PATH)
        )
            .map((dir) => join("packages", dir))
            .filter((path) => statSync(path).isDirectory())
            .map(async (path) => {
                const pkgJsonPath = join(path, "package.json");

                const oldPkgJson = parsePkgJson(await getFileAt(latestTag, pkgJsonPath));
                const newPkgJson = parsePkgJson((await readFile(pkgJsonPath)).toString());

                return { path, oldPkgJson, newPkgJson, shouldBumpReasons: [] };
            }),
    );

    for (const pkg of pkgs) {
        const diff = await hasChangedSince(latestTag, join(pkg.path, "src"));

        const { name, version } = pkg.newPkgJson;

        if (diff) {
            if (pkg.oldPkgJson.version === version) {
                let reasonBuild = `has modifications`;

                if (opts.showCommits) {
                    const newCommits = (await commitsSince(latestTag, pkg.path)).map(
                        (commit) => `${tabLevel(2)} * ${commit}`,
                    );

                    newCommits.unshift(":");
                    reasonBuild += newCommits.join("\n");
                }

                pkg.shouldBumpReasons.push(reasonBuild);
            }

            for (const dep of getPkgsDependOn(name, pkgs)) {
                if (dep.oldPkgJson.version === dep.newPkgJson.version) {
                    dep.shouldBumpReasons.push(`dependency ${name} got modifications`);
                }
            }
        }
    }

    for (const pkg of pkgs) {
        if (pkg.shouldBumpReasons.length > 0) {
            console.log(`ERROR: ${pkg.newPkgJson.name} should receive a version bump for reasons:`);
            for (const reason of pkg.shouldBumpReasons) {
                console.log(`${tabLevel(1)} - ${reason}`);
            }

            console.log();
        }
    }

    if (containsError(pkgs)) {
        process.exit(1);
    } else {
        console.log("All good!");
        process.exit(0);
    }
})();
