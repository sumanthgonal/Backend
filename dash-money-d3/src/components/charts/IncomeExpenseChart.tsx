import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  category: string;
  type: 'income' | 'expense';
  amount: string;
}

interface Props {
  data: DataPoint[];
}

const IncomeExpenseChart = ({ data }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate totals
    const incomeTotal = data
      .filter(d => d.type === 'income')
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    const expenseTotal = data
      .filter(d => d.type === 'expense')
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const chartData = [
      { label: 'Income', value: incomeTotal, color: 'hsl(142, 76%, 36%)' },
      { label: 'Expenses', value: expenseTotal, color: 'hsl(0, 72%, 51%)' },
    ];

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', `Income vs Expenses chart showing ₹${incomeTotal.toFixed(2)} income and ₹${expenseTotal.toFixed(2)} expenses`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
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

    // Bars
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

  }, [data]);

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} className="max-w-full" />
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Comparison of total income and expenses for the current month
      </p>
    </div>
  );
};

export default IncomeExpenseChart;
