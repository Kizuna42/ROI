import { ROIInputs } from '../models/DataTypes';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationUtils {
  static validateROIInputs(inputs: ROIInputs): ValidationError[] {
    const errors: ValidationError[] = [];

    // Basic Info validation
    if (!inputs.basicInfo.productName.trim()) {
      errors.push({ field: 'basicInfo.productName', message: '製品名を入力してください' });
    }
    if (!inputs.basicInfo.purpose.trim()) {
      errors.push({ field: 'basicInfo.purpose', message: '導入目的を入力してください' });
    }
    if (inputs.basicInfo.analysisYears < 1 || inputs.basicInfo.analysisYears > 10) {
      errors.push({ field: 'basicInfo.analysisYears', message: '分析期間は1年から10年の間で入力してください' });
    }

    // Human Resources validation
    if (inputs.humanResources.employeeCount < 1) {
      errors.push({ field: 'humanResources.employeeCount', message: '従業員数は1以上で入力してください' });
    }
    if (inputs.humanResources.averageHourlyWage < 0) {
      errors.push({ field: 'humanResources.averageHourlyWage', message: '平均時給は0以上で入力してください' });
    }
    if (inputs.humanResources.monthlyHours < 0) {
      errors.push({ field: 'humanResources.monthlyHours', message: '月間労働時間は0以上で入力してください' });
    }
    if (inputs.humanResources.annualHours < 0) {
      errors.push({ field: 'humanResources.annualHours', message: '年間労働時間は0以上で入力してください' });
    }

    // Business Metrics validation
    if (inputs.businessMetrics.monthlyTransactions < 0) {
      errors.push({ field: 'businessMetrics.monthlyTransactions', message: '月間取引件数は0以上で入力してください' });
    }
    if (inputs.businessMetrics.avgProcessingTimeMinutes < 0) {
      errors.push({ field: 'businessMetrics.avgProcessingTimeMinutes', message: '平均処理時間は0以上で入力してください' });
    }
    if (inputs.businessMetrics.errorRate < 0 || inputs.businessMetrics.errorRate > 100) {
      errors.push({ field: 'businessMetrics.errorRate', message: 'エラー率は0%から100%の間で入力してください' });
    }
    if (inputs.businessMetrics.reworkRate < 0 || inputs.businessMetrics.reworkRate > 100) {
      errors.push({ field: 'businessMetrics.reworkRate', message: '手戻り率は0%から100%の間で入力してください' });
    }

    // Additional Costs validation
    if (inputs.additionalCosts.recruitmentCost < 0) {
      errors.push({ field: 'additionalCosts.recruitmentCost', message: '採用コストは0以上で入力してください' });
    }
    if (inputs.additionalCosts.trainingCost < 0) {
      errors.push({ field: 'additionalCosts.trainingCost', message: '教育コストは0以上で入力してください' });
    }
    if (inputs.additionalCosts.managementCost < 0) {
      errors.push({ field: 'additionalCosts.managementCost', message: '管理コストは0以上で入力してください' });
    }
    if (inputs.additionalCosts.otherIndirectCosts < 0) {
      errors.push({ field: 'additionalCosts.otherIndirectCosts', message: 'その他間接費用は0以上で入力してください' });
    }

    // Initial Investment validation
    if (inputs.initialInvestment.systemCost < 0) {
      errors.push({ field: 'initialInvestment.systemCost', message: 'システム導入費用は0以上で入力してください' });
    }
    if (inputs.initialInvestment.customizationCost < 0) {
      errors.push({ field: 'initialInvestment.customizationCost', message: 'カスタマイズ費用は0以上で入力してください' });
    }
    if (inputs.initialInvestment.migrationCost < 0) {
      errors.push({ field: 'initialInvestment.migrationCost', message: '移行費用は0以上で入力してください' });
    }
    if (inputs.initialInvestment.setupCost < 0) {
      errors.push({ field: 'initialInvestment.setupCost', message: 'セットアップ費用は0以上で入力してください' });
    }

    // Operational Costs validation
    if (inputs.operationalCosts.monthlySubscription < 0) {
      errors.push({ field: 'operationalCosts.monthlySubscription', message: '月額利用料は0以上で入力してください' });
    }
    if (inputs.operationalCosts.maintenanceCost < 0) {
      errors.push({ field: 'operationalCosts.maintenanceCost', message: '保守費用は0以上で入力してください' });
    }
    if (inputs.operationalCosts.supportCost < 0) {
      errors.push({ field: 'operationalCosts.supportCost', message: 'サポート費用は0以上で入力してください' });
    }
    if (inputs.operationalCosts.additionalFeatureCost < 0) {
      errors.push({ field: 'operationalCosts.additionalFeatureCost', message: '追加機能費用は0以上で入力してください' });
    }

    // Efficiency Gains validation
    if (inputs.efficiencyGains.personnelReduction < 0 || inputs.efficiencyGains.personnelReduction > 100) {
      errors.push({ field: 'efficiencyGains.personnelReduction', message: '人員削減率は0%から100%の間で入力してください' });
    }
    if (inputs.efficiencyGains.workHourReduction < 0 || inputs.efficiencyGains.workHourReduction > 100) {
      errors.push({ field: 'efficiencyGains.workHourReduction', message: '労働時間削減率は0%から100%の間で入力してください' });
    }
    if (inputs.efficiencyGains.automationPercentage < 0 || inputs.efficiencyGains.automationPercentage > 100) {
      errors.push({ field: 'efficiencyGains.automationPercentage', message: '自動化率は0%から100%の間で入力してください' });
    }

    // Quality Improvements validation
    if (inputs.qualityImprovements.errorReduction < 0 || inputs.qualityImprovements.errorReduction > 100) {
      errors.push({ field: 'qualityImprovements.errorReduction', message: 'エラー削減率は0%から100%の間で入力してください' });
    }
    if (inputs.qualityImprovements.customerSatisfactionIncrease < 0 || inputs.qualityImprovements.customerSatisfactionIncrease > 100) {
      errors.push({ field: 'qualityImprovements.customerSatisfactionIncrease', message: '顧客満足度向上率は0%から100%の間で入力してください' });
    }
    if (inputs.qualityImprovements.reworkReduction < 0 || inputs.qualityImprovements.reworkReduction > 100) {
      errors.push({ field: 'qualityImprovements.reworkReduction', message: '手戻り削減率は0%から100%の間で入力してください' });
    }

    // Other Benefits validation
    if (inputs.otherBenefits.opportunityLossReduction < 0) {
      errors.push({ field: 'otherBenefits.opportunityLossReduction', message: '機会損失削減額は0以上で入力してください' });
    }
    if (inputs.otherBenefits.scalabilityImprovement < 0) {
      errors.push({ field: 'otherBenefits.scalabilityImprovement', message: 'スケーラビリティ向上額は0以上で入力してください' });
    }
    if (inputs.otherBenefits.competitiveAdvantage < 0) {
      errors.push({ field: 'otherBenefits.competitiveAdvantage', message: '競争優位性向上額は0以上で入力してください' });
    }

    return errors;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidNumber(value: string): boolean {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }

  static isValidPercentage(value: string): boolean {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num >= 0 && num <= 100;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static parseNumber(value: string): number {
    const sanitized = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(sanitized);
    return isNaN(num) ? 0 : num;
  }

  static formatInputNumber(value: number): string {
    return value.toString();
  }
}