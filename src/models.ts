import { z } from "zod";

export const outages
 = z.array(
  z.object({
    id: z.string(),
    begin: z.string(),
    end: z.string(),
  })
);

export const siteInfo = z.object({
  id: z.string(),
  name: z.string(),
  devices: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export interface FilterdSiteInfo {
    id: string;
    name: string;
    begin: string;
    end: string;
}

export type Outages = z.infer<typeof outages>;
export type SiteInfo = z.infer<typeof siteInfo>;
