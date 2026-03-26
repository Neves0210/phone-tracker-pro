(function () {
  let map = null;
  let mapMarker = null;
  let mapCircle = null;

  function createMarkerIcon() {
    const markerHtml = `<div class="custom-marker"></div>`;

    return L.divIcon({
      html: markerHtml,
      className: "",
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  }

  function getZoomLevel(lat, lng) {
    if (lat === 0 && lng === 0) return 2;
    return 7;
  }

  function getRadius(lat, lng) {
    if (lat === 0 && lng === 0) return 2000000;
    return 65000;
  }

  function ensureMap(lat, lng, label) {
    if (!map) {
      map = L.map("map", {
        zoomControl: true,
        attributionControl: true
      }).setView([lat, lng], getZoomLevel(lat, lng));

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);
    }

    map.setView([lat, lng], getZoomLevel(lat, lng), {
      animate: true,
      duration: 1.2
    });

    if (mapMarker) {
      map.removeLayer(mapMarker);
    }

    if (mapCircle) {
      map.removeLayer(mapCircle);
    }

    const icon = createMarkerIcon();

    mapMarker = L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${label}</strong><br/>Approximate region trace`);

    mapMarker.openPopup();

    mapCircle = L.circle([lat, lng], {
      radius: getRadius(lat, lng),
      color: "#00FF41",
      fillColor: "#00FF41",
      fillOpacity: 0.08,
      weight: 1.5
    }).addTo(map);
  }

  function recenterMap(lat, lng, label) {
    if (!map) {
      ensureMap(lat, lng, label);
      return;
    }

    map.setView([lat, lng], getZoomLevel(lat, lng), {
      animate: true,
      duration: 1.2
    });

    if (mapMarker) {
      mapMarker.setLatLng([lat, lng]).setPopupContent(
        `<strong>${label}</strong><br/>Approximate region trace`
      );
      mapMarker.openPopup();
    }

    if (mapCircle) {
      mapCircle.setLatLng([lat, lng]);
      mapCircle.setRadius(getRadius(lat, lng));
    }
  }

  function invalidateMapSize() {
    if (map) {
      setTimeout(() => map.invalidateSize(), 200);
    }
  }

  function getMapInstance() {
    return map;
  }

  window.PhoneTrackerMap = {
    ensureMap,
    recenterMap,
    invalidateMapSize,
    getMapInstance
  };
})();