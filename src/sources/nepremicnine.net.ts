import puppeteer from "puppeteer";
import { Listing } from "../interfaces.js";
import { integers, sleep } from "../utilities.js";

export const getPageCount = async (frame: puppeteer.Frame): Promise<number> =>
  frame.$eval("#pagination", (div) => {
    const elements = div.querySelectorAll("li");
    const hrefs = Array.from(elements).map(
      (e) => (e.firstChild as HTMLAnchorElement)!.href
    );
    const extractPageNumber = (url: string): number =>
      Number(new URL(url).pathname.match(/\/(\d+)\//)![1]);
    const lastPage = extractPageNumber(hrefs[hrefs.length - 1]);
    return lastPage;
  });

export function* listingPages(
  url: string,
  pageCount: number
): Generator<string, void> {
  for (const page of integers(1, pageCount)) {
    const paged = new URL(url);
    if (!paged.pathname.endsWith("/")) paged.pathname += "/";
    paged.pathname += `${page}/`;
    yield paged.href;
  }
}

export const getListingItems = (frame: puppeteer.Frame) =>
  frame.$$eval(
    '[itemprop=item][itemtype="http://schema.org/Offer"] h2 a',
    (links) => {
      return links.map((a) => (a as HTMLAnchorElement).href);
    }
  );

export const getTitle = (frame: puppeteer.Frame) =>
  frame
    .$eval("h1.podrobnosti-naslov", (title) => title.textContent!)
    .catch(() => "");

export const getPrice = (frame: puppeteer.Frame) =>
  frame
    .waitForSelector(`#podrobnosti .galerija-container .cena span`)
    .then(
      async (span) =>
        await (await span!.getProperty("textContent")).jsonValue<string>()
    )
    .catch(() => "");

export const getSummary = (frame: puppeteer.Frame) =>
  frame
    .$eval("#opis .kratek", (div) => div.textContent!.trim())
    .catch(() => "");

export const getDescription = (frame: puppeteer.Frame) =>
  frame
    .$eval("#opis .web-opis [itemprop=disambiguatingDescription]", (div) => {
      let content: string[] = [];
      for (const child of Array.from(div.querySelectorAll("p"))) {
        content.push(child.textContent!);
      }
      return content
        .join(`\n\n`)
        .replace(/[\r\v]/g, "")
        .trim();
    })
    .catch(() => "");

export const getAttributes = (frame: puppeteer.Frame): Promise<string[]> =>
  frame
    .$$eval("#opis #atributi > li", (items) =>
      items.map((li) => li.textContent!).filter((i) => i.trim())
    )
    .catch(() => []);

export const getContactDetails = (frame: puppeteer.Frame) =>
  frame
    .$eval("#opis .kontakt-opis p", (div) => {
      let content = "";
      for (const child of Array.from(div.childNodes)) {
        if (child.nodeName == "BR") content += "\n";
        else content += child.textContent!;
      }
      return content.trim();
    })
    .catch(() => "");

export const getImages = (frame: puppeteer.Frame): Promise<string[]> =>
  frame
    .waitForTimeout(500)
    .then(async () => {
      frame.$eval(".rsThumbsArrowRight", (button) =>
        (button as HTMLAnchorElement)?.click()
      );
      await sleep(1000);
      frame.$eval(".rsThumbsArrowRight", (button) =>
        (button as HTMLAnchorElement)?.click()
      );
      await sleep(1000);
    })
    .then(() =>
      frame.$$eval("img.rsTmb", (images) =>
        images.map((thumb) =>
          (thumb as HTMLImageElement).src?.replace("/thumbnails/", "2/")
        )
      )
    )
    .catch(() => []);

export const getListingData = async (
  frame: puppeteer.Frame
): Promise<Listing> => {
  const [title, price, summary, description, attributes, contact, images] =
    await Promise.all([
      getTitle(frame),
      getPrice(frame),
      getSummary(frame),
      getDescription(frame),
      getAttributes(frame),
      getContactDetails(frame),
      getImages(frame),
    ]);
  return {
    url: frame.url(),
    title,
    price,
    summary,
    description,
    contact,
    attributes,
    images,
    snapshot: new Date().toISOString(),
  };
};
