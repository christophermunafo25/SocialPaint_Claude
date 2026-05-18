"use client";

export function SocialPaintMark({ size = 22 }: { size?: number }) {
  // Stylized "petal" mark — matches the kickoff deck logo character.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#ED7472" />
      <path
        d="M11 11h4.2c2 0 3.4 1.1 3.4 2.9 0 1.3-.8 2.3-2 2.7 1.6.3 2.6 1.4 2.6 3 0 2-1.5 3.4-3.8 3.4H11V11Z"
        stroke="#0A0A0A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandHalo({ className }: { className?: string }) {
  // Logo-style gradient brand mark used as a wordless centerpiece on Home / Generating.
  return (
    <div
      className={className}
      style={{
        width: 60,
        height: 60,
        borderRadius: 14,
        background:
          "radial-gradient(circle at 30% 30%, #FFB079 0%, #ED7472 55%, #B14A4A 100%)",
        boxShadow:
          "0 14px 60px rgba(237,116,114,0.35), inset 0 0 24px rgba(255,255,255,0.18)",
      }}
    />
  );
}
