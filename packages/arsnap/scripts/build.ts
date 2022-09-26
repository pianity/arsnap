import * as path from "node:path";
import { readFile } from "node:fs/promises";

import { build, PluginBuild, Plugin } from "esbuild";
import { replaceInFileSync } from "replace-in-file";

async function wasmPlugin(pkgName: string): Promise<Plugin> {
    const entryPath = require.resolve(pkgName);
    const entryContent = (await readFile(entryPath)).toString();
    const entryPathParsed = path.parse(entryPath);
    const wasmPath = path.join(entryPathParsed.dir, `${entryPathParsed.name}_bg.wasm`);
    const newPkgEntryCode = `
import wasmBinary from "${wasmPath}";
${entryContent.replace("export default", "// export default")}

export default async function initB64() {
    const imports = getImports();
    initMemory(imports);
    const { instance, module } = await load(wasmBinary, imports);
    return finalizeInit(instance, module);
}
`;
    const wasmBase64 = await readFile(wasmPath, "base64");

    return {
        name: "wasm",
        setup(build: PluginBuild) {
            build.onLoad({ filter: new RegExp(entryPath) }, (args) => {
                return {
                    contents: newPkgEntryCode,
                    loader: "js",
                };
            });

            // Resolve ".wasm" files to a path with a namespace
            build.onResolve({ filter: new RegExp(`${wasmPath}$`) }, (args) => {
                // If this is the import inside the stub module, import the
                // binary itself. Put the path in the "wasm-binary" namespace
                // to tell our binary load callback to load the binary file.
                if (args.namespace === "wasm-stub") {
                    return {
                        path: args.path,
                        namespace: "wasm-binary",
                    };
                }

                // Otherwise, generate the JavaScript stub module for this
                // ".wasm" file. Put it in the "wasm-stub" namespace to tell
                // our stub load callback to fill it with JavaScript.
                //
                // Resolve relative paths to absolute paths here since this
                // resolve callback is given "resolveDir", the directory to
                // resolve imports against.
                if (args.resolveDir === "") {
                    return null; // Ignore unresolvable paths
                }

                return {
                    path: path.isAbsolute(args.path)
                        ? args.path
                        : path.join(args.resolveDir, args.path),
                    namespace: "wasm-stub",
                };
            });

            // Virtual modules in the "wasm-stub" namespace are filled with
            // the JavaScript code for compiling the WebAssembly binary. The
            // binary itself is imported from a second virtual module.
            build.onLoad({ filter: /.*/, namespace: "wasm-stub" }, async (args) => {
                return {
                    contents: `
const wasmBase64 = ${JSON.stringify(wasmBase64)};
const wasmBinary = new Uint8Array(
    atob(wasmBase64)
        .split("")
        .map((char) => char.charCodeAt(0)),
);
export default wasmBinary;
`,
                };
            });

            // Virtual modules in the "wasm-binary" namespace contain the
            // actual bytes of the WebAssembly file. This uses esbuild's
            // built-in "binary" loader instead of manually embedding the
            // binary data inside JavaScript code ourselves.
            build.onLoad({ filter: /.*/, namespace: "wasm-binary" }, async (args) => {
                return {
                    contents: await readFile(args.path),
                    loader: "binary",
                };
            });
        },
    };
}

(async () => {
    // "build-esbuild": "esbuild --bundle --format=cjs --outdir=build src/index.ts",
    await build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        format: "cjs",
        outdir: "build",
        plugins: [await wasmPlugin("arsnap-keygen")],
    });

    // NOTE: This is a hack to avoid a crash when building using `mm-snap`. The crash occurs
    // because Babel detects the usage of "-->" in the build (even if it's actually "-- >") and
    // forbids it.
    replaceInFileSync({
        files: ["build/index.js"],
        from: /while \(power-- > _0n\) \{/g,
        to: "while (power > _0n) {",
        countMatches: true,
    });
})();
