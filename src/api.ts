import {URL, API_KEY} from "./config"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ZodSchema } from "zod";
import { FilterdSiteInfo, outages, siteInfo} from "./models";

export const apiHeaders: AxiosRequestConfig<null> = {
    headers: {
      "x-api-key": API_KEY,
    },
  };

  const checkApiResponse = (response: AxiosResponse<any, any>) => {
    return response;
  };

export const getData = async <T>(
    endpoint: string,
    schema: ZodSchema<T>
  ): Promise<T> => {
    const url = `${URL}/${endpoint}`;
    const apiReponse = await axios.get(url, apiHeaders);
    const successResponse = checkApiResponse(apiReponse);
    const parsedResponse = schema.safeParse(successResponse.data);
    if (!parsedResponse.success)
      throw new Error("recceived payload missmatch");
    return parsedResponse.data;
  };

export const getOutages = async () => await getData("outages", outages);

export const getSiteInfo = async (siteId: string) =>
  await getData(`site-info/${siteId}`, siteInfo);

export const postData = async <T>(data: T, endpoint: string): Promise<void> => {
    const response = await axios.post(
      `${URL}/${endpoint}`,
      data,
      apiHeaders
    );
    checkApiResponse(response);
  };

export const sendData = async (siteId: string, data: FilterdSiteInfo[]) =>
  await postData(data, `site-outages/${siteId}`);

export const retry = async <T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  maxTry: number,
  retryCount = 0
): Promise<Awaited<ReturnType<T>>> => {
  try {
    return await fn(...args);
  } catch (e) {
    console.log(`Retry: ${retryCount} failed`);
    if (retryCount >= maxTry) {
      if (e instanceof Error) {
        console.log(e.message)
      } else {
        console.log(e)
      }
      throw new Error(`All ${maxTry} retry attempts exhausted`)
    }
    return retry(fn, args, maxTry, retryCount + 1);
  }
};
