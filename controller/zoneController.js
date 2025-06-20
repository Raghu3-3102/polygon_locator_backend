import fs from "fs";
import { DOMParser } from "xmldom";
import { kml as convertToGeoJSON } from "@tmcw/togeojson";
import Zone from "../models/Zone.js";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

const checkLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "Invalid or missing coordinates." });
    }

    const userPoint = turfPoint([lng, lat]);
    const zones = await Zone.find();

    for (const zone of zones) {
      const polygonFeature = {
        type: "Feature",
        geometry: zone.geometry,
      };

      if (booleanPointInPolygon(userPoint, polygonFeature)) {
        return res.json({
          matched: true,
          zone: zone.zone,
          properties: zone.properties,
        });
      }
    }

    // No match found
    return res.json({
      matched: false,
      message: "Coming soon to your area",
    });
  } catch (err) {
    console.error("Error checking location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const importKML = async (req, res) => {
  try {
    const kmlBuffer = req.file?.buffer;
    const zonesInput = req.body?.zones;

    if (!kmlBuffer || !zonesInput) {
      return res.status(400).json({ error: "Missing file or zones data" });
    }

    // Parse zones JSON from string
    let zonesMetadata;
    try {
      zonesMetadata = JSON.parse(zonesInput);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in 'zones'" });
    }

    // Convert buffer to string and parse into DOM
    const kmlText = kmlBuffer.toString("utf-8");
    const kmlDoc = new DOMParser().parseFromString(kmlText);
    const geojson = convertToGeoJSON(kmlDoc);

    const features = geojson.features.filter(f =>
      f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon"
    );

    if (!features.length) {
      return res.status(400).json({ error: "No valid polygons found in KML" });
    }

    // Clear existing zones (optional)
    await Zone.deleteMany();

    const createZones = features.map((feature, index) => {
      const zoneName = feature.properties?.name || `Zone-${index + 1}`;

      if (!zonesMetadata[zoneName]) {
        throw new Error(`Missing properties for zone: ${zoneName}`);
      }

      return Zone.create({
        zone: zoneName,
        properties: zonesMetadata[zoneName],
        geometry: feature.geometry,
      });
    });

    await Promise.all(createZones);

    res.json({ message: "Zones imported successfully", count: createZones.length });
  } catch (err) {
    console.error("KML import error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export default {checkLocation,importKML}