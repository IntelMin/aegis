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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PersonalDataTypes } from './types';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const personalDetailsSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

type PersonalDetailsFormProps = {
  data: PersonalDataTypes;
  setData: (data: PersonalDataTypes) => void;
  nextStep: () => void;
};

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  data,
  setData,
  nextStep,
}) => {
  const form = useForm<PersonalDataTypes>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit = (formData: PersonalDataTypes) => {
    console.log(formData);
    setData(formData);
    nextStep();
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Sign up to Aegis
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Lets get you started with your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password2"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Confrim Password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" type="submit">
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" onClick={nextStep} />
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PersonalDetailsForm;
