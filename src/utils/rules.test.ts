import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalizedText,
  calculateDistanceKm,
  filterFacilities,
  validateVerificationStatus,
  searchKnowledgeBase
} from './rules';
import type { Facility, FAQ } from '../types';

test('getLocalizedText retrieves correct language and falls back gracefully', () => {
  const text = {
    en: 'Pushkar Ghat',
    te: 'పుష్కర్ ఘాట్',
    hi: 'पुष्कर घाट'
  };

  assert.equal(getLocalizedText(text, 'te'), 'పుష్కర్ ఘాట్');
  assert.equal(getLocalizedText(text, 'hi'), 'पुष्कर घाट');
  assert.equal(getLocalizedText(text, 'en'), 'Pushkar Ghat');

  // String fallback
  assert.equal(getLocalizedText('Direct Text', 'te'), 'Direct Text');

  // Partial fallback
  const partial = { en: 'Only English', te: '', hi: '' };
  assert.equal(getLocalizedText(partial, 'te'), 'Only English');
});

test('calculateDistanceKm calculates distance between coordinates accurately', () => {
  // Distance between Rajahmundry Pushkar Ghat (~17.000, 81.777) and Kovvur Goshpada (~17.015, 81.730)
  const dist = calculateDistanceKm(17.000, 81.777, 17.015, 81.730);
  assert.ok(dist > 4 && dist < 7, `Expected distance ~5km, got ${dist}`);

  // Same point
  assert.equal(calculateDistanceKm(17.0, 81.7, 17.0, 81.7), 0);
});

test('filterFacilities filters by search query and category', () => {
  const sampleFacilities: Facility[] = [
    {
      id: 'fac-1',
      name: { en: 'Kotilingala Bathing Ghat', te: 'కోటిలింగాల ఘాట్', hi: 'कोटिशिखर घाट' },
      category: 'bathing_ghat',
      description: { en: 'Main riverside bathing ghat', te: 'ప్రధాన నది తీర స్నాన ఘాట్', hi: 'मुख्य नदी स्नान घाट' },
      locality: 'Rajahmundry',
      address: 'Kotilingala Street',
      latitude: 17.005,
      longitude: 81.78,
      verificationStatus: 'DEMO',
      source: 'Demo Seed',
      isDemo: true,
      lastUpdated: '2026-11-01'
    },
    {
      id: 'fac-2',
      name: { en: 'District Headquarter Hospital Camp', te: 'జిల్లా ఆసుపత్రి శిబిరం', hi: 'जिला अस्पताल शिविर' },
      category: 'hospital',
      description: { en: '24/7 emergency medical triage and first aid', te: '24/7 అత్యవసర వైద్య శిబిరం', hi: '24/7 आपातकालीन चिकित्सा शिविर' },
      locality: 'Rajahmundry',
      address: 'Hospital Road',
      latitude: 17.01,
      longitude: 81.785,
      verificationStatus: 'DEMO',
      source: 'Demo Seed',
      isDemo: true,
      lastUpdated: '2026-11-01'
    }
  ];

  // Filter by category
  const hospitals = filterFacilities(sampleFacilities, '', 'hospital');
  assert.equal(hospitals.length, 1);
  assert.equal(hospitals[0].id, 'fac-2');

  // Filter by query in english
  const queryResult = filterFacilities(sampleFacilities, 'Kotilingala', 'ALL', 'ALL', 'en');
  assert.equal(queryResult.length, 1);
  assert.equal(queryResult[0].id, 'fac-1');

  // Filter by query in telugu
  const teResult = filterFacilities(sampleFacilities, 'ఆసుపత్రి', 'ALL', 'ALL', 'te');
  assert.equal(teResult.length, 1);
  assert.equal(teResult[0].id, 'fac-2');
});

test('validateVerificationStatus validates permitted statuses', () => {
  assert.equal(validateVerificationStatus('VERIFIED'), true);
  assert.equal(validateVerificationStatus('UNVERIFIED'), true);
  assert.equal(validateVerificationStatus('DEMO'), true);
  assert.equal(validateVerificationStatus('OFFICIAL'), false);
  assert.equal(validateVerificationStatus(null), false);
});

test('searchKnowledgeBase ranks matching FAQs by relevance', () => {
  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      category: 'Health',
      question: { en: 'Where can I find drinking water points?', te: 'మంచినీటి పాయింట్లు ఎక్కడ ఉన్నాయి?', hi: 'पीने का पानी कहाँ मिल सकता है?' },
      answer: { en: 'Drinking water is available at all major ghat entrances.', te: 'అన్ని ప్రధాన ఘాట్ల వద్ద మంచినీరు లభిస్తుంది.', hi: 'सभी मुख्य घाटों पर पीने का पानी उपलब्ध है।' },
      source: 'Demo FAQ',
      verificationStatus: 'DEMO',
      isDemo: true
    },
    {
      id: 'faq-2',
      category: 'Safety',
      question: { en: 'What should I do if a family member gets lost?', te: 'కుటుంబ సభ్యుడు తప్పిపోతే ఏమి చేయాలి?', hi: 'यदि परिवार का कोई सदस्य खो जाए तो क्या करें?' },
      answer: { en: 'Immediately contact the nearest Police Help Desk or call 112/1098.', te: 'వెంటనే సమీప పోలీస్ సహాయ కేంద్రాన్ని సంప్రదించండి.', hi: 'तुरंत निकटतम पुलिस सहायता केंद्र से संपर्क करें।' },
      source: 'Demo FAQ',
      verificationStatus: 'DEMO',
      isDemo: true
    }
  ];

  const results = searchKnowledgeBase(faqs, 'water drinking', 'en');
  assert.ok(results.length >= 1);
  assert.equal(results[0].id, 'faq-1');

  const lostResults = searchKnowledgeBase(faqs, 'lost family', 'en');
  assert.ok(lostResults.length >= 1);
  assert.equal(lostResults[0].id, 'faq-2');
});
