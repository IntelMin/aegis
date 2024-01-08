import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SocialDataTypes } from './types';

const socialDetailsSchema = z.object({
  twitter: z
    .string()
    .min(3, 'Twitter username must be at least 3 characters')
    .optional(),
  instagram: z
    .string()
    .min(3, 'Instagram username must be at least 3 characters')
    .optional(),
  discord: z
    .string()
    .min(3, 'Discord username must be at least 3 characters')
    .optional(),
  telegram: z
    .string()
    .min(3, 'Telegram username must be at least 3 characters')
    .optional(),
});

type SocialDetailsFormProps = {
  data: SocialDataTypes;
  setData: (data: SocialDataTypes) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const SocialDetailsForm: React.FC<SocialDetailsFormProps> = ({
  data,
  setData,
  nextStep,
  prevStep,
}) => {
  const form = useForm<SocialDataTypes>({
    resolver: zodResolver(socialDetailsSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit = (formData: SocialDataTypes) => {
    setData(formData);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="social_twitter"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input {...field} placeholder="X (formerly twitter)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_telegram"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Telegram</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Telegram" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_discord"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Discord</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Discord" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_instagram"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Instagram" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outline" className="mr-4">
            <ChevronLeftIcon className="w-4 h-4 mr-2" onClick={prevStep} /> Back
          </Button>

          <Button variant="secondary" type="submit">
            Next
            <ChevronRightIcon className="w-4 h-4 ml-2" onClick={prevStep} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SocialDetailsForm;
