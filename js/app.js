(function () {
  const {
    countryMeta
  } = window.PhoneTrackerData;

  const {
    digitsOnly,
    formatPhoneInput,
    validateNumber,
    parsePhone
  } = window.PhoneTrackerParser;

  const {
    ensureMap,
    recenterMap,
    invalidateMapSize
  } = window.PhoneTrackerMap;

  const {
    saveHistoryItem,
    renderHistory
  } = window.PhoneTrackerHistory;

  const {
    runScanAnimation
  } = window.PhoneTrackerScanner;

  const {
    shareResultCard
  } = window.PhoneTrackerShare;

  const {
    unlockAudio,
    playSuccess,
    playError
  } = window.PhoneTrackerAudio;

  let lastResult = null;

  const els = {
    matrixCanvas: document.getElementById("matrixCanvas"),
    countryCode: document.getElementById("countryCode"),
    phoneInput: document.getElementById("phoneInput"),
    trackBtn: document.getElementById("trackBtn"),
    formatHint: document.getElementById("formatHint"),
    errorText: document.getElementById("errorText"),
    resultsWrap: document.getElementById("resultsWrap"),
    resultsGrid: document.getElementById("resultsGrid"),
    historyList: document.getElementById("historyList"),
    copyCoordsBtn: document.getElementById("copyCoordsBtn"),
    shareBtn: document.getElementById("shareBtn"),
    recenterBtn: document.getElementById("recenterBtn"),
    scanOverlay: document.getElementById("scanOverlay"),
    scanStatus: document.getElementById("scanStatus"),
    scanSubtext: document.getElementById("scanSubtext"),
    terminalLines: document.getElementById("terminalLines"),
    progressFill: document.getElementById("progressFill"),
    progressPercent: document.getElementById("progressPercent"),
    toast: document.getElementById("toast"),
    shareCard: document.getElementById("shareCard"),
    shareGrid: document.getElementById("shareGrid"),
    shareTimestamp: document.getElementById("shareTimestamp")
  };

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      els.toast.classList.remove("show");
    }, 2200);
  }

  function clearError() {
    els.errorText.style.display = "none";
    els.phoneInput.classList.remove("shake");
  }

  function showError(message) {
    els.errorText.textContent = message;
    els.errorText.style.display = "block";
    els.phoneInput.classList.add("shake");
    setTimeout(() => els.phoneInput.classList.remove("shake"), 350);
    playError();
  }

  function updateFormatHint() {
    const meta = countryMeta[els.countryCode.value];
    els.formatHint.textContent = meta?.format || "Generic phone format enabled";
    els.phoneInput.value = formatPhoneInput(
      els.countryCode.value,
      digitsOnly(els.phoneInput.value)
    );
    clearError();
  }

  function createInfoCard(label, value, sub = "") {
    return `
      <article class="info-card glass">
        <div class="info-label">${label}</div>
        <div class="info-value">${value}</div>
        ${sub ? `<div class="info-sub">${sub}</div>` : ""}
      </article>
    `;
  }

  function renderResults(result) {
    els.resultsGrid.innerHTML = [
      createInfoCard("📍 Location", result.location, "Approximate prefix-based region"),
      createInfoCard("📡 Carrier", result.carrier, result.formatted),
      createInfoCard(
        "🌍 Country Code",
        `${result.flag} ${result.countryCode} · ${result.iso}`,
        result.countryName
      ),
      createInfoCard(
        "🕐 Timezone",
        result.timezone,
        `Local time: ${result.localTime}`
      ),
      createInfoCard(
        "📊 Number Type",
        result.numberType,
        result.state !== "-" ? `State/Region: ${result.state}` : "Heuristic detection"
      )
    ].join("");

    els.resultsWrap.classList.add("show");

    ensureMap(result.lat, result.lng, result.location);
    invalidateMapSize();
  }

  function handleHistoryClick(item) {
    els.countryCode.value = item.countryCode;
    updateFormatHint();
    els.phoneInput.value = formatPhoneInput(item.countryCode, item.number);
    performTrack();
  }

  function copyCoordinates() {
    if (!lastResult) {
      showToast("No coordinates to copy yet.");
      return;
    }

    const coords = `${lastResult.lat}, ${lastResult.lng}`;
    navigator.clipboard.writeText(coords)
      .then(() => showToast(`Copied: ${coords}`))
      .catch(() => showToast("Clipboard access failed."));
  }

  function handleShare() {
    shareResultCard({
      result: lastResult,
      shareCardEl: els.shareCard,
      shareGridEl: els.shareGrid,
      shareTimestampEl: els.shareTimestamp,
      onToast: showToast
    });
  }

  function handleRecenter() {
    if (!lastResult) {
      showToast("No active result to recenter.");
      return;
    }

    recenterMap(lastResult.lat, lastResult.lng, lastResult.location);
    invalidateMapSize();
    showToast("Map recentered.");
  }

  function performTrack() {
    clearError();
    unlockAudio();

    const countryCode = els.countryCode.value;
    const rawDigits = digitsOnly(els.phoneInput.value);

    if (rawDigits === "000000000") {
      showToast("Nice try, hacker 😎");
      return;
    }

    if (!validateNumber(countryCode, rawDigits)) {
      showError("Invalid number for the selected country.");
      return;
    }

    const parsed = parsePhone(countryCode, rawDigits);
    lastResult = parsed;

    runScanAnimation({
      overlayEl: els.scanOverlay,
      terminalLinesEl: els.terminalLines,
      progressFillEl: els.progressFill,
      progressPercentEl: els.progressPercent,
      scanStatusEl: els.scanStatus,
      scanSubtextEl: els.scanSubtext,
      onComplete: () => {
        renderResults(parsed);
        saveHistoryItem(parsed, rawDigits);
        renderHistory(els.historyList, handleHistoryClick);
        playSuccess();

        setTimeout(() => {
          els.resultsWrap.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 80);
      }
    });
  }

  function initMatrix() {
    const canvas = els.matrixCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+-<>/\\";
    const matrixChars = chars.split("");
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    function resizeMatrix() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
      invalidateMapSize();
    }

    function drawMatrix() {
      ctx.fillStyle = "rgba(5, 5, 5, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00FF41";
      ctx.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    setInterval(drawMatrix, 55);
    window.addEventListener("resize", resizeMatrix);
  }

  function bindEvents() {
    els.countryCode.addEventListener("change", updateFormatHint);

    els.phoneInput.addEventListener("input", (e) => {
      clearError();
      const digits = digitsOnly(e.target.value);
      e.target.value = formatPhoneInput(els.countryCode.value, digits);
    });

    els.phoneInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        performTrack();
      }
    });

    els.trackBtn.addEventListener("click", performTrack);
    els.copyCoordsBtn.addEventListener("click", copyCoordinates);
    els.shareBtn.addEventListener("click", handleShare);
    els.recenterBtn.addEventListener("click", handleRecenter);

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });
  }

  function init() {
    updateFormatHint();
    renderHistory(els.historyList, handleHistoryClick);
    bindEvents();
    initMatrix();
  }

  init();
})();