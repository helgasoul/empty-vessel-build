
import React from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import ExpertBlog from '@/components/experts/ExpertBlog';
import BackButton from '@/components/ui/back-button';

const ExpertBlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BackButton fallbackPath="/experts" className="mb-4" />
        
        <Breadcrumbs
          items={[
            { href: "/", label: "Главная" },
            { href: "/experts", label: "Эксперты" },
            { label: "Блог эксперта" }
          ]}
          className="mb-6"
        />
        
        <ExpertBlog />
      </div>
    </div>
  );
};

export default ExpertBlogPage;
