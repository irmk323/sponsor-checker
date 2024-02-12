const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const { copy } = require('esbuild-plugin-copy');

const filesToStaticallyCopy = [
    "manifest.json",
    "icon.png",
    "popup.html",
    "background.js"
];

esbuild
    .build({
        entryPoints: [
            "src/popup/app.tsx",
            "src/content.ts",
            "src/popup/style.scss"],
        outdir: "dist",
        bundle: true,
        plugins: [
            sassPlugin(),
            ...filesToStaticallyCopy.map(file => copy({ assets: {from: [file], to: [file]} }))
        ]
    })
    .then(() => console.log("We did it?!@. Build complete."))
    .catch(e => console.error("Shit hit the fan:", e));
