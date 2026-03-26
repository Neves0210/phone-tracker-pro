(function () {
  const fakeFragments = [
    "SYNC NODE",
    "ROUTE TRACE",
    "HEX LOCK",
    "PREFIX MAP",
    "AREA GRID",
    "COORD ESTIMATE",
    "PACKET RELAY",
    "SIGNAL BURST",
    "CARRIER MATCH",
    "TIMEZONE RESOLVE",
    "REGION HASH",
    "CELL TOWER",
    "TRIANGULATION",
    "SAT LINK",
    "INDEX"
  ];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomHex(length = 8) {
    const chars = "ABCDEF0123456789";
    let out = "";
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  function randomIp() {
    return `${rand(12, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
  }

  function randomCoord(min, max) {
    return (Math.random() * (max - min) + min).toFixed(4);
  }

  function randomTerminalLine() {
    const lat = randomCoord(-90, 90);
    const lng = randomCoord(-180, 180);
    const frag = fakeFragments[Math.floor(Math.random() * fakeFragments.length)];

    const patterns = [
      `[OK] ${frag} :: ${randomHex(10)} :: ${randomIp()}`,
      `[SYS] COORD LOCK :: ${lat}, ${lng} :: CELL-ID ${randomHex(6)}`,
      `[NET] SIGNAL PATH :: ASN-${rand(1000, 9999)} :: RTT ${rand(8, 92)}ms`,
      `[MAP] REGION PREFIX :: ${rand(10, 99)}-${rand(100, 999)} :: HASH ${randomHex(12)}`,
      `[SEC] TRACE TOKEN :: ${randomHex(16)} :: VERIFIED`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  function runScanAnimation({
    overlayEl,
    terminalLinesEl,
    progressFillEl,
    progressPercentEl,
    scanStatusEl,
    scanSubtextEl,
    onComplete
  }) {
    if (!overlayEl || !terminalLinesEl || !progressFillEl || !progressPercentEl || !scanStatusEl || !scanSubtextEl) {
      return;
    }

    overlayEl.style.display = "flex";
    terminalLinesEl.innerHTML = "";
    progressFillEl.style.width = "0%";
    progressPercentEl.textContent = "0%";
    scanStatusEl.textContent = "SCANNING...";
    scanSubtextEl.textContent = "Initializing trace route and synchronizing local prefix intelligence...";

    if (window.PhoneTrackerAudio) {
      window.PhoneTrackerAudio.playScanStart();
    }

    const states = [
      {
        at: 0,
        title: "SCANNING...",
        sub: "Initializing trace route and synchronizing local prefix intelligence..."
      },
      {
        at: 26,
        title: "LOCATING...",
        sub: "Matching region, tower clusters and geospatial area code ranges..."
      },
      {
        at: 58,
        title: "TRIANGULATING...",
        sub: "Cross-checking carrier heuristics, timezone data and location confidence..."
      },
      {
        at: 88,
        title: "TARGET FOUND",
        sub: "Trace complete. Preparing intel panel and visual map lock..."
      }
    ];

    let progress = 0;
    let stateIndex = 0;
    let tickCounter = 0;

    const lineTimer = setInterval(() => {
      const line = document.createElement("div");
      line.textContent = randomTerminalLine();
      terminalLinesEl.prepend(line);

      while (terminalLinesEl.children.length > 18) {
        terminalLinesEl.removeChild(terminalLinesEl.lastChild);
      }
    }, 90);

    const progressTimer = setInterval(() => {
      progress += rand(1, 4);
      if (progress > 100) progress = 100;

      progressFillEl.style.width = `${progress}%`;
      progressPercentEl.textContent = `${progress}%`;

      tickCounter++;
      if (window.PhoneTrackerAudio && tickCounter % 4 === 0 && progress < 100) {
        window.PhoneTrackerAudio.playProgressTick(progress);
      }

      if (stateIndex < states.length - 1 && progress >= states[stateIndex + 1].at) {
        stateIndex++;
        scanStatusEl.textContent = states[stateIndex].title;
        scanSubtextEl.textContent = states[stateIndex].sub;
      }

      if (progress >= 100) {
        clearInterval(progressTimer);
        clearInterval(lineTimer);

        setTimeout(() => {
          overlayEl.style.display = "none";

          if (typeof onComplete === "function") {
            onComplete();
          }
        }, 380);
      }
    }, 95);
  }

  window.PhoneTrackerScanner = {
    runScanAnimation
  };
})();