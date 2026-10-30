// Tooltip size (used by createTooltip and handleMouseEvents)
const tooltipWidth = 90;
const tooltipHeight = 30;

// Currently selected filter values ("All" means no filtering)
const activeFilters = { screenTech: "All", screenSize: "All" };

// Screen sizes that get a button
const sizeOptions = [24, 32, 55, 65, 98];

// Build one row of filter buttons and wire up the click handler
const buildButtons = (selector, values, key, labelFn, data) => {
    const container = d3.select(selector);

    container
        .selectAll("button")
        .data(values)
        .join("button")
        .attr("class", d => (d === activeFilters[key] ? "filter-btn active" : "filter-btn"))
        .text(labelFn)
        .on("click", (e, d) => {
            activeFilters[key] = d;

            // Highlight only the clicked button in this row
            container.selectAll("button").classed("active", b => b === d);

            updateHistogram(activeFilters, data);
        });
};

// Build the screen-technology and screen-size buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners

    // Screen technologies, most common first (so LED comes before LCD, OLED)
    const techCounts = d3.rollup(data, v => v.length, d => d.screenTech);
    const techs = [...techCounts.keys()].sort((a, b) => techCounts.get(b) - techCounts.get(a));

    buildButtons("#filters_screen", ["All", ...techs], "screenTech", d => d, data);

    buildButtons(
        "#filters_size",
        ["All", ...sizeOptions],
        "screenSize",
        d => (d === "All" ? "All Sizes" : `${d}"`),
        data
    );
};

const updateHistogram = (filters, data) => {
    // Step 7.4 Update the histogram: apply both filters together
    const filteredData = data.filter(d =>
        (filters.screenTech === "All" || d.screenTech === filters.screenTech) &&
        (filters.screenSize === "All" || d.screenSize === filters.screenSize)
    );

    drawHistogram(filteredData);
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");

    // Step 3.3 Append tooltip background rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 4)
        .attr("fill", "#5a3a2a");

    // Step 3.4 Append tooltip text
    tooltip
        .append("text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white");
};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};