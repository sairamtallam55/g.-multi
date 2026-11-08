import type { Facility, FAQ, Language, MultilingualText, VerificationStatus } from '../types';

export function getLocalizedText(
  text: MultilingualText | string | undefined | null,
  lang: Language = 'en'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.en || text.te || text.hi || '';
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function filterFacilities(
  facilities: Facility[],
  query: string = '',
  category?: string,
  locality?: string,
  lang: Language = 'en'
): Facility[] {
  const cleanQuery = query.trim().toLowerCase();

  return facilities.filter((fac) => {
    if (category && category !== 'ALL' && fac.category !== category) {
      return false;
    }
    if (locality && locality !== 'ALL' && fac.locality !== locality) {
      return false;
    }
    if (!cleanQuery) return true;

    const name = getLocalizedText(fac.name, lang).toLowerCase();
    const desc = getLocalizedText(fac.description, lang).toLowerCase();
    const address = (fac.address || '').toLowerCase();
    const loc = (fac.locality || '').toLowerCase();

    return (
      name.includes(cleanQuery) ||
      desc.includes(cleanQuery) ||
      address.includes(cleanQuery) ||
      loc.includes(cleanQuery)
    );
  });
}

export function validateVerificationStatus(status: unknown): status is VerificationStatus {
  return status === 'VERIFIED' || status === 'UNVERIFIED' || status === 'DEMO';
}

export function searchKnowledgeBase(
  faqs: FAQ[],
  query: string,
  lang: Language = 'en'
): FAQ[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return faqs;

  const words = cleanQuery.split(/\s+/).filter((w) => w.length > 2);

  return faqs
    .map((faq) => {
      const q = getLocalizedText(faq.question, lang).toLowerCase();
      const a = getLocalizedText(faq.answer, lang).toLowerCase();
      const cat = (faq.category || '').toLowerCase();

      let score = 0;
      if (q.includes(cleanQuery)) score += 10;
      if (a.includes(cleanQuery)) score += 5;
      if (cat.includes(cleanQuery)) score += 3;

      for (const word of words) {
        if (q.includes(word)) score += 3;
        if (a.includes(word)) score += 1;
      }

      return { faq, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.faq);
}

export function getEmergencyInstructions(): { title: string; number: string; advice: string }[] {
  return [
    {
      title: 'National Emergency Support',
      number: '112',
      advice: 'Single emergency helpline across India for Police, Fire, Ambulance, and Disaster assistance.'
    },
    {
      title: 'Medical Ambulance Helpline',
      number: '108',
      advice: 'Free emergency ambulance response service for life-threatening health situations.'
    },
    {
      title: 'Child Helpline Assistance',
      number: '1098',
      advice: 'Toll-free 24/7 service for children in need of care, protection, or separated in crowds.'
    },
    {
      title: 'Women Helpline',
      number: '181',
      advice: 'Immediate crisis response and protection support for women pilgrims.'
    }
  ];
}
