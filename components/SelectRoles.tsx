import React from 'react'
import VCIcon from '@/public/role-icons/vc.svg'
import AuditorIcon from '@/public/role-icons/auditor.svg'
import IndivIcon from '@/public/role-icons/individual.svg'
import BuilderIcon from '@/public/role-icons/builder.svg'
import AdminIcon from '@/public/role-icons/admin.svg'
import KolIcon from '@/public/role-icons/kol.svg'
import Image from 'next/image'
const roles = [
  {
    icon: VCIcon,
    text: "VCs",
    value: "vc",
    desc: "venture capitalists"
  },
  {
    icon: AuditorIcon,
    text: "Auditors",
    value: "auditor",
    desc: "venture capitalists"
  },
  {
    icon: IndivIcon,
    text: "Individual",
    value: "individual",
    desc: "regular users"
  },
  {
    icon: BuilderIcon,
    text: "Builder",
    value: "builder",
    desc: "project owners"
  },
  {
    icon: AdminIcon,
    text: "Admin",
    value: "admin",
    desc: "system role for internal team"
  },
  {
    icon: KolIcon,
    text: "KOL",
    value: "kol",
    desc: "Advisor"
  },
]

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

const SelectRoles: React.FC<IProps> = ({
  value,
  onChange
}) => (
  <div className='w-full'>
    <p className='text-[16px] font-semibold leading-[24px] text-white'>
      Choose your user type <span className="text-[#ff0000]">*</span>
    </p>
    <div className='flex flex-wrap max-w-[358px] w-[100%] gap-3 mt-[12px]'>
      {roles.map((role, index) =>
        <button
          className={`${role.value === value ? 'bg-[#0e76fd]' : 'bg-transparent'} border border-[#27272a] py-[6px] px-[12px] gap-2 flex hover:bg-[#555555]`}
          key={index}
          onClick={() => onChange(role.value)}
        >
          <Image
            width={22}
            height={22}
            src={role.icon}
            alt={`role-icon-` + index}
          />
          <div>
            <p className='text-[16px] font-medium leading-[24px] text-white text-left'>{role.text}</p>
            <p className={`${role.value === value ? 'text-white' : 'text-[#71717a]'} text-[14px] font-normal leading-[20px]`}>{role.desc}</p>
          </div>
        </button>
      )}
    </div>
  </div>
)

export default SelectRoles