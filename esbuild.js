const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const { copy } = require('esbuild-plugin-copy');

const copyConfigs = {
    manifest: { from: ["manifest.json"], to: ["manifest.json"]},
    icon: { from: ["icon.png"], to: ["icon.png"]},
    popupHtml: { from: ["popup.html"], to: ["popup.html"]},
};

esbuild
    .build({
        entryPoints: ["src/popup/Popup.tsx", "src/popup/style.scss"],
        outdir: "dist",
        bundle: true,
        plugins: [
            sassPlugin(),
            copy({ assets: copyConfigs.manifest }),
            copy({ assets: copyConfigs.popupHtml }),
            copy({ assets: copyConfigs.icon }),
        ]
    })
    .then(() => console.log("We did it?!@. Build complete."))
    .catch(e => console.error("Shit hit the fan:", e));
