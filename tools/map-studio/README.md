# SCOPE Map Studio

Static browser app, linked from the SCOPE site navigation. It draws administrative GeoJSON in an SVG and stores the user's layers and markers in browser local storage. No map API key or server-side account is needed.

## Included features

- Bangladesh division, district, upazila and union/ward-area selectors.
- Custom category layers, colors, place labels and notes. Click the map to add a location.
- Browser auto-save and project JSON import/export.
- PNG download and browser print-to-PDF.
- English/Bangla controls, SCOPE logo and brand palette.

## Boundary data

The bundled boundaries come from the BBS 2022 administrative boundary layer served by the ArcGIS endpoint below. The data is packaged as JavaScript files so the app can load it both from a local `file://` page and from a static host such as GitHub Pages; browser `fetch()` cannot reliably read local files. The four layers were simplified for display at a 0.002-degree tolerance and coordinate precision of five decimals. The union/ward layer has 8,172 records; it includes union areas and municipal/city-corporation ward records. Its area labels use the union/ward name, and the map tooltip identifies municipal/city-corporation ward records.

- [BBS institutional portal](https://ecds.bbs.gov.bd/Home/AboutUs)
- [ArcGIS boundary service](https://www.arcgisbd.com/server/rest/services/ADB005/CRIIPS/MapServer)

Check the source and current administrative records before using the map for official or operational decisions. If BBS updates its boundaries, regenerate the four JavaScript files in `data/` and preserve the expected property names (`Division`, `District`, `Upazila`, `UnName`, `Municipal`, `CityCorp`).

## Publish

This site is static. Upload the updated `scope-site` directory to the existing GitHub Pages repository; the app is available at `tools/map-studio/`.
