import { Switch, Text, Tabs, rem, Input, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import { IconSettings } from '@tabler/icons-react';
import Papa from 'papaparse';

import React from "react";
import { isExtensionEnabled, setIsExtensionEnabled } from "../storage/localStorage"
import { useBoolean } from '../utils';


const TABS = {
    search: "search",
    settings: "settings",
} as const;

export const PopupPage: React.FC<{}> = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [activeTab, setActiveTab] = React.useState<string>(TABS.search);
  return (
      <Tabs className="main-page" value={activeTab} onChange={val => val != null && setActiveTab(val)} color="indigo">

        <Tabs.List>
          <Tabs.Tab value={TABS.search}>Search</Tabs.Tab>
          <Tabs.Tab value={TABS.settings} leftSection={<IconSettings style={iconStyle}/>}>Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={TABS.search} className="tab-panel">
          <SearchPage />
        </Tabs.Panel>

        <Tabs.Panel value={TABS.settings} className="tab-panel">
          <SettingsPage />
        </Tabs.Panel>

      </Tabs>
  );
}

const SettingsPage: React.FC<{}> = () => {
  return (
      <>
          <Text mt="sm" c="dimmed" size="sm">
              We can populate this nicely with{' '}
              <Text span inherit c="var(--mantine-color-anchor)">
                  links to stuff
              </Text>{' '}
              and some settings. Right now we only have one.
          </Text>
          <EnabledSwitch />
      </>
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

const DownloadCSVPanel: React.FC<{}> = () => {
  const [url, setUrl] = React.useState("");
  const [rows, setRows] = React.useState<string[]>([]);
  const {setTrue: setLoading, setFalse: setLoaded, value: isLoading} = useBoolean();

  const handleDownloadClicked = React.useCallback(async () => {
    setLoading();
    console.log('url', url);
    try {
      const res = await fetch(url, {
          mode: "cors"
      });
      const body = await res.text();
      const rawLines = body.split("\n").slice(0, 20).join('\n');
      
      Papa.parse<string>(rawLines, {
        header: true,
        complete: response => {
          const results = response.data;
          setRows(results.map(res => JSON.stringify(res)));
          setLoaded();
        }
      });
    }
    catch (e) {
      console.log('fuck', e);
      setLoaded();
    }
    
  }, [url]);

  return (
    <>
      {/* Maybe be more helpful here? Render a hyperlink to Uk.gov's page? Through which the users can grab the csv url? */}
      <Text mt="sm" c="dimmed" size="sm">
          The list of authorized sponsors is not present in the local storage.
          Please enter the URL for this list in the space provided below.
      </Text>

      <Text mt="sm" c="dimmed" size="sm">          
          Storing this list in local storage will enhance the extension's
          performance and reduce unnecessary data usage.
      </Text>

      {/* https://assets.publishing.service.gov.uk/media/65cb4f16a7ded0000c79e4f3/2024-02-13_-_Worker_and_Temporary_Worker.csv */}
      {/*
        We can auto detect this url by reading uk-gov's page.
        In later iterations, below input field should be a fallback
        for cases where the plugin can't figure out this url automatically.
      */}
      <Input
        placeholder="Download URL for the csv"
        value={url}
        onChange={e => setUrl(e.target.value)}
        mt="md"
      />
      <div className="reverse-flex">
        <Button loading={isLoading} size="xs" variant="filled" onClick={handleDownloadClicked}>Save CSV</Button>
      </div>
      {rows.map((row, index) => <Text key={index}>{row}</Text>)}
    </>
  );
}

const SearchPage: React.FC<{}> = () => {
  // insert logic here to branch off if CSV is found in local storage.
  // 1. load from store & show spinner
  // 2. reroute accordingly
  // 3. potentially handle errors -> we also don't know what _can_ go wrong
  //  - we can prolly just flush everything clean, and reload. Storage is an essential cache
  return <DownloadCSVPanel />
};
