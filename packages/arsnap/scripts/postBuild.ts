import { replaceInFileSync } from "replace-in-file";

replaceInFileSync({
    files: ["dist/bundle.js"],
    from: /while \(power > _0n\) \{/g,
    to: "while (power-- > _0n) {",
});
