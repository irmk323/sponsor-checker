import { Switch, Text, Tabs, Notification, rem, Input, Button, Loader, TableData, Table, FocusTrap,Container } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

import React from "react";
import { getCompanyData, setCompanyData, isExtensionEnabled, setIsExtensionEnabled } from "../storage/localStorage"
import { useBoolean } from "../utils";
import { fetchCsv } from "./downloadCsv";
import classnames from "classnames";

const TABS = {
    search: "search",
    settings: "settings",
} as const;

export const PopupPage: React.FC = () => {
    const iconStyle = { width: rem(12), height: rem(12) };
    const [activeTab, setActiveTab] = React.useState<string>(TABS.search);
    return (
        <Tabs className="main-page" value={activeTab} onChange={val => val != null && setActiveTab(val)} color="indigo">

            <Tabs.List>
                <Tabs.Tab value={TABS.search}>Search</Tabs.Tab>
                <Tabs.Tab value={TABS.settings} leftSection={<IconSettings style={iconStyle} />}>Settings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={TABS.search} className={classnames("tab-panel", "search-panel")}>
                <SearchPage />
            </Tabs.Panel>

            <Tabs.Panel value={TABS.settings} className={"tab-panel"}>
                <SettingsPage />
            </Tabs.Panel>

        </Tabs>
    );
}

const SettingsPage: React.FC = () => {
    return (
        <>
            <Text c="dimmed" size="sm">
                We can populate this nicely with{" "}
                <Text span inherit c="var(--mantine-color-anchor)">
                    links to stuff
                </Text>{" "}
                and some settings. Right now we only have one.
            </Text>
            <EnabledSwitch />
        </>
    );
}

function EnabledSwitch() {
    const [checked, setChecked] = React.useState(false);
    const fetchIsEnabled = React.useCallback(async () => {
        try {
            const isEnabled = await isExtensionEnabled();
            setChecked(isEnabled ?? false);
        } catch (e) {
            console.error("Could not read `isEnabled`", e);
        }
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

const SearchPage: React.FC = () => {
    const [companyNames, setcompanyNames] = React.useState<"loading" | "error" | string[]>("loading");
    const fetchCompanies = React.useCallback(async () => {
        try {
            const companyData = await getCompanyData();
            setcompanyNames(companyData.companies);
        } catch (e) {
            console.error("Could not read `company data`", e);
            // setcompanyNames([]);
            setcompanyNames("error");
        }
    }, []);

    React.useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

    if (companyNames == "loading") {
        return <Loader />
    }

    if (companyNames == "error") {
        return (
            <div className="padded">
                <Notification withCloseButton={false} color="red" title="Error">
                    Failed to read data from chrome`&apos;`s local storage.
                </Notification>
            </div>
        );
    }

    return companyNames.length > 0 ? (<CompaniesPanel companyNames={companyNames} />) : (<DownloadCSVPanel setcompanyNames={setcompanyNames} />);
};

const CompaniesPanel: React.FC<{ companyNames: string[] }> = ({ companyNames }) => {
    const [searchText, setSearchText] = React.useState("");
    const filteredCompanyNames = React.useMemo(() => {
        console.log('searchText', searchText);
        console.log('companyNames.lengths', companyNames.length);
        const lowerCaseText = searchText.toLowerCase();
        if (searchText === "") {
            return companyNames;
        }
        return companyNames.filter(name => name.toLowerCase().includes(lowerCaseText));
    }, [companyNames, searchText]);
    const formattedCompanyCount = new Intl.NumberFormat().format(filteredCompanyNames.length);

    const tableData: TableData = React.useMemo(() => ({
        body: filteredCompanyNames.slice(0, 50).map(name => [<Text key={name}>{name}</Text>]),
    }), [filteredCompanyNames]);

    return (
        <>
            <div className="padded">
                <Text fw={500}>Licensed Companies</Text>
                <FocusTrap active>
                    <Input
                        placeholder="Search company names"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        mt="md"
                    />
                </FocusTrap>
                <Text c="dimmed" size="sm"><b>{formattedCompanyCount}</b> {filteredCompanyNames.length  <= 1 ? 'company' : 'companies'} matching your filter</Text>
            </div>
            <Table.ScrollContainer minWidth={200}>
                <Table highlightOnHover data={tableData} />
            </Table.ScrollContainer>
        </>
    );
}

const DownloadCSVPanel: React.FC<{setcompanyNames: (companyNames: string[]) => void}> = ( { setcompanyNames }) => {
    const [url, setUrl] = React.useState("");
    const { setTrue: setLoading, setFalse: setLoaded, value: isLoading } = useBoolean();

    const handleDownloadClicked = React.useCallback(async () => {
        setLoading();
        try {
            const companyNames = await fetchCsv(url);
            await setCompanyData({ companies: companyNames });
            setLoaded();
            setcompanyNames(companyNames);
            console.log("companyNames", companyNames);
        }
        catch (e) {
            console.log("fuck", e);
            setLoaded();
        }
    }, [url, setLoading, setLoaded, setcompanyNames]);

    return (
        <Container>
        <>
            <Text mt="sm" c="dimmed" size="sm">
                The list of authorized sponsors is not present in the local storage.
                Please enter the URL for this list in the space provided below.
            </Text>
            <Text mt="sm" c="dimmed" size="sm">
                Storing this list in local storage will enhance the extension`&apos;`s
                performance and reduce unnecessary data usage.
            </Text>
            <Text mt="sm" c="dimmed" size="sm">
                You can get the csv URL from{' '}
                <a href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--mantine-color-anchor)' }}> gov.uk website</a>.
                <br/>
                Please go to this page and copy the URL of the csv link.
                <br/>
                *The URL must end with
                <br/>
                20XX-MM-DD_-_Worker_and_Temporary_Worker.csv
            </Text>
            <Input
                placeholder="Download URL for the csv"
                value={url}
                onChange={e => setUrl(e.target.value)}
                mt="md"
            />
            <div className="reverse-flex">
                <Button m={10} loading={isLoading} size="xs" variant="filled" onClick={handleDownloadClicked}>Save CSV</Button>
            </div>
        </>
        </Container>
    );
}
