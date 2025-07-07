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
    const propertiesInput = req.body?.properties;

    if (!kmlBuffer || !propertiesInput) {
      return res.status(400).json({ error: "Missing file or properties data" });
    }

    let sharedProperties;
    try {
      sharedProperties = JSON.parse(propertiesInput);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in 'properties'" });
    }

    const kmlText = kmlBuffer.toString("utf-8");
    const kmlDoc = new DOMParser().parseFromString(kmlText);
    const geojson = convertToGeoJSON(kmlDoc);

    const features = geojson.features.filter(f =>
      f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon"
    );

    if (!features.length) {
      return res.status(400).json({ error: "No valid polygons found in KML" });
    }

    await Zone.deleteMany();

    const createZones = features.map((feature, index) => {
      const zoneName = `Zone-${index + 1}`;

      return Zone.create({
        zone: zoneName,
        properties: sharedProperties,
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