// Function to parse the query string for 'data' parameter
function getQueryParams() {
    const query = new URLSearchParams(window.location.search);
    const data = query.get('data');
    return data ? JSON.parse(decodeURIComponent(data)) : [];
}

// Initialize the map
const map = L.map('map').setView([14.10264, -87.18953], 14);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define sector colors
const sectorColors = {
    1: "blue",
    2: "red",
    3: "green",
    4: "orange",
    5: "purple",
    6: "yellow",
    7: "cyan",
    8: "pink"
};

// Function to dynamically generate an SVG
function createDynamicSVG(point, sectorColor) {
    const isWarden = point.warden === "Prim" || point.warden === "Sec";
    const outerColor = isWarden
        ? point.warden === "Prim"
            ? "red"
            : "yellow"
        : "black";
    const wallColor = isWarden ? "white" : "black";
    const roofColor = isWarden ? "white" : "black";

    // Inline SVG with dynamic styles
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 16.933333 16.933333">
          <path id="OuterCircle" d="M 8.4666667,0.52916667 A 7.9375,7.9375 0 0 0 0.52916667,8.4666667 7.9375,7.9375 0 0 0 8.4666667,16.404167 7.9375,7.9375 0 0 0 16.404167,8.4666667 7.9375,7.9375 0 0 0 8.4666667,0.52916667 Z" style="fill:${outerColor};stroke-width:0.264583" />
          <circle id="InnerCircle" cx="8.4666672" cy="8.4666672" r="6.6145835" style="fill:${sectorColor};stroke-width:0.220486" />
          <path id="Walls" d="M 5.0002116,8.0000285 V 13.00024 H 11.999784 V 8.0000285 Z" style="fill:${wallColor};stroke-width:0.264583" />
          <path id="Roof" d="M 8.0000285,2.9998169 7.0000895,3.9997559 3.9997559,7.0000895 H 8.0000285 13.00024 L 9.9999064,3.9997559 8.9999674,2.9998169 H 8.5002563 Z" style="fill:${roofColor};stroke-width:0.264583" />
        </svg>
    `;
    return svg;
}

// Add markers to the map
const points = getQueryParams();

points.forEach(point => {
    const sectorColor = sectorColors[point.sector] || "gray";

    // Create a custom icon using the dynamic SVG
    const icon = L.divIcon({
        className: "custom-icon",
        html: createDynamicSVG(point, sectorColor),
        iconSize: [64, 64]
    });

    // Add the marker to the map
    L.marker([point.lat, point.lon], { icon: icon })
        .addTo(map)
        .bindPopup(
            `<b>${point.name}</b><br>Sector: ${point.sector}<br>${point.warden ? "Warden: " + point.warden : "Non-Warden"}`
        );
});
