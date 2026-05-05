"use client";

type Point = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string | null;
  latitude: number;
  longitude: number;
};

export function SalePointsMap({ points }: { points: Point[] }) {
  if (!points.length) {
    return <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">No hay puntos activos.</div>;
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-card">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-100 via-white to-brand-200 bg-hero-grid bg-[size:34px_34px]">
          {points.map((point) => {
            const x = maxLng === minLng ? 50 : ((point.longitude - minLng) / (maxLng - minLng)) * 80 + 10;
            const y = maxLat === minLat ? 50 : ((maxLat - point.latitude) / (maxLat - minLat)) * 72 + 12;

            return (
              <div key={point.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <div className="h-4 w-4 rounded-full border-4 border-white bg-brand-700 shadow-lg ring-8 ring-brand-100/40" />
                <div className="mt-2 rounded-xl bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 shadow">
                  {point.city}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4">
        {points.map((point) => (
          <article key={point.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="text-lg font-bold text-slate-900">{point.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{point.address}</p>
            <p className="mt-1 text-sm text-slate-600">{point.city}</p>
            {point.phone ? <p className="mt-2 text-sm font-medium text-brand-700">{point.phone}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
