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
import { BarChart3 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Eyebrow } from "@/components/ui/Badge";
import { TEAM, TEMPLATES } from "@/lib/mock-data";

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
  { band: "<60", count: 4, color: "#f29593" },
  { band: "60–74", count: 11, color: "#f29593" },
  { band: "75–89", count: 86, color: "#f3da8a" },
  { band: "90–100", count: 183, color: "#a9e8b5" },
];

const LEADERBOARD = TEAM.slice(0, 5).map((u, i) => ({
  ...u,
  count: [41, 33, 28, 21, 14][i],
}));

const TOOLTIP_STYLE = {
  background: "#221e22",
  border: "1px solid rgba(247,246,245,0.08)",
  borderRadius: 12,
  fontSize: 12,
  color: "#f7f6f5",
  fontFamily: "var(--font-mono)",
};

export default function InsightsPage() {
  return (
    <div className="px-10 py-9 max-w-[1340px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Eyebrow>Insights · Workspace activity</Eyebrow>
      </div>
      <div className="flex items-end gap-4 mb-7">
        <div
          className="icon-tile"
          style={{
            width: 48,
            height: 48,
            background: "var(--sand)",
            color: "#231f23",
          }}
        >
          <BarChart3 size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="h1">Insights</h1>
          <p className="body mt-1.5">
            How the workspace is shipping. Last 7 days unless noted.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <Metric label="Generated" value="284" delta="↑ 32%" pastel="var(--mint)" />
        <Metric label="Avg score" value="91.4" delta="↑ 4.2" pastel="var(--sand)" />
        <Metric label="Hours saved" value="126h" delta="↑ 11h" pastel="var(--orchid)" />
        <Metric
          label="Top creator"
          value="Mira R."
          delta="41 generations"
          muted
          pastel="var(--peach)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="surface p-5">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow>Generations over time</Eyebrow>
            <span className="label-sm">Last 7d</span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={GENERATIONS_OVER_TIME}
                margin={{ top: 10, right: 6, bottom: 0, left: -16 }}
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5c044" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#ed5a2a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(247,246,245,0.04)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(247,246,245,0.48)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(247,246,245,0.32)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ stroke: "#ed7472", strokeOpacity: 0.35 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f17a3b"
                  strokeWidth={1.5}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow>Compliance distribution</Eyebrow>
            <span className="label-sm">All time</span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMPLIANCE_DISTRIBUTION}
                margin={{ top: 10, right: 6, bottom: 0, left: -16 }}
              >
                <CartesianGrid stroke="rgba(247,246,245,0.04)" vertical={false} />
                <XAxis
                  dataKey="band"
                  tick={{ fill: "rgba(247,246,245,0.48)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(247,246,245,0.32)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "rgba(247,246,245,0.04)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {COMPLIANCE_DISTRIBUTION.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <div className="surface p-5">
          <Eyebrow className="mb-4">Leaderboard · last 7d</Eyebrow>
          <div className="flex flex-col gap-3">
            {LEADERBOARD.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <span
                  className="label-sm w-5 tabular-nums"
                  style={{ color: "var(--fg-3)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <Avatar initials={u.initials} color={u.avatarColor} size={26} />
                <span
                  className="text-[13.5px] flex-1 truncate"
                  style={{ color: "var(--fg-1)" }}
                >
                  {u.name}
                </span>
                <span
                  className="tabular-nums text-[13px]"
                  style={{ color: "var(--fg-2)" }}
                >
                  {u.count}
                </span>
                <div
                  className="w-[140px] h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(247,246,245,0.06)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: `${(u.count / 41) * 100}%`,
                      background:
                        i === 0
                          ? "linear-gradient(90deg, #ed5a2a, #f17a3b 60%, #f5c044)"
                          : "rgba(247,246,245,0.48)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <Eyebrow className="mb-4">Most-used templates</Eyebrow>
          <div className="flex flex-col gap-3">
            {TEMPLATES.slice(0, 5).map((t, i) => {
              const pastel =
                t.palette === "paper"
                  ? "#f7f6f5"
                  : t.palette === "mesh"
                  ? "linear-gradient(135deg, #f5c044, #ed5a2a)"
                  : t.palette === "orchid"
                  ? "#cebffa"
                  : t.palette === "mint"
                  ? "#ccfdcf"
                  : t.palette === "sand"
                  ? "#fff4b8"
                  : t.palette === "peach"
                  ? "#ffe1d6"
                  : "#1a171a";
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex-shrink-0"
                    style={{
                      background: pastel,
                      border: "1px solid rgba(247,246,245,0.06)",
                    }}
                  />
                  <span
                    className="text-[13.5px] flex-1 truncate"
                    style={{ color: "var(--fg-1)" }}
                  >
                    {t.name}
                  </span>
                  <span
                    className="tabular-nums text-[13px]"
                    style={{ color: "var(--fg-2)" }}
                  >
                    {[58, 41, 33, 22, 12][i]}
                  </span>
                </div>
              );
            })}
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
  pastel,
}: {
  label: string;
  value: string;
  delta?: string;
  muted?: boolean;
  pastel: string;
}) {
  return (
    <div className="surface p-5 relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <Eyebrow>{label}</Eyebrow>
        <span
          className="icon-tile"
          style={{
            width: 22,
            height: 22,
            background: pastel,
            borderRadius: 8,
            opacity: 0.85,
          }}
        />
      </div>
      <div
        className="text-[32px] tabular-nums"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          letterSpacing: "-1px",
          color: "var(--fg-1)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {delta && (
        <div
          className="mt-2 label-sm"
          style={{ color: muted ? "var(--fg-3)" : "#a9e8b5" }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
