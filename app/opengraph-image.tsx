import { ImageResponse } from "next/og";
import { siteSeo } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteSeo.ogImageAlt;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #2c3a2e 0%, #1f2a21 55%, #3d4f3f 100%)",
          color: "#f7f4ef",
        }}
      >
        <div
          style={{
            fontSize: 72,
            letterSpacing: "0.28em",
            fontFamily: "serif",
            marginBottom: 24,
          }}
        >
          ORIVANA
        </div>
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.88,
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          Premium Mediterranean dates, olive oil & honey
        </div>
      </div>
    ),
    { ...size }
  );
}
