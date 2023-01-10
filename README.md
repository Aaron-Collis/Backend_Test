# Aaron Collis' Back End Test

## Introduction

This repo is my solution to the KrakenFlex backend test. This readme documents what has been produced, how it works, how to install the dependancies and how to run the program & tests.

## The Task

The task is to write a small program that:

1. Retrieves all outages from the `GET /outages` endpoint
2. Retrieves information from the `GET /site-info/{siteId}` endpoint for the site with the ID `norwich-pear-tree`
3. Filters out any outages that began before `2022-01-01T00:00:00.000Z` or don't have an ID that is in the list of
   devices in the site information
4. For the remaining outages, it should attach the display name of the device in the site information to each appropriate outage
5. Sends this list of outages to `POST /site-outages/{siteId}` for the site with the ID `norwich-pear-tree`

There was an bonus requirement to make the program resilient for a case where the API will occasionally return 500 status codes. 

## Solution

This program address the main five points of the task however the finial 'Bonus Requirement' was not attempted due to time contraints.

### What has been produced

* The first task is fullfilled by using the `getOutages` function which quite simply gets the outages from the outage endpoint in the `/src/api.ts` file
* The second task uses the `getSiteInfo` function feeding in the parameters of endpoint and schema (also in `/src/api.ts`)
* The third and fourth task is done in the `filterAndAttachOutageData` function in the `/src/filterData.ts` file. First the outages which began before the spesified date is filtered out, then the data is again removing any entries without an ID and then finially the remaining outages have the name of the device mapped to each appropriate outage
* The last task is compleated using the  `sendData` function with the parameters of the `siteID` and the filtered data from the third and fourth task.

### How to run the program & tests

1. Fork and clone the repo and then run the following to install dependencies:
```bash
npm install
```
2. Run the program:
```bash
npm run start
```
3. To run the unit tests run the folowing:
```bash
npm test
```
