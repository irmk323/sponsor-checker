import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from '@mantine/core';
import { SettingsPage } from "./SettingsPage";

import '@mantine/core/styles.css';

const ROOT_DIV_ID = 'popup-root';
const rawRootDiv = document.getElementById(ROOT_DIV_ID);
if (rawRootDiv != null) {
    const root = createRoot(rawRootDiv);
    root.render(
        <MantineProvider>
            <SettingsPage />
        </MantineProvider>
    );
} else {
    console.log(`No element found in the document with the id: "${ROOT_DIV_ID}"`);
}
