'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/components/toast';

interface SignInProps {}

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignIn: FC<SignInProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      showToast({
        type: 'error',
        message: 'Something went wrong.',
        description: 'Please check your email and password.',
      });
      setIsLoading(false);
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="w-[20rem] md:w-[22rem]">
      <div className="flex items-center justify-center flex-col h-[90%] px-[10px] mb-8">
        <div className="border border-[#27272A] w-fit p-4 rounded-md mb-3">
          <Image alt="user-icon" src="/icons/user.png" width={20} height={20} />
        </div>
        <h1 className="font-[600] text-[24px] leading-[48px] text-[#FFFFFF]">
          Welcome
        </h1>
        <p className="font-[400] text-[14px] leading-[24px] text-[#A6A6A6]">
          Please enter your account details to sign in.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none bg-zinc-900 border-zinc-800"
                      placeholder="based@aiaegis.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none bg-zinc-900 border-zinc-800"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isLoading ? (
            <>
              <Button disabled className="w-full mt-7">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </Button>
            </>
          ) : (
            <>
              <Button type="submit" className="w-full mt-7">
                Sign in
              </Button>
            </>
          )}
        </form>
      </Form>

      <div className="pt-12 pb-4 mt-auto text-center text-zinc-300">
        <p>{`Don't have an account?`}</p>
        <Link
          className="text-[#0E76FD] text-[14px] font-[400]"
          href={'sign-up'}
        >
          Sign up.
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
