import puppeteer from "puppeteer";
import { Listing } from "../interfaces.js";
import {
  getListingData,
  getListingItems,
  getPageCount,
  listingPages
} from "./nepremicnine.net.js";
import { sleep } from "../utilities.js";

export const captureListings = async (
  browser: puppeteer.Browser,
  url: string,
  maxListings?: number
): Promise<Listing[]> => {
  const data: Listing[] = [];
  const page = await browser.newPage();
  page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url);

  const listingUrls: string[] = [];
  const pageCount = await getPageCount(page.mainFrame());
  {
    let pageNumber = 1;
    for (const pageUrl of listingPages(url, pageCount)) {
      await sleep(1000);
      console.log(`Capturing pages ${pageNumber} of ${pageCount}`);
      await page.goto(pageUrl, { waitUntil: "load" });
      listingUrls.push(...(await getListingItems(page.mainFrame())));
      pageNumber++;
      if (maxListings !== undefined && listingUrls.length >= maxListings) break;
    }
  }

  for (let i = 0; i < (maxListings ?? listingUrls.length); i++) {
    await sleep(1000);
    console.log(
      `Capturing listing ${i + 1} of ${maxListings ?? listingUrls.length}`
    );
    await page.goto(listingUrls[i], { waitUntil: "load" });
    try {
      data.push(await getListingData(page.mainFrame()));
    } catch (err) {
      console.error(listingUrls[i], err);
    }
  }

  return data;
};
