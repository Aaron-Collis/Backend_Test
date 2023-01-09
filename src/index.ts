import { getOutages, getSiteInfo, retry, sendData } from "./api";
import { API_KEY, DATE_TIME_FILTER } from "./config";
import { filterAndAttachOutageData } from "./filterData";

export const handler = async (siteId: string, apiRetries: number): Promise<void> => {
  console.log("1. Retriving all outages from the GET /outages endpoint")
  const outages = await retry(getOutages, [], apiRetries);
  console.log(`2. Retriving information from the GET /site-info/${siteId} endpoint`)
  const siteInfo = await retry(getSiteInfo, [siteId], apiRetries); 
  const filteredSiteOutages = filterAndAttachOutageData(
    DATE_TIME_FILTER,
    outages,
    siteInfo
  );
  console.log(`5. Sending filtered list of ${filteredSiteOutages.length} outages to /site-outages/${siteId}`)
  await retry(sendData, [siteId, filteredSiteOutages], apiRetries); 
};

const runHandler = async () => {
    await handler("norwich-pear-tree", 3)
    console.log("Successfully processed outages")
}

runHandler()