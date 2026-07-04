import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c3a2e",
          color: "#f7f4ef",
          fontSize: 72,
          fontFamily: "serif",
          letterSpacing: "0.08em",
        }}
      >
        O
      </div>
    ),
    { ...size }
  );
}
