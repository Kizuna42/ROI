import { ROIInputs, ROIResults, ExecutiveSummary } from './DataTypes';
import { ROICalculator } from './ROICalculator';
import { FormattingUtils } from '../utils/formatting';

export class ReportGenerator {
  static generateExecutiveSummary(inputs: ROIInputs, results: ROIResults): ExecutiveSummary {
    const { basicInfo } = inputs;
    const { 
      initialInvestmentTotal, 
      annualSavings, 
      paybackPeriodMonths, 
      roi3Year,
      netAnnualBenefit 
    } = results;

    const proposal = this.generateProposal(basicInfo.productName, basicInfo.purpose, netAnnualBenefit);
    const strategicValue = this.generateStrategicValue(inputs);
    const recommendedAction = this.generateRecommendedAction(results);
    const fullReport = this.generateFullReport(inputs, results);

    return {
      proposal,
      keyMetrics: {
        initialInvestment: initialInvestmentTotal,
        annualSavings,
        paybackPeriod: paybackPeriodMonths,
        roi3Year
      },
      strategicValue,
      recommendedAction,
      fullReport
    };
  }

  private static generateProposal(productName: string, purpose: string, netAnnualBenefit: number): string {
    const benefitFormatted = ROICalculator.formatCurrency(netAnnualBenefit);
    
    return `${productName}の導入により、${purpose}の課題解決を図り、年間${benefitFormatted}の純利益向上を実現します。本投資は競争力強化と業務効率化を同時に達成する戦略的な施策です。`;
  }

  private static generateStrategicValue(inputs: ROIInputs): {
    competitiveAdvantage: string;
    scalability: string;
    riskReduction: string;
  } {
    const { efficiencyGains, qualityImprovements, otherBenefits } = inputs;

    const competitiveAdvantage = efficiencyGains.automationPercentage > 50 
      ? "高度な自動化により、業界標準を上回る処理能力を獲得し、市場における優位性を確立"
      : "業務効率化により、競合他社との差別化を図り、顧客満足度の向上を実現";

    const scalability = otherBenefits.scalabilityImprovement > 0
      ? "システム導入により、事業拡張時の追加コストを最小化し、持続可能な成長基盤を構築"
      : "効率化された業務プロセスにより、将来の事業拡張に柔軟に対応可能";

    const riskReduction = qualityImprovements.errorReduction > 30
      ? "大幅なエラー削減により、業務リスクを最小化し、コンプライアンス体制を強化"
      : "品質向上により、顧客満足度の向上と事業継続性の確保を実現";

    return {
      competitiveAdvantage,
      scalability,
      riskReduction
    };
  }

  private static generateRecommendedAction(results: ROIResults): string {
    const { paybackPeriodMonths, roi3Year, npv } = results;

    if (paybackPeriodMonths <= 12 && roi3Year > 100) {
      return "即座に導入を開始し、競争優位性を確保することを強く推奨します。";
    } else if (paybackPeriodMonths <= 24 && roi3Year > 50) {
      return "導入計画を策定し、段階的な実装を進めることを推奨します。";
    } else if (npv > 0) {
      return "詳細な実装計画を検討し、リスク軽減策を講じた上で導入を検討することを推奨します。";
    } else {
      return "現在の条件では投資効果が限定的であるため、導入条件の再検討を推奨します。";
    }
  }

  private static generateConclusion(productName: string, results: ROIResults): string {
    const { paybackPeriodMonths, roi3Year, npv } = results;

    if (!Number.isFinite(paybackPeriodMonths)) {
      return `${productName}の導入は、現在の条件では年間純利益がマイナスまたはゼロとなり、投資回収が見込めません。導入条件の見直しが必要です。`;
    }

    const evaluation = npv > 0
      ? '本投資は財務的に魅力的であり、戦略的価値も高いと評価されます。'
      : 'ただしNPVがマイナスとなるため、投資判断には慎重な検討が必要です。';

    return `${productName}の導入は、${FormattingUtils.formatMonths(paybackPeriodMonths)}での投資回収と、3年間で${ROICalculator.formatPercentage(roi3Year)}のROIを実現します。${evaluation}`;
  }

  private static generateFullReport(inputs: ROIInputs, results: ROIResults): string {
    const { basicInfo, humanResources, businessMetrics, efficiencyGains } = inputs;
    const laborReductionRate = ROICalculator.combineReductionRates([
      efficiencyGains.personnelReduction,
      efficiencyGains.workHourReduction,
      efficiencyGains.automationPercentage
    ]) * 100;
    const { 
      initialInvestmentTotal,
      annualSavings,
      netAnnualBenefit,
      paybackPeriodMonths,
      roi3Year,
      roi5Year,
      npv,
      irr
    } = results;

    return `# ${basicInfo.productName} 導入ROI分析レポート

## 概要
**分析対象**: ${basicInfo.productName}  
**導入目的**: ${basicInfo.purpose}  
**分析期間**: ${basicInfo.analysisYears}年間  

## 現状分析
- **従業員数**: ${humanResources.employeeCount}名
- **平均時給**: ${ROICalculator.formatCurrency(humanResources.averageHourlyWage)}
- **月間取引件数**: ${ROICalculator.formatNumber(businessMetrics.monthlyTransactions)}件
- **平均処理時間**: ${businessMetrics.avgProcessingTimeMinutes}分/件
- **エラー率**: ${ROICalculator.formatPercentage(businessMetrics.errorRate)}

## 財務分析

### 主要指標
- **初期投資額**: ${ROICalculator.formatCurrency(initialInvestmentTotal)}
- **年間削減額**: ${ROICalculator.formatCurrency(annualSavings)}
- **年間純利益**: ${ROICalculator.formatCurrency(netAnnualBenefit)}
- **投資回収期間**: ${FormattingUtils.formatMonths(paybackPeriodMonths)}

### 収益性指標
- **3年間ROI**: ${ROICalculator.formatPercentage(roi3Year)}
- **5年間ROI**: ${ROICalculator.formatPercentage(roi5Year)}
- **NPV**: ${ROICalculator.formatCurrency(npv)}
- **IRR**: ${ROICalculator.formatPercentage(irr)}

## 費用対効果分析

### 現在の年間コスト
- **人件費**: ${ROICalculator.formatCurrency(humanResources.employeeCount * humanResources.averageHourlyWage * humanResources.annualHours)}
- **エラー対応費用**: エラー率${ROICalculator.formatPercentage(businessMetrics.errorRate)}による追加コスト
- **手戻り費用**: 手戻り率${ROICalculator.formatPercentage(businessMetrics.reworkRate)}による損失

### 導入後の効果
- **人件費削減率（合成）**: ${ROICalculator.formatPercentage(laborReductionRate)}（人員削減率${ROICalculator.formatPercentage(efficiencyGains.personnelReduction)}・労働時間削減率${ROICalculator.formatPercentage(efficiencyGains.workHourReduction)}・自動化率${ROICalculator.formatPercentage(efficiencyGains.automationPercentage)}）
  - ※ 各削減率は残りの人件費に順に効くものとして 1 − (1 − 人員削減率)(1 − 労働時間削減率)(1 − 自動化率) で合成しています（単純合算ではないため、合成後の削減率は 100% を超えません）。
- **年間削減額**: ${ROICalculator.formatCurrency(annualSavings)}
- **運用コスト**: ${ROICalculator.formatCurrency(results.annualOperationalCost)}
- **純削減額**: ${ROICalculator.formatCurrency(netAnnualBenefit)}

## 結論
${this.generateConclusion(basicInfo.productName, results)}

## 推奨事項
${this.generateRecommendedAction(results)}
`;
  }
}