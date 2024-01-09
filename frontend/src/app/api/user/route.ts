import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import {
  personalDetailsSchema,
  roleDataSchema,
  socialDetailsSchema,
  projectDetailsSchema,
} from '@/components/sign-up/types';

const baseSchema = personalDetailsSchema
  .and(roleDataSchema)
  .and(socialDetailsSchema);

const userSchema = baseSchema.refine(
  data => {
    if (data.role === 3 || data.role === 4) {
      return projectDetailsSchema.safeParse(data).success;
    }
    return true;
  },
  {
    message: 'Invalid project details for the specified role',
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, password2, role, ...metaFields } =
      userSchema.parse(body);

    // Check for existing username and email
    const existingUser = await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        user_meta: {
          create: metaFields,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        whitelisted: true,
      },
    });

    console.log({ newUser });
    return NextResponse.json(
      { user: newUser, message: `You're signed up!` },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      //   { message: 'An error occurred' },
      { message: error },
      { status: 500 }
    );
  }
}
