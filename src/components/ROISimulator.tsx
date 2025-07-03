import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ROIInputs, ROIResults, ExecutiveSummary } from '../models/DataTypes';
import { ROICalculator } from '../models/ROICalculator';
import { ReportGenerator } from '../models/ReportGenerator';
import { ValidationUtils } from '../utils/validation';
import { FormattingUtils } from '../utils/formatting';
import KPICards from './KPICards';
import CostComparisonChart from './CostComparisonChart';
import CumulativeEffectGraph from './CumulativeEffectGraph';
import SensitivityHeatmap from './SensitivityHeatmap';

const ROISimulator: React.FC = () => {
  const [results, setResults] = useState<ROIResults | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'summary'>('inputs');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ROIInputs>({
    defaultValues: {
      basicInfo: {
        productName: 'SaaS製品',
        purpose: '業務効率化',
        analysisYears: 3
      },
      humanResources: {
        employeeCount: 10,
        averageHourlyWage: 3000,
        monthlyHours: 160,
        annualHours: 1920
      },
      businessMetrics: {
        monthlyTransactions: 1000,
        avgProcessingTimeMinutes: 30,
        errorRate: 5,
        reworkRate: 3
      },
      additionalCosts: {
        recruitmentCost: 500000,
        trainingCost: 200000,
        managementCost: 300000,
        otherIndirectCosts: 100000
      },
      initialInvestment: {
        systemCost: 2000000,
        customizationCost: 500000,
        migrationCost: 300000,
        setupCost: 200000
      },
      operationalCosts: {
        monthlySubscription: 50000,
        maintenanceCost: 100000,
        supportCost: 50000,
        additionalFeatureCost: 0
      },
      efficiencyGains: {
        personnelReduction: 20,
        workHourReduction: 30,
        automationPercentage: 50
      },
      qualityImprovements: {
        errorReduction: 70,
        customerSatisfactionIncrease: 20,
        reworkReduction: 80
      },
      otherBenefits: {
        opportunityLossReduction: 500000,
        scalabilityImprovement: 300000,
        competitiveAdvantage: 200000
      }
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    const validationErrors = ValidationUtils.validateROIInputs(watchedValues);
    if (validationErrors.length === 0) {
      const calculatedResults = ROICalculator.calculate(watchedValues);
      setResults(calculatedResults);
      
      const summary = ReportGenerator.generateExecutiveSummary(watchedValues, calculatedResults);
      setExecutiveSummary(summary);
    }
  }, [watchedValues]);

  const onSubmit = (data: ROIInputs) => {
    const calculatedResults = ROICalculator.calculate(data);
    setResults(calculatedResults);
    
    const summary = ReportGenerator.generateExecutiveSummary(data, calculatedResults);
    setExecutiveSummary(summary);
    
    setActiveTab('results');
  };

  const exportReport = () => {
    if (executiveSummary) {
      const blob = new Blob([executiveSummary.fullReport], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ROI分析レポート_${watchedValues.basicInfo.productName}_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const TabButton = ({ tabKey, label }: { tabKey: typeof activeTab; label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabKey)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tabKey
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SaaS導入ROI分析システム
        </h1>
        <p className="text-gray-600">
          包括的なROI分析により、SaaS製品導入の投資効果を定量化します
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <TabButton tabKey="inputs" label="入力項目" />
        <TabButton tabKey="results" label="分析結果" />
        <TabButton tabKey="summary" label="エグゼクティブサマリー" />
      </div>

      {activeTab === 'inputs' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 基本情報 */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">基本情報</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">製品名</label>
                <input
                  {...register('basicInfo.productName', { required: '製品名は必須です' })}
                  className="form-input"
                  placeholder="SaaS製品名"
                />
                {errors.basicInfo?.productName && (
                  <p className="form-error">{errors.basicInfo.productName.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">導入目的</label>
                <input
                  {...register('basicInfo.purpose', { required: '導入目的は必須です' })}
                  className="form-input"
                  placeholder="業務効率化"
                />
                {errors.basicInfo?.purpose && (
                  <p className="form-error">{errors.basicInfo.purpose.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">分析期間（年）</label>
                <input
                  {...register('basicInfo.analysisYears', { 
                    required: '分析期間は必須です',
                    min: { value: 1, message: '1年以上で入力してください' },
                    max: { value: 10, message: '10年以下で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
                {errors.basicInfo?.analysisYears && (
                  <p className="form-error">{errors.basicInfo.analysisYears.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 人的リソース */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">人的リソース</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">従業員数</label>
                <input
                  {...register('humanResources.employeeCount', { 
                    required: '従業員数は必須です',
                    min: { value: 1, message: '1以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">平均時給（円）</label>
                <input
                  {...register('humanResources.averageHourlyWage', { 
                    required: '平均時給は必須です',
                    min: { value: 0, message: '0以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">月間労働時間</label>
                <input
                  {...register('humanResources.monthlyHours', { 
                    required: '月間労働時間は必須です',
                    min: { value: 0, message: '0以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">年間労働時間</label>
                <input
                  {...register('humanResources.annualHours', { 
                    required: '年間労働時間は必須です',
                    min: { value: 0, message: '0以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* 業務量指標 */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">業務量指標</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">月間取引件数</label>
                <input
                  {...register('businessMetrics.monthlyTransactions', { 
                    required: '月間取引件数は必須です',
                    min: { value: 0, message: '0以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">平均処理時間（分）</label>
                <input
                  {...register('businessMetrics.avgProcessingTimeMinutes', { 
                    required: '平均処理時間は必須です',
                    min: { value: 0, message: '0以上で入力してください' }
                  })}
                  type="number"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">エラー率（%）</label>
                <input
                  {...register('businessMetrics.errorRate', { 
                    required: 'エラー率は必須です',
                    min: { value: 0, message: '0以上で入力してください' },
                    max: { value: 100, message: '100以下で入力してください' }
                  })}
                  type="number"
                  step="0.1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">手戻り率（%）</label>
                <input
                  {...register('businessMetrics.reworkRate', { 
                    required: '手戻り率は必須です',
                    min: { value: 0, message: '0以上で入力してください' },
                    max: { value: 100, message: '100以下で入力してください' }
                  })}
                  type="number"
                  step="0.1"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* 効率化指標 */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">効率化指標</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">人員削減率（%）</label>
                <input
                  {...register('efficiencyGains.personnelReduction', { 
                    required: '人員削減率は必須です',
                    min: { value: 0, message: '0以上で入力してください' },
                    max: { value: 100, message: '100以下で入力してください' }
                  })}
                  type="number"
                  step="0.1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">労働時間削減率（%）</label>
                <input
                  {...register('efficiencyGains.workHourReduction', { 
                    required: '労働時間削減率は必須です',
                    min: { value: 0, message: '0以上で入力してください' },
                    max: { value: 100, message: '100以下で入力してください' }
                  })}
                  type="number"
                  step="0.1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">自動化率（%）</label>
                <input
                  {...register('efficiencyGains.automationPercentage', { 
                    required: '自動化率は必須です',
                    min: { value: 0, message: '0以上で入力してください' },
                    max: { value: 100, message: '100以下で入力してください' }
                  })}
                  type="number"
                  step="0.1"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              ROI分析を実行
            </button>
          </div>
        </form>
      )}

      {activeTab === 'results' && results && (
        <div className="space-y-8">
          <KPICards results={results} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CostComparisonChart results={results} />
            <CumulativeEffectGraph results={results} analysisYears={watchedValues.basicInfo.analysisYears} />
          </div>
          
          <SensitivityHeatmap baseInputs={watchedValues} baseResults={results} />
          
          <div className="flex justify-end gap-4">
            <button onClick={exportReport} className="btn btn-secondary">
              レポートをダウンロード
            </button>
            <button onClick={() => setActiveTab('summary')} className="btn btn-primary">
              エグゼクティブサマリーを表示
            </button>
          </div>
        </div>
      )}

      {activeTab === 'summary' && executiveSummary && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">エグゼクティブサマリー</h2>
            </div>
            <div className="prose max-w-none">
              <h3>提案要旨</h3>
              <p>{executiveSummary.proposal}</p>
              
              <h3>主要財務指標</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
                <div className="metric-card">
                  <div className="metric-value">{ROICalculator.formatCurrency(executiveSummary.keyMetrics.initialInvestment)}</div>
                  <div className="metric-label">初期投資額</div>
                </div>
                <div className="success-metric">
                  <div className="success-value metric-value">{ROICalculator.formatCurrency(executiveSummary.keyMetrics.annualSavings)}</div>
                  <div className="metric-label">年間削減額</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{FormattingUtils.formatMonths(executiveSummary.keyMetrics.paybackPeriod)}</div>
                  <div className="metric-label">投資回収期間</div>
                </div>
                <div className="success-metric">
                  <div className="success-value metric-value">{ROICalculator.formatPercentage(executiveSummary.keyMetrics.roi3Year)}</div>
                  <div className="metric-label">3年間ROI</div>
                </div>
              </div>
              
              <h3>戦略的価値</h3>
              <ul>
                <li><strong>競争優位性:</strong> {executiveSummary.strategicValue.competitiveAdvantage}</li>
                <li><strong>事業拡張性:</strong> {executiveSummary.strategicValue.scalability}</li>
                <li><strong>リスク軽減:</strong> {executiveSummary.strategicValue.riskReduction}</li>
              </ul>
              
              <h3>推奨アクション</h3>
              <p>{executiveSummary.recommendedAction}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button onClick={exportReport} className="btn btn-secondary">
              詳細レポートをダウンロード
            </button>
            <button onClick={() => setActiveTab('results')} className="btn btn-primary">
              詳細分析を表示
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROISimulator;