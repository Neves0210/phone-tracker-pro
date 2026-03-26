(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (window.html2canvas) {
          resolve();
          return;
        }
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }

  function buildShareCard(result, shareGridEl, shareTimestampEl) {
    if (!result || !shareGridEl || !shareTimestampEl) return;

    const coords =
      typeof result.lat === "number" && typeof result.lng === "number"
        ? `${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`
        : "Unknown";

    const items = [
      ["📍 Location", result.location || "Unknown"],
      ["📡 Carrier", result.carrier || "Unknown Carrier"],
      ["🌍 Country", `${result.flag || "🌍"} ${result.countryName || "Unknown Country"}`],
      ["🕐 Timezone", result.timezone || "Unknown"],
      ["📊 Number Type", result.numberType || "Unknown"],
      ["🧭 Coordinates", coords]
    ];

    shareGridEl.innerHTML = items
      .map(
        ([k, v]) => `
          <div class="share-box">
            <div class="k">${k}</div>
            <div class="v">${v}</div>
          </div>
        `
      )
      .join("");

    shareTimestampEl.textContent = new Date().toLocaleString();
  }

  async function ensureHtml2Canvas() {
    if (window.html2canvas) return;
    await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
  }

  async function shareResultCard({
    result,
    shareCardEl,
    shareGridEl,
    shareTimestampEl,
    onToast
  }) {
    if (!result) {
      if (typeof onToast === "function") onToast("No result available to share.");
      return;
    }

    buildShareCard(result, shareGridEl, shareTimestampEl);

    try {
      await ensureHtml2Canvas();

      const canvas = await window.html2canvas(shareCardEl, {
        backgroundColor: null,
        scale: 1.6,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          if (typeof onToast === "function") onToast("Failed to generate share image.");
          return;
        }

        const file = new File([blob], "phone-tracker-result.png", {
          type: "image/png"
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "Phone Tracker Result",
              text: "Generated with Phone Tracker PRO",
              files: [file]
            });

            if (typeof onToast === "function") onToast("Share sheet opened.");
            return;
          } catch {
            /* fallback below */
          }
        }

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "phone-tracker-result.png";
        a.click();

        setTimeout(() => URL.revokeObjectURL(a.href), 1000);

        if (typeof onToast === "function") onToast("Result image downloaded.");
      }, "image/png");
    } catch {
      if (typeof onToast === "function") onToast("Could not generate the share image.");
    }
  }

  window.PhoneTrackerShare = {
    buildShareCard,
    shareResultCard
  };
})();