import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {
  sankey,
  sankeyLinkHorizontal,
  SankeyGraph,
  SankeyNode,
  SankeyLink,
} from 'd3-sankey';
import { testData } from '../../utils/testData';
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

  createGraph(arrayData: any) {
    const idProArray: { id: string; producer: string; numb: number }[] = [];
    const onlyProArray: { name: string }[] = [];
    let sourceTargetArr: { source: number; target: number; value: number }[] =
      [];
    let count = 1;
    for (let i = 0; i < arrayData.length; i++) {
      let obj: any = {};
      let onlyProObj: any = {};
      const element = arrayData[i];
      if (element?.metadata?.previousTokenDetail?.length === 0) {
        obj = {
          id: element?.id,
          producer: element?.metadata?.producer,
          numb: 0,
        };
        // onlyProObj = { name: element?.metadata?.producer };
      } else {
        obj = {
          id: element?.id,
          producer: element?.metadata?.producer,
          numb: count++,
        };
        // onlyProObj = { name: element?.metadata?.producer };
      }

      idProArray.push(obj);
    }
    idProArray.sort((a, b) => a.numb - b.numb);
    const nameArray = idProArray.map((i) => {
      const data = { name: i?.producer };
      return data;
    });
    onlyProArray.push(...nameArray);

    for (let i = 0; i < arrayData.length; i++) {
      const element = arrayData[i];
      if (element?.metadata?.previousTokenDetail.length !== 0) {
        for (
          let j = 0;
          j < element?.metadata?.previousTokenDetail.length;
          j++
        ) {
          const childElement = element?.metadata?.previousTokenDetail[j];
          const idProArraySource = idProArray.find(
            (i) => i?.id === childElement
          );
          const idProArrayTarget = idProArray.find(
            (i) => i?.id === element?.id
          );

          let obj: any = {
            source: idProArraySource?.numb,
            target: idProArrayTarget?.numb,
            value: Number(element?.metadata?.weightInKgs),
          };

          sourceTargetArr.push(obj);
        }
      }
    }
    // console.log({ onlyProArray, idProArray, sourceTargetArr });

    return { onlyProArray, idProArray, sourceTargetArr };
  }

  graphData = this.createGraph(testData);
  private data: SankeyGraph<SankeyNodeExtended, SankeyLinkExtended> = {
    // nodes: [
    //   { name: 'ABC' },
    //   { name: 'NEO' },
    //   { name: 'CARD' },
    //   { name: 'DAN' },
    //   { name: 'MONA' },
    //   { name: 'BAKI' },
    // ],
    // links: [
    //   { source: 0, target: 1, value: 20 },
    //   { source: 0, target: 2, value: 11 },
    //   { source: 1, target: 3, value: 12 },
    //   { source: 2, target: 3, value: 24 },
    //   { source: 3, target: 4, value: 12 },
    //   { source: 2, target: 4, value: 8 },
    //   { source: 4, target: 5, value: 12 },
    // ],
    // nodes: [
    //   {
    //     name: 'PelletDev',
    //   },
    //   {
    //     name: 'Z A Carfted',
    //   },
    //   {
    //     name: 'FabricDev',
    //   },
    //   {
    //     name: 'Wool Works Ltd.',
    //   },
    // ],
    // links: [
    //   {
    //     source: 2,
    //     target: 1,
    //     value: 202,
    //   },
    //   {
    //     source: 3,
    //     target: 2,
    //     value: 2012,
    //   },
    //   {
    //     source: 0,
    //     target: 3,
    //     value: 3025,
    //   },
    // ],
    nodes: this.graphData.onlyProArray,
    links: this.graphData.sourceTargetArr,
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

    // Define color scales
    const nodeColor = d3.scaleOrdinal(d3.schemeCategory10); // Assign different colors to nodes
    const linkColor = d3
      .scaleLinear<string>() // Color shading for links
      .domain([d3.min(links, (d) => d.value)!, d3.max(links, (d) => d.value)!])
      .range(['#D3D3D3', '#4F4F4F']); // Light blue to dark blue

    // Draw links with shading
    svg
      .append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) => linkColor(d.value)) // Apply gradient color based on value
      .attr('stroke-width', (d) => d.width || 1)
      .attr('fill', 'none')
      .attr('opacity', 0.6);

    // Draw nodes with different colors
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
      .attr('fill', (_, i) => nodeColor(i.toString())); // Assign unique color to each node

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

function createGraph(arrayData: any) {
  const idProArray: { id: string; producer: string; numb: number }[] = [];
  const onlyProArray: { name: string }[] = [];
  let sourceTargetArr: { source: number; target: number; value: number }[] = [];
  let count = 1;
  for (let i = 0; i < arrayData.length; i++) {
    let obj: any = {};
    let onlyProObj: any = {};
    const element = arrayData[i];
    if (element?.metadata?.previousTokenDetail?.length === 0) {
      obj = {
        id: element?.id,
        producer: element?.metadata?.producer,
        numb: 0,
      };
      // onlyProObj = { name: element?.metadata?.producer };
    } else {
      obj = {
        id: element?.id,
        producer: element?.metadata?.producer,
        numb: count++,
      };
      // onlyProObj = { name: element?.metadata?.producer };
    }

    idProArray.push(obj);
  }
  idProArray.sort((a, b) => a.numb - b.numb);
  const nameArray = idProArray.map((i) => {
    const data = { name: i?.producer };
    return data;
  });
  onlyProArray.push(...nameArray);

  for (let i = 0; i < arrayData.length; i++) {
    const element = arrayData[i];
    if (element?.metadata?.previousTokenDetail.length !== 0) {
      for (let j = 0; j < element?.metadata?.previousTokenDetail.length; j++) {
        const childElement = element?.metadata?.previousTokenDetail[j];
        const idProArraySource = idProArray.find((i) => i?.id === childElement);
        const idProArrayTarget = idProArray.find((i) => i?.id === element?.id);

        let obj: any = {
          source: idProArraySource?.numb,
          target: idProArrayTarget?.numb,
          value: Number(element?.metadata?.weightInKgs),
        };

        sourceTargetArr.push(obj);
      }
    }
  }
  // console.log({ onlyProArray, idProArray, sourceTargetArr });

  return { onlyProArray, idProArray, sourceTargetArr };
}
// createGraph(testData);
