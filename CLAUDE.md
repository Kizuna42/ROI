# CLAUDE.md

日本語でやりとりすること。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaaS ROI Analysis System - A comprehensive React TypeScript application for analyzing the return on investment of SaaS product implementations. The system provides interactive ROI calculations, executive summaries, and detailed visualizations to support investment decision-making.

## Development Commands

- `npm dev` - Start development server
- `npm build` - Build for production (runs TypeScript compilation and Vite build)
- `npm lint` - Run ESLint for code quality checks
- `npm preview` - Preview production build

## Project Architecture

### Frontend Structure
- **React + TypeScript** with Vite for fast development and building
- **Tailwind CSS** for consistent styling and responsive design
- **Recharts** for professional data visualizations
- **React Hook Form** for efficient form handling and validation

### Core Components
- `ROISimulator` - Main application container with tabbed interface
- `KPICards` - Real-time display of key performance indicators
- `CostComparisonChart` - Bar chart comparing current vs future costs
- `CumulativeEffectGraph` - Line chart showing ROI progression over time
- `SensitivityHeatmap` - Parameter sensitivity analysis visualization

### Business Logic
- `ROICalculator` - Core financial calculation engine with NPV, IRR, and ROI calculations
- `ReportGenerator` - Executive summary and detailed report generation
- `ValidationUtils` - Input validation and error handling
- `FormattingUtils` - Number, currency, and percentage formatting utilities

### Data Models
All TypeScript interfaces are defined in `src/models/DataTypes.ts` including:
- Input structures for basic info, human resources, costs, and benefits
- Calculation results and executive summary formats
- Scenario management for comparing different configurations

## Key Features

### ROI Analysis
- Real-time calculation of ROI, NPV, IRR, and payback period
- Comprehensive cost-benefit analysis with multiple parameters
- Multi-year projections and cumulative effect tracking

### Visualizations
- Interactive KPI dashboard with color-coded performance indicators
- Cost comparison charts and cumulative savings graphs
- Sensitivity analysis heatmaps for parameter impact assessment

### Executive Reporting
- Auto-generated executive summaries in Japanese
- Markdown report export functionality
- Strategic value assessment and investment recommendations

## Financial Calculations

The system implements industry-standard financial calculations:
- **ROI**: Return on Investment over 3 and 5 year periods
- **NPV**: Net Present Value using 8% discount rate
- **IRR**: Internal Rate of Return using Newton-Raphson method
- **Payback Period**: Time to recover initial investment
- **Sensitivity Analysis**: Parameter impact on key metrics

## Styling Guidelines

- Uses Tailwind CSS utility classes for consistent styling
- Custom component classes defined in `src/index.css`
- Responsive design for desktop, tablet, and mobile
- Professional color scheme with semantic color coding (success, warning, danger)
- Print-friendly styles for report generation