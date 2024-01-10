'use client';
import React, { ReactNode } from 'react';

interface UserSidebarItemProps {
  children: ReactNode;
  itemKey: string;
  selected: string;
  onSelect: any;
}

const UserSidebarItem: React.FC<UserSidebarItemProps> = ({
  children,
  itemKey,
  selected,
  onSelect,
}) => {
  const isSelected = itemKey === selected;
  const itemClass = isSelected ? 'cursor-pointer font-bold' : 'cursor-pointer';

  return (
    <p onClick={() => onSelect(itemKey)} className={itemClass}>
      {children}
    </p>
  );
};

export default UserSidebarItem;
