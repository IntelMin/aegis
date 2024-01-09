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
import { SocialDataTypes, socialDetailsSchema } from './types';

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
    <>
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Stay connected
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          What&apos;s your @?
        </p>
      </div>
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
            <Button variant="outline" className="mr-4" onClick={prevStep}>
              <ChevronLeftIcon className="w-4 h-4 mr-2" /> Back
            </Button>

            <Button variant="secondary" onClick={form.handleSubmit(onSubmit)}>
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SocialDetailsForm;
