import React, { Suspense } from 'react';
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';

const DashboardLayout = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-900">
        Dashboard
      </h1>

      {/* Dashboard Page */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>

      </Suspense>
      <DashboardPage />
    </div>
  );
};

export default DashboardLayout;
