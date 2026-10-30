// Chart dimensions (used with a viewBox so the SVG scales responsively)
const width = 800;
const height = 500;
const margin = { top: 40, right: 30, bottom: 60, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Bin generator for the histogram: 200 kWh/year wide bins starting at 0
const binWidth = 200;
const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .domain(values => [0, Math.ceil(d3.max(values) / binWidth) * binWidth])
    .thresholds((values, min, max) => d3.range(min + binWidth, max, binWidth));