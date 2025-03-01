import React, { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import * as d3 from 'd3'

interface Commit {
  id: string
  message: string
  branch: string
  parentId: string | null
  timestamp: string
}

interface BranchGraphProps {
  commits: Commit[]
}

export const BranchGraph: React.FC<BranchGraphProps> = ({ commits }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !commits.length) return

    const width = 800
    const height = commits.length * 50
    const nodeRadius = 6

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40, 20)')

    // Create branch lanes
    const branches = Array.from(new Set(commits.map(c => c.branch)))
    const branchLanes = new Map(branches.map((branch, i) => [branch, i]))

    // Create links
    const links = commits
      .filter(commit => commit.parentId)
      .map(commit => {
        const parent = commits.find(c => c.id === commit.parentId)
        if (!parent) return null

        return {
          source: {
            x: branchLanes.get(commit.branch)! * 80 + 100,
            y: commits.indexOf(commit) * 50 + 20
          },
          target: {
            x: branchLanes.get(parent.branch)! * 80 + 100,
            y: commits.indexOf(parent) * 50 + 20
          }
        }
      })
      .filter(Boolean)

    // Draw links
    svg.selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', d => d3.linkVertical()(d as any))
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)

    // Create nodes
    const nodes = svg.selectAll('g')
      .data(commits)
      .enter()
      .append('g')
      .attr('transform', d => 
        `translate(${branchLanes.get(d.branch)! * 80 + 100},${commits.indexOf(d) * 50 + 20})`
      )

    // Draw commit circles
    nodes.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)

    // Add commit messages
    nodes.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .text(d => d.message.slice(0, 30) + (d.message.length > 30 ? '...' : ''))
      .style('font-size', '12px')

    // Add branch labels
    svg.selectAll('.branch-label')
      .data(Array.from(branchLanes.entries()))
      .enter()
      .append('text')
      .attr('class', 'branch-label')
      .attr('x', ([, lane]) => lane * 80 + 100)
      .attr('y', 0)
      .text(([branch]) => branch)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')

  }, [commits])

  return (
    <Box overflowX="auto" p={4}>
      <svg ref={svgRef} />
    </Box>
  )
}

export default BranchGraph 