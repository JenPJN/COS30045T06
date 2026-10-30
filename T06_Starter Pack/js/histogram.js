const drawHistogram = (data) => {
    // Remove any previous chart so the histogram can be redrawn when filtered
    d3.select("#histogram").selectAll("svg").remove();

    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create an inner chart group with margins
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // If the filter combination has no TVs (e.g. OLED + 24"), say so instead of drawing
    if (data.length === 0) {
        innerChart
            .append("text")
            .attr("class", "empty-message")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight / 2)
            .attr("text-anchor", "middle")
            .text("No TVs match these filters");
        return;
    }

    // Step 6.2 Set up bins
    // (binGenerator is defined in shared-constants.js)
    const bins = binGenerator(data); // Save the bins into an array

    console.log(bins); // Log the bins to the console for debugging

    // Step 6.3 Get the lower and upper bounds of bins
    const minEnergy = bins[0].x0;
    const maxEnergy = bins[bins.length - 1].x1;
    const maxCount = d3.max(bins, d => d.length);

    // Define scales
    const xScale = d3.scaleLinear()
        .domain([minEnergy, maxEnergy])
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([chartHeight, 0]);

    // Step 6.4 Draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2)) // small gap between bars
        .attr("height", d => chartHeight - yScale(d.length))
        .attr("fill", "#636666");

    // Step 6.5 Add axes
    // Put a tick at every bin edge (0, 200, 400, ...)
    const bottomAxis = d3.axisBottom(xScale)
        .tickValues(bins.map(d => d.x0).concat(maxEnergy))
        .tickFormat(d3.format(","))
        .tickSizeOuter(0);

    // Add the x-axis to the bottom of the inner chart
    innerChart
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Add the x-axis label (bottom right)
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", chartWidth)
        .attr("y", chartHeight + 45)
        .attr("text-anchor", "end")
        .text("Labeled Energy Consumption (kWh/year)");

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(","))
        .tickSizeOuter(0);

    // Add the y-axis to the left of the inner chart
    innerChart
        .append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    // Add the y-axis label (top left, above the axis)
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -margin.left + 10)
        .attr("y", -15)
        .attr("text-anchor", "start")
        .text("Frequency");
};