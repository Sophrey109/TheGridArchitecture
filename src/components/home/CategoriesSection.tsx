
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Laptop, 
  Lightbulb, 
  Users, 
  BookOpen, 
  Trophy,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  name: string;
  description: string;
  icon: React.ElementType;
  count: number;
  link: string;
  color: string;
}

const categories: Category[] = [
  {
    name: 'Architecture',
    description: 'Latest projects and architectural innovations',
    icon: Building2,
    count: 245,
    link: '/articles?category=architecture',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'BIM Technology',
    description: 'Building Information Modeling tools and workflows',
    icon: Laptop,
    count: 128,
    link: '/articles?category=bim',
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Design Innovation',
    description: 'Creative solutions and design thinking',
    icon: Lightbulb,
    count: 189,
    link: '/articles?category=innovation',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    name: 'Learning Resources',
    description: 'Tutorials, courses, and educational content',
    icon: BookOpen,
    count: 156,
    link: '/learning',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Career Opportunities',
    description: 'Job openings and career development',
    icon: Briefcase,
    count: 89,
    link: '/jobs',
    color: 'bg-red-100 text-red-600'
  },
  {
    name: 'Competitions',
    description: 'Design competitions and awards',
    icon: Trophy,
    count: 34,
    link: '/competitions',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    name: 'Exhibitions',
    description: 'Shows, exhibitions, and cultural events',
    icon: Calendar,
    count: 67,
    link: '/exhibitions',
    color: 'bg-teal-100 text-teal-600'
  },
  {
    name: 'Industry Insights',
    description: 'Expert interviews and thought leadership',
    icon: Users,
    count: 112,
    link: '/articles?category=insights',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

export const CategoriesSection = () => {
  return (
    <section className="bg-muted/30 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="hero-text mb-4">Explore by Category</h2>
        <p className="body-text text-muted-foreground max-w-2xl mx-auto">
          Discover content tailored to your interests across architecture, technology, and design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.filter(category => !['Competitions', 'Exhibitions'].includes(category.name)).map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.name} to={category.link}>
              <Card className="article-card h-full border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <h3 className="section-title mb-2">{category.name}</h3>
                  <p className="body-text text-muted-foreground mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="caption-text text-primary font-medium">
                      {category.count} articles
                    </span>
                    <span className="text-primary">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
