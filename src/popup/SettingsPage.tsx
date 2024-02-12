import React from "react";
import { Card, Switch, Text } from '@mantine/core';
import { isExtensionEnabled, setIsExtensionEnabled } from "../storage/localStorage"

export const SettingsPage: React.FC<{}> = () => {
    return (
        <Card withBorder shadow="sm" radius="md" className="main-card">
            <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>Settings</Text>
            </Card.Section>

            <Text mt="sm" c="dimmed" size="sm">
                We can populate this nicely with{' '}
                <Text span inherit c="var(--mantine-color-anchor)">
                    links to stuff
                </Text>{' '}
                and some settings. Right now we only have one.
                <EnabledSwitch />
            </Text>

        </Card>
    );
}



function EnabledSwitch() {
    const [checked, setChecked] = React.useState(false);

    const fetchIsEnabled = React.useCallback(async () => {
        const isEnabled = await isExtensionEnabled();
        setChecked(isEnabled ?? false);
    }, []);

    React.useEffect(() => { fetchIsEnabled(); }, [fetchIsEnabled]);

    const toggleEnabled = React.useCallback(async () => {
        await setIsExtensionEnabled(!checked);
        fetchIsEnabled();
    }, [checked, fetchIsEnabled]);

    return (
        <Switch
            checked={checked}
            onChange={toggleEnabled}
            label={"Enabled"}
        />
    );
}
