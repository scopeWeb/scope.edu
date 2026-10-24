# SCOPE Map Studio

Static browser app, linked from the SCOPE site navigation. It draws administrative GeoJSON in an SVG and stores the user's layers and markers in browser local storage. No map API key or server-side account is needed.

## Included features

- Bangladesh division, district, upazila, union/ward-area and optional EPI ward selectors.
- Custom category layers, colors, place labels and notes. Click the map to add a location.
- Browser auto-save and project JSON import/export.
- PNG download and browser print-to-PDF.
- Bundled river lines that remain visible from division down to union/EPI ward scale, with a river legend and source credit.
- English/Bangla controls, SCOPE logo and brand palette.

## Boundary data

The bundled boundaries come from the BBS 2022 administrative boundary layer served by the ArcGIS endpoint below. The data is packaged as JavaScript files so the app can load it both from a local `file://` page and from a static host such as GitHub Pages; browser `fetch()` cannot reliably read local files. The four layers were simplified for display at a 0.002-degree tolerance and coordinate precision of five decimals. The union/ward layer has 8,172 records; it includes union areas and municipal/city-corporation ward records. Its area labels use the union/ward name, and the map tooltip identifies municipal/city-corporation ward records.

- [BBS institutional portal](https://ecds.bbs.gov.bd/Home/AboutUs)
- [ArcGIS boundary service](https://www.arcgisbd.com/server/rest/services/ADB005/CRIIPS/MapServer)

Check the source and current administrative records before using the map for official or operational decisions. If BBS updates its boundaries, regenerate the four JavaScript files in `data/` and preserve the expected property names (`Division`, `District`, `Upazila`, `UnName`, `Municipal`, `CityCorp`).

### River lines

The map overlays 2,076 generalized river line features from the public BIWTA_Topo ArcGIS layer named “Rivers (World Mapping Initiative)”. The data is bundled in `data/rivers.js`, rendered above area fills at every map extent, and included in PNG/PDF exports. Attribution is shown in the map footer. This generalized reference network is not a complete or current BWDB river inventory; small rivers, canals and recent channel changes may be missing.

- [Rivers (World Mapping Initiative) ArcGIS layer](https://services.arcgis.com/zmBQLV64TsFvEpV0/ArcGIS/rest/services/BIWTA_Topo/FeatureServer/7)

### EPI wards and villages

After selecting a union, Map Studio requests its ward polygons from the DGHS ArcGIS service and displays them as **EPI wards**. These are health-service planning areas, not elected local-government wards. The DGHS methodology describes union subdivisions digitized for immunization planning; this layer is requested for the selected union only and is not bundled into this repository.

- [DGHS GIS methodology](https://gisdashboard.dghs.gov.bd/gis-methodology)
- [DGHS EPI ward polygon service](https://gis.dghs.gov.bd/server/rest/services/Hosted/All_Wards_main/FeatureServer/0)

No nationwide village-boundary polygon dataset with verifiable public reuse terms was found. BBS publishes census village statistics, and its ECDS portal describes authorized boundary downloads, but the public pages did not provide an open village-polygon file. Mauza cadastral boundaries are not assumed to equal village boundaries. The app therefore does not invent or mislabel village shapes; add a village layer only after obtaining a verified boundary file and reuse permission.

## Publish

This site is static. Upload the updated `scope-site` directory to the existing GitHub Pages repository; the app is available at `tools/map-studio/`.
