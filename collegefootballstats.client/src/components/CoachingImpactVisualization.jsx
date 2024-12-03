import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CoachingImpactVisualization = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous content

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left, width - margin.right]);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.winPercentage)]).nice()
            .range([height - margin.bottom, margin.top]);

        const y2 = d3.scaleLinear()
            .domain([d3.max(data, d => Math.max(d.apRank, d.coachesPollRank, d.playerCommitterRank)), 1]).nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const y1Axis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y1))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Win Percentage (%)"));

        const y2Axis = g => g
            .attr("transform", `translate(${width - margin.right},0)`)
            .call(d3.axisRight(y2))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", margin.right)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("Rank"));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(y1Axis);

        svg.append("g")
            .call(y2Axis);

        const line1 = d3.line()
            .x(d => x(d.year))
            .y(d => y1(d.winPercentage));

        const line2 = d3.line()
            .x(d => x(d.year))
            .y(d => y2(d.apRank));

        const line3 = d3.line()
            .x(d => x(d.year))
            .y(d => y2(d.coachesPollRank));

        const line4 = d3.line()
            .x(d => x(d.year))
            .y(d => y2(d.playerCommitterRank));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line1);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line2);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", line3);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", line4);

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 150},${margin.top})`);

        legend.append("rect")
            .attr("width", 150)
            .attr("height", 80)
            .attr("fill", "white")
            .attr("stroke", "black");

        legend.append("line")
            .attr("x1", 10)
            .attr("y1", 10)
            .attr("x2", 30)
            .attr("y2", 10)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        legend.append("text")
            .attr("x", 40)
            .attr("y", 10)
            .attr("dy", "0.35em")
            .text("Win %");

        legend.append("line")
            .attr("x1", 10)
            .attr("y1", 30)
            .attr("x2", 30)
            .attr("y2", 30)
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        legend.append("text")
            .attr("x", 40)
            .attr("y", 30)
            .attr("dy", "0.35em")
            .text("AP Rank");

        legend.append("line")
            .attr("x1", 10)
            .attr("y1", 50)
            .attr("x2", 30)
            .attr("y2", 50)
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        legend.append("text")
            .attr("x", 40)
            .attr("y", 50)
            .attr("dy", "0.35em")
            .text("Coaches Poll Rank");

        legend.append("line")
            .attr("x1", 10)
            .attr("y1", 70)
            .attr("x2", 30)
            .attr("y2", 70)
            .attr("stroke", "orange")
            .attr("stroke-width", 2);

        legend.append("text")
            .attr("x", 40)
            .attr("y", 70)
            .attr("dy", "0.35em")
            .text("Playoff Committee Rank");

    }, [data]);

    return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default CoachingImpactVisualization;
