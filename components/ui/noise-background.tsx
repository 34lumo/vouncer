import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  backdropBlur?: boolean;
  animating?: boolean;
}

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(255, 100, 150)",
    "rgb(100, 150, 255)",
    "rgb(255, 200, 100)",
  ],
  noiseIntensity = 0.15,
}: NoiseBackgroundProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-neutral-800 p-2",
        "shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]",
        containerClassName,
      )}
    >
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, ${gradientColors[0]} 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, ${gradientColors[1]} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${gradientColors[2] || gradientColors[0]} 0%, transparent 50%)
          `,
          opacity: 0.35,
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80 blur-sm"
        style={{
          background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: noiseIntensity,
          mixBlendMode: "overlay" as const,
        }}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
