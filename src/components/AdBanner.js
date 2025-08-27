"use client";
import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2053494212350614"
      data-ad-slot="1234567890"   // 🔹 Replace with your Ad Slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
