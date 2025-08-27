// components/AdUnit.js
import { useEffect } from "react";

export default function AdUnit({ slot, format = "auto", responsive = "true" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2053494212350614"   // your publisher ID
      data-ad-slot={slot}                       // ad slot ID from AdSense
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
