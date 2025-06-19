import fs from "fs";
import { DOMParser } from "xmldom";
import { kml } from "@tmcw/togeojson";
import Zone from "../models/Zone.js";
import { point, booleanPointInPolygon } from "@turf/turf";

const checkLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const zones = await Zone.find();

    const point = point([lng, lat]);

    for (const zone of zones) {
      const polygon = {
        type: "Feature",
        geometry: zone.geometry,
      };

      if (booleanPointInPolygon(point, polygon)) {
        return res.json({
          matched: true,
          zone: zone.zone,
          properties: zone.properties,
        });
      }
    }

    return res.json({ matched: false });
  } catch (err) {
    console.error("Error checking location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const importKML = async (req, res) => {
  try {
    const filePath = req.file.path;

    const kmlText = fs.readFileSync(filePath, "utf8");
    const kmlDoc = new DOMParser().parseFromString(kmlText);
    const geojson = kml(kmlDoc);

    await Zone.deleteMany();

    const promises = geojson.features.map((feature, i) => {
      return Zone.create({
        zone: `Zone-${i + 1}`,
        properties: [
          { price: 599, speed: "30 mbps" },
          { price: 899, speed: "100 mbps" },
        ],
        geometry: feature.geometry,
      });
    });

    await Promise.all(promises);

    res.json({ message: "Zones imported successfully" });
  } catch (err) {
    console.error("KML import error:", err);
    res.status(500).json({ error: "Failed to import KML" });
  }
};


export default {checkLocation,importKML}