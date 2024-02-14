import Papa from 'papaparse';

type GovUKRow = [string, string, string, string, string];
const RELEVANT_ROUTE = "skilled worker";

// We should not blindly trust the GovUKRow type here, as there is no run time type check.
// gov.uk can technically return anything and Papa parse might be swalllowing certain errors.
const transformParsedCsv = (govUkRows: GovUKRow[]): string[] => (
    govUkRows
        .filter(row => row.length === 5 && row[4].toLowerCase() === RELEVANT_ROUTE)
        .map(row => row[0])
);

export const fetchCsv = async (url: string) => {
    console.log('fetching url:', url);
    const res = await fetch(url, {
        mode: "cors"
    });
    const body = await res.text();
    const parsed = await papaParse(body);
    return transformParsedCsv(parsed.data);
};

export const metchCsv = async (body: string) => {
    const govUkRows = (await papaParse(body)).data;
    return transformParsedCsv(govUkRows);
};

export const papaParse = (csvString: string): Promise<Papa.ParseResult<GovUKRow>> => {
    return new Promise((resolve, reject) => {
        try {
            Papa.parse<GovUKRow>(csvString, {
                header: false,
                complete: response => resolve(response)
            });
        } catch (e) {
            reject(e);
        }
    });
}
