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
import { ChevronRightIcon } from '@radix-ui/react-icons';
import {
  PersonalDataTypes,
  personalDetailsSchema,
} from '@/components/sign-up/types';

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
            name="username"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Username" />
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
            <Button variant="secondary" onClick={form.handleSubmit(onSubmit)}>
              <ChevronRightIcon className="w-4 h-4 mr-2" />
              Next
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PersonalDetailsForm;
