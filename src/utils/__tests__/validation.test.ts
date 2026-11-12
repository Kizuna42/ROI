import { describe, expect, it } from 'vitest';
import { ValidationUtils } from '../validation';
import { createInputs } from '../../test/fixtures';

describe('ValidationUtils.validateROIInputs', () => {
  it('accepts the default inputs', () => {
    expect(ValidationUtils.validateROIInputs(createInputs())).toEqual([]);
  });

  it('rejects empty number inputs (NaN)', () => {
    const errors = ValidationUtils.validateROIInputs(
      createInputs({ humanResources: { employeeCount: NaN } }),
    );
    expect(errors).toContainEqual({ field: 'humanResources.employeeCount', message: '数値を入力してください' });
  });

  it('rejects fractional or out-of-range analysis years', () => {
    for (const analysisYears of [0, 2.5, 11]) {
      const errors = ValidationUtils.validateROIInputs(createInputs({ basicInfo: { analysisYears } }));
      expect(errors.map((e) => e.field)).toContain('basicInfo.analysisYears');
    }
  });

  it('rejects percentages outside 0-100', () => {
    const errors = ValidationUtils.validateROIInputs(
      createInputs({ efficiencyGains: { automationPercentage: 120 } }),
    );
    expect(errors.map((e) => e.field)).toContain('efficiencyGains.automationPercentage');
  });
});
