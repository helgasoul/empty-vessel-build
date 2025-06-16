
import React from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import ExpertsPanel from '@/components/experts/ExpertsPanel';

const Experts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Главная" },
            { label: "Эксперты" }
          ]}
          className="mb-6"
        />
        
        <ExpertsPanel />
      </div>
    </div>
  );
};

export default Experts;
