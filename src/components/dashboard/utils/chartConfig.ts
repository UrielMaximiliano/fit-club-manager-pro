
import { Theme } from 'recharts';
import React from 'react';

// Color palette for charts
export const CHART_COLORS = {
  primary: '#4ECDC4',
  secondary: '#5DADE2',
  tertiary: '#7DCEA0',
  quaternary: '#7FB3D5',
  background: '#222732',
  text: '#F4F6FB',
  textSecondary: '#A0AEC0',
  grid: 'rgba(244, 246, 251, 0.1)',
  tooltip: {
    background: '#2D3748',
    border: '#4F8EF6'
  }
};

// Common chart theme for consistent styling
export const chartTheme: Theme = {
  colorScheme: 'dark',
};

// Shared configuration for tooltips
export const tooltipStyle = {
  contentStyle: {
    backgroundColor: CHART_COLORS.tooltip.background,
    border: `1px solid ${CHART_COLORS.tooltip.border}`,
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    fontSize: '12px',
    color: CHART_COLORS.text
  },
  itemStyle: {
    color: CHART_COLORS.text
  },
  cursor: {
    fill: 'rgba(255, 255, 255, 0.05)'
  }
};

// Bar chart configuration
export const barChartConfig = {
  barSize: 30,
  barRadius: [4, 4, 0, 0],
  horizontalBarRadius: [0, 4, 4, 0],
  animationDuration: 800,
  gridStrokeDasharray: '3 3',
  gridOpacity: 0.3,
  axisProps: {
    stroke: CHART_COLORS.textSecondary,
    fontSize: 12,
    tickLine: false,
  }
};

// Line/Area chart configuration
export const lineChartConfig = {
  strokeWidth: 2,
  animationDuration: 800,
  dotRadius: 4,
  activeDotRadius: 6,
  gridStrokeDasharray: '3 3',
  gridOpacity: 0.3,
  axisProps: {
    stroke: CHART_COLORS.textSecondary,
    fontSize: 12,
    tickLine: false,
  }
};

// Pie chart configuration
export const pieChartConfig = {
  innerRadius: 40,
  outerRadius: 90,
  paddingAngle: 2,
  animationDuration: 800,
  labelLineProps: {
    stroke: CHART_COLORS.textSecondary,
    strokeWidth: 1,
  }
};

// Reference line configuration (for averages, etc)
export const referenceLineConfig = {
  stroke: CHART_COLORS.textSecondary,
  strokeDasharray: '3 3',
  label: {
    fill: CHART_COLORS.textSecondary,
    fontSize: 10
  }
};

// Shared chart canvas container style
export const chartContainerClass = "w-full h-full transition-all duration-300 ease-in-out";

// Gradient IDs for consistent reference
export const GRADIENT_IDS = {
  area: 'areaGradient',
  bar: 'barGradient',
};

// Gradient definitions as objects (not JSX)
export const getAreaGradientId = (id: string): string => {
  return `url(#${id})`;
};

export const getBarGradientId = (id: string, index: number): string => {
  return `url(#${id}${index})`;
};

// These functions return React elements and should be used in TSX files
export const createAreaGradient = (id: string) => {
  return {
    id: id,
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
    stops: [
      {
        offset: '5%',
        stopColor: CHART_COLORS.primary,
        stopOpacity: 0.8
      },
      {
        offset: '95%',
        stopColor: CHART_COLORS.primary,
        stopOpacity: 0
      }
    ]
  };
};

export const createBarGradient = (id: string, index: number) => {
  return {
    id: `${id}${index}`,
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
    stops: [
      {
        offset: '0%',
        stopColor: CHART_COLORS.primary,
        stopOpacity: 0.8
      },
      {
        offset: '100%',
        stopColor: CHART_COLORS.background,
        stopOpacity: 0.2
      }
    ]
  };
};

// Export color array for consistent usage across charts
export const colorArray = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary, 
  CHART_COLORS.quaternary
];
