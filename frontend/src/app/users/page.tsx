'use client';
import React, { useState } from 'react';
import UserAccountTable from '@/components/users/user-account-table';

import UserSidebarItem from '@/components/users/UserSidebarItem';
import UserPaymentsTable from '@/components/users/user-payments-table';
import UserHistoryTable from '@/components/users/user-history-table';

type ContentKey = 'accounts' | 'payments' | 'history';

const User = () => {
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<ContentKey>('accounts');

  const contentTitles: { [key in ContentKey]: string } = {
    accounts: 'Accounts',
    payments: 'Payments',
    history: 'History',
  };

  const renderContent = () => {
    switch (selectedSidebarItem) {
      case 'accounts':
        return <UserAccountTable />;
      case 'payments':
        return <UserPaymentsTable />;
      case 'history':
        return <UserHistoryTable />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-2xl">
          Hello <span className="text-sky-600">Yuvraj</span>
        </div>
        <div>
          Credit Balance: <span className="text-green-600">30 Credits</span>
        </div>
      </div>
      <hr className="border-b-1 border-slate-700 mt-4" />

      {/* Sidebar */}
      <div className="flex gap-2">
        <nav className="flex flex-col gap-6 border-r-[1px] border-gray-700 h-screen pr-10 w-[200px] pt-10">
          {Object.keys(contentTitles).map(key => (
            <UserSidebarItem
              key={key}
              itemKey={key as ContentKey}
              selected={selectedSidebarItem}
              onSelect={setSelectedSidebarItem}
            >
              {contentTitles[key as ContentKey]}
            </UserSidebarItem>
          ))}
        </nav>

        {/* Content Area */}
        <div className="p-6 w-full">
          <h1 className="text-3xl">{contentTitles[selectedSidebarItem]}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default User;
