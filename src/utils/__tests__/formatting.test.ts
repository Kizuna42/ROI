import { describe, expect, it } from 'vitest';
import { FormattingUtils } from '../formatting';

describe('FormattingUtils', () => {
  it('formats months, including payback that is never reached', () => {
    expect(FormattingUtils.formatMonths(0.5)).toBe('1ヶ月未満');
    expect(FormattingUtils.formatMonths(5.2)).toBe('6ヶ月');
    expect(FormattingUtils.formatMonths(24)).toBe('2年');
    expect(FormattingUtils.formatMonths(Infinity)).toBe('回収不可');
    expect(FormattingUtils.formatMonths(NaN)).toBe('算出不可');
  });

  it('formats non-finite percentages as not computable', () => {
    expect(FormattingUtils.formatPercentage(12.345)).toBe('12.3%');
    expect(FormattingUtils.formatPercentage(NaN)).toBe('算出不可');
  });

  it('formats negative compact currency with the same units as positive', () => {
    expect(FormattingUtils.formatCurrencyCompact(1_500_000)).toBe('150.0万円');
    expect(FormattingUtils.formatCurrencyCompact(-1_500_000)).toBe('-150.0万円');
    expect(FormattingUtils.formatCurrencyCompact(-250_000_000)).toBe('-2.5億円');
    expect(FormattingUtils.formatCurrencyCompact(123.4)).toBe('123円');
  });
});
