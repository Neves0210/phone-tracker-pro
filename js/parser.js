(function () {
  const {
    countryMeta,
    brazilAreaCodes,
    usAreaCodes,
    countryFallbacks,
    brazilCarriers
  } = window.PhoneTrackerData;

  function digitsOnly(value) {
    return (value || "").replace(/\D/g, "");
  }

  function formatPhoneInput(countryCode, digits) {
    if (!digits) return "";

    if (countryCode === "+55") {
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 10) {
        return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
      }
      return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    if (countryCode === "+1") {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    if (countryCode === "+44") {
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }

    if (countryCode === "+91") {
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }

    if (
      countryCode === "+351" ||
      countryCode === "+34" ||
      countryCode === "+33" ||
      countryCode === "+39"
    ) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  }

  function validateNumber(countryCode, digits) {
    const meta = countryMeta[countryCode];
    if (!meta) return false;
    return meta.mobileLength.includes(digits.length);
  }

  function detectBrazilCarrier(digits) {
    if (digits.length < 4) return "Unknown Carrier";
    const mobilePrefix = digits.slice(2, 4);
    return brazilCarriers[mobilePrefix] || "Unknown Carrier";
  }

  function detectBrazilType(digits) {
    if (digits.length === 11) {
      return digits[2] === "9" ? "Mobile" : "Unknown";
    }

    if (digits.length === 10) {
      return "Landline";
    }

    return "Unknown";
  }

  function detectUsType(digits) {
    const tollFreePrefixes = ["800", "833", "844", "855", "866", "877", "888"];
    if (tollFreePrefixes.includes(digits.slice(0, 3))) return "Toll-free";
    if (digits.startsWith("500") || digits.startsWith("600")) return "VoIP";
    return "Mobile / Landline";
  }

  function detectUsTimezoneByState(state) {
    if (["CA", "WA", "OR", "NV"].includes(state)) return "America/Los_Angeles";
    if (["TX", "IL", "MN", "TN", "LA", "WI", "AL", "MS", "OK", "KS"].includes(state)) return "America/Chicago";
    if (["AZ"].includes(state)) return "America/Phoenix";
    if (["CO", "UT", "NM"].includes(state)) return "America/Denver";
    if (["AK"].includes(state)) return "America/Anchorage";
    if (["HI"].includes(state)) return "Pacific/Honolulu";
    return "America/New_York";
  }

  function getLocalTime(timezone) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: timezone
      }).format(new Date());
    } catch {
      return "Unknown";
    }
  }

  function parsePhone(countryCode, digits) {
    const meta = countryMeta[countryCode];
    const fallback = countryFallbacks[countryCode];

    let result = {
      countryName: meta?.name || "Unknown Country",
      countryCode,
      iso: meta?.iso || "--",
      flag: meta?.flag || "🌍",
      location: meta?.name || "Unknown Country",
      region: "Unknown Region",
      state: "-",
      lat: 0,
      lng: 0,
      carrier: "Unknown Carrier",
      timezone: meta?.timezone || "UTC",
      numberType: "Unknown",
      formatted: formatPhoneInput(countryCode, digits),
      localTime: "Unknown"
    };

    if (countryCode === "+55") {
      const ddd = digits.slice(0, 2);
      const region = brazilAreaCodes[ddd];

      if (region) {
        result.region = region.city;
        result.state = region.state;
        result.location = `${region.city}, ${region.state}`;
        result.lat = region.lat;
        result.lng = region.lng;
        result.timezone = region.timezone;
      } else {
        result.location = "Brazil";
        result.region = "Unknown Region";
        result.lat = -14.235;
        result.lng = -51.9253;
      }

      result.carrier = detectBrazilCarrier(digits);
      result.numberType = detectBrazilType(digits);
    }
    else if (countryCode === "+1") {
      const area = digits.slice(0, 3);
      const region = usAreaCodes[area];

      if (region) {
        result.region = region[0];
        result.state = region[1];
        result.location = `${region[0]}, ${region[1]}`;
        result.lat = region[2];
        result.lng = region[3];
        result.timezone = detectUsTimezoneByState(region[1]);
      } else {
        result.location = "United States / Canada";
        result.region = "Unknown Region";
        result.lat = 39.8283;
        result.lng = -98.5795;
        result.timezone = "America/New_York";
      }

      result.carrier = "Mobile Carrier";
      result.numberType = detectUsType(digits);
    }
    else {
      result.region = fallback?.region || meta?.name || "Unknown Region";
      result.location = fallback?.region || meta?.name || "Unknown Country";
      result.state = "-";
      result.lat = fallback?.lat || 0;
      result.lng = fallback?.lng || 0;
      result.timezone = fallback?.timezone || meta?.timezone || "UTC";
      result.carrier = fallback?.carrier || "Unknown Carrier";
      result.numberType = fallback?.type || "Mobile";
    }

    result.localTime = getLocalTime(result.timezone);
    return result;
  }

  window.PhoneTrackerParser = {
    digitsOnly,
    formatPhoneInput,
    validateNumber,
    parsePhone,
    getLocalTime
  };
})();