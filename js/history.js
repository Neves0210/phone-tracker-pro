(function () {
  const HISTORY_KEY = "phoneTrackerProHistory";
  const MAX_HISTORY = 10;

  function getHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveHistoryItem(result, rawDigits) {
    const current = getHistory();

    const item = {
      id: Date.now(),
      countryCode: result.countryCode,
      number: rawDigits,
      formatted: result.formatted,
      location: result.location,
      carrier: result.carrier,
      lat: result.lat,
      lng: result.lng,
      timestamp: new Date().toISOString()
    };

    const filtered = current.filter(
      x => !(x.countryCode === item.countryCode && x.number === item.number)
    );

    filtered.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));

    return filtered.slice(0, MAX_HISTORY);
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }

  function renderHistory(container, onItemClick) {
    if (!container) return;

    const history = getHistory();

    if (!history.length) {
      container.innerHTML = `
        <div class="empty-state">
          No scans yet.<br/>
          Your last 10 lookups will appear here.
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(item => {
      const dt = new Date(item.timestamp);

      return `
        <div
          class="history-item"
          data-country="${item.countryCode}"
          data-number="${item.number}"
        >
          <div class="history-top">
            <div class="history-number">${item.countryCode} ${item.formatted}</div>
            <div class="history-time">
              ${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>

          <div class="history-meta">${item.location}</div>
          <div class="history-meta">${item.carrier}</div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".history-item").forEach(el => {
      el.addEventListener("click", () => {
        if (typeof onItemClick === "function") {
          onItemClick({
            countryCode: el.dataset.country,
            number: el.dataset.number
          });
        }
      });
    });
  }

  window.PhoneTrackerHistory = {
    getHistory,
    saveHistoryItem,
    clearHistory,
    renderHistory
  };
})();