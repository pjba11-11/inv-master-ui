export type DashboardPeriod = 'LAST_MONTH' | 'LAST_3_MONTHS' | 'LAST_6_MONTHS' | 'LAST_YEAR';

export interface MonthlyRevenueResponse {
  month: string;
  year: number;
  revenue: number;
}

export interface MonthlyInvoiceCountResponse {
  month: string;
  year: number;
  invoiceCount: number;
}

export interface TopProductResponse {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface TopCustomerResponse {
  customerId: number;
  customerName: string;
  invoiceCount: number;
  revenue: number;
}

export interface GrowthPredictionResponse {
  companyHealth: string;
  expectedGrowthPercentage: number;
  expectedRevenue: number;
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export interface DashboardPeriodResponse {
  period: DashboardPeriod;
  revenue: number;
  collectedAmount: number;
  outstandingAmount: number;
  totalInvoices: number;
  totalCustomers: number;
  averageInvoiceValue: number;
  growthPercentage: number;
  monthlyRevenue: MonthlyRevenueResponse[];
  monthlyInvoiceCount: MonthlyInvoiceCountResponse[];
  topProducts: TopProductResponse[];
  topCustomers: TopCustomerResponse[];
  growthPrediction: GrowthPredictionResponse | null;
}

export interface DashboardResponse {
  periods: DashboardPeriodResponse[];
  growthPrediction: GrowthPredictionResponse | null;
}

export interface CustomerInsightResponse {
  customerId: number;
  customerName: string;
  insight: string;
  riskLevel: string;
}

export interface ProductInsightResponse {
  productId: number;
  productName: string;
  insight: string;
  recommendation: string;
}

export interface InventorySuggestionResponse {
  materialName: string;
  suggestion: string;
  priority: string;
}

export interface PaymentRiskResponse {
  customerId: number;
  customerName: string;
  riskLevel: string;
  reason: string;
}

export interface ProfitabilityAnalysisResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface PriceRecommendationResponse {
  productId: number;
  productName: string;
  recommendation: string;
}

export interface DemandForecastResponse {
  summary: string;
  nextMonthForecast: string;
  nextQuarterForecast: string;
}

export interface CashFlowInsightResponse {
  summary: string;
  recommendation: string;
}

export interface BusinessScoreResponse {
  score: number;
  grade: string;
  summary: string;
}

export interface DashboardAIResponse {
  businessSummary: string;
  growthPrediction: string;
  recommendations: string[];
  customerInsights: CustomerInsightResponse[];
  productInsights: ProductInsightResponse[];
  inventorySuggestions: InventorySuggestionResponse[];
  paymentRisks: PaymentRiskResponse[];
  profitabilityAnalysis: ProfitabilityAnalysisResponse;
  priceRecommendations: PriceRecommendationResponse[];
  demandForecast: DemandForecastResponse;
  cashFlowInsights: CashFlowInsightResponse;
  overallBusinessScore: BusinessScoreResponse;
}

export const DASHBOARD_PERIOD_LABELS: Record<DashboardPeriod, string> = {
  LAST_MONTH: 'Last Month',
  LAST_3_MONTHS: 'Last 3 Months',
  LAST_6_MONTHS: 'Last 6 Months',
  LAST_YEAR: 'Last Year',
};
