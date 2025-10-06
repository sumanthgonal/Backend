import { useEffect, useState } from 'react';
import { budgetAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: number;
  year: number;
  month: number;
  amount: string;
}

const Budget = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [amount, setAmount] = useState('');
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const { toast } = useToast();

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    const budget = budgets.find(
      (b) => b.year === selectedYear && b.month === selectedMonth
    );
    setCurrentBudget(budget || null);
    setAmount(budget?.amount || '');
  }, [selectedYear, selectedMonth, budgets]);

  const fetchBudgets = async () => {
    try {
      const response = await budgetAPI.list();
      const budgetsData = response.data.results || response.data;
      setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setBudgets([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        year: selectedYear,
        month: selectedMonth,
        amount,
      };

      if (currentBudget) {
        await budgetAPI.update(currentBudget.id, data);
        toast({
          title: 'Success',
          description: 'Budget updated successfully',
        });
      } else {
        await budgetAPI.create(data);
        toast({
          title: 'Success',
          description: 'Budget created successfully',
        });
      }

      fetchBudgets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save budget',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Monthly Budget</h1>
          <p className="text-muted-foreground">Set your spending limit for each month</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Set Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger id="year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(value) => setSelectedMonth(parseInt(value))}
                    >
                      <SelectTrigger id="month">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {currentBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {budgets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No budgets set yet
                  </p>
                ) : (
                  Array.isArray(budgets) && budgets
                    .sort((a, b) => {
                      if (a.year !== b.year) return b.year - a.year;
                      return b.month - a.month;
                    })
                    .map((budget) => (
                      <div
                        key={budget.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">
                            {months.find((m) => m.value === budget.month)?.label} {budget.year}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ₹{parseFloat(budget.amount).toFixed(2)}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Budget;
