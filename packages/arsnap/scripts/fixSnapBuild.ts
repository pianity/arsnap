/**
 * This file should be executed as a standalone script only after running `yarn build-esbuild`.
 * Its purpose is to fix an error thrown by Babel when running `yarn build-snap`.
 */
import replace from "replace-in-file";

const REPLACEMENTS = [[/while \(power-- > _0n\) \{/g, "while (power > 0) {\npower--;\n"]] as const;

for (const [from, to] of REPLACEMENTS) {
    console.log(
        replace.replaceInFileSync({
            files: ["build/index.js"],
            from: from,
            to,
            countMatches: true,
        }),
    );
}

export {};
