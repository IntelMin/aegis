import React, { useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleDataTypes, roleDataSchema } from './types';

type RoleDataFormProps = {
  data: RoleDataTypes;
  setData: (data: RoleDataTypes) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const RoleDetailsForm: React.FC<RoleDataFormProps> = ({
  data,
  setData,
  nextStep,
  prevStep,
}) => {
  const form = useForm<RoleDataTypes>({
    resolver: zodResolver(roleDataSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit = (formData: RoleDataTypes) => {
    const updatedData = {
      ...formData,
      role:
        typeof formData.role === 'string'
          ? parseInt(formData.role, 10)
          : formData.role,
    };

    setData(updatedData);
    nextStep();
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          wdyd?
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Tell us who you are
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }: { field: any }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am a..</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: any) => {
                      form.setValue('role', parseInt(value, 10));
                    }}
                    value={form.watch('role').toString()}
                    defaultValue={field.value.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem
                      className={`border border-[#27272a] p-[12px] gap-2 flex items-center justify-between ${
                        field.value == 1 ? 'bg-[#0e76fd]' : 'hover:bg-[#555555]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <div className="flex flex-col space-y-1">
                          <FormLabel className="font-normal">
                            Trader{' '}
                            <FormDescription className="pt-2 text-xs font-normal text-zinc-300">
                              based defi user
                            </FormDescription>
                          </FormLabel>
                        </div>
                      </div>
                      <Image
                        width={22}
                        height={22}
                        src={`/icons/role/trader.svg`}
                        alt="trader"
                        style={
                          field.value === 1
                            ? {
                                filter:
                                  'invert(100%) brightness(1000%) contrast(100%)',
                              }
                            : {}
                        }
                      />
                    </FormItem>

                    <FormItem
                      className={`mt-4 border border-[#27272a] p-[12px] gap-2 flex items-center justify-between ${
                        field.value == 2 ? 'bg-[#0e76fd]' : 'hover:bg-[#555555]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <div className="flex flex-col space-y-1">
                          <FormLabel className="font-normal">
                            Auditor{' '}
                            <FormDescription className="pt-2 text-xs font-normal text-zinc-300">
                              smart contract analyzoor
                            </FormDescription>
                          </FormLabel>
                        </div>
                      </div>
                      <Image
                        width={22}
                        height={22}
                        src={`/icons/role/auditor.svg`}
                        alt="trader"
                        style={
                          field.value === 2
                            ? {
                                filter:
                                  'invert(100%) brightness(1000%) contrast(100%)',
                              }
                            : {}
                        }
                      />
                    </FormItem>

                    <FormItem
                      className={`mt-4 border border-[#27272a] p-[12px] gap-2 flex items-center justify-between ${
                        field.value == 3 ? 'bg-[#0e76fd]' : 'hover:bg-[#555555]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="3" />
                        </FormControl>
                        <div className="flex flex-col space-y-1">
                          <FormLabel className="font-normal">
                            Builder{' '}
                            <FormDescription className="pt-2 text-xs font-normal text-zinc-300">
                              24/7 buidl maniac
                            </FormDescription>
                          </FormLabel>
                        </div>
                      </div>
                      <Image
                        width={22}
                        height={22}
                        src={`/icons/role/builder.svg`}
                        alt="builder"
                        style={
                          field.value === 3
                            ? {
                                filter:
                                  'invert(100%) brightness(1000%) contrast(100%)',
                              }
                            : {}
                        }
                      />
                    </FormItem>

                    <FormItem
                      className={`mt-4 border border-[#27272a] p-[12px] gap-2 flex items-center justify-between ${
                        field.value == 4 ? 'bg-[#0e76fd]' : 'hover:bg-[#555555]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <div className="flex flex-col space-y-1">
                          <FormLabel className="font-normal">
                            KOL{' '}
                            <FormDescription className="pt-2 text-xs font-normal text-zinc-300">
                              {'trusted advisor & influencer'}
                            </FormDescription>
                          </FormLabel>
                        </div>
                      </div>
                      <Image
                        width={22}
                        height={22}
                        src={`/icons/role/kol.svg`}
                        alt="kol"
                        style={
                          field.value === 4
                            ? {
                                filter:
                                  'invert(100%) brightness(1000%) contrast(100%)',
                              }
                            : {}
                        }
                      />
                    </FormItem>

                    <FormItem
                      className={`mt-4 border border-[#27272a] p-[12px] gap-2 flex items-center justify-between ${
                        field.value == 5 ? 'bg-[#0e76fd]' : 'hover:bg-[#555555]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="5" />
                        </FormControl>
                        <div className="flex flex-col space-y-1">
                          <FormLabel className="font-normal">
                            Venture Capitalist{' '}
                            <FormDescription className="pt-2 text-xs font-normal text-zinc-300">
                              {'Invest in & support innovative projects'}
                            </FormDescription>
                          </FormLabel>
                        </div>
                      </div>
                      <Image
                        width={22}
                        height={22}
                        src="/icons/role/vc.svg"
                        alt="vc"
                        style={
                          field.value === 5
                            ? {
                                filter:
                                  'invert(100%) brightness(1000%) contrast(100%)',
                              }
                            : {}
                        }
                      />
                    </FormItem>
                  </RadioGroup>
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

export default RoleDetailsForm;
