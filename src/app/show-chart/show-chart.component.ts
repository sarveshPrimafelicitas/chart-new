import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {
  sankey,
  sankeyLinkHorizontal,
  SankeyGraph,
  SankeyNode,
  SankeyLink,
} from 'd3-sankey';

interface SankeyNodeExtended extends SankeyNode<any, any> {
  name: string;
}

interface SankeyLinkExtended extends SankeyLink<any, any> {}

@Component({
  selector: 'app-show-chart',
  templateUrl: './show-chart.component.html',
  standalone: true,
  styleUrls: ['./show-chart.component.css'],
})
export class ShowChartComponent implements OnInit {
  @ViewChild('sankeyContainer', { static: true }) container!: ElementRef;

  private width = 600;
  private height = 400;

  private data: SankeyGraph<SankeyNodeExtended, SankeyLinkExtended> = {
    nodes: [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'E' },
      { name: 'F' },
    ],
    links: [
      { source: 0, target: 3, value: 10 },
      { source: 1, target: 2, value: 5 },
      { source: 2, target: 3, value: 15 },
      { source: 3, target: 4, value: 15 },
      { source: 4, target: 5, value: 15 },
    ],
  };

  ngOnInit(): void {
    this.createSankey();
  }

  private createSankey() {
    const svg = d3
      .select(this.container.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const sankeyGenerator = sankey<SankeyNodeExtended, SankeyLinkExtended>()
      .nodeWidth(20)
      .nodePadding(10)
      .extent([
        [1, 1],
        [this.width - 1, this.height - 1],
      ]);

    const { nodes, links } = sankeyGenerator({ ...this.data });

    // Draw links
    svg
      .append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#B6CBBD')
      .attr('stroke-width', (d) => d.width || 1)
      .attr('fill', 'none')
      .attr('opacity', 0.6);

    // Draw nodes
    svg
      .append('g')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('width', (d) => d.x1! - d.x0!)
      .attr('height', (d) => d.y1! - d.y0!)
      .attr('fill', 'green');

    // Add labels
    svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (d) => d.x0! - 6)
      .attr('y', (d) => (d.y0! + d.y1!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d) => d.name)
      .attr('fill', 'black');
  }
}
