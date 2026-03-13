"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLayoutEffect } from "react";

const defaultCenter: [number, number] = [26.2, 92.9]; // Rough center of Assam

type DistrictMarker = {
  slug: string;
  name: string;
  position: [number, number];
};

const DISTRICTS: DistrictMarker[] = [
  { slug: "guwahati", name: "Guwahati", position: [26.1445, 91.7362] },
  { slug: "majuli", name: "Majuli", position: [27.0, 94.2] },
  { slug: "sivasagar", name: "Sivasagar", position: [26.9985, 94.6376] },
  { slug: "kaziranga", name: "Kaziranga", position: [26.5775, 93.1711] },
  { slug: "tezpur", name: "Tezpur", position: [26.6334, 92.8] },
  { slug: "jorhat", name: "Jorhat", position: [26.75, 94.2167] },
  { slug: "dibrugarh", name: "Dibrugarh", position: [27.4833, 95.0] },
  { slug: "tinsukia", name: "Tinsukia", position: [27.5, 95.3667] },
  { slug: "goalpara", name: "Goalpara", position: [26.1667, 90.6167] },
  { slug: "nalbari", name: "Nalbari", position: [26.45, 91.45] },
  { slug: "morigaon", name: "Morigaon", position: [26.25, 92.35] },
];

// Fix default marker icon paths for Leaflet in Next.js
function configureLeafletIcons() {
  // @ts-expect-error leaflet icon config for bundled assets
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export interface AssamMapProps {
  selectedDistrictSlug?: string;
  onSelectDistrict?: (slug: string) => void;
}

export function AssamMap({
  selectedDistrictSlug,
  onSelectDistrict,
}: AssamMapProps) {
  const isClient = typeof window !== 'undefined';

  useLayoutEffect(() => {
    configureLeafletIcons();
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      id="assam-cultural-map"
      center={defaultCenter}
      zoom={7}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {DISTRICTS.map((district) => (
        <Marker
          key={district.slug}
          position={district.position}
          eventHandlers={{
            click: () => onSelectDistrict?.(district.slug),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <div className="font-semibold">{district.name}</div>
              {selectedDistrictSlug === district.slug && (
                <div className="text-xs text-green-600 font-medium">Currently selected</div>
              )}
              <button
                className="text-sm text-sky-600 hover:underline"
                onClick={() => onSelectDistrict?.(district.slug)}
              >
                View cultural experiences
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}