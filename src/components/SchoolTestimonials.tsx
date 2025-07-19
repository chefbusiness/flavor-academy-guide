
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { School } from '@/types/school';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  date: string;
  category: 'student' | 'alumni' | 'teacher';
}

interface SchoolTestimonialsProps {
  school: School;
}

export const SchoolTestimonials: React.FC<SchoolTestimonialsProps> = ({ school }) => {
  const { language, t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate testimonials based on school data
    const generateTestimonials = () => {
      const testimonialTemplates = {
        es: {
          student: [
            `Las instalaciones de ${school.name} son impresionantes. Los profesores son muy experimentados y el ambiente de aprendizaje es excepcional.`,
            `Estoy aprendiendo mucho en ${school.name}. La metodología práctica me está preparando muy bien para mi carrera profesional.`,
            `Lo que más me gusta de estudiar aquí es la combinación perfecta entre teoría y práctica. Recomiendo totalmente esta escuela.`
          ],
          alumni: [
            `Gracias a mi formación en ${school.name}, conseguí trabajo en un restaurante prestigioso apenas me gradué.`,
            `La educación que recibí aquí me dio las herramientas necesarias para abrir mi propio restaurante. Excelente preparación.`,
            `Dos años después de graduarme, puedo decir que ${school.name} cambió mi vida profesional completamente.`
          ],
          teacher: [
            `Como profesor en ${school.name}, disfruto trabajar con estudiantes tan motivados y ver su crecimiento día a día.`,
            `Las instalaciones y recursos que tenemos aquí nos permiten ofrecer una educación de primera calidad.`,
            `El nivel académico y la pasión por la gastronomía que se vive en ${school.name} es realmente inspirador.`
          ]
        },
        en: {
          student: [
            `The facilities at ${school.name} are impressive. The teachers are very experienced and the learning environment is exceptional.`,
            `I'm learning so much at ${school.name}. The practical methodology is preparing me very well for my professional career.`,
            `What I like most about studying here is the perfect combination of theory and practice. I totally recommend this school.`
          ],
          alumni: [
            `Thanks to my training at ${school.name}, I got a job at a prestigious restaurant as soon as I graduated.`,
            `The education I received here gave me the tools I needed to open my own restaurant. Excellent preparation.`,
            `Two years after graduating, I can say that ${school.name} completely changed my professional life.`
          ],
          teacher: [
            `As a teacher at ${school.name}, I enjoy working with such motivated students and seeing their growth every day.`,
            `The facilities and resources we have here allow us to offer first-class education.`,
            `The academic level and passion for gastronomy that exists at ${school.name} is truly inspiring.`
          ]
        }
      };

      const names = {
        es: {
          student: ['María García', 'Carlos Rodríguez', 'Ana López', 'David Martín', 'Laura Pérez'],
          alumni: ['Chef Roberto Silva', 'Elena Vázquez', 'Miguel Torres', 'Carmen Ruiz', 'Andrés Moreno'],
          teacher: ['Prof. Isabel Fernández', 'Chef Juan Carlos', 'Dra. Patricia Vega', 'Chef Luis Sánchez']
        },
        en: {
          student: ['Sarah Johnson', 'Michael Brown', 'Emma Davis', 'James Wilson', 'Sophie Taylor'],
          alumni: ['Chef Robert Smith', 'Elena Martinez', 'Michael Torres', 'Carmen Rodriguez', 'Andrew Miller'],
          teacher: ['Prof. Isabella White', 'Chef John Carter', 'Dr. Patricia Green', 'Chef Louis Anderson']
        }
      };

      const roles = {
        es: {
          student: ['Estudiante de 2º año', 'Estudiante de 1er año', 'Estudiante de 3er año'],
          alumni: ['Egresado 2022', 'Egresado 2021', 'Egresado 2020', 'Egresado 2019'],
          teacher: ['Professor', 'Chef Instructor', 'Coordinador Académico']
        },
        en: {
          student: ['2nd Year Student', '1st Year Student', '3rd Year Student'],
          alumni: ['Graduate 2022', 'Graduate 2021', 'Graduate 2020', 'Graduate 2019'],
          teacher: ['Professor', 'Chef Instructor', 'Academic Coordinator']
        }
      };

      const generated: Testimonial[] = [];
      const categories: Array<'student' | 'alumni' | 'teacher'> = ['student', 'alumni', 'teacher'];
      
      categories.forEach((category, categoryIndex) => {
        for (let i = 0; i < 2; i++) {
          const templates = testimonialTemplates[language as 'es' | 'en'][category];
          const nameList = names[language as 'es' | 'en'][category];
          const roleList = roles[language as 'es' | 'en'][category];
          
          generated.push({
            id: `${category}-${i}`,
            name: nameList[i % nameList.length],
            role: roleList[i % roleList.length],
            content: templates[i % templates.length],
            rating: 4 + Math.round(Math.random()),
            date: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
            category
          });
        }
      });

      return generated;
    };

    setTimeout(() => {
      setTestimonials(generateTestimonials());
      setLoading(false);
    }, 1000);
  }, [school, language]);

  if (loading) {
    return (
      <section className="space-y-6">
        <h3 className="text-xl font-semibold">
          {t('communityReviews')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <Quote className="w-5 h-5 mr-2 text-primary" />
        {t('communityReviews')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-l-4 border-l-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{testimonial.name}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < testimonial.rating 
                              ? 'text-amber-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{testimonial.content}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
