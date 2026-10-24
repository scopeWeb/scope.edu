# SCOPE Map Studio

Static browser app, linked from the SCOPE site navigation. It draws administrative GeoJSON in an SVG and stores the user's layers and markers in browser local storage. No map API key or server-side account is needed.

## Included features

- Bangladesh division, district, upazila, union/ward-area and optional EPI ward selectors.
- Custom category layers, colors, place labels and notes. Click the map to add a location.
- Browser auto-save and project JSON import/export.
- PNG download and browser print-to-PDF.
- Optional river overlay with four independently selectable stream-order levels, saved with the user's project and included in PNG/PDF exports.
- English/Bangla controls, SCOPE logo and brand palette.
- Map editor toolbar to switch area-label language, hide labels, show or hide internal boundaries, change boundary color/width, and rename any clicked area with a custom spelling. These settings and names persist locally and are included in project JSON export.

## Boundary data

The bundled boundaries come from the BBS 2022 administrative boundary layer served by the ArcGIS endpoint below. The data is packaged as JavaScript files so the app can load it both from a local `file://` page and from a static host such as GitHub Pages; browser `fetch()` cannot reliably read local files. The four layers were simplified for display at a 0.002-degree tolerance and coordinate precision of five decimals. The union/ward layer has 8,172 records; it includes union areas and municipal/city-corporation ward records. Its area labels use the union/ward name, and the map tooltip identifies municipal/city-corporation ward records.

- [BBS institutional portal](https://ecds.bbs.gov.bd/Home/AboutUs)
- [ArcGIS boundary service](https://www.arcgisbd.com/server/rest/services/ADB005/CRIIPS/MapServer)

Check the source and current administrative records before using the map for official or operational decisions. If BBS updates its boundaries, regenerate the four JavaScript files in `data/` and preserve the expected property names (`Division`, `District`, `Upazila`, `UnName`, `Municipal`, `CityCorp`).

### Area labels and boundary display

The toolbar can hide internal administrative separators while keeping a dissolved outline of Bangladesh visible on the nationwide map. Filled areas keep their own borders when the separators are hidden. Users can restore all internal boundaries at any time, set their color and thickness in the toolbar, toggle map labels, switch between English and Bengali labels, and click **Rename areas** to save a custom spelling. Overrides are keyed to the selected area's administrative identity, so changing display language does not erase them.

The bundled Bengali reference names for divisions, districts, and available upazilas are from [Open Admin Data](https://github.com/open-admin-data/bangladesh-administrative-divisions) (CC BY 4.0). Union names use [bd-geo-info](https://github.com/mdtanvirahamedshanto/bd-geo-info) (MIT). Those reference lists do not match every BBS spelling; unmatched names fall back to the BBS label and can be corrected with the custom-name editor. The dissolved country outline is derived from the bundled BBS 2022 division polygons.

### Road and highway lines

The map combines the Roads and Highways Department (RHD) hosted **RHD All Road Single Line** GIS layer with OpenStreetMap road classes. RHD National, Regional, and Zilla roads are grouped into Levels 1–3 and drawn with a stronger stroke over the OSM reference lines. Level 3 is enabled by default so secondary connections are visible in the nationwide view. The RHD layer is a useful backbone, but its published GIS service and OSM are not guaranteed to contain every road or bridge connection; verify operational routes against current RHD/LGED records.

- [RHD All Road Single Line GIS service](https://gis.rhd.gov.bd/server/rest/services/Hosted/RHD_Road_Single_Line/FeatureServer/0)
- [RHD Online Road Network](https://rhd.gov.bd/OnlineRoadNetwork/Default.asp)
- [OpenStreetMap attribution and licence](https://www.openstreetmap.org/copyright)

### River lines

The optional river overlay is derived from the Asia release of HydroRIVERS v10. Its actual Strahler stream-order attribute is grouped into four selectable levels:

- Level 1: orders 6 and higher — main rivers.
- Level 2: orders 4–5 — larger tributaries.
- Level 3: orders 2–3 — smaller tributaries.
- Level 4: order 1 — headwater reaches.

The bundled data contains 26,497 generalized river reaches. Rivers are off by default. Turning the river layer on reveals independent checkboxes for each level; any combination can be displayed. Line widths also decrease from Level 1 to Level 4. The selected visibility and levels persist in the browser and in exported project JSON. River reach geometries are generalized for display and included in PNG/PDF exports. The selection mask is simplified from the bundled BBS administrative polygons and buffered by 0.03 degrees to keep river channels that sit just outside land boundaries; short reaches near an international/coastal border can therefore extend outside the administrative outline.

HydroRIVERS maps rivers with catchment area of at least 10 km² or average flow of at least 0.1 m³/s. It is a generalized reference network, not a complete/current BWDB inventory; many small streams, canals and recent channel changes are not represented. Check current official records before operational use. Source and license details are on the [HydroRIVERS product page](https://www.hydrosheds.org/products/hydrorivers); attribution is shown in the map footer.

- [HydroRIVERS v10](https://www.hydrosheds.org/products/hydrorivers)

### EPI wards and villages

After selecting a union, Map Studio requests its ward polygons from the DGHS ArcGIS service and displays them as **EPI wards**. These are health-service planning areas, not elected local-government wards. The DGHS methodology describes union subdivisions digitized for immunization planning; this layer is requested for the selected union only and is not bundled into this repository.

- [DGHS GIS methodology](https://gisdashboard.dghs.gov.bd/gis-methodology)
- [DGHS EPI ward polygon service](https://gis.dghs.gov.bd/server/rest/services/Hosted/All_Wards_main/FeatureServer/0)

No nationwide village-boundary polygon dataset with verifiable public reuse terms was found. BBS publishes census village statistics, and its ECDS portal describes authorized boundary downloads, but the public pages did not provide an open village-polygon file. Mauza cadastral boundaries are not assumed to equal village boundaries. The app therefore does not invent or mislabel village shapes; add a village layer only after obtaining a verified boundary file and reuse permission.

## Publish

This site is static. Upload the updated `scope-site` directory to the existing GitHub Pages repository; the app is available at `tools/map-studio/`.
