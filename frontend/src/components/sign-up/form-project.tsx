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
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { ProjectDataTypes, projectDetailsSchema } from './types';

type ProjectDetailsFormProps = {
  data: ProjectDataTypes;
  setData: (data: ProjectDataTypes) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  data,
  setData,
  nextStep,
  prevStep,
}) => {
  const form = useForm<ProjectDataTypes>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit = (formData: ProjectDataTypes) => {
    setData(formData);
    nextStep();
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          What&apos;s cooking?
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Tell us what you&apos;re working on
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="project_name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name of the project" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_website"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Project Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Website" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 py-2">
              <FormField
                control={form.control}
                name="project_twitter"
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
            </div>

            <div className="w-1/2 px-2 py-2">
              <FormField
                control={form.control}
                name="project_telegram"
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
            </div>

            <div className="w-1/2 px-2 py-2">
              <FormField
                control={form.control}
                name="project_discord"
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
            </div>

            <div className="w-1/2 px-2 py-2">
              <FormField
                control={form.control}
                name="project_instagram"
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
            </div>
          </div>

          <FormField
            control={form.control}
            name="project_logo"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Logo" />
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

export default ProjectDetailsForm;
