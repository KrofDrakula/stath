import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { captureListings } from "./sources/capture.js";

const list = `https://www.nepremicnine.net/oglasi-prodaja/ljubljana-okolica/hisa/?s=16`;

const browser = await puppeteer.launch();

const data = await captureListings(browser, list, 100);

await writeFile(
  join(
    dirname(fileURLToPath(import.meta.url)),
    `../data/nepremicnine.net/${Date.now()}.json`
  ),
  JSON.stringify(data, null, 2),
  "utf-8"
);

await browser.close();
