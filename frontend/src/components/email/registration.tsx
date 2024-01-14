// components/emails/welcome.tsx
import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Section,
} from '@react-email/components';

interface RegistrationEmailProps {
  name: string | null | undefined;
}

export const RegistrationEmail = ({ name }: RegistrationEmailProps) => {
  const previewText = `Welcome to Aegis, ${name}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
    </Html>
  );
};
