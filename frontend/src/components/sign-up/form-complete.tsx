import { CheckIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Button } from '../ui/button';
import { PersonalDataTypes, RoleDataTypes, SocialDataTypes } from './types';

const roleMapping: { [key: string]: string } = {
  '1': 'trader',
  '2': 'auditor',
  '3': 'builder',
  '4': 'KOL',
  '5': 'vc',
};

type FinishStepProps = {
  personalData: PersonalDataTypes;
  roleData: RoleDataTypes;
  socialData: SocialDataTypes;
  onSubmit: () => void;
};

const CompleteForm: React.FC<FinishStepProps> = ({
  personalData,
  roleData,
  socialData,
  onSubmit,
}) => {
  return (
    <div>
      <h2 className="pb-2 text-lg font-bold text-zinc-300">
        Hey, {personalData.name}!
      </h2>
      <div className="pb-2 text-md text-zinc-400">
        We&apos;re excited to have another{' '}
        <span className="text-zinc-200">
          {roleMapping[roleData.role.toString()]}
        </span>{' '}
        on board. Let&apos;s get you signed up!
      </div>

      <p className="pb-2 text-md text-zinc-400">
        Once you submit your form, we&apos;ll set you up for{' '}
        <strong>whitelisting</strong>.
      </p>
      <p className="pb-6 text-md text-zinc-400">
        You&apos;ll receive an email at{' '}
        <span className="font-semibold text-zinc-200">
          {personalData.email}
        </span>
        , and we might also reach out to you on your social channels.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="submit">
          <CheckIcon className="w-4 h-4 mr-2" onClick={onSubmit} />
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default CompleteForm;
