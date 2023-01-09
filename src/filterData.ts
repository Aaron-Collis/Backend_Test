import { FilterdSiteInfo, Outages, SiteInfo } from "./models";

const arrayToObject = <T extends Record<K, any>, K extends keyof any>(
  array: T[] = [],
  getKey: (item: T) => K
) =>
  array.reduce((obj, cur) => {
    const key = getKey(cur);
    return { ...obj, [key]: cur };
  }, {} as Record<K, T>);

export const filterAndAttachOutageData = (
  dateFrom: string,
  outages: Outages,
  siteInfo: SiteInfo
): FilterdSiteInfo[] => {
  const idToDeviceMap = arrayToObject(siteInfo.devices, (site) => site.id);

  console.log("3a. Filtering out outages that began before a set date")
  const recentOutages = outages.filter(
    (outage) => new Date(outage.begin) >= new Date(dateFrom)
  );

  console.log("3b. Filtering out outages that don't have an ID")
  const recentSiteOutages = recentOutages.filter(
    (recentOutages) => !!idToDeviceMap[recentOutages.id]
  );

  console.log("4. Attaching the display name of the device in the site information to each appropriate outage")
  const recentSiteOutagesFiltered = recentSiteOutages.map(recentSiteOutage => {
    return {
      ...recentSiteOutage,
      name: idToDeviceMap[recentSiteOutage.id].name
    }
  })

  

  return recentSiteOutagesFiltered;
};
