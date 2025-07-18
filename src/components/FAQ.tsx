
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ = () => {
  const { language, t } = useLanguage();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData: { [key: string]: FAQItem[] } = {
    es: [
      {
        id: 'selection',
        question: '¿Cómo seleccionan las escuelas incluidas en el directorio?',
        answer: 'Evaluamos cada institución basándonos en criterios rigurosos: acreditación oficial, calidad de instalaciones, prestigio del profesorado, empleabilidad de graduados, programas académicos reconocidos y opiniones de estudiantes. Solo incluimos escuelas que cumplen con nuestros estándares de excelencia educativa.'
      },
      {
        id: 'updates',
        question: '¿Con qué frecuencia se actualiza la información?',
        answer: 'Actualizamos constantemente nuestra base de datos. La información de cada escuela se revisa mensualmente, incluyendo programas, costos, requisitos de admisión y datos de contacto. Trabajamos directamente con las instituciones para mantener la información siempre actualizada.'
      },
      {
        id: 'suggest',
        question: '¿Puedo sugerir una escuela para incluir en el directorio?',
        answer: 'Por supuesto. Si conoces una escuela de cocina de calidad que no esté en nuestro directorio, puedes sugerirnos incluirla a través de nuestro formulario de contacto. Evaluaremos la institución según nuestros criterios de calidad antes de agregarla.'
      },
      {
        id: 'quality',
        question: '¿Cómo verifican la calidad de las instituciones?',
        answer: 'Realizamos una investigación exhaustiva que incluye: verificación de acreditaciones oficiales, análisis de infraestructura y equipamiento, evaluación del perfil del profesorado, revisión de programas académicos, análisis de estadísticas de empleabilidad y recopilación de testimonios de graduados.'
      },
      {
        id: 'scholarships',
        question: '¿Ofrecen información sobre becas y financiamiento?',
        answer: 'Sí, incluimos información sobre opciones de financiamiento, becas disponibles, programas de ayuda financiera y convenios especiales que ofrecen las escuelas. Esta información se actualiza regularmente y varía según cada institución.'
      },
      {
        id: 'limit',
        question: '¿Hay límite en el número de escuelas que puedo consultar?',
        answer: 'No, puedes consultar todas las escuelas que desees sin ningún límite. Nuestro directorio es completamente gratuito y está diseñado para que puedas explorar todas las opciones que necesites para tomar la mejor decisión educativa.'
      }
    ],
    en: [
      {
        id: 'selection',
        question: 'How do you select the schools included in the directory?',
        answer: 'We evaluate each institution based on rigorous criteria: official accreditation, facility quality, faculty prestige, graduate employability, recognized academic programs, and student reviews. We only include schools that meet our educational excellence standards.'
      },
      {
        id: 'updates',
        question: 'How frequently is the information updated?',
        answer: 'We constantly update our database. Each school\'s information is reviewed monthly, including programs, costs, admission requirements, and contact details. We work directly with institutions to keep information always current.'
      },
      {
        id: 'suggest',
        question: 'Can I suggest a school to include in the directory?',
        answer: 'Absolutely. If you know a quality culinary school that\'s not in our directory, you can suggest including it through our contact form. We\'ll evaluate the institution according to our quality criteria before adding it.'
      },
      {
        id: 'quality',
        question: 'How do you verify the quality of institutions?',
        answer: 'We conduct thorough research including: official accreditation verification, infrastructure and equipment analysis, faculty profile evaluation, academic program review, employability statistics analysis, and graduate testimonial collection.'
      },
      {
        id: 'scholarships',
        question: 'Do you provide information about scholarships and financing?',
        answer: 'Yes, we include information about financing options, available scholarships, financial aid programs, and special agreements offered by schools. This information is regularly updated and varies by institution.'
      },
      {
        id: 'limit',
        question: 'Is there a limit on how many schools I can consult?',
        answer: 'No, you can consult as many schools as you want without any limit. Our directory is completely free and designed so you can explore all the options you need to make the best educational decision.'
      }
    ]
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const currentFAQ = faqData[language] || faqData.es;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'es' 
                ? 'Resolvemos las dudas más comunes sobre nuestro directorio de escuelas de cocina'
                : 'We answer the most common questions about our culinary schools directory'
              }
            </p>
          </div>

          <div className="space-y-4">
            {currentFAQ.map((faq) => (
              <div 
                key={faq.id}
                className="border border-border rounded-lg bg-card shadow-sm"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
