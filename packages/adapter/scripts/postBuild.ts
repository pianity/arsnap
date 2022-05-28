/**
 * This file should be executed as a standalone script only after running `yarn build`.
 * Its purpose is to set constants defined at `src/consts.ts` at build-time.
 */
import replace from "replace-in-file";

import { version } from "package.json";

const DEV = process.env.NODE_ENV === "development";

const REPLACEMENTS: [from: string, to: string][] = [
    ["$SIGNING-CLIENT-VERSION", `v${version}`],
    ["$SNAP-ID", DEV ? "local:http://localhost:4000" : "npm:@pianity/arsnap"],
];

for (const [from, to] of REPLACEMENTS) {
    replace.replaceInFileSync({
        files: ["dist/consts.d.ts", "dist/consts.js"],
        from,
        to,
    });
}

export {};
