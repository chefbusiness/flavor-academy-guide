
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

export const CTASection = () => {
  const { language } = useLanguage();

  const handleExploreSchools = () => {
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'es' 
              ? '¿Listo para profesionalizar tu carrera culinaria?'
              : 'Ready to professionalize your culinary career?'
            }
          </h2>
          
          <p className="text-xl mb-8 text-green-100">
            {language === 'es'
              ? 'Accede a información detallada de las mejores escuelas de cocina del mundo y encuentra la formación perfecta para alcanzar tus objetivos profesionales.'
              : 'Access detailed information from the world\'s best culinary schools and find the perfect training to achieve your professional goals.'
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'es' ? 'Programas Verificados' : 'Verified Programs'}
              </h3>
              <p className="text-green-100 text-sm text-center">
                {language === 'es'
                  ? 'Solo incluimos escuelas con acreditación oficial y programas de calidad reconocida'
                  : 'We only include schools with official accreditation and recognized quality programs'
                }
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'es' ? 'Red Global' : 'Global Network'}
              </h3>
              <p className="text-green-100 text-sm text-center">
                {language === 'es'
                  ? 'Conectamos estudiantes con las mejores instituciones culinarias en todo el mundo'
                  : 'We connect students with the best culinary institutions worldwide'
                }
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'es' ? 'Excelencia Garantizada' : 'Guaranteed Excellence'}
              </h3>
              <p className="text-green-100 text-sm text-center">
                {language === 'es'
                  ? 'Evaluamos cada institución con criterios rigurosos de calidad educativa'
                  : 'We evaluate each institution with rigorous educational quality criteria'
                }
              </p>
            </div>
          </div>

          <Button 
            onClick={handleExploreSchools}
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3 text-lg"
          >
            {language === 'es' ? 'Explorar Escuelas' : 'Explore Schools'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
