'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ui/error-state';
import { DetailSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import { DashboardAIResponse } from '@/types/dashboard';

function riskBadgeVariant(level: string): 'success' | 'warning' | 'error' | 'default' {
  const l = level.toUpperCase();
  if (l === 'HIGH') return 'error';
  if (l === 'MEDIUM') return 'warning';
  if (l === 'LOW') return 'success';
  return 'default';
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<DashboardAIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requested, setRequested] = useState(false);

  const generate = () => {
    setRequested(true);
    setLoading(true);
    setError('');
    fetch('/api/dashboard/ai')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: DashboardAIResponse) => setInsights(data))
      .catch(() => setError('Could not generate AI insights. Try again.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="AI-generated analysis of your business performance"
      >
        <Button variant="primary" onClick={generate} loading={loading}>
          {insights ? 'Regenerate Insights' : 'Generate Insights'}
        </Button>
      </PageHeader>

      {!requested && (
        <Card>
          <p className="text-sm text-text-muted text-center py-8">
            Click &ldquo;Generate Insights&rdquo; to have AI analyze your invoices, customers, and products.
            This calls out to an LLM and may take a few seconds.
          </p>
        </Card>
      )}

      {loading && (
        <div className="space-y-6">
          <DetailSkeleton fields={3} />
          <TableSkeleton rows={4} cols={3} />
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={generate} />}

      {!loading && !error && insights && (
        <div className="space-y-6">
          {/* Score + summary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                <span className="text-4xl font-bold text-primary-500">{insights.overallBusinessScore.score}</span>
                <span className="text-sm font-semibold text-text-primary">{insights.overallBusinessScore.grade}</span>
                <p className="text-xs text-text-muted mt-2">{insights.overallBusinessScore.summary}</p>
              </div>
            </Card>
            <Card className="lg:col-span-2" header={<h3 className="text-base font-semibold text-text-primary">Business Summary</h3>}>
              <p className="text-sm text-text-primary whitespace-pre-line">{insights.businessSummary}</p>
              <p className="text-sm text-text-muted mt-4 whitespace-pre-line">{insights.growthPrediction}</p>
            </Card>
          </div>

          {insights.recommendations.length > 0 && (
            <Card header={<h3 className="text-base font-semibold text-text-primary">Recommendations</h3>}>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-text-primary">
                {insights.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {insights.customerInsights.length > 0 && (
              <Card header={<h3 className="text-base font-semibold text-text-primary">Customer Insights</h3>}>
                <div className="divide-y divide-surface-2">
                  {insights.customerInsights.map(c => (
                    <div key={c.customerId} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{c.customerName}</p>
                        <Badge variant={riskBadgeVariant(c.riskLevel)}>{c.riskLevel}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">{c.insight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {insights.paymentRisks.length > 0 && (
              <Card header={<h3 className="text-base font-semibold text-text-primary">Payment Risks</h3>}>
                <div className="divide-y divide-surface-2">
                  {insights.paymentRisks.map(p => (
                    <div key={p.customerId} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{p.customerName}</p>
                        <Badge variant={riskBadgeVariant(p.riskLevel)}>{p.riskLevel}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">{p.reason}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {insights.productInsights.length > 0 && (
              <Card header={<h3 className="text-base font-semibold text-text-primary">Product Insights</h3>}>
                <div className="divide-y divide-surface-2">
                  {insights.productInsights.map(p => (
                    <div key={p.productId} className="py-3 space-y-1">
                      <p className="text-sm font-medium text-text-primary">{p.productName}</p>
                      <p className="text-xs text-text-muted">{p.insight}</p>
                      <p className="text-xs text-primary-400">{p.recommendation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {insights.priceRecommendations.length > 0 && (
              <Card header={<h3 className="text-base font-semibold text-text-primary">Price Recommendations</h3>}>
                <div className="divide-y divide-surface-2">
                  {insights.priceRecommendations.map(p => (
                    <div key={p.productId} className="py-3 space-y-1">
                      <p className="text-sm font-medium text-text-primary">{p.productName}</p>
                      <p className="text-xs text-text-muted">{p.recommendation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {insights.inventorySuggestions.length > 0 && (
              <Card header={<h3 className="text-base font-semibold text-text-primary">Inventory Suggestions</h3>}>
                <div className="divide-y divide-surface-2">
                  {insights.inventorySuggestions.map((s, i) => (
                    <div key={i} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{s.materialName}</p>
                        <Badge variant={riskBadgeVariant(s.priority)}>{s.priority}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">{s.suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card header={<h3 className="text-base font-semibold text-text-primary">Profitability Analysis</h3>}>
              <p className="text-sm text-text-primary mb-4">{insights.profitabilityAnalysis.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase mb-2">Strengths</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-success">
                    {insights.profitabilityAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase mb-2">Weaknesses</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-error">
                    {insights.profitabilityAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card header={<h3 className="text-base font-semibold text-text-primary">Demand Forecast</h3>}>
              <p className="text-sm text-text-primary mb-3">{insights.demandForecast.summary}</p>
              <p className="text-xs text-text-muted"><span className="font-medium text-text-primary">Next month:</span> {insights.demandForecast.nextMonthForecast}</p>
              <p className="text-xs text-text-muted mt-1"><span className="font-medium text-text-primary">Next quarter:</span> {insights.demandForecast.nextQuarterForecast}</p>
            </Card>
            <Card header={<h3 className="text-base font-semibold text-text-primary">Cash Flow Insights</h3>}>
              <p className="text-sm text-text-primary mb-3">{insights.cashFlowInsights.summary}</p>
              <p className="text-xs text-text-muted">{insights.cashFlowInsights.recommendation}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
