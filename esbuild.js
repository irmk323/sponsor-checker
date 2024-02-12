const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const { copy } = require('esbuild-plugin-copy');

const filesToStaticallyCopy = [
    {from: "manifest.json", to: "manifest.json"},
    {from: "icon.png", to: "icon.png"},
    {from: "src/popup/popup.html", to: "popup/popup.html"},
    {from: "background.js", to: "background.js"},
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
            ...filesToStaticallyCopy.map(({from, to}) => copy({ assets: { from, to } }))
        ]
    })
    .then(() => console.log("We did it?!@. Build complete."))
    .catch(e => console.error("Shit hit the fan:", e));
