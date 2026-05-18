"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Avatar } from "@/components/ui/Avatar";
import { TEAM } from "@/lib/mock-data";
import { TEMPLATES } from "@/lib/mock-data";

const GENERATIONS_OVER_TIME = [
  { day: "Mon", value: 22 },
  { day: "Tue", value: 38 },
  { day: "Wed", value: 31 },
  { day: "Thu", value: 47 },
  { day: "Fri", value: 41 },
  { day: "Sat", value: 18 },
  { day: "Sun", value: 12 },
];

const COMPLIANCE_DISTRIBUTION = [
  { band: "<60", count: 4, color: "#ED7472" },
  { band: "60–74", count: 11, color: "#ED7472" },
  { band: "75–89", count: 86, color: "#F7C57A" },
  { band: "90–100", count: 183, color: "#7CE3B5" },
];

const LEADERBOARD = TEAM.slice(0, 5).map((u, i) => ({
  ...u,
  count: [41, 33, 28, 21, 14][i],
}));

export default function InsightsPage() {
  return (
    <div className="px-10 py-8 max-w-[1320px] mx-auto">
      <div className="mb-6">
        <div className="mono">§ 4.9 · Insights</div>
        <h1 className="text-[24px] font-medium tracking-tight mt-1">Insights</h1>
        <p className="text-[13px] text-white/45 mt-1">
          How the workspace is shipping. Last 7 days unless noted.
        </p>
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <Metric label="Generated" value="284" delta="↑ 32%" />
        <Metric label="Avg score" value="91.4" delta="↑ 4.2" />
        <Metric label="Hours saved" value="126h" delta="↑ 11h" />
        <Metric label="Top creator" value="Mira R." delta="41 generations" muted />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="mono">Generations over time</div>
            <div className="mono text-white/35">Last 7d</div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={GENERATIONS_OVER_TIME}
                margin={{ top: 10, right: 6, bottom: 0, left: -16 }}
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ED7472" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#ED7472" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "#ED7472", strokeOpacity: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ED7472"
                  strokeWidth={1.5}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="mono">Compliance distribution</div>
            <div className="mono text-white/35">All time</div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMPLIANCE_DISTRIBUTION}
                margin={{ top: 10, right: 6, bottom: 0, left: -16 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="band"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {COMPLIANCE_DISTRIBUTION.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard + templates */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <div className="surface p-5">
          <div className="mono mb-4">Leaderboard · last 7d</div>
          <div className="flex flex-col gap-2.5">
            {LEADERBOARD.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="mono w-5 text-white/35 tabular-nums">{i + 1}</span>
                <Avatar initials={u.initials} color={u.avatarColor} size={26} />
                <span className="text-[13px] text-white/90 flex-1 truncate">{u.name}</span>
                <span className="tabular-nums text-[13px] text-white/65">{u.count}</span>
                <div className="w-[120px] h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${(u.count / 41) * 100}%`,
                      background: i === 0 ? "#ED7472" : "rgba(255,255,255,0.45)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <div className="mono mb-4">Most-used templates</div>
          <div className="flex flex-col gap-2.5">
            {TEMPLATES.slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <div
                  className="h-7 w-7 rounded-md flex-shrink-0"
                  style={{ background: t.thumbBg }}
                />
                <span className="text-[13px] text-white/90 flex-1 truncate">{t.name}</span>
                <span className="tabular-nums text-[13px] text-white/55">
                  {[58, 41, 33, 22, 12][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  muted,
}: {
  label: string;
  value: string;
  delta?: string;
  muted?: boolean;
}) {
  return (
    <div className="surface p-5">
      <div className="mono mb-2">{label}</div>
      <div className="text-[28px] font-medium tracking-tight tabular-nums">{value}</div>
      {delta && (
        <div
          className="mt-1 text-[11.5px] font-mono uppercase tracking-[0.06em]"
          style={{ color: muted ? "rgba(255,255,255,0.4)" : "#7CE3B5" }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
