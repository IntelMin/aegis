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

type ProjectDetailsData = {
  project_name: string;
  project_website: string;
  project_telegram: string;
  project_twitter: string;
  project_instagram: string;
  project_discord: string;
  project_logo: string;
};

const projectDetailsSchema = z
  .object({
    project_name: z.string().min(1, 'Project name is required'),
    project_website: z
      .string()
      .url('Invalid URL format')
      .min(1, 'Project website is required'),
    project_telegram: z
      .string()
      .min(3, 'Telegram username must be at least 3 characters')
      .optional(),
    project_twitter: z
      .string()
      .min(3, 'Twitter username must be at least 3 characters')
      .optional(),
    project_instagram: z
      .string()
      .min(3, 'Instagram username must be at least 3 characters')
      .optional(),
    project_discord: z
      .string()
      .min(3, 'Discord username must be at least 3 characters')
      .optional(),
    project_logo: z
      .string()
      .url('Invalid URL format')
      .min(1, 'Project logo is required'),
  })
  .refine(
    data => {
      return (
        data.project_telegram ||
        data.project_twitter ||
        data.project_instagram ||
        data.project_discord
      );
    },
    {
      message:
        'At least one social media contact (Telegram, Twitter, Instagram, or Discord) is required',
      path: [
        'project_telegram',
        'project_twitter',
        'project_instagram',
        'project_discord',
      ],
    }
  );

type ProjectDetailsFormProps = {
  data: ProjectDetailsData;
  setData: (data: ProjectDetailsData) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  data,
  setData,
  nextStep,
  prevStep,
}) => {
  const form = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const onSubmit = (formData: ProjectDetailsData) => {
    setData(formData);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Website" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_twitter"
          render={({ field }) => (
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
          name="project_telegram"
          render={({ field }) => (
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
          name="project_discord"
          render={({ field }) => (
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
          name="project_instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Instagram" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project_logo"
          render={({ field }) => (
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

export default ProjectDetailsForm;
