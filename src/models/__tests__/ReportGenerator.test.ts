import { describe, expect, it } from 'vitest';
import { ROICalculator } from '../ROICalculator';
import { ReportGenerator } from '../ReportGenerator';
import { createInputs } from '../../test/fixtures';

describe('ReportGenerator', () => {
  it('does not claim a payback period when the investment is never recovered', () => {
    const inputs = createInputs({
      efficiencyGains: { personnelReduction: 0, workHourReduction: 0, automationPercentage: 0 },
      qualityImprovements: { errorReduction: 0, reworkReduction: 0 },
      otherBenefits: { opportunityLossReduction: 0, scalabilityImprovement: 0 },
    });
    const summary = ReportGenerator.generateExecutiveSummary(inputs, ROICalculator.calculate(inputs));

    expect(summary.fullReport).not.toContain('Infinity');
    expect(summary.fullReport).toContain('回収不可');
    expect(summary.fullReport).toContain('投資回収が見込めません');
    expect(summary.recommendedAction).toContain('再検討');
  });

  it('labels the 3-year ROI as 3 years regardless of the analysis period', () => {
    const inputs = createInputs({ basicInfo: { analysisYears: 5 } });
    const summary = ReportGenerator.generateExecutiveSummary(inputs, ROICalculator.calculate(inputs));

    expect(summary.fullReport).toContain('3年間で');
  });
});
