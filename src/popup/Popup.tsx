import { Card, Switch, Text, Tabs, rem } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import React from "react";
import { isExtensionEnabled, setIsExtensionEnabled } from "../storage/localStorage"

const TABS = {
    search: "search",
    settings: "settings",
} as const;

export const PopupPage: React.FC<{}> = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = React.useState<string>(TABS.search);
  return (
    <Card withBorder shadow="sm" radius="md" className="main-page">

      <Tabs color="indigo" value={activeTab} onChange={val => val != null && setActiveTab(val)}>
        <Tabs.List>
          <Tabs.Tab value={TABS.search}>Search</Tabs.Tab>
          <Tabs.Tab value={TABS.settings} leftSection={<IconSettings style={iconStyle}/>}>Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TABS.search}>
          Gallery tab content
        </Tabs.Panel>

        <Tabs.Panel value={TABS.settings}>
          <SettingsPage />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}

const SettingsPage: React.FC<{}> = () => {
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>Settings</Text>
            </Card.Section>

            <Text mt="sm" c="dimmed" size="sm">
                We can populate this nicely with{' '}
                <Text span inherit c="var(--mantine-color-anchor)">
                    links to stuff
                </Text>{' '}
                and some settings. Right now we only have one.
            </Text>
            <EnabledSwitch />
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
