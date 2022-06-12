# Stath

![](https://c.tenor.com/mapePSMpO_wAAAAd/stath-stath-lets-flats.gif)

A time-series scraping utility for observing realestate listings in Slovenia.

You'll need at least Node 16.x and Yarn installed to run this. After cloning the repo, run `yarn install` to install dependencies.

## Running a scrape

You can run a scrape of a category by running the `scrape` script:

```sh
yarn run scrape
```

This will collect all URLs from the given category (currently hardcoded to houses near Ljubljana with latest publication ordering) and scrape each listing, writing them to a `data.json` file in the root of the repository.
