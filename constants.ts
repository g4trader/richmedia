import { OfferData } from './types';

export const DEFAULT_OFFERS: OfferData[] = [
  {
    id: '1',
    course: 'Medicina',
    headline: 'O Futuro da Medicina Começa Aqui',
    subtitle: 'Laboratórios de ponta e hospital escola próprio.',
    discount: 'Bolsas de até 100%',
    ctaText: 'Inscreva-se Agora',
    colorFrom: 'from-blue-900',
    colorTo: 'to-blue-600',
    // Using a vertical placeholder to simulate a person cutout
    image: 'https://placehold.co/300x500/png?text=Medico+Recortado'
  },
  {
    id: '2',
    course: 'Direito',
    headline: 'Defenda Seus Ideais',
    subtitle: 'Corpo docente formado por mestres e doutores.',
    discount: '50% de Desconto',
    ctaText: 'Quero Minha Vaga',
    colorFrom: 'from-red-900',
    colorTo: 'to-red-700',
    image: 'https://placehold.co/300x500/png?text=Advogada+Recortada'
  },
  {
    id: '3',
    course: 'Engenharia de Software',
    headline: 'Programe o Mundo',
    subtitle: 'Alta empregabilidade e parcerias com big techs.',
    discount: 'Matrícula Grátis',
    ctaText: 'Saiba Mais',
    colorFrom: 'from-emerald-900',
    colorTo: 'to-emerald-600',
    image: 'https://placehold.co/300x500/png?text=Dev+Recortado'
  }
];