import { useEffect, useState } from 'react';
import { summaryAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import Layout from '@/components/Layout';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import BudgetComparisonChart from '@/components/charts/BudgetComparisonChart';

interface SummaryData {
  total_income: string;
  total_expenses: string;
  balance: string;
  by_category: Array<{
    category: string;
    type: 'income' | 'expense';
    amount: string;
  }>;
  monthly_budget: string;
  budget_variance: string;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await summaryAPI.get({ year, month });
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [year, month]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </Layout>
    );
  }

  const income = parseFloat(summary?.total_income || '0');
  const expenses = parseFloat(summary?.total_expenses || '0');
  const balance = parseFloat(summary?.balance || '0');
  const budget = parseFloat(summary?.monthly_budget || '0');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview for {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ₹{income.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ₹{expenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                ₹{balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{budget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.budget_variance && parseFloat(summary.budget_variance) < 0 ? 'Over' : 'Under'} by ₹
                {Math.abs(parseFloat(summary?.budget_variance || '0')).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart data={summary?.by_category || []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetComparisonChart
                budget={budget}
                actual={expenses}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
