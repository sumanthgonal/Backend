import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { transactionsAPI } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

interface Transaction {
  id: number;
  category: number;
  amount: string;
  date: string;
  note?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  categories: Category[];
  onSuccess: () => void;
}

const TransactionFormDialog = ({ open, onOpenChange, transaction, categories, onSuccess }: Props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        category: transaction.category.toString(),
        amount: transaction.amount,
        date: transaction.date,
        note: transaction.note || '',
      });
    } else {
      form.reset({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [transaction, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        category: parseInt(values.category),
        amount: values.amount,
        date: values.date,
        note: values.note,
      };

      if (transaction) {
        await transactionsAPI.update(transaction.id, data);
        toast({
          title: 'Success',
          description: 'Transaction updated successfully',
        });
      } else {
        await transactionsAPI.create(data);
        toast({
          title: 'Success',
          description: 'Transaction created successfully',
        });
      }

      onSuccess();
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save transaction',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(categories) && categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name} ({cat.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a note..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
