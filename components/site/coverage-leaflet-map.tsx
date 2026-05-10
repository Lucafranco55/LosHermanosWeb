"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const locations: Array<{ name: string; position: [number, number] }> = [
  { name: "General Belgrano", position: [-35.7696, -58.4937] },
  { name: "San Miguel del Monte", position: [-35.4395, -58.8072] },
  { name: "Lobos", position: [-35.1844, -59.0944] },
  { name: "Cañuelas", position: [-35.0518, -58.7606] },
  { name: "Navarro", position: [-35.005, -59.2767] },
  { name: "Mercedes", position: [-34.6515, -59.4307] },
  { name: "Brandsen", position: [-35.1684, -58.2343] },
  { name: "Ranchos", position: [-35.5167, -58.3181] },
  { name: "Las Flores", position: [-36.0143, -59.0991] },
  { name: "Dolores", position: [-36.3132, -57.6792] },
  { name: "Castelli", position: [-36.0891, -57.8062] },
  { name: "Lezama", position: [-35.876, -57.886] },
  { name: "Pila", position: [-36.0041, -58.1411] },
  { name: "Gorchs", position: [-35.6833, -58.95] }
];

const markerIcon = L.divIcon({
  className: "",
  html: `
    <span style="
      display:block;
      width:18px;
      height:18px;
      border-radius:9999px;
      background:#0f76a8;
      border:4px solid white;
      box-shadow:0 10px 24px rgba(15,118,168,0.35);
    "></span>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12]
});

export function CoverageLeafletMap() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-3 shadow-card">
      <MapContainer
        center={[-35.45, -58.65]}
        zoom={7}
        scrollWheelZoom
        className="h-[420px] w-full rounded-[1.5rem] sm:h-[500px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location.name} position={location.position} icon={markerIcon}>
            <Popup>
              <div className="min-w-40">
                <p className="font-semibold text-slate-900">{location.name}</p>
                <p className="mt-1 text-sm text-slate-700">Zona de cobertura</p>
                <p className="text-sm text-slate-600">Entregas programadas</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
