import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  budget: number;
  actual: number;
}

const BudgetComparisonChart = ({ budget, actual }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chartData = [
      { label: 'Budget', value: budget, color: 'hsl(231, 48%, 48%)' },
      { label: 'Actual', value: actual, color: actual > budget ? 'hsl(0, 72%, 51%)' : 'hsl(142, 76%, 36%)' },
    ];

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', `Budget comparison showing budgeted ₹${budget.toFixed(2)} vs actual spending ₹${actual.toFixed(2)}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, Math.max(budget, actual) * 1.1])
      .nice()
      .range([chartHeight, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .attr('class', 'text-sm');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `₹${d}`))
      .attr('class', 'text-sm');

    // Bars with animation
    g.selectAll('.bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', chartHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .transition()
      .duration(800)
      .attr('y', d => y(d.value))
      .attr('height', d => chartHeight - y(d.value));

    // Value labels
    g.selectAll('.label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'label text-xs font-medium')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text(d => `₹${d.value.toFixed(2)}`);

    // Budget line (if actual exceeds budget)
    if (actual > budget) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', y(budget))
        .attr('y2', y(budget))
        .attr('stroke', 'hsl(0, 72%, 51%)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }

  }, [budget, actual]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} className="max-w-full" />
      <p className="mt-2 text-sm text-muted-foreground text-center">
        {actual > budget ? (
          <span className="text-destructive font-medium">
            Over budget by ₹{(actual - budget).toFixed(2)}
          </span>
        ) : (
          <span className="text-success font-medium">
            Under budget by ₹{(budget - actual).toFixed(2)}
          </span>
        )}
      </p>
    </div>
  );
};

export default BudgetComparisonChart;
