import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ByMagiq — AI that remembers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#14171C",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#3454D1",
          }}
        >
          ByMagiq
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#FAFAF8",
              maxWidth: 980,
            }}
          >
            Most AI forgets you the moment you close the tab.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(250, 250, 248, 0.65)",
              maxWidth: 820,
            }}
          >
            ByMagiq builds tools for AI that keeps its memory.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
