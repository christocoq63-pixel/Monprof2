import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Send, ArrowLeft, Loader2, BookOpen, RefreshCw, Mic, MicOff, BookText, X, MessageCircle, LogOut, Mail, Lock, User, UserCircle, Calendar, MapPin, Phone, Globe2, Check, Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ─── COUNTRY DIAL CODES ───────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'FR', dial: '+33',  name: 'France',        flag: '🇫🇷' },
  { code: 'BE', dial: '+32',  name: 'Belgique',      flag: '🇧🇪' },
  { code: 'CH', dial: '+41',  name: 'Suisse',        flag: '🇨🇭' },
  { code: 'CA', dial: '+1',   name: 'Canada',        flag: '🇨🇦' },
  { code: 'LU', dial: '+352', name: 'Luxembourg',    flag: '🇱🇺' },
  { code: 'MC', dial: '+377', name: 'Monaco',        flag: '🇲🇨' },
  { code: 'US', dial: '+1',   name: 'États-Unis',    flag: '🇺🇸' },
  { code: 'GB', dial: '+44',  name: 'Royaume-Uni',   flag: '🇬🇧' },
  { code: 'IE', dial: '+353', name: 'Irlande',       flag: '🇮🇪' },
  { code: 'ES', dial: '+34',  name: 'Espagne',       flag: '🇪🇸' },
  { code: 'PT', dial: '+351', name: 'Portugal',      flag: '🇵🇹' },
  { code: 'IT', dial: '+39',  name: 'Italie',        flag: '🇮🇹' },
  { code: 'DE', dial: '+49',  name: 'Allemagne',     flag: '🇩🇪' },
  { code: 'AT', dial: '+43',  name: 'Autriche',      flag: '🇦🇹' },
  { code: 'NL', dial: '+31',  name: 'Pays-Bas',      flag: '🇳🇱' },
  { code: 'DK', dial: '+45',  name: 'Danemark',      flag: '🇩🇰' },
  { code: 'SE', dial: '+46',  name: 'Suède',         flag: '🇸🇪' },
  { code: 'NO', dial: '+47',  name: 'Norvège',       flag: '🇳🇴' },
  { code: 'FI', dial: '+358', name: 'Finlande',      flag: '🇫🇮' },
  { code: 'PL', dial: '+48',  name: 'Pologne',       flag: '🇵🇱' },
  { code: 'CZ', dial: '+420', name: 'Tchéquie',      flag: '🇨🇿' },
  { code: 'GR', dial: '+30',  name: 'Grèce',         flag: '🇬🇷' },
  { code: 'TR', dial: '+90',  name: 'Turquie',       flag: '🇹🇷' },
  { code: 'RU', dial: '+7',   name: 'Russie',        flag: '🇷🇺' },
  { code: 'JP', dial: '+81',  name: 'Japon',         flag: '🇯🇵' },
  { code: 'CN', dial: '+86',  name: 'Chine',         flag: '🇨🇳' },
  { code: 'KR', dial: '+82',  name: 'Corée du Sud',  flag: '🇰🇷' },
  { code: 'IN', dial: '+91',  name: 'Inde',          flag: '🇮🇳' },
  { code: 'AU', dial: '+61',  name: 'Australie',     flag: '🇦🇺' },
  { code: 'NZ', dial: '+64',  name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'BR', dial: '+55',  name: 'Brésil',        flag: '🇧🇷' },
  { code: 'MX', dial: '+52',  name: 'Mexique',       flag: '🇲🇽' },
  { code: 'AR', dial: '+54',  name: 'Argentine',     flag: '🇦🇷' },
  { code: 'MA', dial: '+212', name: 'Maroc',         flag: '🇲🇦' },
  { code: 'DZ', dial: '+213', name: 'Algérie',       flag: '🇩🇿' },
  { code: 'TN', dial: '+216', name: 'Tunisie',       flag: '🇹🇳' },
  { code: 'SN', dial: '+221', name: 'Sénégal',       flag: '🇸🇳' },
  { code: 'CI', dial: '+225', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'CM', dial: '+237', name: 'Cameroun',      flag: '🇨🇲' },
  { code: 'MU', dial: '+230', name: 'Maurice',       flag: '🇲🇺' },
  { code: 'RE', dial: '+262', name: 'La Réunion',    flag: '🇷🇪' },
  { code: 'ZA', dial: '+27',  name: 'Afrique du Sud',flag: '🇿🇦' },
  { code: 'AE', dial: '+971', name: 'Émirats',       flag: '🇦🇪' },
  { code: 'SA', dial: '+966', name: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: 'IL', dial: '+972', name: 'Israël',        flag: '🇮🇱' },
];

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// Supports both the new PUBLISHABLE_KEY name (2025+) and the legacy ANON_KEY
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// ─── LANGUAGES & AVATARS ──────────────────────────────────────────────────────

const LANGUAGES = {
  en: {
    code: 'en', name: 'Anglais', nativeName: 'English', glyph: 'EN',
    ttsLocale: 'en-US', srLocale: 'en-US', srSupported: true,
    accent: '#B85B3F',
    avatars: [
      { id:'emma', gender:'female', name:'Emma', age:28, location:'Manchester, UK', role:'Amie de café',
        tagline:'Détendue, vie quotidienne, séries, week-end',
        persona:'casual, warm British English, uses colloquial expressions',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['samantha','kate','serena','female','martha','amelie'],
        greetings:[{t:"Hey! How's it going today?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Hi there! What've you been up to?", fr:"Coucou ! Qu'est-ce que tu as fait de beau ?"}]},
      { id:'marcus', gender:'male', name:'Marcus', age:35, location:'San Francisco, USA', role:'Ingénieur logiciel',
        tagline:'Tech, boulot, projets, idées',
        persona:'direct, professional American English, brings up technical topics naturally',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'grid',
        voiceHint:['daniel','alex','fred','tom','aaron','male'],
        greetings:[{t:"Hey, nice to meet you. What kind of work do you do?", fr:"Hé, ravi de te rencontrer. Tu fais quoi comme boulot ?"},
                   {t:"Hi! Working on anything fun lately?", fr:"Salut ! Tu bosses sur des trucs sympas ?"}]},
      { id:'hannah', gender:'female', name:'Hannah', age:32, location:'Dublin, Ireland', role:"Professeure d'anglais",
        tagline:'Patiente, claire, parle doucement',
        persona:'gentle, clear, slightly slower English, very reassuring',
        color:'#3F6B4E', soft:'#DCE8DF', pattern:'lines',
        voiceHint:['fiona','moira','karen','tessa','female'],
        greetings:[{t:"Hello! Take your time. What would you like to chat about?", fr:"Bonjour ! Prends ton temps. De quoi veux-tu parler ?"},
                   {t:"Hi! Tell me a bit about yourself.", fr:"Salut ! Parle-moi un peu de toi."}]},
      { id:'oliver', gender:'male', name:'Oliver', age:47, location:'Oxford, UK', role:'Universitaire',
        tagline:'Cultivé, humour pince-sans-rire, sujets de fond',
        persona:'formal, witty, intellectual British English, dry humor',
        color:'#7A4A2F', soft:'#EBD7C5', pattern:'dots',
        voiceHint:['daniel','oliver','arthur','gordon','male'],
        greetings:[{t:"Good day. What's been on your mind recently?", fr:"Bonjour. Qu'est-ce qui vous occupe l'esprit ces temps-ci ?"},
                   {t:"Hello there. Care for an interesting conversation?", fr:"Bonjour. Envie d'une discussion intéressante ?"}]},
      { id:'priya', gender:'female', name:'Priya', age:31, location:'Bangalore, India', role:'Développeuse logicielle',
        tagline:'Anglais indien, tech, voyages, cuisine',
        persona:'Indian English (educated Bangalore accent), warm and articulate. Occasionally uses Hinglish expressions like "yaar", "actually", or sentence-final "no?" naturally. Brings up tech and travel topics.',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['veena','rishi','raveena','lekha','heera','female'],
        greetings:[{t:"Hi! Nice to meet you. So tell me, what do you do?", fr:"Salut ! Ravi de te rencontrer. Dis-moi, tu fais quoi ?"},
                   {t:"Hello, how is your day going? Working on something interesting?", fr:"Bonjour, comment se passe ta journée ? Tu travailles sur quelque chose d'intéressant ?"}]},
      { id:'karim', gender:'male', name:'Karim', age:41, location:'Dubaï, EAU', role:'Ingénieur',
        tagline:'Anglais arabe, business, ingénierie',
        persona:'Gulf-Arab-accented professional English, warm and polite. Occasionally uses Arabic expressions like "Inshallah" or "Mashallah" naturally. Focus on engineering, business and culture.',
        color:'#1E3A5F', soft:'#D0DAE5', pattern:'grid',
        voiceHint:['majed','tarik','daniel','male'],
        greetings:[{t:"Hello, pleased to meet you. What field do you work in?", fr:"Bonjour, ravi de vous rencontrer. Vous travaillez dans quel domaine ?"},
                   {t:"Hi there. How is your day going so far?", fr:"Bonjour. Comment se passe votre journée jusqu'ici ?"}]},
    ],
  },
  es: {
    code: 'es', name: 'Espagnol', nativeName: 'Español', glyph: 'ES',
    ttsLocale: 'es-ES', srLocale: 'es-ES', srSupported: true,
    accent: '#C2410C',
    avatars: [
      { id:'lucia', gender:'female', name:'Lucía', age:27, location:'Madrid, España', role:'Amie de café',
        tagline:'Castillan moderne, sorties, ciné, food',
        persona:'casual Castilian Spanish from Madrid, friendly and energetic',
        color:'#C2410C', soft:'#FBE4D2', pattern:'circles',
        voiceHint:['monica','marisol','paulina','female'],
        greetings:[{t:"¡Hola! ¿Qué tal te va el día?", fr:"Salut ! Comment se passe ta journée ?"},
                   {t:"¿Qué tal? Cuéntame algo.", fr:"Ça va ? Raconte-moi quelque chose."}]},
      { id:'diego', gender:'male', name:'Diego', age:34, location:'Buenos Aires, Argentina', role:'Designer',
        tagline:'Espagnol argentin, créativité, voyages',
        persona:'Argentine Spanish (rioplatense), uses "vos" and "che", warm and chatty',
        color:'#6B4D9B', soft:'#E1D8EE', pattern:'lines',
        voiceHint:['jorge','diego','juan','carlos','male'],
        greetings:[{t:"¡Che, qué bueno conocerte! ¿De dónde sos?", fr:"Hé, content de te connaître ! D'où tu viens ?"},
                   {t:"Hola, ¿qué onda? ¿Cómo estás?", fr:"Salut, ça roule ? Comment ça va ?"}]},
      { id:'carmen', gender:'female', name:'Carmen', age:42, location:'Ciudad de México', role:"Professeure d'espagnol",
        tagline:'Espagnol mexicain, claire et patiente',
        persona:'Mexican Spanish, very patient teacher, speaks clearly and slowly',
        color:'#4A7C59', soft:'#DCE8DF', pattern:'dots',
        voiceHint:['paulina','esperanza','female'],
        greetings:[{t:"Hola, mucho gusto. ¿Cómo te llamas?", fr:"Bonjour, enchantée. Comment tu t'appelles ?"},
                   {t:"Bienvenido. ¿De qué te gustaría hablar?", fr:"Bienvenue. De quoi aimerais-tu parler ?"}]},
    ],
  },
  de: {
    code: 'de', name: 'Allemand', nativeName: 'Deutsch', glyph: 'DE',
    ttsLocale: 'de-DE', srLocale: 'de-DE', srSupported: true,
    accent: '#374151',
    avatars: [
      { id:'lena', gender:'female', name:'Lena', age:26, location:'Berlin, Deutschland', role:'Amie créative',
        tagline:'Berlinois moderne, culture, sorties',
        persona:'casual Berliner German, hip and modern',
        color:'#5B6CB8', soft:'#DDE2F0', pattern:'lines',
        voiceHint:['anna','helena','steffi','female'],
        greetings:[{t:"Hi! Wie läuft's bei dir?", fr:"Salut ! Comment ça se passe pour toi ?"},
                   {t:"Hallo! Was machst du so?", fr:"Salut ! Tu fais quoi de beau ?"}]},
      { id:'klaus', gender:'male', name:'Klaus', age:48, location:'München, Deutschland', role:'Ingénieur',
        tagline:'Précis, technique, sujets de fond',
        persona:'precise, structured German, professional',
        color:'#374151', soft:'#D6DAE0', pattern:'grid',
        voiceHint:['markus','stefan','yannick','male'],
        greetings:[{t:"Guten Tag. Womit beschäftigen Sie sich beruflich?", fr:"Bonjour. Que faites-vous comme métier ?"},
                   {t:"Hallo. Worüber möchten Sie sprechen?", fr:"Bonjour. De quoi souhaitez-vous parler ?"}]},
      { id:'anja', gender:'female', name:'Anja', age:38, location:'Wien, Österreich', role:"Professeure d'allemand",
        tagline:'Autrichienne, douce, parle clairement',
        persona:'Austrian German (softer accent), patient and clear',
        color:'#6B7A3F', soft:'#E2E6D3', pattern:'dots',
        voiceHint:['petra','greta','female'],
        greetings:[{t:"Grüß Sie! Wie geht es Ihnen?", fr:"Bonjour ! Comment allez-vous ?"},
                   {t:"Hallo. Lassen Sie uns ein bisschen plaudern.", fr:"Bonjour. Bavardons un peu."}]},
    ],
  },
  it: {
    code: 'it', name: 'Italien', nativeName: 'Italiano', glyph: 'IT',
    ttsLocale: 'it-IT', srLocale: 'it-IT', srSupported: true,
    accent: '#9A3412',
    avatars: [
      { id:'giulia', gender:'female', name:'Giulia', age:30, location:'Roma, Italia', role:'Amie de café',
        tagline:'Romaine, expressive, food et dolce vita',
        persona:'expressive Roman Italian, warm and lively',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['alice','silvia','federica','female'],
        greetings:[{t:"Ciao! Come va oggi?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Ehi, ciao! Raccontami qualcosa di te.", fr:"Hé, salut ! Raconte-moi quelque chose sur toi."}]},
      { id:'marco', gender:'male', name:'Marco', age:42, location:'Milano, Italia', role:'Designer',
        tagline:'Italien du Nord, raffiné, design',
        persona:'refined Northern Italian (Milanese), elegant and professional',
        color:'#1E3A5F', soft:'#D0DAE5', pattern:'grid',
        voiceHint:['luca','paolo','marco','male'],
        greetings:[{t:"Buongiorno. Di cosa ti occupi?", fr:"Bonjour. De quoi t'occupes-tu ?"},
                   {t:"Ciao, piacere. Cosa ti porta qui?", fr:"Salut, enchanté. Qu'est-ce qui t'amène ?"}]},
      { id:'sofia', gender:'female', name:'Sofia', age:55, location:'Firenze, Italia', role:"Professeure d'italien",
        tagline:'Toscane, claire, patiente, classique',
        persona:'classic Tuscan Italian, very clear and patient teacher',
        color:'#7A4A2F', soft:'#EBD7C5', pattern:'dots',
        voiceHint:['alice','federica','silvia','female'],
        greetings:[{t:"Salve! Da dove viene?", fr:"Bonjour ! D'où venez-vous ?"},
                   {t:"Ciao. Come ti chiami?", fr:"Salut. Comment tu t'appelles ?"}]},
    ],
  },
  pt: {
    code: 'pt', name: 'Portugais', nativeName: 'Português', glyph: 'PT',
    ttsLocale: 'pt-BR', srLocale: 'pt-BR', srSupported: true,
    accent: '#15803D',
    avatars: [
      { id:'rafael', gender:'male', name:'Rafael', age:32, location:'Rio de Janeiro, Brasil', role:'Ami carioca',
        tagline:'Portugais brésilien, plage, musique, foot',
        persona:'casual Brazilian Portuguese (carioca), relaxed and warm',
        color:'#15803D', soft:'#D5E8D9', pattern:'circles',
        voiceHint:['felipe','luciana','male'],
        greetings:[{t:"E aí, beleza? Tudo bem com você?", fr:"Salut, ça va ? Tout va bien ?"},
                   {t:"Oi! O que você anda fazendo?", fr:"Salut ! Qu'est-ce que tu fais en ce moment ?"}]},
      { id:'beatriz', gender:'female', name:'Beatriz', age:34, location:'Lisboa, Portugal', role:'Amie lisboète',
        tagline:'Portugais européen, calme, culture',
        persona:'European Portuguese (Lisbon), elegant and clear pronunciation',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'lines',
        voiceHint:['joana','catarina','female'],
        greetings:[{t:"Olá, tudo bem? Como tem passado?", fr:"Bonjour, ça va ? Comment vous portez-vous ?"},
                   {t:"Boa tarde. De onde é?", fr:"Bonjour. D'où venez-vous ?"}]},
      { id:'joao', gender:'male', name:'João', age:45, location:'São Paulo, Brasil', role:"Professeur de portugais",
        tagline:'Patient, clair, brésilien standard',
        persona:'standard Brazilian Portuguese, patient teacher',
        color:'#6B4D9B', soft:'#E1D8EE', pattern:'dots',
        voiceHint:['felipe','daniel','ricardo','male'],
        greetings:[{t:"Olá! Como você se chama?", fr:"Salut ! Comment tu t'appelles ?"},
                   {t:"Oi, prazer. Sobre o que quer conversar?", fr:"Bonjour, enchanté. De quoi veux-tu parler ?"}]},
    ],
  },
  ja: {
    code: 'ja', name: 'Japonais', nativeName: '日本語', glyph: 'JA',
    ttsLocale: 'ja-JP', srLocale: 'ja-JP', srSupported: true,
    accent: '#9D174D',
    avatars: [
      { id:'yuki', gender:'female', name:'Yuki', age:26, location:'東京 (Tokyo)', role:'Amie tokyoïte',
        tagline:'Décontractée, pop culture, café',
        persona:'casual modern Tokyo Japanese, friendly and conversational',
        color:'#9D174D', soft:'#F0D5DE', pattern:'circles',
        voiceHint:['kyoko','haruka','female'],
        greetings:[{t:"こんにちは！元気ですか？", fr:"Bonjour ! Comment vas-tu ?"},
                   {t:"やあ、最近どうしてた？", fr:"Hé, qu'est-ce que tu deviens ?"}]},
      { id:'takeshi', gender:'male', name:'Takeshi', age:54, location:'京都 (Kyoto)', role:'Professeur',
        tagline:'Japonais soutenu, patient',
        persona:'polite, classical Kyoto Japanese, very patient with learners',
        color:'#3F2A1F', soft:'#E5DBD0', pattern:'dots',
        voiceHint:['otoya','hattori','male'],
        greetings:[{t:"こんにちは。お名前は何ですか？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"はじめまして。何について話したいですか？", fr:"Enchanté. De quoi voulez-vous parler ?"}]},
      { id:'aiko', gender:'female', name:'Aiko', age:33, location:'大阪 (Osaka)', role:"Professeure de japonais",
        tagline:'Kansai, chaleureuse, claire',
        persona:'Kansai (Osaka) Japanese, warm and friendly teacher',
        color:'#5B6CB8', soft:'#DDE2F0', pattern:'lines',
        voiceHint:['kyoko','sayaka','female'],
        greetings:[{t:"こんにちは！日本語を勉強していますか？", fr:"Bonjour ! Tu étudies le japonais ?"},
                   {t:"はじめまして！ゆっくり話しましょうね。", fr:"Enchantée ! Parlons doucement, d'accord ?"}]},
    ],
  },
  zh: {
    code: 'zh', name: 'Mandarin', nativeName: '中文', glyph: '中',
    ttsLocale: 'zh-CN', srLocale: 'zh-CN', srSupported: true,
    accent: '#B91C1C',
    avatars: [
      { id:'mei', gender:'female', name:'Mei', age:28, location:'上海 (Shanghai)', role:'Amie',
        tagline:'Mandarin moderne, vie urbaine',
        persona:'modern Mandarin from Shanghai, casual and friendly',
        color:'#B91C1C', soft:'#F4D5D5', pattern:'circles',
        voiceHint:['tingting','meijia','female'],
        greetings:[{t:"你好！今天怎么样？", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"嗨，最近忙吗？", fr:"Coucou, occupé ces temps-ci ?"}]},
      { id:'wei', gender:'male', name:'Wei', age:45, location:'北京 (Beijing)', role:'Professeur de mandarin',
        tagline:'Mandarin standard, patient, clair',
        persona:'standard Beijing Mandarin, patient teacher with clear pronunciation',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['tian-tian','male'],
        greetings:[{t:"你好。你叫什么名字？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"欢迎！你想聊什么？", fr:"Bienvenue ! De quoi voulez-vous parler ?"}]},
      { id:'lin', gender:'female', name:'Lin', age:31, location:'台北 (Taipei)', role:'Designer',
        tagline:'Mandarin taïwanais, créative',
        persona:'Taiwanese Mandarin, soft-spoken and creative',
        color:'#4D7C0F', soft:'#DEEAC8', pattern:'lines',
        voiceHint:['sin-ji','meijia','female'],
        greetings:[{t:"嗨，你好！你住在哪裡？", fr:"Salut ! Tu habites où ?"},
                   {t:"哈囉，最近做什麼？", fr:"Coucou, qu'est-ce que tu fais en ce moment ?"}]},
    ],
  },
  ar: {
    code: 'ar', name: 'Arabe', nativeName: 'العربية', glyph: 'AR',
    ttsLocale: 'ar-SA', srLocale: 'ar-SA', srSupported: true, rtl: true,
    accent: '#1E40AF',
    avatars: [
      { id:'layla', gender:'female', name:'Layla', age:32, location:'Beyrouth, Liban', role:'Journaliste',
        tagline:'Arabe levantin, culture, actualité',
        persona:'Levantine Arabic (Lebanese), educated and culturally engaged',
        color:'#1E40AF', soft:'#D6DEF2', pattern:'circles',
        voiceHint:['laila','majed','female'],
        greetings:[{t:"مرحبا! كيف حالك اليوم؟", fr:"Bonjour ! Comment vas-tu aujourd'hui ?"},
                   {t:"أهلا. عن أي موضوع تحب أن نتكلم؟", fr:"Salut. De quel sujet aimerais-tu qu'on parle ?"}]},
      { id:'omar', gender:'male', name:'Omar', age:44, location:'القاهرة (Le Caire)', role:'Professeur',
        tagline:'Arabe standard moderne, patient',
        persona:'Modern Standard Arabic (MSA), patient Egyptian teacher',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['majed','tarik','male'],
        greetings:[{t:"السلام عليكم. ما اسمك؟", fr:"Salam aleykoum. Comment t'appelles-tu ?"},
                   {t:"مرحبا. هل تتعلم العربية؟", fr:"Bonjour. Apprends-tu l'arabe ?"}]},
    ],
  },
  mfe: {
    code: 'mfe', name: 'Créole mauricien', nativeName: 'Kreol Morisien', glyph: 'MU',
    ttsLocale: 'fr-FR', srLocale: 'fr-FR', srSupported: false,
    accent: '#0F766E',
    avatars: [
      { id:'anais', gender:'female', name:'Anaïs', age:30, location:'Port-Louis, Maurice', role:'Amie',
        tagline:'Décontractée, plage, lagon, séga',
        persona:`casual Mauritian Creole, warm and lively.
- Use authentic Mauritian expressions constantly: "Ki manyer", "Bonzour", "Korek", "Zenfan", "Mo bro", "Mo ser", "Ala", "Samem sa", "Ayo", "Mo bon", "Bonpe", "Ti-mama", "Ki nouvel", "Kot to ete", "Pa gagn traka", "Kontan trouv twa".
- Use "mo/to" (I/you), "pe" for progressive tense, "ti" for past tense.
- Talk about lagoon, beach, gato-pima, dholl-puri, séga music, weekends in Blue Bay or Trou aux Biches, family Sundays.
- Mix in a French or English word sometimes as Mauritians naturally do.
- Never use standard French — always Creole spelling (e.g. "azordi" not "aujourd'hui", "koz" not "parler", "bien" stays "bien", "kot" not "où").`,
        color:'#0F766E', soft:'#CDE8E5', pattern:'circles',
        // Google FR is warmer than Windows Hortense; French Canadian is more melodious.
        voiceHint:['google français','google french','amélie','audrey','virginie','marie','female'],
        rate: 0.82, pitch: 1.05,
        greetings:[{t:"Bonzour mo ser ! Ki manyer azordi, korek ?", fr:"Bonjour ma sœur ! Comment ça va aujourd'hui, tout va bien ?"},
                   {t:"Eh salu ! Ki to pe fer ? Mo kontan trouv twa.", fr:"Hé salut ! Qu'est-ce que tu fais ? Je suis contente de te voir."}]},
      { id:'ravi', gender:'male', name:'Ravi', age:42, location:'Curepipe, Maurice', role:'Ingénieur',
        tagline:'Pragmatique, parle boulot, projets',
        persona:`professional Mauritian Creole.
- Mixes Creole with French and English words as is natural for Mauritian professionals (e.g. "mo pe travay lor enn projet interesan").
- Use "mo bro", "ki manyer", "korek sa", "azordi", "demen".
- Discusses work, engineering, tech, cyclones, elections, family. Direct but warm.
- Never respond in standard French — always Creole.`,
        color:'#7C2D12', soft:'#EFD8C9', pattern:'grid',
        voiceHint:['google français','google french','thomas','nicolas','daniel','male'],
        rate: 0.85, pitch: 0.95,
        greetings:[{t:"Bonzour mo bro. Ki manyer ? To travay dan ki domenn ?", fr:"Bonjour mon ami. Comment ça va ? Tu travailles dans quel domaine ?"},
                   {t:"Salam, ki nouvel ? Ki to pe fer sa lasemenn la ?", fr:"Salut, quelles nouvelles ? Qu'est-ce que tu fais cette semaine ?"}]},
      { id:'marie', gender:'female', name:'Marie', age:48, location:'Beau Bassin, Maurice', role:'Professeure',
        tagline:'Patiente, explique tout, créole standard',
        persona:`standard Mauritian Creole teacher, patient and clear.
- Speaks slowly and repeats important words.
- Uses classic teacher expressions: "mo zanfan", "gete bien", "konpran ?", "pran twa letan", "byen tranquil", "pa gagn traka".
- Explains vocabulary when the learner seems lost. Never switches to French.
- Warm, motherly tone. Uses "to" (informal you) affectionately.`,
        color:'#5B21B6', soft:'#DDD3F0', pattern:'dots',
        voiceHint:['google français','google french','audrey','marie','virginie','female'],
        rate: 0.78, pitch: 1.0,
        greetings:[{t:"Bonzour mo zanfan. Kouma to apele, di mwa ?", fr:"Bonjour mon enfant. Comment tu t'appelles, dis-moi ?"},
                   {t:"Bonzour ! Pran twa letan. Ki to anvi koz lor li azordi ?", fr:"Bonjour ! Prends ton temps. De quoi as-tu envie de parler aujourd'hui ?"}]},
    ],
  },
  fr: {
    code: 'fr', name: 'Français', nativeName: 'Français', glyph: 'FR',
    ttsLocale: 'fr-FR', srLocale: 'fr-FR', srSupported: true,
    accent: '#2E5C8A',
    avatars: [
      { id:'lea', gender:'female', name:'Léa', age:28, location:'Paris, France', role:'Amie de café',
        tagline:'Parisienne, détendue, tendance',
        persona:`casual modern Parisian French, warm and lively.
- Use natural Parisian expressions: "du coup", "en fait", "carrément", "grave", "c'est ouf", "trop bien", "je te jure".
- Talk about cafés, weekends, séries, sorties, culture, food, actualité.
- Uses "tu" naturally, contractions ("j'sais pas", "chuis"), fluid speech.
- Warm, friendly, uses subtle humor.`,
        color:'#2E5C8A', soft:'#D5E2EF', pattern:'circles',
        voiceHint:['google français','google french','amélie','audrey','virginie','marie','female'],
        rate: 0.92, pitch: 1.0,
        greetings:[{t:"Salut ! Ça va aujourd'hui ?", fr:"Hi! How are you today?"},
                   {t:"Coucou ! Alors, quoi de neuf ?", fr:"Hey! So, what's new?"}]},
      { id:'antoine', gender:'male', name:'Antoine', age:42, location:'Lyon, France', role:'Ingénieur',
        tagline:'Pragmatique, boulot, projets tech',
        persona:`professional French from Lyon, precise and technical.
- Uses proper business French but stays warm.
- Discusses engineering, tech, work, family, culture.
- Balanced formal/informal, uses "vous" at first then may switch to "tu".`,
        color:'#7C2D12', soft:'#EFD8C9', pattern:'grid',
        voiceHint:['google français','google french','thomas','nicolas','daniel','male'],
        rate: 0.9, pitch: 0.95,
        greetings:[{t:"Bonjour ! Enchanté. Vous travaillez dans quel domaine ?", fr:"Hello! Nice to meet you. What field do you work in?"},
                   {t:"Bonjour, comment allez-vous aujourd'hui ?", fr:"Hello, how are you today?"}]},
      { id:'fatou', gender:'female', name:'Fatou', age:35, location:'Dakar, Sénégal', role:'Journaliste',
        tagline:'Français africain, culture, actualité',
        persona:`Senegalese French journalist, warm and articulate.
- Uses standard French with occasional West-African expressions ("dis donc", "ah bon !", "c'est parti").
- Discusses culture, actualité, voyages, cuisine.
- Very expressive and encouraging.`,
        color:'#0F766E', soft:'#CDE8E5', pattern:'lines',
        voiceHint:['google français','google french','audrey','amélie','female'],
        rate: 0.9, pitch: 1.02,
        greetings:[{t:"Bonjour ! Ravie de te rencontrer. D'où viens-tu ?", fr:"Hello! Nice to meet you. Where are you from?"},
                   {t:"Salut ! Comment tu vas ? Raconte-moi un peu.", fr:"Hi! How are you? Tell me a bit about yourself."}]},
      { id:'marie_fr', gender:'female', name:'Marie', age:48, location:'Aix-en-Provence, France', role:"Professeure de français",
        tagline:'Patiente, claire, français standard',
        persona:`standard French teacher from Provence, very patient.
- Speaks slowly and clearly, repeats important words.
- Uses simple vocabulary at first, gradually introduces more complex terms.
- Explains grammar naturally when useful. Very warm and encouraging.`,
        color:'#5B21B6', soft:'#DDD3F0', pattern:'dots',
        voiceHint:['google français','google french','marie','audrey','virginie','female'],
        rate: 0.82, pitch: 1.0,
        greetings:[{t:"Bonjour ! Prenez votre temps. Comment vous appelez-vous ?", fr:"Hello! Take your time. What's your name?"},
                   {t:"Bienvenue ! De quoi aimeriez-vous parler aujourd'hui ?", fr:"Welcome! What would you like to talk about today?"}]},
    ],
  },
  mfe: {
    code: 'mfe', name: 'Créole mauricien', nativeName: 'Kreol morisien', glyph: 'MU',
    // Aucune voix TTS/reconnaissance vocale dédiée dans les navigateurs pour le
    // kreol morisien — on tombe sur les voix françaises, qui prononcent
    // correctement le vocabulaire (base fortement lexifiée sur le français).
    ttsLocale: 'fr-FR', srLocale: 'fr-FR', srSupported: true,
    accent: '#0891B2',
    avatars: [
      { id:'marie_lise', gender:'female', name:'Marie-Lise', age:34, location:'Port-Louis, Maurice', role:'Amie de café',
        tagline:'Kreol du quotidien, food, plages, séga',
        persona:`Mauritian Creole speaker from Port-Louis, warm and cheerful.
- Speaks natural everyday kreol morisien with typical Mauritian expressions ("enn ti kozri", "korek?", "ki manier ?", "laba", "mo p").
- Uses the Mauritian orthography (mo, to, li, nou, zot; ena, pa ena; li p vini).
- Common topics: everyday life, sega music, seafood, beach outings, family.
- Gently explains a word in French only if the learner is clearly lost.`,
        color:'#0891B2', soft:'#CFEDF3', pattern:'circles',
        voiceHint:['google français','google french','audrey','amélie','marie','virginie','female'],
        rate: 0.9, pitch: 1.02,
        greetings:[{t:"Ki manier ? Kouma to appelé ?", fr:"Comment ça va ? Comment tu t'appelles ?"},
                   {t:"Salam ! Enn ti kozri ?", fr:"Salut ! On papote un peu ?"}]},
      { id:'devraj', gender:'male', name:'Devraj', age:41, location:'Curepipe, Maurice', role:"Prof de kreol",
        tagline:'Patient, explique la grammaire mauricienne',
        persona:`Mauritian Creole teacher of Indo-Mauritian heritage from Curepipe, patient and clear.
- Uses standard kreol morisien (Ledikasyon pu Travayer orthography).
- Explains grammar rules gently: verb markers "ti / pe / va / pou", possessives "mo/to/so", plural marker "bann".
- Occasionally sprinkles in a Bhojpuri or Hindi word explained in context.
- Speaks slowly, repeats key words, always encouraging.`,
        color:'#7C3AED', soft:'#E4D8F8', pattern:'dots',
        voiceHint:['google français','google french','thomas','daniel','male'],
        rate: 0.85, pitch: 0.98,
        greetings:[{t:"Bonzour ! Pran to letan. Ki to anvi kozé zordi ?", fr:"Bonjour ! Prends ton temps. De quoi veux-tu parler aujourd'hui ?"},
                   {t:"Alo ! Kouma to sanmem ? Nou al gagn enn ti diskisyon.", fr:"Salut ! Comment vas-tu ? On va bavarder un peu."}]},
      { id:'jean_marc', gender:'male', name:'Jean-Marc', age:52, location:'Mahébourg, Maurice', role:'Pêcheur, guide local',
        tagline:'Kreol côtier, pêche, histoires du sud',
        persona:`Mauritian Creole fisherman-guide from Mahébourg (south coast), colourful and witty.
- Uses coastal kreol with expressions from fishing life and local folklore.
- Loves telling stories about the lagoon, séga music, old Mauritius, family recipes.
- Frequently uses "abé", "koumsa", "sa mem", "eh kamarad".
- Speaks with humour and warmth; gently corrects only when asked.`,
        color:'#B85B3F', soft:'#F6E2D4', pattern:'lines',
        voiceHint:['google français','google french','thomas','fred','male'],
        rate: 0.88, pitch: 1.0,
        greetings:[{t:"Éh kamarad ! Kouma to yé zordi ?", fr:"Eh l'ami ! Comment tu vas aujourd'hui ?"},
                   {t:"Bonzour matlo, kouma sa alé ? Ki to p fer ?", fr:"Bonjour mon pote, comment ça va ? Qu'est-ce que tu fais ?"}]},
    ],
  },
};

// Face features per avatar — gives each character a distinct look
// Chaque avatar a un look bien identifiable : hair, hairColor, skin — dérivé
// de sa nationalité + profil, et différentes silhouettes/palettes pour éviter
// que les personnages se ressemblent.
const FACES = {
  // ─── Anglais ─────────────────────────────
  emma:    { eyes:'lashes', mouth:'wide-smile', accessory:null,            blush:true,
             hair:'wave',    hairColor:'ginger',   skin:'light' },
  marcus:  { eyes:'round',  mouth:'neutral',    accessory:'glasses-square',
             hair:'quiff',   hairColor:'darkbrown',skin:'light' },
  hannah:  { eyes:'round',  mouth:'wide-smile', accessory:null,            freckles:true,
             hair:'long',    hairColor:'ginger',   skin:'light' },
  oliver:  { eyes:'round',  mouth:'smirk',      accessory:'glasses-round', moustache:true,
             hair:'wave-m',  hairColor:'grey',     skin:'light' },
  priya:   { eyes:'lashes', mouth:'smile',      accessory:'bindi',
             hair:'long',    hairColor:'black',    skin:'medium' },
  karim:   { eyes:'round',  mouth:'neutral',    accessory:'beard',
             hair:'short',   hairColor:'black',    skin:'tan' },
  // ─── Espagnol ────────────────────────────
  lucia:   { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick',
             hair:'wave',    hairColor:'darkbrown',skin:'peach' },
  diego:   { eyes:'round',  mouth:'smile',      accessory:'beard',
             hair:'curly-m', hairColor:'chestnut', skin:'peach' },
  carmen:  { eyes:'round',  mouth:'wide-smile', accessory:null,
             hair:'bob',     hairColor:'black',    skin:'medium' },
  // ─── Allemand ────────────────────────────
  lena:    { eyes:'round',  mouth:'smile',      accessory:null,
             hair:'ponytail',hairColor:'blonde',   skin:'light' },
  klaus:   { eyes:'round',  mouth:'neutral',    accessory:'glasses-square',
             hair:'crew',    hairColor:'blonde',   skin:'light' },
  anja:    { eyes:'round',  mouth:'wide-smile', accessory:null,
             hair:'bob',     hairColor:'platinum', skin:'light' },
  // ─── Italien ─────────────────────────────
  giulia:  { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick',
             hair:'curly',   hairColor:'chestnut', skin:'peach' },
  marco:   { eyes:'round',  mouth:'smirk',      accessory:null,
             hair:'wave-m',  hairColor:'darkbrown',skin:'peach' },
  sofia:   { eyes:'round',  mouth:'wide-smile', accessory:null,
             hair:'long',    hairColor:'chestnut', skin:'peach' },
  // ─── Portugais ───────────────────────────
  rafael:  { eyes:'round',  mouth:'wide-smile', accessory:'beard',
             hair:'short',   hairColor:'darkbrown',skin:'medium' },
  beatriz: { eyes:'lashes', mouth:'smile',      accessory:null,
             hair:'ponytail',hairColor:'brown',    skin:'peach' },
  joao:    { eyes:'round',  mouth:'smile',      accessory:'glasses-round',
             hair:'short',   hairColor:'brown',    skin:'medium' },
  // ─── Japonais ────────────────────────────
  yuki:    { eyes:'oval',   mouth:'smile',      accessory:null,            blush:true,
             hair:'bob',     hairColor:'black',    skin:'light' },
  takeshi: { eyes:'oval',   mouth:'neutral',    accessory:null,
             hair:'crew',    hairColor:'black',    skin:'light' },
  aiko:    { eyes:'oval',   mouth:'wide-smile', accessory:null,
             hair:'buns',    hairColor:'black',    skin:'light' },
  // ─── Mandarin ────────────────────────────
  mei:     { eyes:'oval',   mouth:'smile',      accessory:null,
             hair:'long',    hairColor:'black',    skin:'light' },
  wei:     { eyes:'oval',   mouth:'neutral',    accessory:'glasses-square',
             hair:'short',   hairColor:'black',    skin:'light' },
  lin:     { eyes:'oval',   mouth:'smile',      accessory:null,
             hair:'ponytail',hairColor:'black',    skin:'light' },
  // ─── Arabe ───────────────────────────────
  layla:   { eyes:'lashes', mouth:'smile',      accessory:null,
             hair:'hijab',   hairColor:'red',      skin:'peach' },
  omar:    { eyes:'round',  mouth:'neutral',    accessory:'beard',
             hair:'short',   hairColor:'black',    skin:'tan' },
  // ─── Mauricien ───────────────────────────
  anais:   { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick',
             hair:'long',    hairColor:'black',    skin:'tan' },
  ravi:    { eyes:'round',  mouth:'smile',      accessory:null,
             hair:'short',   hairColor:'black',    skin:'tan' },
  marie:   { eyes:'round',  mouth:'wide-smile', accessory:null,
             hair:'curly',   hairColor:'black',    skin:'brown' },
  // ─── Français ────────────────────────────
  lea:     { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick',
             hair:'wave',    hairColor:'blonde',   skin:'light' },
  antoine: { eyes:'round',  mouth:'smile',      accessory:'glasses-square',
             hair:'short',   hairColor:'darkbrown',skin:'light' },
  fatou:   { eyes:'lashes', mouth:'wide-smile', accessory:'headband-tails',
             hair:'headband-tails', hairColor:'black', skin:'deep' },
  marie_fr:{ eyes:'round',  mouth:'wide-smile', accessory:null,
             hair:'bob',     hairColor:'brown',    skin:'light' },
  // ─── Créole mauricien ────────────────────
  marie_lise: { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick',   blush:true,
                hair:'long',    hairColor:'black',    skin:'tan' },
  devraj:     { eyes:'round',  mouth:'smile',      accessory:'glasses-round',
                hair:'short',   hairColor:'black',    skin:'tan' },
  jean_marc:  { eyes:'round',  mouth:'smirk',      accessory:null,          moustache:true,
                hair:'short',   hairColor:'grey',     skin:'tan' },
};

const LEVELS = {
  beginner: {
    id:'beginner', label:'Débutant', sublabel:'A1 – A2',
    description:'Mots simples, phrases courtes, on parle doucement et on répète',
    icon:'•',
    prompt:'beginner level (A1-A2). Use only very simple vocabulary and short sentences (5-10 words). Use mostly present tense. Repeat important words. Speak slowly. Be extremely patient and encouraging.',
  },
  intermediate: {
    id:'intermediate', label:'Intermédiaire', sublabel:'B1 – B2',
    description:'Conversation fluide, sujets variés, expressions courantes',
    icon:'••',
    prompt:'intermediate level (B1-B2). Use natural vocabulary and varied tenses. Use idiomatic expressions when they fit.',
  },
  advanced: {
    id:'advanced', label:'Avancé', sublabel:'C1 – C2',
    description:'Style natif, vocabulaire riche, nuances et humour',
    icon:'•••',
    prompt:'advanced level (C1-C2). Speak as you would with a native speaker. Use sophisticated vocabulary, complex sentences, cultural references, humor and nuances.',
  },
};

// ─── PATTERNS ─────────────────────────────────────────────────────────────────

const PATTERN_BG = (pattern) => {
  switch (pattern) {
    case 'circles':
      return { backgroundImage:'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0%, transparent 35%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.12) 0%, transparent 30%)' };
    case 'grid':
      return { backgroundImage:'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 14px)' };
    case 'lines':
      return { backgroundImage:'repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 11px)' };
    case 'dots':
      return { backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.35) 1.4px, transparent 1.6px)', backgroundSize:'10px 10px' };
    default: return {};
  }
};

// ─── PERSISTENCE (localStorage-based) ────────────────────────────────────────

const storageKey = (lang, level, avatar) => `chat:${lang.code}:${level.id}:${avatar.id}`;
const statsKey   = (lang, level, avatar) => `stats:${lang.code}:${level.id}:${avatar.id}`;
const META_KEY   = 'meta:lastSession';
const LANG_MAP_KEY = 'meta:lastChoicePerLang'; // { [userId]: { [langCode]: { levelId, avatarId, updatedAt } } }

// ─── LANGUES D'ORIGINE (UI + langue de traduction pour les prompts IA) ──────
// 5 langues natives supportées à ce jour. Pour en ajouter une, il faut :
//  1. l'ajouter ici,
//  2. compléter le dictionnaire TRANSLATIONS,
//  3. mettre à jour la contrainte CHECK dans la migration SQL.
const NATIVE_LANGUAGES = {
  fr: { code: 'fr', label: 'Français',   flag: '🇫🇷', enName: 'French' },
  en: { code: 'en', label: 'English',    flag: '🇬🇧', enName: 'English' },
  es: { code: 'es', label: 'Español',    flag: '🇪🇸', enName: 'Spanish' },
  pt: { code: 'pt', label: 'Português',  flag: '🇧🇷', enName: 'Portuguese' },
  de: { code: 'de', label: 'Deutsch',    flag: '🇩🇪', enName: 'German' },
};

// Variable globale mise à jour dès que le profil se charge — permet aux
// fonctions hors-composant (buildeurs de prompts IA) de connaître la langue
// d'origine sans devoir threader le profil partout.
let __USER_NATIVE_LANG = 'fr';
function setUserNativeLang(code) {
  __USER_NATIVE_LANG = (code && NATIVE_LANGUAGES[code]) ? code : 'fr';
}
function getUserNativeLangCode() { return __USER_NATIVE_LANG; }
function getUserNativeLangName() { return NATIVE_LANGUAGES[__USER_NATIVE_LANG]?.enName || 'French'; }
function getUserNativeLangLabel() { return NATIVE_LANGUAGES[__USER_NATIVE_LANG]?.label || 'Français'; }

const storage = {
  get(k)   { try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v) { try { localStorage.setItem(k, v); } catch {} },
  del(k)   { try { localStorage.removeItem(k); } catch {} },
  keys()   { try { return Object.keys(localStorage); } catch { return []; } },
};

// ─── Dernier choix par langue ─────────────────────────────────────────────────
// Retient (niveau + prof) pour CHAQUE langue déjà utilisée, par utilisateur.
// Ainsi, quand on retourne sur une langue déjà utilisée, on retrouve son prof.
function _readLangMap() {
  try { return JSON.parse(storage.get(LANG_MAP_KEY) || '{}'); } catch { return {}; }
}
function saveLangChoice(userId, langCode, levelId, avatarId) {
  if (!langCode || !levelId || !avatarId) return;
  const key = userId || 'anon';
  const map = _readLangMap();
  if (!map[key]) map[key] = {};
  map[key][langCode] = { levelId, avatarId, updatedAt: Date.now() };
  try { storage.set(LANG_MAP_KEY, JSON.stringify(map)); } catch {}
}
function loadLangChoice(userId, langCode) {
  const key = userId || 'anon';
  const map = _readLangMap();
  return map[key]?.[langCode] || null;
}
function loadAllLangChoices(userId) {
  const key = userId || 'anon';
  return _readLangMap()[key] || {};
}

async function loadConversation(lang, level, avatar) {
  const raw = storage.get(storageKey(lang, level, avatar));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function saveConversation(lang, level, avatar, messages, userId = null) {
  storage.set(storageKey(lang, level, avatar), JSON.stringify(messages));
  storage.set(META_KEY, JSON.stringify({
    userId: userId || null,
    langCode: lang.code, levelId: level.id, avatarId: avatar.id, lastUpdated: Date.now(),
  }));
  // Retient le prof + niveau pour CETTE langue (permet de revenir dessus plus tard)
  saveLangChoice(userId, lang.code, level.id, avatar.id);
  let stats = { firstVisit: Date.now(), days: [] };
  const rawStats = storage.get(statsKey(lang, level, avatar));
  if (rawStats) { try { stats = JSON.parse(rawStats); } catch {} }
  stats.lastVisit = Date.now();
  stats.messageCount = messages.length;
  const today = new Date().toISOString().slice(0, 10);
  if (!stats.days.includes(today)) stats.days.push(today);
  storage.set(statsKey(lang, level, avatar), JSON.stringify(stats));
}

async function clearConversation(lang, level, avatar) {
  storage.del(storageKey(lang, level, avatar));
}

// ─── SCÉNARIOS : cache local (openings + conversations) ──────────────────────

const scenarioOpeningKey = (lang, level, avatar, scenario) =>
  `scen_open:${lang.code}:${level.id}:${avatar.id}:${scenario.id}`;

const scenarioConvKey = (lang, level, avatar, scenario) =>
  `scen_chat:${lang.code}:${level.id}:${avatar.id}:${scenario.id}`;

// Cache l'opening line d'un scénario (réutilisée à chaque relance → 0 tokens)
function loadScenarioOpening(lang, level, avatar, scenario) {
  try {
    const raw = storage.get(scenarioOpeningKey(lang, level, avatar, scenario));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveScenarioOpening(lang, level, avatar, scenario, data) {
  try { storage.set(scenarioOpeningKey(lang, level, avatar, scenario), JSON.stringify(data)); } catch {}
}
function clearScenarioOpening(lang, level, avatar, scenario) {
  storage.del(scenarioOpeningKey(lang, level, avatar, scenario));
}

// ─── SCÉNARIOS : pool de dialogues (jusqu'à 3 par scénario) ─────────────────
// Chaque scénario peut avoir plusieurs dialogues pré-générés, tirés au hasard
// à l'ouverture pour offrir de la variété sans consommer de tokens. La
// régénération explicite ajoute un nouveau dialogue au pool (max 3).
const DIALOG_POOL_MAX = 3;

const dialoguePoolKey = (lang, level, scenario) =>
  `scen_dialog_pool:${lang.code}:${level.id}:${scenario.id}`;

const dialogueLegacyKey = (lang, level, scenario) =>
  `scen_dialog:${lang.code}:${level.id}:${scenario.id}`;

function loadDialoguePool(lang, level, scenario) {
  try {
    const raw = storage.get(dialoguePoolKey(lang, level, scenario));
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch { /* ignore */ }
  // Migration : si un dialogue legacy existe, on le remonte dans le pool
  try {
    const legacy = storage.get(dialogueLegacyKey(lang, level, scenario));
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.lines?.length) {
        try { storage.set(dialoguePoolKey(lang, level, scenario), JSON.stringify([parsed])); } catch {}
        try { storage.del(dialogueLegacyKey(lang, level, scenario)); } catch {}
        return [parsed];
      }
    }
  } catch { /* ignore */ }
  return [];
}

function saveDialogueToPool(lang, level, scenario, dialogue) {
  const pool = loadDialoguePool(lang, level, scenario);
  pool.push(dialogue);
  const trimmed = pool.slice(-DIALOG_POOL_MAX); // garde les DIALOG_POOL_MAX derniers
  try { storage.set(dialoguePoolKey(lang, level, scenario), JSON.stringify(trimmed)); } catch {}
  return trimmed;
}

// Cache la conversation d'un scénario en cours (résume en cliquant à nouveau)
async function loadScenarioConversation(lang, level, avatar, scenario) {
  try {
    const raw = storage.get(scenarioConvKey(lang, level, avatar, scenario));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
async function saveScenarioConversation(lang, level, avatar, scenario, messages /* userId */) {
  try { storage.set(scenarioConvKey(lang, level, avatar, scenario), JSON.stringify(messages)); } catch {}
}
async function clearScenarioConversation(lang, level, avatar, scenario) {
  storage.del(scenarioConvKey(lang, level, avatar, scenario));
}

// ─── SCÉNARIOS : vocabulaire ─────────────────────────────────────────────────

const scenarioVocabKey = (lang, scenario) =>
  `scen_vocab:${lang.code}:${scenario.id}`;

function loadScenarioVocab(lang, scenario) {
  try {
    const raw = storage.get(scenarioVocabKey(lang, scenario));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveScenarioVocab(lang, scenario, items) {
  try { storage.set(scenarioVocabKey(lang, scenario), JSON.stringify(items)); } catch {}
}

// Generate 12-15 essential words/phrases for a scenario in the target language.
// Cached per (lang, scenario) — 1 call max, then instant.
async function generateScenarioVocab(lang, scenario) {
  // Cache hit → instant, 0 tokens
  const cached = loadScenarioVocab(lang, scenario);
  if (cached && cached.length) return cached;

  const nl = getUserNativeLangName();
  const system = `You produce a short vocabulary list for a language-learning scenario.
Target language: ${lang.nativeName} (${lang.name}).
Scenario: "${scenario.title}" — ${scenario.description}
Role of the tutor: ${scenario.role}. Role of the learner: ${scenario.userRole}.

Give the 12 to 15 MOST USEFUL words or short phrases the learner will need in this scenario.
Focus on VERBS, NOUNS and SHORT PHRASES specific to the situation (avoid generic words like "hello", "yes", "no").
Return each with its ${nl} translation.

Respond ONLY with a JSON array, no code fences:
[
  { "word": "<word or short phrase in ${lang.nativeName}>", "fr": "<short ${nl} translation>" }
]`;

  try {
    const data = await chatWithFallback({
      system,
      messages: [{ role: 'user', content: `Give me the essential vocabulary for the scenario now.` }],
      maxTokens: 700,
      cache: true,
    });
    const raw = data?.content?.[0]?.text || '[]';
    const cleaned = raw.replace(/```json\s*|```/g, '').trim();
    const s = cleaned.indexOf('['), e = cleaned.lastIndexOf(']');
    const parsed = JSON.parse(s !== -1 ? cleaned.slice(s, e + 1) : cleaned);
    if (Array.isArray(parsed) && parsed.length) {
      saveScenarioVocab(lang, scenario, parsed);
      return parsed;
    }
    return [];
  } catch (e) {
    return [];
  }
}

async function loadStats(lang, level, avatar) {
  const raw = storage.get(statsKey(lang, level, avatar));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// Returns the last session for the given user (or unscoped, if no userId given).
// Sessions stored with a different userId are refused (prevents cross-account leaks).
// Legacy sessions with no userId are claimed for the current user AND re-saved
// with the userId, so they persist properly and don't cause a re-migration.
async function loadLastSession(userId = null) {
  const raw = storage.get(META_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Explicit foreign user → refuse
    if (userId && parsed.userId && parsed.userId !== userId) return null;
    // Legacy data (no userId) → claim for the current user and re-save
    if (userId && !parsed.userId) {
      parsed.userId = userId;
      try { storage.set(META_KEY, JSON.stringify(parsed)); } catch {}
    }
    return parsed;
  } catch { return null; }
}

const voiceKey = (avatar) => `voice:${avatar.id}`;

async function loadVoicePref(avatar) {
  return storage.get(voiceKey(avatar));
}
async function saveVoicePref(avatar, voiceURI) {
  if (voiceURI) storage.set(voiceKey(avatar), voiceURI);
  else storage.del(voiceKey(avatar));
}

async function listAvatarsWithHistory(lang, level) {
  const prefix = `chat:${lang.code}:${level.id}:`;
  const ids = storage.keys()
    .filter(k => k.startsWith(prefix))
    .map(k => k.replace(prefix, ''));
  return new Set(ids);
}

// ─── LEVEL TESTS (persisted in Supabase + localStorage cache) ────────────────

async function saveLevelTestResult(result) {
  // Local cache (always works, even offline / without Supabase)
  const cacheKey = 'level_tests_cache';
  const now = Date.now();
  const entry = { ...result, taken_at: new Date().toISOString(), _local_id: `local-${now}` };
  try {
    const raw = storage.get(cacheKey);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(entry);
    storage.set(cacheKey, JSON.stringify(arr.slice(0, 50)));
  } catch (e) { /* ignore */ }

  // Supabase persistence
  if (!supabase) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;
  const { error } = await supabase.from('level_tests').insert({
    user_id: userData.user.id,
    language_code: result.language_code,
    language_name: result.language_name,
    cefr: result.cefr,
    score: result.score,
    level_id: result.level_id,
    strengths_fr: result.strengths_fr,
    weaknesses_fr: result.weaknesses_fr,
    advice_fr: result.advice_fr,
    transcript: result.transcript,
    exchanges: result.exchanges,
    duration_seconds: result.duration_seconds,
  });
  if (error) throw error;
}

// ─── ERROR LOG (for grammar exercises) ────────────────────────────────────────

// Store every correction to build a "weak points" ledger per lang+level.
// Persists to Supabase when a user session is available; always mirrors in localStorage.
async function logError(lang, level, correction) {
  if (!correction || !correction.original) return;

  // Local cache (always)
  try {
    const key = `errors:${lang.code}:${level.id}`;
    const raw = storage.get(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ ...correction, logged_at: Date.now() });
    storage.set(key, JSON.stringify(arr.slice(0, 100)));
  } catch (e) { /* ignore */ }

  // Supabase (fire-and-forget)
  if (!supabase) return;
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    await supabase.from('user_errors').insert({
      user_id: userData.user.id,
      language_code: lang.code,
      level_id: level.id,
      original: correction.original,
      corrected: correction.corrected,
      spoken_echo: correction.spoken_echo || null,
      explanation_fr: correction.explanation_fr,
      category: correction.category || 'other',
    });
  } catch (e) { /* silent — the local cache already saved it */ }
}

async function loadRecentErrors(lang, level, limit = 30) {
  // Try Supabase first, then fall back to localStorage.
  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('user_errors')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('language_code', lang.code)
          .eq('level_id', level.id)
          .order('logged_at', { ascending: false })
          .limit(limit);
        if (!error && data && data.length) return data;
      }
    } catch (e) { /* fall through */ }
  }
  // Fallback: localStorage
  try {
    const key = `errors:${lang.code}:${level.id}`;
    const raw = storage.get(key);
    const arr = raw ? JSON.parse(raw) : [];
    return arr.slice(0, limit);
  } catch { return []; }
}

// Save the result of a completed exercise session
async function saveExerciseSession({ lang, level, categories, exercises, score }) {
  const record = {
    language_code: lang.code,
    level_id: level.id,
    categories: categories,
    exercises: exercises,
    score: score,
    total: exercises.length,
    completed_at: new Date().toISOString(),
  };

  // Local cache
  try {
    const raw = storage.get('exercise_sessions');
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(record);
    storage.set('exercise_sessions', JSON.stringify(arr.slice(0, 50)));
  } catch (e) { /* ignore */ }

  // Supabase
  if (!supabase) return;
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    await supabase.from('exercise_sessions').insert({
      user_id: userData.user.id,
      ...record,
    });
  } catch (e) { /* silent */ }
}

async function loadExerciseSessions(userId, limit = 20) {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('exercise_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data;
    } catch (e) { /* fall through */ }
  }
  try {
    const raw = storage.get('exercise_sessions');
    return raw ? JSON.parse(raw).slice(0, limit) : [];
  } catch { return []; }
}

// Group errors by category to detect patterns
function summarizeErrors(errors) {
  const by = {};
  errors.forEach(e => {
    const cat = e.category || 'other';
    if (!by[cat]) by[cat] = { count: 0, samples: [] };
    by[cat].count += 1;
    if (by[cat].samples.length < 4) {
      by[cat].samples.push({ original: e.original, corrected: e.corrected, explanation_fr: e.explanation_fr });
    }
  });
  return Object.entries(by)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.count - a.count);
}

const CATEGORY_LABELS_FR = {
  past_tense: 'Passé',
  present_perfect: 'Present perfect',
  future: 'Futur',
  conditional: 'Conditionnel',
  subjunctive: 'Subjonctif',
  articles: 'Articles',
  prepositions: 'Prépositions',
  pronouns: 'Pronoms',
  gender: 'Genre',
  plural: 'Pluriel',
  word_order: 'Ordre des mots',
  agreement: 'Accord',
  phrasal_verb: 'Phrasal verbs',
  false_friend: 'Faux amis',
  vocabulary: 'Vocabulaire',
  spelling: 'Orthographe',
  punctuation: 'Ponctuation',
  other: 'Divers',
};

async function loadLevelTests(userId) {
  // Try Supabase first
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('level_tests')
        .select('*')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false })
        .limit(50);
      if (!error && data) return data;
    } catch (e) { /* fall through */ }
  }
  // Fallback: local cache
  try {
    const raw = storage.get('level_tests_cache');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function timeSince(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 7) {
    const d = new Date(ts);
    return `le ${d.getDate()}/${d.getMonth()+1}`;
  }
  if (days >= 1) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours >= 1) return `il y a ${hours} h`;
  if (mins >= 5) return `il y a ${mins} min`;
  return "à l'instant";
}

// ─── PLATFORM DETECTION ───────────────────────────────────────────────────────

const detectPlatform = () => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua)) return 'mac';
  if (/Windows/i.test(ua)) return 'windows';
  return 'other';
};
const AUTO_PLATFORM = detectPlatform();

// User's chosen device (persists across sessions). Falls back to auto-detection.
const DEVICE_KEY = 'device_choice';
const getUserDevice = () => {
  try { return storage.get(DEVICE_KEY) || AUTO_PLATFORM; } catch { return AUTO_PLATFORM; }
};
const setUserDevice = (device) => {
  try { storage.set(DEVICE_KEY, device); } catch {}
};
let PLATFORM = AUTO_PLATFORM;
try { PLATFORM = storage.get(DEVICE_KEY) || AUTO_PLATFORM; } catch {}

const PLATFORM_HINTS = {
  android: { label: 'micro du clavier', detail: 'sur le clavier Gboard, touchez le 🎤 en haut à droite' },
  ios:     { label: 'dictée du clavier', detail: 'sur le clavier, touchez le 🎤 à côté de la barre espace' },
  mac:     { label: 'dictée macOS', detail: 'appuyez deux fois sur Fn pour dicter' },
  windows: { label: 'Win + H', detail: 'appuyez sur Win+H pour dicter' },
  other:   { label: 'dictée clavier', detail: 'utilisez le micro de votre système' },
};

// Device presentation info for the chooser
const DEVICES = [
  {
    id: 'ios',
    name: 'iPhone / iPad',
    emoji: '📱',
    color: '#0A84FF',
    tip: 'Reconnaissance vocale par touches courtes. Meilleure expérience : installer en PWA depuis Safari (Partager → Sur l\'écran d\'accueil).',
  },
  {
    id: 'android',
    name: 'Android',
    emoji: '🤖',
    color: '#3DDC84',
    tip: 'Excellent support du micro et de la voix. Installe l\'app via le menu Chrome → Ajouter à l\'écran d\'accueil.',
  },
  {
    id: 'mac',
    name: 'Mac',
    emoji: '💻',
    color: '#A855F7',
    tip: 'Utilise Chrome ou Safari. Le micro et les voix macOS marchent parfaitement.',
  },
  {
    id: 'windows',
    name: 'Windows',
    emoji: '🖥️',
    color: '#FF385C',
    tip: 'Chrome ou Edge recommandés. Utilise Win+H pour la dictée système en complément.',
  },
];

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

// Strict level-specific constraints — used both by chat and reader
const LEVEL_CONSTRAINTS = {
  beginner: `LEVEL — BEGINNER (CEFR A1–A2). STRICT:
- Vocabulary: only the 1000 most common everyday words. NEVER use rare or literary words.
- Grammar: present tense, simple past ("was", "went"), simple future ("will"). Avoid conditionals, subjunctive, complex passives.
- Sentence length: 5–10 words maximum, one clause each.
- Repeat key words. Speak slowly (short sentences).
- No idioms, no cultural references without context, no humor that hinges on wordplay.
- Always finish with a very simple, open question the learner can answer in one short sentence.`,

  intermediate: `LEVEL — INTERMEDIATE (CEFR B1–B2). STRICT:
- Vocabulary: everyday + common professional/topical words. Avoid literary/technical jargon.
- Grammar: all common tenses, conditionals, reported speech, common phrasal verbs.
- Sentence length: 8–18 words, up to two clauses.
- You may use common idioms if the meaning is transparent from context.
- Natural, friendly pace.`,

  advanced: `LEVEL — ADVANCED (CEFR C1–C2). STRICT:
- Vocabulary: rich, precise, native-like including idioms, cultural references, humor, sarcasm.
- Grammar: full range including subjunctive, inversion, complex subordination.
- Sentence length: unrestricted, but keep replies conversational (1–4 sentences).
- Nuance and register matter — challenge the learner.`,
};

const buildSystemPrompt = (lang, level, avatar) => { const nl = getUserNativeLangName(); return `You are ${avatar.name}, a ${avatar.age}-year-old ${avatar.role.toLowerCase()} from ${avatar.location}.

You are having a casual conversation with a ${nl} speaker who is learning ${lang.nativeName} (${lang.name}).

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Persona: ${avatar.persona}

Your role:
- Always reply in ${lang.nativeName}. ${lang.code === 'mfe' ? 'IMPORTANT: respond strictly in Kreol Morisien using authentic Mauritian spelling and expressions. Do NOT respond in French.' : ''}
- Stay in character. Be natural and engaging.
- Keep replies short: 1–3 sentences. End with a question or remark that invites continuing.
- Match your vocabulary and complexity STRICTLY to the level constraints above — never exceed them.
- If the user writes mainly in ${nl}, gently respond in ${lang.nativeName}, encourage them, and provide one short model sentence they could try.

ERROR CORRECTION (mandatory — this is your teacher role):
- Detect ANY real error in the user's ${lang.nativeName}: grammar, conjugation, gender, word order, vocabulary, prepositions, tense, articles, false friends, spelling.
- Do NOT flag minor stylistic preferences — only what a teacher would correct.
- Give a brief, friendly explanation IN ${nl.toUpperCase()} with the underlying rule.
- Also produce a natural spoken echo: how a native would rephrase the learner's whole sentence correctly, staying in ${lang.nativeName}. This is what the tutor's voice will read aloud so the learner hears the correct form.

CRITICAL OUTPUT FORMAT: Respond ONLY with one valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "reply": "<your in-character response in ${lang.nativeName}>",
  "fr_translation": "<a natural ${nl} translation of your reply>",
  "corrections": [
    {
      "original": "<user's incorrect phrase, as they wrote it>",
      "corrected": "<the same phrase rewritten correctly in ${lang.nativeName}>",
      "spoken_echo": "<a short natural sentence in ${lang.nativeName} the tutor would say aloud to model the correct form, e.g. 'Actually, we say ...' or the equivalent in ${lang.nativeName}>",
      "explanation_fr": "<short explanation in ${nl} with the rule>",
      "category": "<one of: past_tense | present_perfect | future | conditional | subjunctive | articles | prepositions | pronouns | gender | plural | word_order | agreement | phrasal_verb | false_friend | vocabulary | spelling | punctuation | other>"
    }
  ]
}

If no errors, return "corrections": []. Never wrap the JSON in backticks. Never add text outside the JSON.`; };

// System prompt for scenario mode — the teacher plays a specific role
const buildScenarioSystemPrompt = (lang, level, avatar, scenario) => { const nl = getUserNativeLangName(); return `You are playing a role in a language-learning scenario.

Character to play: ${scenario.role}
The learner is: ${scenario.userRole}
Scenario: "${scenario.title}" — ${scenario.description}

You are ${avatar.name}, a ${avatar.age}-year-old from ${avatar.location}, but in this scenario you play the character above. Adopt that character's tone and vocabulary while keeping your general warmth.

The learner is a ${nl} speaker learning ${lang.nativeName} (${lang.name}).

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

RULES OF THE ROLE-PLAY:
- Speak ONLY in ${lang.nativeName} when playing the character. ${lang.code === 'mfe' ? 'IMPORTANT: use authentic Kreol Morisien.' : ''}
- Stay in character: use the vocabulary, register and typical phrases of the role.
- Start the scenario by initiating the interaction in a natural way (e.g. a waiter would say "Welcome, how many people?"; a doctor would say "What brings you in today?").
- Keep each reply short: 1–3 sentences. End with a question or line that pushes the learner to reply.
- Match your vocabulary and complexity STRICTLY to the level constraints above.
- If the learner is stuck or writes in ${nl}, gently prompt in ${lang.nativeName} and offer one short model sentence.

ERROR CORRECTION (mandatory, in ${nl}):
- Detect ANY real error in the user's ${lang.nativeName}: grammar, tense, vocab, preposition, gender, spelling, etc.
- Give a brief ${nl} explanation with the underlying rule.
- Produce a natural spoken echo — how a native would rephrase the whole sentence correctly.

CRITICAL OUTPUT FORMAT: Respond ONLY with one valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "reply": "<your in-character response in ${lang.nativeName}>",
  "fr_translation": "<a natural ${nl} translation of your reply>",
  "corrections": [
    {
      "original": "<user's incorrect phrase>",
      "corrected": "<the phrase rewritten correctly>",
      "spoken_echo": "<a short natural sentence the tutor would say aloud>",
      "explanation_fr": "<short ${nl} explanation with the rule>",
      "category": "<one of: past_tense | present_perfect | future | conditional | subjunctive | articles | prepositions | pronouns | gender | plural | word_order | agreement | phrasal_verb | false_friend | vocabulary | spelling | punctuation | other>"
    }
  ]
}

If no errors, return "corrections": []. Never wrap the JSON in backticks. Never add text outside the JSON.`; };

// ─── HOOKS ────────────────────────────────────────────────────────────────────

// Heuristic: guess a voice's gender from its name.
// Returns 'female', 'male', or null (unknown).
function guessVoiceGender(voiceName) {
  const n = voiceName.toLowerCase();
  // Explicit markers
  if (/\bfemale\b|femme|frau|donna|mujer|mulher|女性|امرأة/.test(n)) return 'female';
  if (/\bmale\b|homme|mann|uomo|hombre|homem|男性|رجل/.test(n)) return 'male';
  // Common female voice names across systems
  const femaleNames = [
    // Windows / Azure
    'zira','hazel','susan','heera','catherine','linda','jenny','aria','ana','emma','michelle','clara','nanami','ayumi','xiaoxiao','xiaoyou','hortense','julie','denise','katja','elsa','isabella','francisca','helena','sabina','alicja','joanna','maja',
    // Apple
    'samantha','victoria','allison','ava','kate','serena','fiona','moira','tessa','karen','veena','rishi','martha','amelie','audrey','virginie','marie','anna','helena','alice','silvia','federica','joana','catarina','luciana','paulina','esperanza','monica','marisol','laila','kyoko','haruka','sayaka','tingting','meijia','sin-ji',
    // Google
    'wavenet-a','wavenet-c','wavenet-e','wavenet-f','wavenet-h',
    // Miscellaneous common female French names used in TTS
    'petra','greta','laura','nadia','sarah','sophia','olivia'
  ];
  const maleNames = [
    'david','mark','richard','george','james','guy','ryan','tony','christopher','william','brandon','eric','jacob','matthew','antonio','marco','luca','felipe','ricardo','daniel','thomas','nicolas','markus','stefan','yannick','jorge','diego','juan','carlos','majed','tarik','otoya','hattori','alex','fred','tom','aaron','arthur','gordon','oliver','bruce','henri','jean','pierre','paul','claude','sean','declan','angus'
  ];
  if (femaleNames.some(name => n.includes(name))) return 'female';
  if (maleNames.some(name => n.includes(name))) return 'male';
  return null;
}

function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [speakingText, setSpeakingText] = useState(null);
  const [speakingBoundary, setSpeakingBoundary] = useState(null); // { text, charIndex, charLength }

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speak = (text, avatar, lang, preferredVoiceURI) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang?.ttsLocale || 'en-US';
    // Per-avatar rate/pitch override if defined
    u.rate = avatar?.rate ?? 0.9;
    u.pitch = avatar?.pitch ?? 1;
    u.onstart = () => { setSpeakingText(text); setSpeakingBoundary({ text, charIndex: 0, charLength: 0 }); };
    u.onend = () => { setSpeakingText(null); setSpeakingBoundary(null); };
    u.onerror = () => { setSpeakingText(null); setSpeakingBoundary(null); };
    u.onboundary = (evt) => {
      // Fired for word/sentence boundaries. Not all browsers fire it, but Chrome/Safari do.
      if (evt.name === 'word' || !evt.name) {
        setSpeakingBoundary({ text, charIndex: evt.charIndex, charLength: evt.charLength || 0 });
      }
    };
    if (voices.length) {
      let chosen = null;
      if (preferredVoiceURI) {
        chosen = voices.find(v => v.voiceURI === preferredVoiceURI);
      }
      if (!chosen) {
        const base = (lang?.ttsLocale || 'en-US').split('-')[0];
        const langPool = voices.filter(v => v.lang.startsWith(base));
        const exactPool = langPool.filter(v => v.lang === (lang?.ttsLocale || 'en-US'));
        const pool = exactPool.length ? exactPool : langPool;

        // Determine target gender from avatar
        const targetGender = avatar?.gender || null;

        const scored = pool.map(v => {
          let score = 0;
          const n = v.name.toLowerCase();
          if (/natural|premium|enhanced|neural|wavenet|studio/.test(n)) score += 100;
          if (/google/.test(n)) score += 60;
          if (/microsoft/.test(n) && /online|natural/.test(n)) score += 40;
          if (avatar && avatar.voiceHint.some(h => n.includes(h))) score += 80;
          if (v.localService === false) score += 5;

          // Gender matching: HUGE boost when it matches, big penalty otherwise
          if (targetGender) {
            const voiceGender = guessVoiceGender(v.name);
            if (voiceGender === targetGender) score += 500;
            else if (voiceGender && voiceGender !== targetGender) score -= 300;
          }
          return { v, score };
        });
        scored.sort((a, b) => b.score - a.score);
        chosen = scored[0]?.v || pool[0];

        // Fallback: if the chosen voice's gender doesn't match, modulate pitch
        // to make male vs female audibly distinct even with the same underlying voice.
        if (targetGender && chosen) {
          const chosenGender = guessVoiceGender(chosen.name);
          if (chosenGender !== targetGender) {
            // No matching gender available → shift pitch to fake it
            if (targetGender === 'male' && (chosenGender === 'female' || chosenGender === null)) {
              u.pitch = Math.max(0.5, (avatar?.pitch ?? 1) - 0.35);
            } else if (targetGender === 'female' && (chosenGender === 'male' || chosenGender === null)) {
              u.pitch = Math.min(2.0, (avatar?.pitch ?? 1) + 0.35);
            }
          }
        }
      }
      if (chosen) u.voice = chosen;
    }
    window.speechSynthesis.speak(u);
  };

  // Speak several pieces one after the other, with an optional pause between them.
  // Usage: speakSequence([{text: "Hello."}, {text: "How are you?", pauseBefore: 700}], avatar, lang, uri)
  const speakSequence = (items, avatar, lang, preferredVoiceURI) => {
    if (!('speechSynthesis' in window) || !items?.length) return;
    window.speechSynthesis.cancel();
    let cancelled = false;
    let idx = 0;

    const speakNext = () => {
      if (cancelled || idx >= items.length) { setSpeakingText(null); return; }
      const item = items[idx++];
      const delay = item.pauseBefore || 0;
      setTimeout(() => {
        if (cancelled) return;
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = lang?.ttsLocale || 'en-US';
        u.rate = item.rate ?? avatar?.rate ?? 0.9;
        u.pitch = item.pitch ?? avatar?.pitch ?? 1;
        u.onstart = () => setSpeakingText(item.text);
        u.onend = () => { if (!cancelled) speakNext(); };
        u.onerror = () => { setSpeakingText(null); };
        // Reuse the same voice-picking logic by delegating
        if (voices.length) {
          let chosen = null;
          if (preferredVoiceURI) chosen = voices.find(v => v.voiceURI === preferredVoiceURI);
          if (!chosen) {
            const base = (lang?.ttsLocale || 'en-US').split('-')[0];
            const langPool = voices.filter(v => v.lang.startsWith(base));
            const exactPool = langPool.filter(v => v.lang === (lang?.ttsLocale || 'en-US'));
            const pool = exactPool.length ? exactPool : langPool;
            chosen = pool[0];
          }
          if (chosen) u.voice = chosen;
        }
        window.speechSynthesis.speak(u);
      }, delay);
    };
    speakNext();
    // Return a canceller
    return () => { cancelled = true; window.speechSynthesis.cancel(); setSpeakingText(null); };
  };

  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingText(null);
    setSpeakingBoundary(null);
  };
  return { speak, speakSequence, stop, speakingText, speakingBoundary, voices };
}

function useRecognition(srLocale) {
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = srLocale || 'en-US';
      r.interimResults = true;
      // Continuous mode: keeps listening across pauses within a single sentence.
      // Our own silence timer (2.5s) decides when the user has really finished.
      r.continuous = true;
      recRef.current = r;
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, [srLocale]);

  const listen = ({ onInterim, onFinal, onEnd, onError }) => {
    const r = recRef.current;
    if (!r) return;
    // Full-final transcript rebuilt from all isFinal items every event.
    //
    // Android quirk: Chrome on Android emits GROWING SNAPSHOTS as separate final
    // results (each new final contains the previous one as its prefix). Naive
    // concatenation duplicates: ["why", "why I", "why I am"] → "why why I why I am".
    // Fix: drop any final transcript that is a prefix of a later one, then join
    // the survivors. On desktop (where each final is a distinct phrase, none a
    // prefix of the next), nothing is dropped and behaviour is unchanged.
    let finalText = '';
    r.onresult = (e) => {
      let interim = '';
      const finals = [];
      for (let i = 0; i < e.results.length; i++) {
        const t = (e.results[i][0].transcript || '').trim();
        if (!t) continue;
        if (e.results[i].isFinal) finals.push(t);
        else interim += (interim && !interim.endsWith(' ') ? ' ' : '') + t;
      }
      // Keep only finals that are NOT a prefix of a later final (drops
      // Android's growing snapshots and exact duplicates).
      const kept = [];
      for (let i = 0; i < finals.length; i++) {
        const cur = finals[i];
        let stale = false;
        for (let j = i + 1; j < finals.length; j++) {
          const later = finals[j];
          if (later === cur || later.startsWith(cur + ' ') || later.startsWith(cur)) {
            stale = true; break;
          }
        }
        if (!stale) kept.push(cur);
      }
      const cumulativeFinal = kept.join(' ').trim();
      if (cumulativeFinal && cumulativeFinal !== finalText) {
        finalText = cumulativeFinal;
        // Pass the full cumulative final — callers should REPLACE their stored
        // transcript with this value, not append.
        onFinal?.(cumulativeFinal, cumulativeFinal);
      }
      if (interim) onInterim?.(interim.trim());
    };
    r.onerror = (e) => onError?.(e);
    r.onend = () => onEnd?.(finalText);
    try { r.start(); } catch (e) { /* already started */ }
  };

  const stop = () => { try { recRef.current?.stop(); } catch (e) {} };
  const abort = () => { try { recRef.current?.abort(); } catch (e) {} };

  return { supported, listen, stop, abort };
}

// ─── ANIMATED AVATAR ──────────────────────────────────────────────────────────

function Eye({ cx, style, blink }) {
  if (blink) {
    return <line x1={cx-5} y1={42} x2={cx+5} y2={42} stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />;
  }
  switch (style) {
    case 'oval':
      return <ellipse cx={cx} cy={42} rx={5} ry={3.5} fill="#1a1a1a" />;
    case 'lashes':
      return (
        <g>
          <ellipse cx={cx} cy={42} rx={3.8} ry={4.5} fill="#1a1a1a" />
          <line x1={cx-6} y1={35} x2={cx-3} y2={38.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1={33} x2={cx} y2={37.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx+6} y1={35} x2={cx+3} y2={38.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx={cx} cy={42} r={4} fill="#1a1a1a" />;
  }
}

function Accessory({ kind }) {
  switch (kind) {
    case 'glasses-round':
      return (
        <g stroke="#1a1a1a" strokeWidth="2" fill="rgba(255,255,255,0.18)">
          <circle cx={34} cy={42} r={11} />
          <circle cx={66} cy={42} r={11} />
          <line x1={45} y1={42} x2={55} y2={42} strokeWidth="2.5" />
        </g>
      );
    case 'glasses-square':
      return (
        <g stroke="#1a1a1a" strokeWidth="2" fill="rgba(255,255,255,0.18)">
          <rect x={23} y={34} width={22} height={16} rx={2} />
          <rect x={55} y={34} width={22} height={16} rx={2} />
          <line x1={45} y1={42} x2={55} y2={42} strokeWidth="2.5" />
        </g>
      );
    case 'bindi':
      return <circle cx={50} cy={27} r={3} fill="#B91C1C" />;
    case 'beard':
      return (
        <path d="M 28 66 Q 28 82 50 86 Q 72 82 72 66 L 67 72 Q 58 80 50 81 Q 42 80 33 72 Z"
              fill="#1a1a1a" opacity={0.88} />
      );
    default:
      return null;
  }
}

function Mouth({ style, speaking, color }) {
  if (speaking) {
    return (
      <ellipse cx={50} cy={68} rx={6} ry={3} fill={color}>
        <animate attributeName="ry" values="1.5;5.5;2.5;6;1.5" dur="0.45s" repeatCount="indefinite" />
        <animate attributeName="rx" values="6;4.5;6;5;6" dur="0.45s" repeatCount="indefinite" />
      </ellipse>
    );
  }
  switch (style) {
    case 'wide-smile':
      return <path d="M 38 63 Q 50 75 62 63" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case 'smirk':
      return <path d="M 42 68 Q 50 71 58 64" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case 'neutral':
      return <line x1={43} y1={68} x2={57} y2={68} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
    case 'smile':
    default:
      return <path d="M 42 65 Q 50 71 58 65" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
}

// Palettes for cartoon character avatars (à la illustration flat colorée).
const HAIR_COLORS = {
  black: '#1F1B1A', darkbrown: '#3E2A1E', brown: '#6B4423', chestnut: '#A0522D',
  ginger: '#C05621', orange: '#EA580C', blonde: '#E8B76B', platinum: '#F0E4C8',
  red: '#B91C1C', grey: '#78716C', white: '#F0EBE5', bluish: '#334155',
};
const SKIN_TONES = {
  light: '#FFDBB5', peach: '#F3C99A', medium: '#D8A778',
  tan: '#B5814C', brown: '#8B5A2B', deep: '#5C3317',
};
const HAIR_C_KEYS = Object.keys(HAIR_COLORS);
const SKIN_KEYS   = Object.keys(SKIN_TONES);
const HAIRS_F = ['bob', 'long', 'ponytail', 'buns', 'curly', 'wave'];
const HAIRS_M = ['short', 'quiff', 'crew', 'curly-m', 'wave-m', 'bald', 'spike', 'cap', 'headphones'];

// Deterministic pick from id — same avatar always gets the same look.
function _hashN(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0; return Math.abs(h); }
function _pickFrom(id, salt, arr) { return arr[_hashN(id + salt) % arr.length]; }

function deriveAvatarLook(avatar) {
  const face = FACES[avatar.id] || {};
  const isM = avatar.gender === 'male';
  const hair = face.hair || _pickFrom(avatar.id, 'h', isM ? HAIRS_M : HAIRS_F);
  const hairColor = HAIR_COLORS[face.hairColor] || HAIR_COLORS[_pickFrom(avatar.id, 'hc', HAIR_C_KEYS)];
  const skin = SKIN_TONES[face.skin] || SKIN_TONES[_pickFrom(avatar.id, 'sk', SKIN_KEYS)];
  return { hair, hairColor, skin };
}

function HairPath({ style, color }) {
  const s = { stroke: '#1a1a1a', strokeWidth: 2.5, strokeLinejoin: 'round' };
  switch (style) {
    case 'bald':
      // Just a subtle shine on top of the scalp
      return <ellipse cx={50} cy={20} rx={6} ry={2.5} fill="white" opacity="0.4"/>;
    case 'crew':
      // Very short buzz cut — a thin cap hugging the skull
      return <path d="M 22 30 Q 22 18 50 16 Q 78 18 78 30 L 76 28 Q 66 22 50 22 Q 34 22 24 28 Z" fill={color} {...s}/>;
    case 'short':
      // Classic short cut with side part
      return <path d="M 18 38 Q 16 10 50 10 Q 84 10 82 38 L 78 30 Q 72 22 50 20 Q 28 22 22 30 Z M 40 16 L 62 16 L 60 22 L 42 22 Z" fill={color} {...s}/>;
    case 'quiff':
      // High pompadour with a visible tuft/wave in front
      return (
        <g {...s}>
          <path d="M 18 42 Q 18 12 50 8 Q 82 12 82 42 L 78 32 Q 68 18 50 16 Q 32 18 22 32 Z" fill={color}/>
          <path d="M 34 14 Q 40 2 52 6 Q 62 10 68 14 Q 60 8 50 10 Q 42 6 34 14 Z" fill={color}/>
        </g>
      );
    case 'curly-m':
      // Big fluffy afro-like curls — many round bumps
      return (
        <g {...s}>
          <path d="M 14 42 Q 6 30 16 20 Q 18 8 32 12 Q 40 2 50 10 Q 60 2 68 12 Q 82 8 84 20 Q 94 30 86 42 Q 80 30 72 30 Q 78 22 68 22 Q 60 14 52 20 Q 50 12 48 20 Q 40 14 32 22 Q 22 22 28 30 Q 20 30 14 42 Z" fill={color}/>
          <circle cx="24" cy="20" r="4" fill={color}/>
          <circle cx="76" cy="20" r="4" fill={color}/>
        </g>
      );
    case 'wave-m':
      // Side-swept wave (fringe swept)
      return <path d="M 18 40 Q 18 12 50 10 Q 82 12 82 40 Q 76 22 66 24 Q 60 18 50 22 Q 40 30 30 24 Q 22 20 18 40 Z" fill={color} {...s}/>;
    case 'spike':
      // Spiky punk hair — jagged edges pointing up
      return <path d="M 20 34 L 18 20 L 26 30 L 30 12 L 36 28 L 42 8 L 48 26 L 54 8 L 60 28 L 66 12 L 70 30 L 78 20 L 76 34 Q 74 28 50 24 Q 26 28 20 34 Z" fill={color} {...s}/>;
    case 'bob':
      // Chin-length bob framing the face
      return <path d="M 12 54 Q 10 16 50 8 Q 90 16 88 54 L 82 30 Q 72 20 50 18 Q 28 20 18 30 Z" fill={color} {...s}/>;
    case 'long':
      // Long straight hair past the shoulders
      return <path d="M 8 78 Q 4 18 50 8 Q 96 18 92 78 L 82 40 Q 74 22 50 18 Q 26 22 18 40 Z" fill={color} {...s}/>;
    case 'ponytail':
      // Hair pulled back with a side ponytail
      return (
        <g {...s}>
          <path d="M 20 40 Q 16 14 50 10 Q 84 14 80 40 L 76 30 Q 70 22 50 20 Q 30 22 24 30 Z" fill={color}/>
          <ellipse cx="90" cy="42" rx="8" ry="16" fill={color} transform="rotate(28 90 42)"/>
        </g>
      );
    case 'buns':
      // Twin side buns (playful)
      return (
        <g {...s}>
          <path d="M 22 42 Q 18 18 50 12 Q 82 18 78 42 L 74 32 Q 68 22 50 20 Q 32 22 26 32 Z" fill={color}/>
          <circle cx="18" cy="18" r="10" fill={color}/>
          <circle cx="82" cy="18" r="10" fill={color}/>
        </g>
      );
    case 'curly':
      // Big fluffy curls (female afro-style)
      return (
        <g {...s}>
          <path d="M 10 42 Q 4 20 20 12 Q 26 2 40 8 Q 50 0 60 8 Q 74 2 80 12 Q 96 20 90 42 Q 84 30 78 30 Q 84 20 74 20 Q 68 12 60 18 Q 54 8 50 16 Q 46 8 40 18 Q 32 12 26 20 Q 16 20 22 30 Q 16 30 10 42 Z" fill={color}/>
          <circle cx="16" cy="22" r="4" fill={color}/>
          <circle cx="84" cy="22" r="4" fill={color}/>
        </g>
      );
    case 'wave':
      // Wavy long hair
      return <path d="M 10 60 Q 6 14 50 10 Q 94 14 90 60 L 82 34 Q 74 22 50 20 Q 26 22 18 34 Z" fill={color} {...s}/>;
    case 'headband-tails':
      // Two low ponytails with a headband on top
      return (
        <g {...s}>
          {/* Base hair */}
          <path d="M 20 42 Q 16 16 50 12 Q 84 16 80 42 L 76 30 Q 70 22 50 20 Q 30 22 24 30 Z" fill={color}/>
          {/* Two low side puffs */}
          <ellipse cx="14" cy="52" rx="6" ry="10" fill={color}/>
          <ellipse cx="86" cy="52" rx="6" ry="10" fill={color}/>
          {/* Headband on top */}
          <path d="M 20 18 Q 50 8 80 18 L 82 24 Q 50 14 18 24 Z" fill="#EC4899" stroke="#1a1a1a" strokeWidth="2"/>
        </g>
      );
    case 'hijab':
      // Scarf covering the head and neck
      return (
        <g {...s}>
          <path d="M 8 40 Q 4 4 50 4 Q 96 4 92 40 L 92 70 Q 88 76 82 76 L 68 76 L 68 68 L 32 68 L 32 76 L 18 76 Q 12 76 8 70 Z"
                fill={color === '#B91C1C' ? '#B91C1C' : color}/>
          {/* Fold detail */}
          <path d="M 32 68 Q 50 62 68 68" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
        </g>
      );
    case 'cap':
      // Baseball cap
      return (
        <g {...s}>
          <path d="M 22 32 Q 22 12 50 10 Q 78 12 78 32 L 78 28 Q 72 20 50 18 Q 28 20 22 28 Z" fill={color}/>
          <ellipse cx="70" cy="34" rx="18" ry="4" fill={color}/>
        </g>
      );
    case 'headphones':
      // Big over-ear headphones
      return (
        <g {...s}>
          <path d="M 22 32 Q 22 14 50 12 Q 78 14 78 32 L 76 28 Q 70 22 50 20 Q 30 22 24 28 Z" fill={color}/>
          <path d="M 12 44 Q 12 20 50 18 Q 88 20 88 44" stroke="#4B5563" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <ellipse cx="12" cy="48" rx="6" ry="9" fill="#4B5563"/>
          <ellipse cx="88" cy="48" rx="6" ry="9" fill="#4B5563"/>
        </g>
      );
    default:
      return <path d="M 18 38 Q 18 12 50 12 Q 82 12 82 38 L 78 30 Q 70 20 50 18 Q 30 20 22 30 Z" fill={color} {...s}/>;
  }
}

function AnimatedAvatar({ avatar, size='md', speaking=false }) {
  const sizes = { xs:'w-8 h-8', sm:'w-12 h-12', md:'w-16 h-16', lg:'w-24 h-24', xl:'w-32 h-32' };
  const face = FACES[avatar.id] || { eyes:'round', mouth:'smile', accessory:null };
  const { hair, hairColor, skin } = deriveAvatarLook(avatar);
  const mouthColor = face.accessory === 'lipstick' ? '#9F1239' : '#1a1a1a';
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });  // pupil offset for eye-tracking
  const [wave, setWave] = useState(false);            // occasional greeting wave
  const [smileFlash, setSmileFlash] = useState(false); // occasional smile flash

  useEffect(() => {
    let alive = true;
    // Blink
    const blinkTick = () => {
      if (!alive) return;
      if (Math.random() < 0.5) {
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 130);
      }
    };
    const blinkId = setInterval(blinkTick, 2400);

    // Eye movement (looking around)
    const lookTick = () => {
      if (!alive) return;
      const positions = [
        { x: 0, y: 0 },   { x: 0, y: 0 },
        { x: -1.5, y: 0 },{ x: 1.5, y: 0 },
        { x: 0, y: -1 },  { x: 0, y: 1 },
        { x: 1, y: -0.5 },{ x: -1, y: -0.5 },
      ];
      const pick = positions[Math.floor(Math.random() * positions.length)];
      setLook(pick);
    };
    const lookId = setInterval(lookTick, 1800);

    // Occasional wave
    const waveTick = () => {
      if (!alive) return;
      if (Math.random() < 0.35) {
        setWave(true);
        setTimeout(() => alive && setWave(false), 1300);
      }
    };
    const waveId = setInterval(waveTick, 5500);

    // Occasional smile flash
    const smileTick = () => {
      if (!alive) return;
      if (Math.random() < 0.4) {
        setSmileFlash(true);
        setTimeout(() => alive && setSmileFlash(false), 900);
      }
    };
    const smileId = setInterval(smileTick, 4200);

    return () => {
      alive = false;
      clearInterval(blinkId); clearInterval(lookId);
      clearInterval(waveId); clearInterval(smileId);
    };
  }, []);

  return (
    <div className={`${sizes[size]} relative shrink-0`}>
      {speaking && (
        <span className="absolute inset-0 pointer-events-none rounded-full" style={{
          backgroundColor: avatar.color,
          opacity: 0.4,
          animation: 'avatar-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        }} />
      )}
      <div
        className="relative w-full h-full grid place-items-center overflow-hidden rounded-full"
        style={{
          backgroundColor: avatar.soft || '#F8F5F2',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: `0 4px 14px ${avatar.color}55`,
          animation: speaking
            ? 'avatar-bounce 0.55s ease-in-out infinite'
            : 'avatar-breathe 4.5s ease-in-out infinite',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Shirt/shoulders at the bottom (colored) */}
          <path d="M 0 100 L 0 88 Q 4 76 20 74 L 50 70 L 80 74 Q 96 76 100 88 L 100 100 Z"
                fill={avatar.color} stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Neck */}
          <path d="M 42 66 L 42 74 Q 50 76 58 74 L 58 66 Z" fill={skin} stroke="#1a1a1a" strokeWidth="2"/>
          {/* Head (skin) */}
          <circle cx={50} cy={42} r={30} fill={skin} stroke="#1a1a1a" strokeWidth="2.5"/>
          {/* Hair on top */}
          <HairPath style={hair} color={hairColor} />
          {/* Blush */}
          {face.blush && !speaking && (
            <g opacity={0.5} fill="#E11D48">
              <ellipse cx={30} cy={54} rx={5} ry={2.5} />
              <ellipse cx={70} cy={54} rx={5} ry={2.5} />
            </g>
          )}
          {/* Freckles */}
          {face.freckles && (
            <g fill="#7C2D12" opacity={0.6}>
              <circle cx={40} cy={52} r={0.9} />
              <circle cx={44} cy={54} r={0.9} />
              <circle cx={56} cy={54} r={0.9} />
              <circle cx={60} cy={52} r={0.9} />
              <circle cx={50} cy={50} r={0.9} />
            </g>
          )}
          {/* Eyes (pupils track `look`) */}
          <g style={{ transform: `translate(${look.x}px, ${look.y}px)`, transition: 'transform 0.5s ease-out' }}>
            <Eye cx={34} style={face.eyes} blink={blink} />
            <Eye cx={66} style={face.eyes} blink={blink} />
          </g>
          {/* Moustache */}
          {face.moustache && (
            <path d="M 38 60 Q 50 64 62 60 Q 58 63 50 63 Q 42 63 38 60 Z" fill="#1a1a1a" opacity={0.9} />
          )}
          {/* Accessory (glasses, beard, bindi…) */}
          <Accessory kind={face.accessory} />
          {/* Mouth (smile-flash if idle) */}
          <Mouth style={smileFlash && !speaking ? 'smile' : face.mouth} speaking={speaking} color={mouthColor} />
          {/* Little waving hand (idle greeting) */}
          {wave && !speaking && (
            <g style={{ transformOrigin: '86px 82px', animation: 'avatar-wave 1.3s ease-in-out' }}>
              <circle cx={86} cy={82} r={5} fill={skin} stroke="#1a1a1a" strokeWidth={1.2} />
              <path d="M 83 78 L 83 72 M 85 78 L 85 70 M 87 78 L 87 70 M 89 78 L 89 72" stroke="#1a1a1a" strokeWidth={1} strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── LANGUAGE BADGE ───────────────────────────────────────────────────────────

function LanguageBadge({ lang, size='md' }) {
  const sizes = { sm:'w-12 h-12 text-base', md:'w-16 h-16 text-xl', lg:'w-20 h-20 text-2xl' };
  return (
    <div className={`${sizes[size]} grid place-items-center text-stone-50 shrink-0 relative overflow-hidden`}
         style={{ backgroundColor: lang.accent, fontFamily:'Fraunces, Georgia, serif', fontWeight: 500 }}>
      <span>{lang.glyph}</span>
    </div>
  );
}

// ─── STEP HEADER ──────────────────────────────────────────────────────────────

function StepHeader({ step, total, label, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
          étape {step} / {total} · {label}
        </div>
        <div className="flex gap-1 mt-1.5">
          {Array.from({length: total}).map((_,i) => (
            <div key={i} className={`h-0.5 flex-1 ${i < step ? 'bg-[color:var(--ink)]' : 'bg-[color:rgba(90,78,69,0.2)]'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: LANGUAGE ─────────────────────────────────────────────────────────

function LanguagePicker({ onSelect, onResumeLast, onChangeAvatarForLast, profile, signOut, onOpenProfile, onOpenLexicon }) {
  const t = useT();
  const nativeLangCode = profile?.native_language || 'fr';
  const [lastSession, setLastSession] = useState(null);
  const [langChoices, setLangChoices] = useState({}); // { [langCode]: { avatar, level } } — pour afficher le prof déjà choisi

  // La langue d'origine ne peut pas être une langue d'apprentissage
  const learnableLanguages = Object.values(LANGUAGES).filter(l => l.code !== nativeLangCode);

  useEffect(() => {
    // Only show a resume banner if the saved session belongs to the current user.
    if (!profile?.id) { setLastSession(null); setLangChoices({}); return; }
    loadLastSession(profile.id).then(s => {
      if (!s) { setLastSession(null); return; }
      const lang = LANGUAGES[s.langCode];
      const level = LEVELS[s.levelId];
      const avatar = lang?.avatars.find(a => a.id === s.avatarId);
      if (lang && level && avatar) {
        setLastSession({ lang, level, avatar, lastUpdated: s.lastUpdated });
      }
    });
    // Résout tous les choix par langue en objets réels (lang, level, avatar)
    const raw = loadAllLangChoices(profile.id);
    const resolved = {};
    for (const [code, choice] of Object.entries(raw)) {
      const lang = LANGUAGES[code];
      const level = LEVELS[choice.levelId];
      const avatar = lang?.avatars.find(a => a.id === choice.avatarId);
      if (lang && level && avatar) resolved[code] = { avatar, level };
    }
    setLangChoices(resolved);
  }, [profile?.id]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        {/* Top user bar */}
        {profile && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <button onClick={onOpenProfile}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
              <div className="rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                   style={{ width: 32, height: 32, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 2px 6px rgba(255,56,92,0.25)" }}>
                <span style={{ fontSize: 14, color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
                  {(profile.first_name?.[0] || '?').toUpperCase()}
                </span>
              </div>
              <span className="text-[15px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--corail-2)' }}>
                {t('hello')}, {profile.first_name}
              </span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={onOpenLexicon}
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <LexiconIcon size={18} /> {t('my_lexicon')}
              </button>
              <button onClick={onOpenProfile}
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <UserCircle size={12} /> {t('my_account')}
              </button>
              <button onClick={signOut}
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <LogOut size={11} /> {t('signout')}
              </button>
            </div>
          </div>
        )}
        <StepHeader step={1} total={4} label={t('lang.step')} />
        <span className="text-[22px] mb-1">{t('hello')} !</span>
        <h1 className="text-3xl sm:text-[46px] font-medium tracking-tight leading-none mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          {t('lang.title')}
        </h1>
        <p className="mt-4 text-[17px] max-w-lg italic" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
          {t('lang.subtitle')}
        </p>

        {/* Raccourci : reprendre la dernière session + option changer de prof */}
        {lastSession && (
          <div className="mt-5 flex items-stretch gap-2">
            <button onClick={() => onResumeLast(lastSession)}
              className="flex-1 hover:-translate-y-0.5 transition-all p-3 pr-4 flex items-center gap-3 text-left"
              style={{
                backgroundColor: 'white',
                border: `1.5px solid ${lastSession.lang.accent}55`,
                boxShadow: `0 3px 10px ${lastSession.lang.accent}22`,
                borderRadius: '999px',
              }}>
              <AnimatedAvatar avatar={lastSession.avatar} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: lastSession.lang.accent }}>
                  {t('lang.resume_with')} {lastSession.avatar.name}
                </div>
                <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-tight truncate">
                  <em>{lastSession.lang.name}</em> · niveau {lastSession.level.label.toLowerCase()}
                </div>
                <div className="text-[11px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  {timeSince(lastSession.lastUpdated)}
                </div>
              </div>
              <span className="shrink-0 text-xl" style={{ fontFamily:'Fraunces, Georgia, serif', color: lastSession.lang.accent }}>→</span>
            </button>

            {/* Bouton "choisir autre prof" — même langue + niveau, nouveau prof */}
            <button onClick={() => onChangeAvatarForLast?.(lastSession)}
              className="hover:-translate-y-0.5 transition-all px-4 flex flex-col items-center justify-center gap-1"
              style={{
                backgroundColor: 'white',
                border: `1.5px solid ${lastSession.lang.accent}55`,
                boxShadow: `0 3px 10px ${lastSession.lang.accent}22`,
                borderRadius: '999px',
                minWidth: '96px',
              }}
              title="choisir un autre prof pour cette langue">
              <span style={{ fontSize: 22 }}>👤</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight"
                    style={{ fontFamily: 'DM Sans', color: lastSession.lang.accent, whiteSpace: 'pre-line' }}>
                {t('lang.other_teacher')}
              </span>
            </button>
          </div>
        )}

        <div className="mt-8">
          <div className="text-xs font-bold uppercase tracking-wider text-center mb-6">
            {lastSession ? t('lang.or_another') : `· ${t('lang.choose')} ·`}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
          {learnableLanguages.map(lang => {
            const priorChoice = langChoices[lang.code]; // { avatar, level } si déjà utilisée
            return (
            <button key={lang.code} onClick={() => onSelect(lang)}
              className="lang-bubble group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{
                width: '132px',
                height: '132px',
                borderRadius: '50%',
                border: `1.5px solid ${lang.accent}${priorChoice ? '' : '55'}`,
                background: `radial-gradient(circle at 30% 30%, ${lang.accent}25, ${lang.accent}18)`,
                boxShadow: priorChoice ? `0 4px 14px ${lang.accent}40` : `0 3px 10px ${lang.accent}20`,
              }}>
              {/* Overlay : couleur pleine au hover */}
              <span
                className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}DD)`,
                  boxShadow: `0 10px 28px ${lang.accent}66`,
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
                <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">{lang.glyph}</span>
                <span
                  className="text-[15px] sm:text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ fontFamily:'Fraunces, Georgia, serif', color: lang.accent }}>
                  {lang.name}
                </span>
                <span
                  className="mt-0.5 transition-colors duration-300 group-hover:text-white/85"
                  style={{ fontFamily:'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.06em', color: `${lang.accent}CC` }}>
                  {lang.nativeName}
                </span>
              </div>
              {/* Badge : prof déjà choisi pour cette langue — en bas à droite */}
              {priorChoice && (
                <div className="absolute -bottom-1 -right-1 z-20 rounded-full bg-white p-0.5"
                     style={{
                       boxShadow: `0 2px 8px ${lang.accent}55`,
                       border: `2px solid ${lang.accent}`,
                     }}
                     title={`Dernier prof : ${priorChoice.avatar.name} · ${priorChoice.level.label.toLowerCase()}`}>
                  <AnimatedAvatar avatar={priorChoice.avatar} size="xs" />
                </div>
              )}
            </button>
          );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: LEVEL ────────────────────────────────────────────────────────────

function LevelPicker({ language, onSelect, onStartTest, onBack }) {
  const t = useT();
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={2} total={4} label={t('level.step')} onBack={onBack} />
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            {t('level.your_in')}
          </h1>
          <span className="text-2xl sm:text-4xl px-4 py-1 text-stone-50 rounded-full" style={{ fontFamily:'Fraunces, Georgia, serif', backgroundColor: language.accent }}>
            {language.name}
          </span>
        </div>
        <p className="mt-3 text-[color:var(--gris)] max-w-xl" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          {t('level.honest')}
        </p>

        {/* CTA — test de niveau */}
        <button onClick={onStartTest}
          className="mt-6 w-full text-left hover:-translate-y-0.5 transition-all p-4 sm:p-5 flex items-center gap-4 group"
          style={{
            borderRadius: '9999px',
            background: `linear-gradient(135deg, ${language.accent}, ${language.accent}CC)`,
            border: 'none',
            boxShadow: `0 6px 20px ${language.accent}55`,
          }}>
          <div className="w-14 h-14 rounded-full grid place-items-center shrink-0 bg-white/25 backdrop-blur"
               style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">{t('level.evaluate')}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-80" style={{ fontFamily:'DM Sans, sans-serif' }}>3–4 min</span>
            </div>
            <p className="text-sm opacity-90 mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              {t('level.evaluate_sub')}
            </p>
          </div>
          <span className="text-white text-2xl group-hover:translate-x-1 transition-transform" style={{ fontFamily:'Fraunces, Georgia, serif' }}>→</span>
        </button>

        <div className="mt-8 text-xs font-bold uppercase tracking-wider text-center mb-4" style={{ color: 'var(--gris)' }}>
          {t('level.or_direct')}
        </div>

        <div className="mt-2 space-y-3">
          {Object.values(LEVELS).map(lv => (
            <button key={lv.id} onClick={() => onSelect(lv)}
              className="w-full text-left hover:-translate-y-0.5 transition-all p-4 sm:p-5 flex items-center gap-4"
              style={{
                borderRadius: '9999px',
                background: 'white',
                border: `1.5px solid ${language.accent}44`,
                boxShadow: `0 2px 8px ${language.accent}12`,
              }}>
              <div className="w-14 h-14 rounded-full grid place-items-center text-stone-50 shrink-0" style={{ backgroundColor: language.accent, fontFamily:'Fraunces, Georgia, serif' }}>
                <span className="text-2xl">{lv.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">{lv.label}</span>
                  <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily:'DM Sans, sans-serif', color: language.accent, fontWeight: 700 }}>{lv.sublabel}</span>
                </div>
                <p className="text-sm text-[color:var(--gris)] mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>{lv.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2b: TEST DE NIVEAU ─────────────────────────────────────────────────

function LevelTestScreen({ language, onLevelDetermined, onBack }) {
  const TEST_DURATION_S = 210; // 3 min 30 s
  const MAX_EXCHANGES = 10;

  const [messages, setMessages] = useState([]); // { role: 'assistant'|'user', text }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState(null); // { cefr, level, feedback_fr }
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const exchangesCount = messages.filter(m => m.role === 'user').length;
  const timeUp = elapsed >= TEST_DURATION_S;
  const enoughExchanges = exchangesCount >= MAX_EXCHANGES;
  const canFinish = exchangesCount >= 4; // au moins 4 échanges avant de pouvoir clore
  const shouldAutoFinish = (timeUp || enoughExchanges) && !assessment && !assessing;

  // Timer
  useEffect(() => {
    if (assessment) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [assessment]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Opening question
  useEffect(() => {
    (async () => {
      setLoading(true);
      const opening = `Start the level test. Ask a very simple opening question in ${language.nativeName} to greet the learner and get them talking. Only one short question (max 12 words). No preamble.`;
      try {
        const data = await chatWithFallback({
          system: buildTestSystem(language),
          messages: [{ role: 'user', content: opening }],
          maxTokens: 120,
          cache: true,
        });
        const text = data?.content?.[0]?.text?.trim() || `Hello! How are you today?`;
        setMessages([{ role: 'assistant', text }]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto trigger assessment when time up or enough exchanges
  useEffect(() => {
    if (shouldAutoFinish) finishTest();
  }, [shouldAutoFinish]);

  const send = async () => {
    if (!input.trim() || loading || assessing) return;
    const userMsg = { role: 'user', text: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const data = await chatWithFallback({
        system: buildTestSystem(language),
        messages: next.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        maxTokens: 150,
        cache: true,
      });
      const text = data?.content?.[0]?.text?.trim() || '...';
      setMessages(m => [...m, { role: 'assistant', text }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finishTest = async () => {
    if (assessing) return;
    setAssessing(true); setError(null);
    try {
      const transcript = messages.map(m =>
        `${m.role === 'assistant' ? 'Tuteur' : 'Apprenant'}: ${m.text}`
      ).join('\n');

      const nl = getUserNativeLangName();
      const systemAssess = `You are a certified CEFR language examiner assessing spoken/written ${language.name} proficiency.
Analyze ONLY the "Apprenant" (learner) turns in the transcript.
Return ONLY a JSON object, no code fence:
{
  "cefr": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "score": <integer 0-100>,
  "strengths_fr": "<1-2 short sentences in ${nl} about what the learner did well>",
  "weaknesses_fr": "<1-2 short sentences in ${nl} about weak points>",
  "advice_fr": "<1 short sentence in ${nl} with the recommended focus>"
}`;

      const data = await chatWithFallback({
        system: systemAssess,
        messages: [{ role: 'user', content: transcript }],
        maxTokens: 400,
      });
      const raw = data?.content?.[0]?.text || '{}';
      const cleaned = raw.replace(/```json\s*|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Map CEFR → LEVELS
      const cefr = parsed.cefr || 'A2';
      const lvl = ['A1','A2'].includes(cefr) ? LEVELS.beginner
        : ['B1','B2'].includes(cefr) ? LEVELS.intermediate
        : LEVELS.advanced;

      const result = { ...parsed, level: lvl };
      setAssessment(result);

      // Persist the test result to Supabase (fire-and-forget)
      saveLevelTestResult({
        language_code: language.code,
        language_name: language.name,
        cefr,
        score: parsed.score ?? null,
        level_id: lvl.id,
        strengths_fr: parsed.strengths_fr || '',
        weaknesses_fr: parsed.weaknesses_fr || '',
        advice_fr: parsed.advice_fr || '',
        transcript,
        exchanges: exchangesCount,
        duration_seconds: elapsed,
      }).catch(err => console.warn('Failed to save test result:', err));
    } catch (e) {
      setError(e.message);
      setAssessment({ cefr: 'A2', level: LEVELS.beginner, strengths_fr: '', weaknesses_fr: '', advice_fr: '' });
    } finally {
      setAssessing(false);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const progress = Math.min(100, (elapsed / TEST_DURATION_S) * 100);

  // === Écran de résultat ===
  if (assessment) {
    const cefrColor = { A1:'#78716C', A2:'#A78BFA', B1:'#FF385C', B2:'#E88865', C1:'#FCD34D', C2:'#22C55E' }[assessment.cefr] || 'var(--corail)';
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gris)' }}>
            évaluation terminée
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            Votre niveau en <em>{language.name}</em>
          </h1>

          <div className="mt-8 mx-auto rounded-full flex items-center justify-center relative"
               style={{
                 width: 180, height: 180,
                 background: `radial-gradient(circle at 30% 30%, ${cefrColor}, ${cefrColor}CC)`,
                 boxShadow: `0 12px 40px ${cefrColor}66`,
               }}>
            <div className="text-white text-center">
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-90" style={{ fontFamily:'DM Sans, sans-serif' }}>CECRL</div>
              <div className="text-6xl leading-none font-bold" style={{ fontFamily:'Fraunces, Georgia, serif' }}>{assessment.cefr}</div>
              <div className="text-xs mt-1 opacity-90" style={{ fontFamily:'DM Sans, sans-serif' }}>{assessment.score || '—'}/100</div>
            </div>
          </div>

          <div className="mt-6 inline-block px-6 py-2 rounded-full" style={{ background: `${cefrColor}22`, color: cefrColor }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily:'DM Sans, sans-serif' }}>
              → mode {assessment.level.label.toLowerCase()} ({assessment.level.sublabel})
            </span>
          </div>

          <div className="mt-6 wl-card p-5 text-left" style={{ borderRadius: '24px' }}>
            {assessment.strengths_fr && (
              <div className="mb-3">
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#22C55E' }}>✓ points forts</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.strengths_fr}</p>
              </div>
            )}
            {assessment.weaknesses_fr && (
              <div className="mb-3">
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--corail-2)' }}>→ à travailler</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.weaknesses_fr}</p>
              </div>
            )}
            {assessment.advice_fr && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--corail)' }}>💡 conseil</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.advice_fr}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => { setAssessment(null); setMessages([]); setElapsed(0); }}
              className="wl-chip px-6 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
              <RefreshCw size={14} /> refaire le test
            </button>
            <button onClick={() => onLevelDetermined(assessment.level)}
              className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
              Continuer avec le niveau {assessment.level.label.toLowerCase()} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Écran de test en cours ===
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
      {/* Header avec timer + progression */}
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(90,78,69,0.12)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              <span>test de niveau · {language.name}</span>
              <span style={{ color: elapsed > TEST_DURATION_S * 0.9 ? 'var(--corail)' : 'var(--gris)' }}>
                {mm}:{ss}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(90,78,69,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                   style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${language.accent}, ${language.accent}AA)` }} />
            </div>
          </div>
          {canFinish && !assessing && (
            <button onClick={finishTest}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'DM Sans', color: 'white', background: language.accent }}>
              terminer
            </button>
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">
          {messages.length === 0 && loading && (
            <div className="text-center py-10 text-[color:var(--gris)]" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              <Loader2 size={20} className="animate-spin inline mr-2" />
              Le tuteur prépare sa première question…
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 ${m.role === 'user' ? 'text-white' : ''}`}
                   style={{
                     borderRadius: m.role === 'user' ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
                     background: m.role === 'user'
                       ? `linear-gradient(135deg, ${language.accent}, ${language.accent}DD)`
                       : 'white',
                     border: m.role === 'user' ? 'none' : '1px solid rgba(90,78,69,0.12)',
                     fontFamily: 'Fraunces, Georgia, serif',
                     boxShadow: m.role === 'user' ? `0 3px 10px ${language.accent}44` : '0 2px 6px rgba(0,0,0,0.03)',
                   }}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-3xl flex items-center gap-2"
                   style={{ background: 'white', border: '1px solid rgba(90,78,69,0.12)' }}>
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {assessing && (
            <div className="text-center py-6" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              <Loader2 size={22} className="animate-spin inline mr-2" style={{ color: language.accent }} />
              Analyse de votre niveau…
            </div>
          )}

          {error && (
            <div className="wl-card px-4 py-3 text-sm text-center"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Zone de saisie */}
      {!assessing && (
        <div className="sticky bottom-0 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.9)', borderTop: '1px solid rgba(90,78,69,0.12)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={`Répondez en ${language.name.toLowerCase()}…`}
              disabled={loading}
              className="flex-1 bg-white px-5 py-3 rounded-full focus:outline-none disabled:opacity-60"
              style={{ fontFamily: 'DM Sans', border: '1px solid rgba(90,78,69,0.2)', fontSize: 15 }}
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-full grid place-items-center text-white transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
              style={{ background: `linear-gradient(135deg, ${language.accent}, ${language.accent}DD)`, boxShadow: `0 3px 10px ${language.accent}55` }}>
              <Send size={16} />
            </button>
          </div>
          <div className="text-center pb-2 text-[10px] uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            {exchangesCount} / {MAX_EXCHANGES} échanges
          </div>
        </div>
      )}
    </div>
  );
}

// Prompt système pour le testeur — progression naturelle de difficulté
function buildTestSystem(language) {
  const nl = getUserNativeLangName();
  return `You are a friendly, calm CEFR examiner assessing a learner's ${language.name} proficiency in a short natural conversation.

RULES:
- Speak ONLY in ${language.nativeName} (never in ${nl}).
- Keep every reply short: 1-2 sentences max, always ending with ONE simple question.
- Start VERY easy (A1: name, age, hobbies), then gradually raise difficulty every 2 exchanges: A2 (daily routine, past tense), B1 (opinions, plans, hypothesis), B2 (abstract topics, nuances), C1+ (idioms, cultural references, complex arguments).
- If the learner struggles, ease off; if they answer fluently, push harder.
- Never correct, never translate, never comment on their level.
- Never say "let's move on" or announce the difficulty. Just chat naturally.
- Avoid yes/no questions — use open questions that reveal grammar and vocabulary.
- Do NOT end the conversation on your own; the system does it after ~10 exchanges.`;
}

// ─── DEVICE CHOOSER ──────────────────────────────────────────────────────────

function DeviceChooserScreen({ onSaved, onSkip, currentDevice, forceShow = false }) {
  const [selected, setSelected] = useState(currentDevice || AUTO_PLATFORM);
  const detected = DEVICES.find(d => d.id === AUTO_PLATFORM);

  const save = () => {
    setUserDevice(selected);
    PLATFORM = selected;
    onSaved?.(selected);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        {onSkip && (
          <button onClick={onSkip}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 68, height: 68, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 32 }}>📱</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Sur quel <em style={{ color: 'var(--corail)' }}>appareil</em> ?
          </h1>
          <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            {forceShow
              ? "MonProf adapte le micro, les voix et les astuces à votre appareil."
              : "Confirmez ou changez votre appareil pour adapter l'expérience."}
          </p>
          {detected && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full"
                 style={{ background: `${detected.color}18`, color: detected.color, fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12 }}>
              <span>{detected.emoji}</span>
              <span>détecté : {detected.name}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {DEVICES.map(dev => {
            const isSelected = selected === dev.id;
            return (
              <button key={dev.id} onClick={() => setSelected(dev.id)}
                className="p-4 sm:p-5 text-center transition-all hover:-translate-y-1"
                style={{
                  borderRadius: '24px',
                  border: `2px solid ${isSelected ? dev.color : `${dev.color}33`}`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${dev.color}18, ${dev.color}08)`
                    : 'white',
                  boxShadow: isSelected
                    ? `0 8px 24px ${dev.color}55`
                    : `0 2px 8px ${dev.color}15`,
                }}>
                <div className="rounded-full mx-auto mb-3 flex items-center justify-center transition-transform"
                     style={{
                       width: 64, height: 64,
                       background: `radial-gradient(circle at 30% 30%, ${dev.color}30, ${dev.color}18)`,
                       transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                     }}>
                  <span style={{ fontSize: 32 }}>{dev.emoji}</span>
                </div>
                <div className="font-medium leading-tight"
                     style={{ fontFamily: 'Fraunces, Georgia, serif', color: isSelected ? dev.color : 'var(--ink)', fontSize: 16 }}>
                  {dev.name}
                </div>
                {isSelected && (
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                       style={{ fontFamily: 'DM Sans', color: dev.color }}>
                    <Check size={11} /> choisi
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Astuce contextuelle */}
        {selected && (() => {
          const dev = DEVICES.find(d => d.id === selected);
          if (!dev) return null;
          return (
            <div className="mt-5 p-4 sm:p-5 rounded-3xl"
                 style={{ background: `${dev.color}12`, border: `1px solid ${dev.color}33` }}>
              <div className="flex items-start gap-3">
                <div className="rounded-full flex items-center justify-center shrink-0"
                     style={{ width: 36, height: 36, background: dev.color, color: 'white', fontSize: 18 }}>
                  💡
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1"
                       style={{ fontFamily: 'DM Sans', color: dev.color }}>
                    astuce {dev.name}
                  </div>
                  <p className="text-[14px] leading-snug"
                     style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    {dev.tip}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        <button onClick={save}
          className="wl-btn-primary w-full mt-6 flex items-center justify-center gap-2">
          <Check size={16} /> {forceShow ? 'Continuer' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// Mini-écran : choix manuel du niveau (langue + niveau) depuis "Mon compte"
function ManualLevelPickerScreen({ onSaved, onBack }) {
  const [selectedLang, setSelectedLang] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);

  const saveLevel = async (level) => {
    if (!selectedLang) return;
    setSaving(true); setError(null);
    // Rough CEFR mapping from our 3 in-app levels
    const cefr = level.id === 'beginner' ? 'A2' : level.id === 'intermediate' ? 'B1' : 'C1';
    try {
      await saveLevelTestResult({
        language_code: selectedLang.code,
        language_name: selectedLang.name,
        cefr,
        score: null,
        level_id: level.id,
        strengths_fr: '',
        weaknesses_fr: '',
        advice_fr: 'Niveau choisi manuellement — un test permettra une évaluation plus précise.',
        transcript: '[Niveau choisi manuellement, sans test]',
        exchanges: 0,
        duration_seconds: 0,
      });
      setSavedFlash(true);
      setTimeout(() => onSaved?.(level), 900);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  // Étape 2 : choix du niveau une fois la langue choisie
  if (selectedLang) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setSelectedLang(null)}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3 px-4 py-2 rounded-full"
                 style={{ background: `${selectedLang.accent}18`, color: selectedLang.accent, fontFamily: 'DM Sans', fontWeight: 700 }}>
              <span style={{ fontSize: 18 }}>{selectedLang.glyph}</span>
              <span>{selectedLang.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl leading-none"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
              Choisir mon <em style={{ color: selectedLang.accent }}>niveau</em>
            </h1>
            <p className="mt-3 text-[14px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Soyez honnête — c'est mieux de commencer un peu en dessous et de progresser
            </p>
          </div>

          <div className="space-y-3">
            {Object.values(LEVELS).map(lv => (
              <button key={lv.id} onClick={() => saveLevel(lv)}
                disabled={saving}
                className="w-full text-left hover:-translate-y-0.5 transition-all p-4 sm:p-5 flex items-center gap-4 disabled:opacity-60"
                style={{
                  borderRadius: '9999px',
                  background: 'white',
                  border: `1.5px solid ${selectedLang.accent}44`,
                  boxShadow: `0 2px 8px ${selectedLang.accent}12`,
                }}>
                <div className="w-14 h-14 rounded-full grid place-items-center text-stone-50 shrink-0" style={{ backgroundColor: selectedLang.accent, fontFamily: 'Fraunces, Georgia, serif' }}>
                  <span className="text-2xl">{lv.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span style={{ fontFamily: 'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">{lv.label}</span>
                    <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'DM Sans, sans-serif', color: selectedLang.accent, fontWeight: 700 }}>{lv.sublabel}</span>
                  </div>
                  <p className="text-sm text-[color:var(--gris)] mt-1" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{lv.description}</p>
                </div>
              </button>
            ))}
          </div>

          {savedFlash && (
            <div className="mt-5 text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full"
                 style={{ background: '#DCFCE7', color: '#15803D', fontFamily: 'DM Sans', fontWeight: 700 }}>
              <Check size={16} /> niveau enregistré
            </div>
          )}
          {error && (
            <div className="mt-4 wl-card px-4 py-3 text-sm text-center"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Étape 1 : choix de la langue
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 28 }}>📝</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Choisir <em style={{ color: 'var(--corail)' }}>manuellement</em>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Quelle langue voulez-vous définir ?
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
          {Object.values(LANGUAGES).map(lang => (
            <button key={lang.code} onClick={() => setSelectedLang(lang)}
              className="group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{
                width: '132px', height: '132px',
                borderRadius: '50%',
                border: `1.5px solid ${lang.accent}55`,
                background: `radial-gradient(circle at 30% 30%, ${lang.accent}25, ${lang.accent}18)`,
                boxShadow: `0 3px 10px ${lang.accent}20`,
              }}>
              <span className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}DD)`,
                  boxShadow: `0 10px 28px ${lang.accent}66`,
                }} />
              <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
                <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">{lang.glyph}</span>
                <span className="text-[15px] sm:text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: lang.accent }}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mini-écran : choix de langue pour lancer un test depuis "Mon compte"
function LanguagePickForTest({ onSelect, onBack }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 28 }}>🎯</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Refaire un <em style={{ color: 'var(--corail)' }}>test</em>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Choisissez la langue à évaluer
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
          {Object.values(LANGUAGES).map(lang => (
            <button key={lang.code} onClick={() => onSelect(lang)}
              className="group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{
                width: '132px', height: '132px',
                borderRadius: '50%',
                border: `1.5px solid ${lang.accent}55`,
                background: `radial-gradient(circle at 30% 30%, ${lang.accent}25, ${lang.accent}18)`,
                boxShadow: `0 3px 10px ${lang.accent}20`,
              }}>
              <span className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}DD)`,
                  boxShadow: `0 10px 28px ${lang.accent}66`,
                }} />
              <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
                <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">{lang.glyph}</span>
                <span className="text-[15px] sm:text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: lang.accent }}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: AVATAR ───────────────────────────────────────────────────────────

function AvatarPicker({ language, level, onSelect, onBack }) {
  const [withHistory, setWithHistory] = useState(new Set());

  useEffect(() => {
    listAvatarsWithHistory(language, level).then(setWithHistory);
  }, [language.code, level.id]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={4} total={4} label="interlocuteur" onBack={onBack} />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          Avec <em>qui</em> ?
        </h1>
        <p className="mt-3 text-[color:var(--gris)] max-w-xl" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          {language.name} · {level.label.toLowerCase()} · choisissez l'accent et la personnalité qui vous parlent
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {language.avatars.map(av => {
            const hasHist = withHistory.has(av.id);
            return (
              <button key={av.id} onClick={() => onSelect(av)}
                className="relative text-left hover:-translate-y-1 transition-all p-4 sm:p-5 flex gap-4 items-center group"
                style={{
                  borderRadius: '9999px',
                  background: 'white',
                  border: `1.5px solid ${av.color}44`,
                  boxShadow: `0 3px 12px ${av.color}18`,
                }}>
                {/* Pastille ronde avec personnage animé */}
                <div className="relative shrink-0"
                     style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <AnimatedAvatar avatar={av} size="lg" />
                  </div>
                  {hasHist && (
                    <span
                      className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-white"
                      style={{ width: 22, height: 22, background: av.color, fontSize: 11, boxShadow: `0 2px 6px ${av.color}88` }}
                      title="conversation en cours">
                      📖
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }} className="text-xl sm:text-2xl font-medium leading-none truncate">{av.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest shrink-0" style={{ fontFamily:'DM Sans, sans-serif', color: av.color, fontWeight: 700 }}>{av.age} ans</span>
                  </div>
                  <div className="text-[11px] mt-1 truncate" style={{ fontFamily:'DM Sans, sans-serif', color: 'var(--gris)' }}>{av.location} · {av.role}</div>
                  <p className="mt-1.5 text-sm leading-snug line-clamp-2" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{av.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CORRECTIONS ──────────────────────────────────────────────────────────────

function CorrectionsPanel({ corrections, onReplay }) {
  if (!corrections || !corrections.length) return null;
  return (
    <div className="mt-2 rounded-2xl bg-amber-50/70 border border-amber-300/60 pl-3 pr-3 py-2.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-900" style={{ fontFamily:'DM Sans, sans-serif' }}>
          <BookOpen size={11} /> correction{corrections.length > 1 ? 's' : ''}
        </div>
        {onReplay && (
          <button onClick={onReplay}
            title="réécouter le prof lire la correction"
            className="w-7 h-7 rounded-full grid place-items-center hover:bg-amber-200/60 transition-colors">
            <Volume2 size={13} className="text-amber-900" />
          </button>
        )}
      </div>
      {corrections.map((c, i) => (
        <div key={i} className="text-sm" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="line-through text-[color:var(--gris)] italic">{c.original}</span>
            <span className="text-amber-800">→</span>
            <span className="font-medium text-[color:var(--ink)] italic">{c.corrected}</span>
          </div>
          {c.spoken_echo && (
            <div className="mt-1 flex items-start gap-1.5 text-[13px] italic" style={{ color: '#78350F' }}>
              <Volume2 size={11} className="mt-1 shrink-0" />
              <span>« {c.spoken_echo} »</span>
            </div>
          )}
          <div className="mt-1 text-[color:var(--ink)] text-[13px] leading-snug">{c.explanation_fr}</div>
        </div>
      ))}
    </div>
  );
}

// ─── CLICKABLE WORDS + EXPLAIN POPUP ─────────────────────────────────────────

// Attempts a request with a fast model first, then falls back to a reliable one.
// Wrap a string system prompt as an array of content blocks with cache_control.
// This enables Anthropic prompt caching: the system portion is billed at ~10%
// on cache hits (5-minute TTL by default), instead of full price.
function wrapSystemForCaching(system, cache) {
  if (!cache) return system;
  const text = typeof system === 'string' ? system : (Array.isArray(system) ? system.map(b => b.text || '').join('\n') : String(system));
  return [{ type: 'text', text, cache_control: { type: 'ephemeral' } }];
}

async function chatWithFallback({ system, messages, maxTokens = 500, cache = false }) {
  const models = [
    'claude-haiku-4-5',           // fastest
    'claude-3-5-haiku-latest',    // fast, widely available fallback
    'claude-sonnet-4-20250514',   // reliable last resort
  ];
  const sys = wrapSystemForCaching(system, cache);
  let lastError = null;
  for (const model of models) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: maxTokens, system: sys, messages }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      // 400 usually means "model not found" — try next
      if (response.status === 400 || response.status === 404) {
        lastError = new Error(`Model ${model} unavailable`);
        continue;
      }
      // Other errors (401, 429, 500) — stop and report
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('All models failed');
}

// A tiny incremental JSON parser: given a partial JSON string,
// extract as many top-level string fields as have arrived so far.
// Handles nested objects (like "example": {...}) up to one level.
function extractPartialFields(raw) {
  const out = {};
  if (!raw) return out;
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '');
  const s = cleaned.indexOf('{');
  if (s === -1) return out;
  const body = cleaned.slice(s + 1);

  // Match: "key": "value" (complete strings)
  const pairRe = /"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = pairRe.exec(body)) !== null) out[m[1]] = m[2].replace(/\\"/g, '"');

  // Match: "example": { "text": "...", "fr": "..." }
  const exRe = /"example"\s*:\s*\{([^}]*)\}/;
  const exMatch = body.match(exRe);
  if (exMatch) {
    const ex = {};
    const inner = exMatch[1];
    const innerRe = /"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    let mm;
    while ((mm = innerRe.exec(inner)) !== null) ex[mm[1]] = mm[2].replace(/\\"/g, '"');
    if (Object.keys(ex).length) out.example = ex;
  }
  return out;
}

// System prompt for word lookups — stable per language, so Anthropic can cache it.
function buildWordSystem(lang) {
  const nl = getUserNativeLangName();
  return `You are a language tutor helping a ${nl} speaker learn ${lang.nativeName} (${lang.name}).
The user will give you a word and the sentence it appears in. You produce:
- The ${nl} translation IN THAT CONTEXT (as short as possible — 1-4 words)
- A short ${nl} explanation (nature: noun/verb/adjective/etc, grammar note, nuance, or false friend warning)
- A short example sentence in ${lang.nativeName} using this word, with its ${nl} translation

Respond ONLY with a JSON object, no code fences. Emit fields IN THIS ORDER — translation first, then explanation, then example:
{
  "translation": "<${nl} translation of the word in this context>",
  "explanation": "<short ${nl} explanation, 1-2 sentences>",
  "example": {
    "text": "<short example sentence in ${lang.nativeName}>",
    "fr": "<${nl} translation of the example>"
  }
}`;
}

// Streaming word explanation — starts calling `onPartial` as soon as the
// translation arrives (usually <500ms), so the popup shows a first result fast.
async function explainWord(word, context, lang, { onPartial } = {}) {
  const normalized = word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '').trim();
  const cacheKey = `word:${lang.code}:${normalized}`;

  // 1) Local cache — instant, no network call
  try {
    const cached = storage.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.translation) {
        onPartial?.(parsed);
        return parsed;
      }
    }
  } catch { /* ignore */ }

  // 2) Streaming call — Haiku only (fastest, no fallback penalty on hot path)
  const cachedSystem = wrapSystemForCaching(buildWordSystem(lang), true);
  const payload = {
    model: 'claude-haiku-4-5',
    max_tokens: 250,
    system: cachedSystem,
    messages: [{ role: 'user', content: `Word: "${word}"\nSentence: "${context}"` }],
    stream: true,
  };

  let accumulated = '';
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      for (const evt of events) {
        for (const line of evt.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6);
          try {
            const evtData = JSON.parse(dataStr);
            if (evtData.type === 'content_block_delta' && evtData.delta?.text) {
              accumulated += evtData.delta.text;
              const partial = extractPartialFields(accumulated);
              if (partial.translation) onPartial?.(partial);
            }
          } catch { /* ignore parse errors on partial events */ }
        }
      }
    }
  } catch (e) {
    // Fallback: single non-streaming call
    const data = await chatWithFallback({
      system: buildWordSystem(lang),
      messages: [{ role: 'user', content: `Word: "${word}"\nSentence: "${context}"` }],
      maxTokens: 250,
      cache: true,
    });
    accumulated = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  }

  // Final parse
  const cleaned = accumulated.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
  const parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);

  // Cache the final result
  try { storage.set(cacheKey, JSON.stringify(parsed)); } catch { /* ignore */ }
  onPartial?.(parsed);
  return parsed;
}

// ─── LEXICON (mots enregistrés) ──────────────────────────────────────────────

async function saveToLexicon({ word, translation, explanation, example, lang, context }) {
  const normalized = word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '').trim();
  const record = {
    word: normalized,
    display_word: word.trim(),
    translation,
    explanation: explanation || '',
    example_text: example?.text || '',
    example_fr: example?.fr || '',
    language_code: lang.code,
    language_name: lang.name,
    context: context || '',
    saved_at: new Date().toISOString(),
  };

  // Local cache
  try {
    const key = 'lexicon';
    const raw = storage.get(key);
    const arr = raw ? JSON.parse(raw) : [];
    // De-dup: remove any existing entry for (word, language) and prepend the new one
    const filtered = arr.filter(e => !(e.word === normalized && e.language_code === lang.code));
    filtered.unshift(record);
    storage.set(key, JSON.stringify(filtered.slice(0, 500)));
  } catch (e) { /* ignore */ }

  // Supabase (fire-and-forget)
  if (!supabase) return;
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    // Upsert on (user_id, language_code, word) to keep only latest lookup
    await supabase.from('lexicon').upsert({
      user_id: userData.user.id,
      word: normalized,
      display_word: word.trim(),
      translation,
      explanation: explanation || null,
      example_text: example?.text || null,
      example_fr: example?.fr || null,
      language_code: lang.code,
      language_name: lang.name,
      context: context || null,
      saved_at: new Date().toISOString(),
    }, { onConflict: 'user_id,language_code,word' });
  } catch (e) { /* silent */ }
}

async function loadLexicon(userId, languageCode = null, limit = 200) {
  if (supabase && userId) {
    try {
      let q = supabase.from('lexicon').select('*').eq('user_id', userId);
      if (languageCode) q = q.eq('language_code', languageCode);
      const { data, error } = await q.order('saved_at', { ascending: false }).limit(limit);
      if (!error && data) return data;
    } catch (e) { /* fall through */ }
  }
  try {
    const raw = storage.get('lexicon');
    const arr = raw ? JSON.parse(raw) : [];
    return languageCode ? arr.filter(e => e.language_code === languageCode).slice(0, limit) : arr.slice(0, limit);
  } catch { return []; }
}

async function deleteLexiconEntry(entry, userId) {
  // Local
  try {
    const raw = storage.get('lexicon');
    if (raw) {
      const arr = JSON.parse(raw);
      const filtered = arr.filter(e => !(e.word === entry.word && e.language_code === entry.language_code));
      storage.set('lexicon', JSON.stringify(filtered));
    }
  } catch { /* ignore */ }
  // Supabase
  if (!supabase || !userId) return;
  try {
    await supabase.from('lexicon').delete()
      .eq('user_id', userId)
      .eq('language_code', entry.language_code)
      .eq('word', entry.word);
  } catch { /* silent */ }
}

function WordExplainPopup({ word, context, lang, onClose, onSpeak }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null); setError(null);
    explainWord(word, context, lang, {
      // Progressive: as soon as `translation` arrives, the popup shows it.
      onPartial: (partial) => { if (alive) setData(prev => ({ ...(prev || {}), ...partial })); },
    })
      .then(d => {
        if (!alive) return;
        setData(d);
        // Auto-save to lexicon in the background
        saveToLexicon({
          word,
          translation: d.translation,
          explanation: d.explanation,
          example: d.example,
          lang,
          context,
        }).then(() => {
          if (!alive) return;
          setSavedFlash(true);
          setTimeout(() => alive && setSavedFlash(false), 1800);
        }).catch(() => {});
      })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [word, context, lang.code]);

  return (
    <div className="fixed inset-0 z-50 bg-[color:rgba(43,36,34,0.55)] flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={onClose}>
      <div className="w-full sm:max-w-md wl-card max-h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
              mot · {lang.name.toLowerCase()}
            </div>
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-2xl font-medium leading-none mt-0.5 italic" dir={lang.rtl ? 'rtl' : 'ltr'}>
              {word}
            </div>
          </div>
          <button onClick={() => onSpeak(word)} className="w-9 h-9 grid place-items-center wl-btn-secondary" title="écouter">
            <Volume2 size={14} />
          </button>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {savedFlash && (
            <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                 style={{ fontFamily: 'DM Sans', background: '#DCFCE7', color: '#15803D' }}>
              <Check size={11} /> ajouté au lexique
            </div>
          )}
          {!data && !error && (
            <div className="flex items-center gap-2 text-[color:var(--gris)] text-sm" style={{ fontFamily:'DM Sans, sans-serif' }}>
              <Loader2 size={14} className="animate-spin" />
              <span>recherche…</span>
            </div>
          )}
          {data && !data.example && !error && (
            <div className="mt-3 text-[11px] uppercase tracking-widest text-[color:var(--gris)] flex items-center gap-1.5" style={{ fontFamily:'DM Sans, sans-serif' }}>
              <Loader2 size={10} className="animate-spin" />
              <span>chargement de l'exemple…</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-amber-800" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              Impossible de récupérer l'explication. Vérifiez votre connexion.
            </div>
          )}
          {data && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>traduction</div>
                <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl text-[color:var(--ink)] italic">
                  {data.translation}
                </div>
              </div>
              {data.explanation && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>explication</div>
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-stone-800 text-sm leading-relaxed">
                    {data.explanation}
                  </div>
                </div>
              )}
              {data.example && data.example.text && (
                <div className="border-l-4 border-amber-700 pl-3 py-1 bg-amber-50/60">
                  <div className="text-[10px] uppercase tracking-widest text-amber-900 mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>exemple</div>
                  <div className="flex items-start gap-2">
                    <button onClick={() => onSpeak(data.example.text)} className="mt-0.5 shrink-0 text-[color:var(--gris)] hover:text-[color:var(--ink)]" title="écouter">
                      <Volume2 size={12} />
                    </button>
                    <div className="flex-1">
                      <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)] italic" dir={lang.rtl ? 'rtl' : 'ltr'}>
                        « {data.example.text} »
                      </div>
                      <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--gris)] text-sm mt-1 italic">
                        {data.example.fr}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Splits text into clickable word tokens.
// Non-word characters (punctuation, spaces) are rendered as static spans.
function ClickableText({ text, onWordClick, rtl = false, boundary = null, activeText = null, highlightedWord = null }) {
  if (!text) return null;
  // Match word chunks (letters incl. accents & CJK) vs non-word chunks
  // Use split-with-capture so we keep both word and non-word chunks in order.
  const parts = text.split(/(\s+|[.,;:!?¿¡«»"'()\[\]{}—–…])/g);

  // Compute the char range currently being spoken (only when boundary matches this text)
  const speakingIsThis = boundary && activeText && boundary.text === activeText && activeText === text;
  const speakStart = speakingIsThis ? boundary.charIndex : -1;
  const speakEnd = speakingIsThis ? boundary.charIndex + (boundary.charLength || 0) : -1;

  // Normalize the "just clicked" word for comparison
  const clickedNorm = highlightedWord ? highlightedWord.toLowerCase().trim() : null;

  let cursor = 0; // running char index in the source text
  return (
    <span style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {parts.map((part, i) => {
        if (part === undefined || part === null) return null;
        const startIdx = cursor;
        cursor += part.length;
        if (!part) return null;
        const isWord = /[\p{L}]/u.test(part) && !/^\s+$/.test(part);
        if (!isWord) return <span key={i}>{part}</span>;

        const isBeingSpoken = speakingIsThis && startIdx >= speakStart && startIdx < speakEnd;
        const isClicked = clickedNorm && part.toLowerCase().trim() === clickedNorm;

        const cls = [
          'inline hover:bg-amber-200 hover:underline decoration-dotted underline-offset-2 rounded-sm transition-colors cursor-pointer',
          isBeingSpoken ? 'bg-amber-300/70 underline decoration-2 underline-offset-2' : '',
          isClicked ? 'bg-yellow-200 ring-2 ring-amber-400 rounded-md' : '',
        ].filter(Boolean).join(' ');

        return (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onWordClick(part.trim(), text); }}
            className={cls}
            style={{ padding: '0 1px', transition: 'background-color 120ms ease' }}
          >
            {part}
          </button>
        );
      })}
    </span>
  );
}

// ─── BUBBLES ──────────────────────────────────────────────────────────────────

function UserMessage({ message, rtl, onReplayCorrection }) {
  return (
    <div className="flex flex-col items-end mb-4">
      <div className="max-w-[85%]">
        <div className="wl-card px-4 py-2.5" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>vous</div>
          <div className="text-[color:var(--ink)] leading-relaxed" style={{ direction: rtl ? 'rtl' : 'ltr' }}>{message.content}</div>
        </div>
        <div className="mt-1">
          <CorrectionsPanel
            corrections={message.corrections}
            onReplay={message.corrections?.length ? () => onReplayCorrection?.(message.corrections) : null} />
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ message, avatar, lang, onSpeak, speaking, onWordClick, boundary, activeText, highlightedWord }) {
  const [showFr, setShowFr] = useState(false);
  return (
    <div className="flex gap-3 mb-4 items-start">
      <AnimatedAvatar avatar={avatar} size="sm" speaking={speaking} />
      <div className="max-w-[85%] flex-1">
        <div className="px-4 py-3 relative" style={{ backgroundColor: avatar.soft, borderLeft: `3px solid ${avatar.color}`, fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily:'DM Sans, sans-serif', color: avatar.color }}>{avatar.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={onSpeak} className="text-[color:var(--gris)] hover:text-[color:var(--ink)]" aria-label="écouter"><Volume2 size={14} /></button>
              <button onClick={() => setShowFr(s => !s)} className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] hover:text-[color:var(--ink)] px-1.5 border border-stone-400" style={{ fontFamily:'DM Sans, sans-serif' }}>fr</button>
            </div>
          </div>
          <div className="text-[color:var(--ink)] leading-relaxed">
            <ClickableText
              text={message.reply}
              onWordClick={onWordClick}
              rtl={lang.rtl}
              boundary={boundary}
              activeText={activeText}
              highlightedWord={highlightedWord}
            />
          </div>
          {showFr && message.translation && (
            <div className="mt-2 pt-2 border-t border-stone-400/40 text-sm text-[color:var(--ink)] italic">{message.translation}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }) {
  return (
    <div className="flex gap-3 mb-4 items-start">
      <AnimatedAvatar avatar={avatar} size="sm" />
      <div className="px-4 py-3" style={{ backgroundColor: avatar.soft, borderLeft: `3px solid ${avatar.color}` }}>
        <div className="flex gap-1.5 items-center">
          {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: avatar.color, animationDelay: `${d}ms` }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT INPUT ───────────────────────────────────────────────────────────────

function ChatInput({ onSend, disabled, avatar, lang, autoListen, avatarIsSpeaking }) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [micError, setMicError] = useState(null); // null | 'denied' | 'other'
  const [countdown, setCountdown] = useState(0); // seconds remaining before auto-send
  const { supported, listen, stop, abort } = useRecognition(lang.srLocale);
  const textareaRef = useRef(null);

  // Refs used inside setTimeout callbacks (which can't read latest state)
  const silenceTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const accumulatedRef = useRef('');
  const submittedRef = useRef(false);

  const SILENCE_MS = 3000; // Auto-send after 3 seconds of silence

  const clearTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    silenceTimerRef.current = null;
    countdownTimerRef.current = null;
  };

  const doSubmit = (value) => {
    if (submittedRef.current) return;
    const v = (value ?? '').trim();
    if (!v) return;
    submittedRef.current = true;
    clearTimers();
    setRecording(false);
    setInterim('');
    setCountdown(0);
    accumulatedRef.current = '';
    setText('');
    abort(); // hard stop the mic
    onSend(v);
  };

  const armSilenceTimer = () => {
    clearTimers();
    setCountdown(Math.ceil(SILENCE_MS / 1000));
    let remaining = SILENCE_MS;
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1000;
      setCountdown(Math.max(0, Math.ceil(remaining / 1000)));
    }, 1000);
    silenceTimerRef.current = setTimeout(() => {
      // Silence timer fired → send whatever we have
      doSubmit(accumulatedRef.current || text);
    }, SILENCE_MS);
  };

  // Remember what was already typed BEFORE recording started, so we can
  // prepend it to the recognized speech (avoids losing what the user typed).
  const priorTextRef = useRef('');

  const startListening = () => {
    if (!supported) { setMicError('other'); return; }
    if (recording || disabled) return;
    setMicError(null);
    setInterim('');
    setRecording(true);
    submittedRef.current = false;
    priorTextRef.current = text || '';
    accumulatedRef.current = priorTextRef.current;
    listen({
      onInterim: (t) => {
        setInterim(t);
        // Any speech → reset silence timer
        armSilenceTimer();
      },
      // On mobile (Android), each final callback carries the CUMULATIVE
      // full transcript, not a delta. So we REPLACE (never append) — this
      // fixes the "why why I why I am why I am leaving…" duplication bug.
      onFinal: (fullFinal) => {
        const prior = priorTextRef.current;
        accumulatedRef.current = prior
          ? (prior + ' ' + fullFinal).trim()
          : fullFinal;
        setText(accumulatedRef.current);
        setInterim('');
        armSilenceTimer();
      },
      onEnd: () => {
        setRecording(false);
        setInterim('');
        // If not yet submitted and we have something → send now
        if (!submittedRef.current && (accumulatedRef.current || '').trim()) {
          doSubmit(accumulatedRef.current);
        }
      },
      onError: (e) => {
        clearTimers();
        setRecording(false);
        setInterim('');
        setCountdown(0);
        if (e?.error === 'no-speech') return;
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
          setMicError('denied');
        } else if (e?.error !== 'aborted') {
          setMicError('other');
        }
      },
    });
  };

  const stopListening = () => {
    clearTimers();
    setCountdown(0);
    stop();
  };

  const submitFromButton = () => {
    const v = ((accumulatedRef.current || text) + ' ' + interim).trim();
    if (!v || disabled) return;
    doSubmit(v);
  };

  // Auto-listen: when enabled, start mic as soon as it's our turn and avatar isn't speaking
  useEffect(() => {
    if (!autoListen) return;
    if (disabled) return;
    if (avatarIsSpeaking) return;
    if (recording) return;
    if (micError === 'denied') return; // don't spam if user refused
    // Small delay so the avatar's voice fully ends
    const id = setTimeout(() => startListening(), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [autoListen, disabled, avatarIsSpeaking]);

  // Stop listening if avatar starts speaking
  useEffect(() => {
    if (avatarIsSpeaking && recording) stopListening();
    // eslint-disable-next-line
  }, [avatarIsSpeaking]);

  // Cleanup on unmount
  useEffect(() => () => { clearTimers(); abort(); }, []);

  useEffect(() => {
    if (!disabled && !recording && textareaRef.current) textareaRef.current.focus();
  }, [disabled, recording]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFromButton(); }
  };

  const displayText = recording && interim
    ? (text ? text + ' ' : '') + interim
    : text;

  return (
    <div className="border-t wl-card px-3 sm:px-5 py-2.5 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {micError === 'denied' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-700/30 px-2 py-1.5 text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
            ⚠ micro refusé · autorisez-le dans les paramètres du site
          </div>
        )}
        {micError === 'other' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-[color:var(--gris)] bg-stone-100 border border-stone-300 px-2 py-1.5 text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
            micro non disponible sur ce navigateur
          </div>
        )}

        {/* Recording status bar */}
        {recording && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 border" style={{ backgroundColor: avatar.soft, borderColor: avatar.color }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: avatar.color }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: avatar.color }}></span>
            </span>
            <span className="text-[11px] uppercase tracking-widest flex-1" style={{ fontFamily:'DM Sans, sans-serif', color: avatar.color }}>
              {countdown > 0
                ? `envoi dans ${countdown} s… continuez de parler pour attendre`
                : `à l'écoute · parlez en ${lang.name.toLowerCase()}`}
            </span>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={recording ? stopListening : startListening}
            disabled={disabled}
            className={`shrink-0 w-11 h-11 grid place-items-center transition-all ${
              recording
                ? 'text-stone-50 animate-pulse'
                : micError === 'denied' || micError === 'other'
                  ? 'bg-stone-400 text-stone-100'
                  : 'wl-btn-secondary disabled:opacity-30'
            }`}
            style={recording ? { backgroundColor: avatar.color } : {}}
            aria-label={recording ? 'arrêter le micro' : 'démarrer le micro'}
            title={recording ? 'arrêter' : 'démarrer le micro'}>
            {recording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <div className="flex-1 relative">
            <textarea ref={textareaRef} value={displayText}
              onChange={(e) => { setText(e.target.value); accumulatedRef.current = e.target.value; }}
              onKeyDown={handleKey} rows={1} disabled={disabled}
              placeholder={recording
                ? `parlez en ${lang.name.toLowerCase()}…`
                : autoListen
                  ? `parlez ou écrivez à ${avatar.name}…`
                  : `écrivez à ${avatar.name}…`}
              className="w-full resize-none wl-card px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700/40 disabled:opacity-50 text-base"
              style={{ fontFamily:'Fraunces, Georgia, serif', maxHeight:120, direction: lang.rtl ? 'rtl' : 'ltr' }} />
          </div>
          <button onClick={submitFromButton} disabled={disabled || !((text || interim).trim())}
            className="shrink-0 w-11 h-11 grid place-items-center text-stone-50 disabled:opacity-30 transition-all"
            style={{ backgroundColor: avatar.color }} aria-label="envoyer">
            {disabled ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VOICE PICKER ─────────────────────────────────────────────────────────────

function VoicePicker({ voices, lang, avatar, currentURI, onChoose, onClose, onPreview }) {
  const base = (lang.ttsLocale || 'en-US').split('-')[0];
  const filtered = voices
    .filter(v => v.lang.startsWith(base))
    .sort((a, b) => {
      // Quality score
      const score = (v) => {
        let s = 0;
        const n = v.name.toLowerCase();
        if (/natural|premium|enhanced|neural|wavenet|studio/.test(n)) s += 100;
        if (/google/.test(n)) s += 50;
        if (/microsoft/.test(n) && /online|natural/.test(n)) s += 40;
        return s;
      };
      return score(b) - score(a);
    });

  return (
    <div className="fixed inset-0 z-50 bg-[color:rgba(43,36,34,0.55)] flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={onClose}>
      <div className="w-full sm:max-w-lg wl-card max-h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
              voix pour · {avatar.name}
            </div>
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none mt-0.5">
              Choisir la voix
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)]">
                Aucune voix installée pour <em>{lang.name.toLowerCase()}</em> sur cet appareil.
              </div>
              <div className="mt-3 text-xs text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
                installez une voix dans les paramètres système<br/>
                (windows : paramètres › voix · android : synthèse vocale)
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => onChoose(null)}
                className={`w-full text-left px-4 py-3 border-b border-stone-300 hover:bg-white flex items-center gap-3 ${!currentURI ? 'bg-amber-50' : ''}`}
              >
                <div className="flex-1">
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="font-medium">Auto (recommandé)</div>
                  <div className="text-xs text-[color:var(--gris)] mt-0.5" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    l'appli choisit la meilleure voix disponible
                  </div>
                </div>
                {!currentURI && <span className="text-amber-700">✓</span>}
              </button>
              {filtered.map((v) => {
                const isNatural = /natural|premium|enhanced|neural|wavenet/i.test(v.name);
                const isGoogle = /google/i.test(v.name);
                const gender = guessVoiceGender(v.name);
                const isSelected = currentURI === v.voiceURI;
                return (
                  <div key={v.voiceURI} className={`px-4 py-3 border-b border-stone-200 flex items-center gap-2 ${isSelected ? 'bg-amber-50' : 'hover:bg-white'}`}>
                    <button onClick={() => onPreview(v.voiceURI)}
                      className="w-9 h-9 grid place-items-center wl-btn-secondary shrink-0"
                      title="écouter un extrait">
                      <Volume2 size={14} />
                    </button>
                    <button onClick={() => onChoose(v.voiceURI)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="font-medium truncate">
                          {v.name}
                        </span>
                        {gender === 'female' && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-rose-600 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            ♀ f
                          </span>
                        )}
                        {gender === 'male' && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-sky-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            ♂ h
                          </span>
                        )}
                        {isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            naturelle
                          </span>
                        )}
                        {isGoogle && !isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-stone-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            google
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[color:var(--gris)] mt-0.5" style={{ fontFamily:'DM Sans, sans-serif' }}>
                        {v.lang}{v.localService ? ' · local' : ' · en ligne'}
                      </div>
                    </button>
                    {isSelected && <span className="text-amber-700 shrink-0">✓</span>}
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="px-4 py-2 border-t border-stone-300 text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
          {filtered.length} voix trouvée{filtered.length > 1 ? 's' : ''} · touchez 🔊 pour écouter
        </div>
      </div>
    </div>
  );
}

// ─── EXERCISES SCREEN ─────────────────────────────────────────────────────────

// ─── LEXICON SCREEN ──────────────────────────────────────────────────────────

// ─── SCENARIOS SCREEN ─────────────────────────────────────────────────────────

function ScenariosScreen({ lang, level, onBack, onStartScenario }) {
  const [scope, setScope] = useState(level?.id || 'all'); // 'all' or a level id
  const [selected, setSelected] = useState(null);
  const [dialogueMode, setDialogueMode] = useState(false); // true = listen/read only, no interaction
  const [dialogue, setDialogue] = useState(null);          // { lines: [{speaker, text, fr}] }
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const [dialogueShowFr, setDialogueShowFr] = useState(false);
  const [perLineFr, setPerLineFr] = useState(() => new Set()); // indices of lines whose FR is revealed individually
  const [playingIdx, setPlayingIdx] = useState(null);
  const [playAllRunning, setPlayAllRunning] = useState(false);
  const playCancelRef = useRef(false);
  const { speak, stop: stopSpeak, speakingText } = useSpeech();

  // Génère UN nouveau dialogue via Claude, l'ajoute au pool, et le retourne.
  const generateFreshDialogue = async (scenario) => {
    const nl = getUserNativeLangName();
    // On ajoute un "hint" temporel dans le prompt utilisateur pour varier les
    // dialogues successifs sur le même scénario (utile pour la régénération).
    const pool = loadDialoguePool(lang, level, scenario);
    const variationHint = pool.length === 0
      ? 'Write the dialogue now.'
      : `Write ANOTHER version of this dialogue — different opening line, different specific details (dishes, prices, names, twists) so it feels like a fresh new take. Already generated: ${pool.length}.`;

    const system = `You write short, natural dialogue scripts for language learners.
Language: ${lang.nativeName} (${lang.name}).
${LEVEL_CONSTRAINTS[level.id] || level.prompt}
Scenario: "${scenario.title}" — ${scenario.description}
Characters: A) ${scenario.role}   B) ${scenario.userRole}

Write a complete, realistic dialogue between A and B of 8 to 12 turns total.
Match the level constraints STRICTLY. Keep each line short (1–2 sentences).
Also provide the ${nl} translation of each line.

Respond ONLY with a JSON object, no code fences:
{
  "lines": [
    { "speaker": "A" | "B", "text": "<line in ${lang.nativeName}>", "fr": "<${nl} translation>" }
  ]
}`;
    const data = await chatWithFallback({
      system,
      messages: [{ role: 'user', content: variationHint }],
      maxTokens: 1200,
      cache: true,
    });
    const raw = data?.content?.[0]?.text || '{}';
    const cleaned = raw.replace(/```json\s*|```/g, '').trim();
    const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
    const parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
    if (!parsed?.lines?.length) throw new Error('empty dialogue');
    saveDialogueToPool(lang, level, scenario, parsed);
    return parsed;
  };

  // Ouvre le dialogue : tire un dialogue au hasard dans le pool (aucun token
  // consommé), et n'appelle Claude que si le pool est vide.
  const openDialogue = async (scenario) => {
    setDialogueMode(true);
    setDialogueLoading(true);
    setDialogueShowFr(false);
    setPerLineFr(new Set());
    setDialogue(null);

    // 1) Pool en cache → tirage aléatoire, ZÉRO token
    const pool = loadDialoguePool(lang, level, scenario);
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setDialogue(pick);
      setDialogueLoading(false);
      return;
    }

    // 2) Pool vide → on génère le 1er dialogue et on le met en cache
    try {
      const fresh = await generateFreshDialogue(scenario);
      setDialogue(fresh);
    } catch (e) {
      setDialogue({ lines: [], error: e.message });
    } finally {
      setDialogueLoading(false);
    }
  };

  // Force la génération d'un NOUVEAU dialogue (consomme des tokens).
  // Ajoute au pool (max DIALOG_POOL_MAX, éviction du plus ancien).
  const regenerateDialogue = async () => {
    if (!selected) return;
    setDialogueLoading(true);
    setDialogueShowFr(false);
    setPerLineFr(new Set());
    setDialogue(null);
    try {
      const fresh = await generateFreshDialogue(selected);
      setDialogue(fresh);
    } catch (e) {
      setDialogue({ lines: [], error: e.message });
    } finally {
      setDialogueLoading(false);
    }
  };

  const closeDialogue = () => {
    stopSpeak();
    playCancelRef.current = true;
    setDialogueMode(false);
    setDialogue(null);
    setPlayingIdx(null);
    setPlayAllRunning(false);
    setPerLineFr(new Set());
  };

  const toggleLineFr = (i) => {
    setPerLineFr(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const playLine = (line, idx) => {
    stopSpeak();
    setPlayingIdx(idx);
    speak(line.text, null, lang);
    // Best-effort: clear playing indicator when speech ends (SpeechSynthesis)
    setTimeout(() => setPlayingIdx(cur => cur === idx ? null : cur), Math.min(15000, 800 + line.text.length * 80));
  };

  const playAll = async () => {
    if (!dialogue?.lines) return;
    playCancelRef.current = false;
    setPlayAllRunning(true);
    for (let i = 0; i < dialogue.lines.length; i++) {
      if (playCancelRef.current) break;
      setPlayingIdx(i);
      stopSpeak();
      await new Promise(res => {
        // Give a moment before speaking to let previous stop settle
        setTimeout(() => {
          if (playCancelRef.current) return res();
          const line = dialogue.lines[i];
          if (!('speechSynthesis' in window)) return res();
          const u = new SpeechSynthesisUtterance(line.text);
          u.lang = lang.ttsLocale || 'en-US';
          u.rate = 0.9;
          u.onend = () => res();
          u.onerror = () => res();
          window.speechSynthesis.speak(u);
        }, 250);
      });
    }
    setPlayingIdx(null);
    setPlayAllRunning(false);
  };
  const stopAll = () => {
    playCancelRef.current = true;
    stopSpeak();
    setPlayAllRunning(false);
    setPlayingIdx(null);
  };

  const scenarios = scope === 'all'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.level === scope);

  // Group by level for display when scope === 'all'
  const groups = scope === 'all'
    ? Object.values(LEVELS).map(lv => ({ lv, items: SCENARIOS.filter(s => s.level === lv.id) })).filter(g => g.items.length)
    : [{ lv: LEVELS[scope], items: scenarios }];

  // ─── Scenario detail view ─────────────────────────────────────
  // IMPORTANT: `dialogueMode` must be checked BEFORE `selected` (see below),
  // because entering the dialogue view does NOT clear `selected`.
  if (selected && !dialogueMode) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>

          {/* Cover */}
          <div className="flex items-start gap-4 mb-5">
            <div className="rounded-3xl flex items-center justify-center shrink-0"
                 style={{
                   width: 110, height: 130,
                   background: `linear-gradient(135deg, ${lang.accent}44, ${lang.accent}22)`,
                   border: `1.5px solid ${lang.accent}55`,
                   fontSize: 54,
                 }}>
              {selected.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                scénario · {lang.name}
              </div>
              <h1 className="text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                {selected.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ fontFamily: 'DM Sans', background: `${lang.accent}18`, color: lang.accent }}>
                  {LEVELS[selected.level].label}
                </span>
                <span className="text-[11px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  ⏱ ~{selected.duration} min · 📖 ~{selected.vocabCount} mots
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="wl-card p-4 sm:p-5 mb-4" style={{ borderRadius: '20px' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              À propos du scénario
            </div>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 15, lineHeight: 1.5 }}>
              {selected.description}
            </p>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl" style={{ background: `${lang.accent}12`, border: `1px solid ${lang.accent}33` }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Sans', color: lang.accent }}>
                le prof joue
              </div>
              <p className="text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                {selected.role}
              </p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(90,78,69,0.15)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                vous jouez
              </div>
              <p className="text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                {selected.userRole}
              </p>
            </div>
          </div>

          {/* Two entry points: interactive OR listen/read */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => openDialogue(selected)}
              className="text-left p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
              style={{
                background: 'white',
                border: `1.5px solid ${lang.accent}55`,
                boxShadow: `0 3px 12px ${lang.accent}18`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 20 }}>🎧</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: lang.accent }}>
                  écouter · lire
                </span>
              </div>
              <div className="leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                Le dialogue tout prêt
              </div>
              <div className="text-[12px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                Une scène complète à écouter ou à lire, sans interaction
              </div>
            </button>

            <button onClick={() => onStartScenario?.(selected)}
              className="text-left p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
              style={{
                background: `linear-gradient(135deg, ${lang.accent}, ${lang.accent}DD)`,
                border: 'none',
                boxShadow: `0 6px 20px ${lang.accent}55`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 20 }}>🎬</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90" style={{ fontFamily: 'DM Sans' }}>
                  jouer le scénario
                </span>
              </div>
              <div className="text-white leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 15, fontWeight: 500 }}>
                Jouer un rôle
              </div>
              <div className="text-[12px] mt-0.5 text-white/85" style={{ fontFamily: 'DM Sans' }}>
                Vous répondez au prof qui joue son personnage
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dialogue "listen / read" view ───────────────────────────
  if (dialogueMode) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={closeDialogue}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl flex items-center justify-center shrink-0"
                 style={{ width: 60, height: 60,
                          background: `linear-gradient(135deg, ${lang.accent}44, ${lang.accent}22)`,
                          border: `1.5px solid ${lang.accent}55`, fontSize: 30 }}>
              {selected?.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                dialogue · {lang.name}
              </div>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }} className="text-xl font-medium leading-tight truncate">
                {selected?.title}
              </h2>
            </div>
          </div>

          {/* Controls */}
          {!dialogueLoading && dialogue?.lines?.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button onClick={playAllRunning ? stopAll : playAll}
                className="px-4 py-2 rounded-full text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                style={{ fontFamily: 'DM Sans', background: lang.accent, boxShadow: `0 3px 10px ${lang.accent}55` }}>
                {playAllRunning ? (<><span>◼</span> arrêter</>) : (<><span>▶</span> tout écouter</>)}
              </button>
              <button onClick={() => setDialogueShowFr(v => !v)}
                className="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  fontFamily: 'DM Sans',
                  background: dialogueShowFr ? lang.accent : 'white',
                  color: dialogueShowFr ? 'white' : lang.accent,
                  border: `1.5px solid ${lang.accent}`,
                }}>
                {dialogueShowFr ? '✓ traduction' : 'afficher FR'}
              </button>
              <button onClick={regenerateDialogue} disabled={dialogueLoading}
                className="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-30 flex items-center gap-1.5 hover:-translate-y-0.5 transition-all"
                style={{
                  fontFamily: 'DM Sans',
                  background: 'white',
                  color: lang.accent,
                  border: `1.5px solid ${lang.accent}`,
                  boxShadow: `0 2px 8px ${lang.accent}22`,
                }}
                title="Génère un nouveau dialogue via l'IA (consomme des tokens)">
                <RefreshCw size={12} className={dialogueLoading ? 'animate-spin' : ''} /> autre dialogue
              </button>
            </div>
          )}
          {/* Compteur discret du pool + rappel qu'un nouveau tirage ne coûte rien */}
          {!dialogueLoading && dialogue?.lines?.length > 0 && selected && (() => {
            const poolSize = loadDialoguePool(lang, level, selected).length;
            if (poolSize <= 1) return null;
            return (
              <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-4"
                   style={{ fontFamily: 'DM Sans' }}>
                📚 {poolSize} dialogue{poolSize > 1 ? 's' : ''} en cache · un rafraîchissement de la page ou une nouvelle visite tirera un dialogue au hasard
              </div>
            );
          })()}

          {dialogueLoading && (
            <div className="text-center py-10" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
              <Loader2 size={22} className="animate-spin inline mr-2" style={{ color: lang.accent }} />
              Le prof écrit le dialogue…
            </div>
          )}

          {/* Dialogue lines */}
          {!dialogueLoading && dialogue?.lines?.length > 0 && (
            <div className="space-y-2">
              {dialogue.lines.map((line, i) => {
                const isA = line.speaker === 'A';
                const isPlaying = playingIdx === i;
                return (
                  <div key={i}
                       className="flex gap-3 items-start"
                       style={{ flexDirection: isA ? 'row' : 'row-reverse' }}>
                    <div className="rounded-full grid place-items-center shrink-0 text-white font-bold text-sm"
                         style={{
                           width: 32, height: 32,
                           background: isA ? lang.accent : '#78716C',
                           fontFamily: 'Fraunces, Georgia, serif',
                         }}>
                      {isA ? 'A' : 'B'}
                    </div>
                    <div className="max-w-[80%] rounded-2xl p-3 pr-2"
                         style={{
                           background: isA ? `${lang.accent}12` : '#F5F5F4',
                           border: isPlaying ? `2px solid ${lang.accent}` : `1px solid ${isA ? lang.accent + '33' : 'rgba(90,78,69,0.15)'}`,
                           boxShadow: isPlaying ? `0 0 0 4px ${lang.accent}22` : 'none',
                         }}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest mb-1"
                               style={{ fontFamily: 'DM Sans', color: isA ? lang.accent : 'var(--gris)' }}>
                            {isA ? (selected?.role || 'A') : (selected?.userRole || 'B')}
                          </div>
                          <div style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 15 }}
                               dir={lang.rtl ? 'rtl' : 'ltr'}>
                            {line.text}
                          </div>
                          {dialogueShowFr && line.fr && (
                            <div className="mt-1.5 text-[13px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
                              {line.fr}
                            </div>
                          )}
                        </div>
                        <button onClick={() => playLine(line, i)}
                          className="w-8 h-8 grid place-items-center rounded-full shrink-0 hover:bg-black/5"
                          title="écouter">
                          <Volume2 size={13} style={{ color: isA ? lang.accent : 'var(--gris)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Scenario list view ───────────────────────────────────────
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="flex items-start gap-3 mb-6">
          <div className="rounded-2xl flex items-center justify-center shrink-0"
               style={{ width: 60, height: 72, background: `linear-gradient(135deg, ${lang.accent}22, ${lang.accent}0F)`, border: `1.5px solid ${lang.accent}44` }}>
            <ScenarioIcon size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              {lang.name} · situations
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium leading-none tracking-tight" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
              <em>Scénarios</em> de conversation
            </h1>
            <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Situations réelles où le prof joue un rôle — restaurant, hôtel, entretien, etc.
            </p>
          </div>
        </div>

        {/* Filtres par niveau */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button onClick={() => setScope('all')}
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              fontFamily: 'DM Sans',
              background: scope === 'all' ? lang.accent : 'white',
              color: scope === 'all' ? 'white' : lang.accent,
              border: `1.5px solid ${lang.accent}${scope === 'all' ? '' : '55'}`,
            }}>
            tous les niveaux
          </button>
          {Object.values(LEVELS).map(lv => {
            const active = scope === lv.id;
            return (
              <button key={lv.id} onClick={() => setScope(lv.id)}
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  fontFamily: 'DM Sans',
                  background: active ? lang.accent : 'white',
                  color: active ? 'white' : 'var(--gris)',
                  border: `1.5px solid ${active ? lang.accent : 'rgba(90,78,69,0.2)'}`,
                }}>
                {lv.label}
              </button>
            );
          })}
        </div>

        {/* Grouped list */}
        {groups.map(g => (
          <div key={g.lv.id} className="mb-6">
            {scope === 'all' && (
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                {g.lv.label} · {g.lv.sublabel}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {g.items.map(s => (
                <button key={s.id} onClick={() => setSelected(s)}
                  className="text-left p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-all group"
                  style={{
                    borderRadius: '20px',
                    background: 'white',
                    border: `1px solid ${lang.accent}33`,
                    boxShadow: `0 2px 8px ${lang.accent}10`,
                  }}>
                  <div className="rounded-2xl flex items-center justify-center shrink-0"
                       style={{
                         width: 60, height: 68,
                         background: `linear-gradient(135deg, ${lang.accent}33, ${lang.accent}18)`,
                         fontSize: 32,
                       }}>
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }} className="text-base font-medium leading-tight">
                      {s.title}
                    </div>
                    <div className="text-[11px] mt-1" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                      ⏱ ~{s.duration} min · 📖 ~{s.vocabCount} mots
                    </div>
                    {/* Level bars indicator */}
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {['beginner','intermediate','advanced'].map((lvId, i) => {
                        const isActive = ['beginner','intermediate','advanced'].indexOf(s.level) >= i;
                        return (
                          <span key={lvId}
                            className="rounded-full"
                            style={{
                              width: 8, height: 8,
                              background: isActive ? lang.accent : `${lang.accent}22`,
                            }} />
                        );
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LexiconScreen({ lang, profile, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [scope, setScope] = useState('all'); // 'all' or a language code — default 'all' so an empty per-lang filter never hides all entries
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { speak } = useSpeech();

  const load = async () => {
    setLoading(true);
    const data = await loadLexicon(profile?.id, scope === 'all' ? null : scope, 300);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [profile?.id, scope]);

  const doDelete = async (entry) => {
    await deleteLexiconEntry(entry, profile?.id);
    setEntries(es => es.filter(e => !(e.word === entry.word && e.language_code === entry.language_code)));
    setConfirmDelete(null);
    setExpanded(null);
  };

  // Which languages appear in the lexicon
  const langsInLexicon = Array.from(new Set(entries.map(e => e.language_code)));
  const availableLangs = scope === 'all'
    ? langsInLexicon
    : Array.from(new Set([scope, ...langsInLexicon]));

  const filtered = filter
    ? entries.filter(e => {
        const q = filter.toLowerCase().trim();
        return e.display_word?.toLowerCase().includes(q)
          || e.word?.toLowerCase().includes(q)
          || e.translation?.toLowerCase().includes(q);
      })
    : entries;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FFE5D9, #FFF3E0)', boxShadow: '0 6px 18px rgba(255,56,92,0.18)', border: '2px solid rgba(255,56,92,0.25)' }}>
            <LexiconIcon size={42} />
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Mon <em style={{ color: 'var(--corail)' }}>lexique</em>
          </h1>
          <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Tous les mots dont vous avez demandé la traduction
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => setScope('all')}
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              fontFamily: 'DM Sans',
              background: scope === 'all' ? 'var(--corail)' : 'white',
              color: scope === 'all' ? 'white' : 'var(--gris)',
              border: `1.5px solid ${scope === 'all' ? 'var(--corail)' : 'rgba(90,78,69,0.2)'}`,
            }}>
            toutes ({entries.length && scope === 'all' ? entries.length : '·'})
          </button>
          {availableLangs.map(code => {
            const l = LANGUAGES[code];
            if (!l) return null;
            const isActive = scope === code;
            return (
              <button key={code} onClick={() => setScope(code)}
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                style={{
                  fontFamily: 'DM Sans',
                  background: isActive ? l.accent : 'white',
                  color: isActive ? 'white' : l.accent,
                  border: `1.5px solid ${l.accent}${isActive ? '' : '55'}`,
                }}>
                <span>{l.glyph}</span>
                <span>{l.name}</span>
              </button>
            );
          })}
        </div>

        {/* Recherche */}
        <div className="flex items-center gap-2 wl-card px-4 py-2.5 rounded-full mb-4">
          <span style={{ color: 'var(--gris)', fontSize: 15 }}>🔍</span>
          <input
            type="text"
            placeholder="rechercher un mot…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-[15px]"
            style={{ fontFamily: 'DM Sans', color: 'var(--ink)' }}
          />
          {filter && (
            <button onClick={() => setFilter('')} className="w-6 h-6 grid place-items-center rounded-full hover:bg-black/5">
              <X size={13} style={{ color: 'var(--gris)' }} />
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-10" style={{ color: 'var(--gris)' }}>
            <Loader2 size={20} className="animate-spin inline mr-2" />
            chargement du lexique…
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="wl-card p-8 text-center" style={{ borderRadius: '24px' }}>
            <div className="text-4xl mb-3">✨</div>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 15 }}>
              {entries.length === 0
                ? 'Aucun mot enregistré pour l\'instant. Cliquez sur les mots dans le reader ou dans le chat pour les ajouter automatiquement.'
                : 'Aucun mot ne correspond à votre recherche.'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            {filtered.length} mot{filtered.length > 1 ? 's' : ''}
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((entry, i) => {
            const l = LANGUAGES[entry.language_code];
            const accent = l?.accent || 'var(--corail)';
            const isOpen = expanded === i;
            return (
              <div key={`${entry.language_code}-${entry.word}-${i}`}
                   style={{ borderRadius: '18px', background: 'white', border: `1px solid ${accent}33`, boxShadow: `0 2px 6px ${accent}12` }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-black/5 rounded-[18px] transition-colors">
                  <div className="rounded-full flex items-center justify-center shrink-0 text-white shrink-0"
                       style={{ width: 40, height: 40, background: `radial-gradient(circle at 30% 30%, ${accent}, ${accent}CC)`, fontFamily: 'Fraunces, Georgia, serif', fontSize: 16 }}>
                    {l?.glyph || '·'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 18, fontWeight: 500, fontStyle: 'italic' }}>
                        {entry.display_word || entry.word}
                      </span>
                      <span style={{ color: 'var(--gris)', fontSize: 12 }}>→</span>
                      <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: accent, fontSize: 15, fontWeight: 500 }}>
                        {entry.translation}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                      {formatTestDate(entry.saved_at)}
                    </div>
                  </div>
                  <span className="shrink-0" style={{ color: 'var(--gris)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>→</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 space-y-2.5 text-[13px]"
                       style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    {entry.explanation && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent, fontFamily: 'DM Sans' }}>explication</span>
                        <p className="mt-0.5">{entry.explanation}</p>
                      </div>
                    )}
                    {entry.example_text && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: `${accent}12` }}>
                        <button onClick={() => speak(entry.example_text, null, l)}
                          className="mt-0.5 shrink-0" title="écouter">
                          <Volume2 size={14} style={{ color: accent }} />
                        </button>
                        <div className="flex-1">
                          <div className="italic">« {entry.example_text} »</div>
                          {entry.example_fr && (
                            <div className="text-[12px] mt-1 italic" style={{ color: 'var(--gris)' }}>
                              {entry.example_fr}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {entry.context && entry.context !== entry.example_text && (
                      <div className="text-[12px] italic" style={{ color: 'var(--gris)' }}>
                        vu dans : « {entry.context.length > 100 ? entry.context.slice(0, 100) + '…' : entry.context} »
                      </div>
                    )}
                    <div className="flex justify-end pt-1">
                      {confirmDelete === i ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]" style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)' }}>supprimer ?</span>
                          <button onClick={() => setConfirmDelete(null)}
                            className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full hover:opacity-70"
                            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                            annuler
                          </button>
                          <button onClick={() => doDelete(entry)}
                            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                            style={{ fontFamily: 'DM Sans', background: 'var(--corail)' }}>
                            supprimer
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(i)}
                          className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 hover:opacity-70"
                          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                          <X size={11} /> retirer
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExercisesScreen({ lang, level, onBack }) {
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedCats, setSelectedCats] = useState(null); // null = all top 3
  const [exercises, setExercises] = useState(null);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(null); // { correct, feedback_fr }
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // Speech recognition for optional voice input
  const [micRec, setMicRec] = useState(false);
  const [micInterim, setMicInterim] = useState('');
  const { supported: micSupported, listen: micListen, stop: micStop, abort: micAbort } = useRecognition(lang.srLocale);
  const priorAnsRef = useRef('');

  const startMic = () => {
    if (!micSupported || micRec) return;
    priorAnsRef.current = userAnswer || '';
    setMicRec(true); setMicInterim('');
    micListen({
      onInterim: (t) => setMicInterim(t),
      onFinal: (full) => {
        const prior = priorAnsRef.current;
        const merged = prior ? (prior + ' ' + full).trim() : full;
        setUserAnswer(merged);
        setMicInterim('');
      },
      onEnd: () => { setMicRec(false); setMicInterim(''); },
      onError: () => { setMicRec(false); setMicInterim(''); },
    });
  };
  const stopMic = () => { micStop(); setMicRec(false); setMicInterim(''); };

  useEffect(() => {
    let alive = true;
    (async () => {
      const e = await loadRecentErrors(lang, level, 30);
      if (!alive) return;
      setErrors(e);
      setSummary(summarizeErrors(e));
    })();
    return () => { alive = false; };
  }, [lang.code, level.id]);

  const generate = async (categories) => {
    setLoading(true); setError(null);
    setExercises(null); setCurrent(0); setUserAnswer(''); setShowResult(null); setScore(0); setDone(false);
    try {
      // Pick sample errors from chosen categories
      const cats = categories?.length ? categories : summary.slice(0, 3).map(s => s.category);
      const samples = errors
        .filter(e => cats.includes(e.category || 'other'))
        .slice(0, 10);

      const nl = getUserNativeLangName();
      const system = `You are a language teacher creating targeted grammar exercises for a ${nl} speaker learning ${lang.nativeName} (${lang.name}) at ${level.label} level.

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Their recent mistakes (JSON):
${JSON.stringify(samples, null, 2)}

Categories to work on: ${cats.map(c => CATEGORY_LABELS_FR[c] || c).join(', ')}

Generate exactly 5 short exercises that target these specific weaknesses. Mix 3 types:
- "fill_blank": one sentence with a ___ blank to fill (the answer is 1-4 words)
- "transform": a sentence to rewrite following an instruction (e.g. "Put in the past tense", "Correct the following sentence")
- "translate": a short ${nl} sentence to translate into ${lang.nativeName}

For each exercise, provide the model answer AND acceptable alternative answers.

Respond ONLY with a JSON array, no code fences:
[
  {
    "type": "fill_blank"|"transform"|"translate",
    "instruction_fr": "<short instruction in ${nl}>",
    "prompt": "<the sentence in ${lang.nativeName} with ___ for fill_blank, or the source sentence to transform, or the ${nl} sentence to translate>",
    "answer": "<the correct answer, plain text, in ${lang.nativeName}>",
    "alternatives": ["<other acceptable answers, if any>"],
    "hint_fr": "<one short hint in ${nl} to help if the user is stuck>",
    "category": "<same category taxonomy>"
  }
]

Each exercise must clearly target one of the given categories. Keep exercises short, appropriate to level, and pedagogically clear.`;

      const data = await chatWithFallback({
        system,
        messages: [{ role: 'user', content: `Generate the 5 exercises now, focused on: ${cats.join(', ')}.` }],
        maxTokens: 1500,
      });
      const raw = data?.content?.[0]?.text || '[]';
      const cleaned = raw.replace(/```json\s*|```/g, '').trim();
      const s = cleaned.indexOf('['), e = cleaned.lastIndexOf(']');
      const parsed = JSON.parse(s !== -1 ? cleaned.slice(s, e + 1) : cleaned);
      setExercises(parsed);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const check = async () => {
    if (!userAnswer.trim() || !exercises) return;
    if (micRec) { micAbort(); setMicRec(false); setMicInterim(''); }
    const ex = exercises[current];
    setChecking(true);
    try {
      // Local quick check first
      const normalize = (s) => s.toLowerCase().trim().replace(/[.,;!?"']/g, '').replace(/\s+/g, ' ');
      const acceptable = [ex.answer, ...(ex.alternatives || [])].map(normalize);
      const userNorm = normalize(userAnswer);
      let correct = acceptable.includes(userNorm);

      // If not an exact match, ask Claude to judge (tolerates paraphrases)
      let feedback_fr = '';
      if (!correct) {
        const judge = await chatWithFallback({
          system: `You judge whether a language learner's answer to a grammar exercise is correct.
Language being learned: ${lang.nativeName}.
Be lenient on minor typos but strict on grammar and vocabulary.
Respond ONLY with JSON: {"correct": <boolean>, "feedback_fr": "<one short French sentence explaining what's wrong or confirming, mention the correct form>"}`,
          messages: [{ role: 'user', content: `Exercise: ${ex.instruction_fr}\nPrompt: ${ex.prompt}\nExpected answer: ${ex.answer}\nAcceptable alternatives: ${(ex.alternatives || []).join(' | ')}\nStudent's answer: ${userAnswer}` }],
          maxTokens: 200,
        });
        const rawJ = judge?.content?.[0]?.text || '{}';
        const cleaned = rawJ.replace(/```json\s*|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        correct = !!parsed.correct;
        feedback_fr = parsed.feedback_fr || '';
      } else {
        feedback_fr = `✓ Bonne réponse !`;
      }

      setShowResult({ correct, feedback_fr });
      if (correct) setScore(s => s + 1);
    } catch (e) {
      // Fallback to lenient local judge
      const okLocal = userAnswer.trim().toLowerCase() === ex.answer.trim().toLowerCase();
      setShowResult({ correct: okLocal, feedback_fr: okLocal ? '✓ Bonne réponse !' : `La bonne réponse est : « ${ex.answer} »` });
      if (okLocal) setScore(s => s + 1);
    } finally {
      setChecking(false);
    }
  };

  const nextExercise = () => {
    if (current + 1 < exercises.length) {
      setCurrent(current + 1);
      setUserAnswer(''); setShowResult(null);
    } else {
      setDone(true);
      // Persist the completed session (fire-and-forget)
      const finalScore = score; // already up-to-date at this point
      const cats = [...new Set(exercises.map(e => e.category))];
      saveExerciseSession({ lang, level, categories: cats, exercises, score: finalScore })
        .catch(err => console.warn('Failed to save exercise session:', err));
    }
  };

  const accent = lang.accent;

  // ─── Écran d'accueil : choix des catégories ───────────────────────────────
  if (!exercises && !loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center rounded-full mb-3"
                 style={{ width: 76, height: 76, background: 'linear-gradient(135deg, #FFE5D9, #FFF3E0)', boxShadow: `0 6px 18px ${accent}33`, border: `2px solid ${accent}44` }}>
              <ExercisesIcon size={46} />
            </div>
            <h1 className="text-3xl sm:text-4xl leading-none mt-2"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
              Exercices <em style={{ color: accent }}>sur mesure</em>
            </h1>
            <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Générés à partir de vos dernières erreurs en {lang.name}
            </p>
          </div>

          {errors.length === 0 ? (
            <div className="wl-card p-8 text-center" style={{ borderRadius: '24px' }}>
              <div className="text-4xl mb-3">✨</div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 16 }}>
                Aucune erreur enregistrée pour l'instant.<br/>
                Discutez d'abord avec un prof pour identifier vos points faibles !
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--gris)' }}>
                vos points à travailler
              </div>
              <div className="space-y-2 mb-6">
                {summary.slice(0, 6).map((s, i) => {
                  const label = CATEGORY_LABELS_FR[s.category] || s.category;
                  const isTop = i === 0;
                  return (
                    <div key={s.category}
                         className="flex items-center gap-3 p-3.5"
                         style={{
                           borderRadius: '9999px',
                           background: 'white',
                           border: `1.5px solid ${isTop ? accent : 'rgba(90,78,69,0.15)'}`,
                           boxShadow: isTop ? `0 3px 10px ${accent}22` : 'none',
                         }}>
                      <div className="rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                           style={{ width: 36, height: 36, background: isTop ? accent : 'var(--gris)', fontFamily: 'Fraunces, Georgia, serif', fontSize: 14 }}>
                        {s.count}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 15, fontWeight: 500 }}>
                          {label}
                        </div>
                        <div className="text-[11px] truncate" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                          {s.count} erreur{s.count > 1 ? 's' : ''} détectée{s.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      {isTop && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white shrink-0"
                              style={{ background: accent, fontFamily: 'DM Sans' }}>
                          priorité
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={() => generate(null)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, boxShadow: `0 6px 20px ${accent}55`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                🎯 Générer 5 exercices ciblés
              </button>

              {summary.length > 3 && (
                <div className="mt-3 text-center text-[12px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  focus sur les 3 catégories prioritaires
                </div>
              )}
            </>
          )}

          {error && (
            <div className="wl-card px-4 py-3 mt-4 text-sm font-semibold text-center"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Chargement ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin inline mb-3" style={{ color: accent }} />
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 18 }}>
            Le prof prépare vos exercices…
          </p>
        </div>
      </div>
    );
  }

  // ─── Écran final ──────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / exercises.length) * 100);
    const compliment = pct === 100 ? 'Parfait !' : pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué' : pct >= 40 ? 'Continuez' : 'À retravailler';
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-3">{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            {compliment}
          </h1>
          <div className="mt-6 mx-auto rounded-full flex items-center justify-center relative"
               style={{ width: 160, height: 160, background: `radial-gradient(circle at 30% 30%, ${accent}, ${accent}CC)`, boxShadow: `0 12px 40px ${accent}66` }}>
            <div className="text-white">
              <div className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{score}/{exercises.length}</div>
              <div className="text-[13px] opacity-90 mt-1" style={{ fontFamily: 'DM Sans' }}>{pct}%</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => generate(null)}
              className="wl-chip px-6 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
              <RefreshCw size={14} /> nouvelle série
            </button>
            <button onClick={onBack}
              className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
              Retour au chat →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Écran d'exercice en cours ────────────────────────────────────────────
  const ex = exercises[current];
  const typeLabel = { fill_blank: 'Complétez', transform: 'Transformez', translate: 'Traduisez' }[ex.type] || 'Exercice';

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        {/* Progression */}
        <div className="flex items-center gap-2 mb-6">
          {exercises.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-colors"
                 style={{ background: i < current ? accent : (i === current ? `${accent}88` : 'rgba(90,78,69,0.15)') }} />
          ))}
        </div>

        <div className="wl-card p-5 sm:p-6" style={{ borderRadius: '24px', border: `1.5px solid ${accent}33` }}>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3"
               style={{ fontFamily: 'DM Sans', color: accent }}>
            <span className="rounded-full px-2.5 py-1" style={{ background: `${accent}18` }}>
              exercice {current + 1} / {exercises.length}
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: `${accent}18` }}>
              {typeLabel}
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(90,78,69,0.1)', color: 'var(--gris)' }}>
              {CATEGORY_LABELS_FR[ex.category] || ex.category}
            </span>
          </div>

          <p className="text-[15px] italic mb-3" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
            {ex.instruction_fr}
          </p>

          <div className="text-[20px] sm:text-[22px] leading-relaxed mb-4 py-3 px-1"
               style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
            « {ex.prompt} »
          </div>

          {!showResult && (
            <>
              <div className="relative">
                <textarea
                  value={userAnswer + (micInterim ? (userAnswer ? ' ' : '') + micInterim : '')}
                  onChange={(e) => { if (!micRec) setUserAnswer(e.target.value); }}
                  placeholder={`écrivez ou parlez votre réponse en ${lang.name.toLowerCase()}…`}
                  rows={2}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } }}
                  className="w-full pl-4 pr-14 py-3 focus:outline-none resize-none"
                  style={{
                    fontFamily: 'DM Sans', fontSize: 16,
                    border: `1.5px solid ${micRec ? accent : 'rgba(90,78,69,0.2)'}`,
                    borderRadius: '18px',
                    background: 'white',
                    color: micInterim ? 'var(--gris)' : 'var(--ink)',
                  }}
                />
                {micSupported && (
                  <button
                    type="button"
                    onClick={micRec ? stopMic : startMic}
                    disabled={checking}
                    className="absolute bottom-3 right-3 w-10 h-10 grid place-items-center rounded-full transition-all"
                    style={{
                      background: micRec ? accent : 'white',
                      color: micRec ? 'white' : accent,
                      border: `1.5px solid ${accent}`,
                      boxShadow: micRec ? `0 0 0 4px ${accent}33` : 'none',
                      animation: micRec ? 'avatar-ping 1.4s infinite' : 'none',
                    }}
                    title={micRec ? 'arrêter le micro' : 'répondre à la voix'}>
                    {micRec ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
              </div>
              {micRec && (
                <div className="mt-2 text-[11px] uppercase tracking-widest text-center"
                     style={{ fontFamily: 'DM Sans', color: accent }}>
                  🎙 écoute en cours — parlez maintenant
                </div>
              )}

              {ex.hint_fr && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider hover:opacity-70"
                           style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                    💡 indice
                  </summary>
                  <div className="mt-2 p-3 rounded-2xl text-[13px]"
                       style={{ fontFamily: 'Fraunces, Georgia, serif', background: `${accent}12`, color: 'var(--ink)' }}>
                    {ex.hint_fr}
                  </div>
                </details>
              )}

              <button onClick={check} disabled={checking || !userAnswer.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                {checking && <Loader2 size={16} className="animate-spin" />}
                {checking ? 'vérification…' : 'Valider'}
              </button>
            </>
          )}

          {showResult && (
            <div className="mt-2">
              <div className="p-4 rounded-2xl"
                   style={{
                     background: showResult.correct ? '#DCFCE7' : '#FEE2E2',
                     border: `1px solid ${showResult.correct ? '#86EFAC' : '#FCA5A5'}`,
                   }}>
                <div className="flex items-center gap-2 text-sm font-bold mb-2"
                     style={{ fontFamily: 'DM Sans', color: showResult.correct ? '#15803D' : '#B91C1C' }}>
                  {showResult.correct ? (<><Check size={16} /> Bravo !</>) : (<><X size={16} /> Pas tout à fait</>)}
                </div>
                <div className="text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                  {showResult.feedback_fr}
                </div>
                {!showResult.correct && (
                  <div className="mt-2 text-[14px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    Réponse attendue&nbsp;: <strong>« {ex.answer} »</strong>
                  </div>
                )}
              </div>

              <button onClick={nextExercise}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                {current + 1 < exercises.length ? 'Exercice suivant →' : 'Voir le résultat 🏁'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-[13px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Score : <strong style={{ color: accent }}>{score}</strong> / {current + (showResult ? 1 : 0)}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ──────────────────────────────────────────────────────────────

function ChatScreen({ lang, level, avatar, onChangeAvatar, onBackHome, onOpenExercises, onOpenLexicon, profile, scenario }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [autoListen, setAutoListen] = useState(() => {
    // Default: auto-listen ON, but respect user's saved preference
    const saved = storage.get('pref:autoListen');
    return saved === null ? true : saved === 'true';
  });
  const [resumedFrom, setResumedFrom] = useState(null);
  const [voiceURI, setVoiceURI] = useState(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [wordPopup, setWordPopup] = useState(null);
  const [showVocab, setShowVocab] = useState(false);
  const [vocabItems, setVocabItems] = useState([]);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [vocabRevealed, setVocabRevealed] = useState({}); // { idx: true } — words whose FR is revealed
  const [vocabShowAllFr, setVocabShowAllFr] = useState(false);
  const { speak, speakSequence, stop, speakingText, speakingBoundary, voices } = useSpeech();
  const endRef = useRef(null);
  const initDone = useRef(false);

  // Load the scenario vocabulary once we enter a scenario (cache-first, 0-token on replay).
  useEffect(() => {
    if (!scenario) { setVocabItems([]); return; }
    setVocabLoading(true);
    setVocabRevealed({});
    setVocabShowAllFr(false);
    generateScenarioVocab(lang, scenario).then(list => {
      setVocabItems(list || []);
      setVocabLoading(false);
    });
  }, [scenario?.id, lang.code]);

  // Persist autoListen pref
  useEffect(() => {
    storage.set('pref:autoListen', String(autoListen));
  }, [autoListen]);

  // Load voice preference for this avatar
  useEffect(() => {
    loadVoicePref(avatar).then(setVoiceURI);
  }, [avatar.id]);

  const speakFor = (text) => speak(text, avatar, lang, voiceURI);

  // Speak the reply, then (if corrections) the tutor's echo of the correct form.
  const speakReplyWithCorrections = (reply, corrections) => {
    const items = [];
    if (reply) items.push({ text: reply });
    if (corrections && corrections.length) {
      corrections.forEach(c => {
        const echo = c.spoken_echo || c.corrected;
        if (echo) items.push({ text: echo, pauseBefore: 700, rate: (avatar?.rate ?? 0.9) - 0.05 });
      });
    }
    if (items.length > 1) speakSequence(items, avatar, lang, voiceURI);
    else if (items.length === 1) speakFor(items[0].text);
  };

  useEffect(() => {
    initDone.current = false;
    setResumedFrom(null);
    (async () => {
      // Scenario mode: try to resume an in-progress role-play; else use a
      // cached opening line if we have one; else generate & cache.
      if (scenario) {
        const savedScen = await loadScenarioConversation(lang, level, avatar, scenario);
        if (savedScen && savedScen.length > 0) {
          setMessages(savedScen);
          if (autoSpeak) {
            const lastAssistant = [...savedScen].reverse().find(m => m.role === 'assistant');
            if (lastAssistant?.reply) setTimeout(() => speakFor(lastAssistant.reply), 700);
          }
          initDone.current = true;
          return;
        }

        // No saved conversation — try cached opening line (saves tokens on replay)
        const cachedOpening = loadScenarioOpening(lang, level, avatar, scenario);
        if (cachedOpening) {
          setMessages([{ role: 'assistant', reply: cachedOpening.reply, translation: cachedOpening.fr_translation || '', corrections: [] }]);
          setTimeout(() => speakFor(cachedOpening.reply), 500);
          initDone.current = true;
          return;
        }

        // First run for this (lang+level+avatar+scenario) — generate + cache
        setMessages([]);
        setLoading(true);
        try {
          const data = await chatWithFallback({
            system: buildScenarioSystemPrompt(lang, level, avatar, scenario),
            messages: [{ role: 'user', content: `Please open the scenario now with your first line as ${scenario.role}. Do not greet the learner as a teacher — jump straight into the role.` }],
            maxTokens: 300,
            cache: true,
          });
          const raw = data?.content?.[0]?.text || '';
          const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
          const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
          const parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
          setMessages([{ role: 'assistant', reply: parsed.reply || '(no reply)', translation: parsed.fr_translation || '', corrections: [] }]);
          saveScenarioOpening(lang, level, avatar, scenario, {
            reply: parsed.reply,
            fr_translation: parsed.fr_translation || '',
          });
          setTimeout(() => speakFor(parsed.reply), 500);
        } catch (err) {
          setMessages([{ role: 'assistant', reply: '…', translation: 'Désolé, problème pour lancer le scénario.', corrections: [] }]);
        } finally {
          setLoading(false);
        }
        initDone.current = true;
        return;
      }

      const saved = await loadConversation(lang, level, avatar);
      if (saved && saved.length > 0) {
        setMessages(saved);
        const stats = await loadStats(lang, level, avatar);
        setResumedFrom(stats?.lastVisit || null);
        // Re-read the last teacher phrase aloud, so the user picks up the
        // conversation exactly where they left it — audio, not just text.
        if (autoSpeak) {
          const lastAssistant = [...saved].reverse().find(m => m.role === 'assistant');
          if (lastAssistant?.reply) {
            setTimeout(() => speakFor(lastAssistant.reply), 700);
          }
        }
      } else {
        const g = avatar.greetings[Math.floor(Math.random() * avatar.greetings.length)];
        setMessages([{ role:'assistant', reply: g.t, translation: g.fr, corrections: [] }]);
        setTimeout(() => speakFor(g.t), 600);
      }
      initDone.current = true;
    })();
    return () => stop();
    // eslint-disable-next-line
  }, [avatar.id, lang.code, level.id, scenario?.id]);

  // Auto-save on every message change (after initial load).
  // Normal chat → saves to the main conversation + META (drives "reprendre").
  // Scenario mode → saves to a scenario-scoped key (does NOT touch META, so
  // the home screen still shows the last real conversation, not a scenario).
  useEffect(() => {
    if (!initDone.current) return;
    if (messages.length < 1) return;
    if (scenario) {
      saveScenarioConversation(lang, level, avatar, scenario, messages, profile?.id);
      return;
    }
    saveConversation(lang, level, avatar, messages, profile?.id);
  }, [messages, lang.code, level.id, avatar.id, profile?.id, scenario?.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = { role:'user', content: text, corrections: [] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Optimization: sliding window on history. Anything beyond the last 15
      // exchanges (30 messages) is dropped. The greeting stays as message 0
      // for continuity.
      let trimmed = newMessages;
      if (newMessages.length > 32) {
        trimmed = [newMessages[0], ...newMessages.slice(-30)];
      }
      const apiMessages = trimmed.map(m => m.role === 'user' ? { role:'user', content: m.content } : { role:'assistant', content: m.reply });
      // Uses chatWithFallback: Haiku first (fast + cheap), Sonnet only if Haiku unavailable.
      // Prompt caching is enabled: the system prompt (avatar + level + rules)
      // is stable across turns, so it hits the Anthropic cache (~10% billing).
      const data = await chatWithFallback({
        system: scenario
          ? buildScenarioSystemPrompt(lang, level, avatar, scenario)
          : buildSystemPrompt(lang, level, avatar),
        messages: apiMessages,
        maxTokens: 1000,
        cache: true,
      });
      const textOut = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      let parsed;
      try {
        const cleaned = textOut.replace(/```json\s*/gi,'').replace(/```/g,'').trim();
        const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
        parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e+1) : cleaned);
      } catch (e) {
        parsed = { reply: textOut, fr_translation:'', corrections: [] };
      }
      setMessages(prev => {
        const upd = [...prev];
        const lastU = upd.map(m => m.role).lastIndexOf('user');
        if (lastU !== -1) upd[lastU] = { ...upd[lastU], corrections: parsed.corrections || [] };
        return [...upd, { role:'assistant', reply: parsed.reply || '(no reply)', translation: parsed.fr_translation || '', corrections: [] }];
      });
      // Log errors for the grammar-exercises generator
      (parsed.corrections || []).forEach(c => logError(lang, level, c));
      if (autoSpeak && parsed.reply) speakReplyWithCorrections(parsed.reply, parsed.corrections || []);
    } catch (err) {
      setMessages(prev => [...prev, { role:'assistant', reply:'…', translation:"Désolé, problème de connexion.", corrections: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const restartChat = async () => {
    if (messages.length > 1) {
      if (!window.confirm("Effacer cette conversation et recommencer à zéro ?")) return;
    }
    stop();

    if (scenario) {
      // Reset the scenario: clear the saved conversation AND the cached opening,
      // then re-fetch a fresh opening line.
      await clearScenarioConversation(lang, level, avatar, scenario);
      clearScenarioOpening(lang, level, avatar, scenario);
      setResumedFrom(null);
      setMessages([]);
      // Trigger the same initial-load path by bumping initDone
      initDone.current = false;
      setLoading(true);
      try {
        const data = await chatWithFallback({
          system: buildScenarioSystemPrompt(lang, level, avatar, scenario),
          messages: [{ role: 'user', content: `Please open the scenario now with your first line as ${scenario.role}. Do not greet the learner as a teacher — jump straight into the role.` }],
          maxTokens: 300,
          cache: true,
        });
        const raw = data?.content?.[0]?.text || '';
        const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
        const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
        const parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
        setMessages([{ role: 'assistant', reply: parsed.reply || '(no reply)', translation: parsed.fr_translation || '', corrections: [] }]);
        saveScenarioOpening(lang, level, avatar, scenario, {
          reply: parsed.reply,
          fr_translation: parsed.fr_translation || '',
        });
        setTimeout(() => speakFor(parsed.reply), 400);
      } finally {
        setLoading(false);
        initDone.current = true;
      }
      return;
    }

    await clearConversation(lang, level, avatar);
    setResumedFrom(null);
    const g = avatar.greetings[Math.floor(Math.random() * avatar.greetings.length)];
    setMessages([{ role:'assistant', reply: g.t, translation: g.fr, corrections: [] }]);
    setTimeout(() => speakFor(g.t), 400);
  };

  const handleChooseVoice = async (uri) => {
    setVoiceURI(uri);
    await saveVoicePref(avatar, uri);
    setShowVoicePicker(false);
  };
  const handlePreviewVoice = (uri) => {
    const sample = avatar.greetings[0].t;
    speak(sample, avatar, lang, uri);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:'transparent' }}>
      <div className="border-b wl-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={onBackHome || onChangeAvatar} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors" title="retour à l'accueil">
            <ArrowLeft size={16} />
          </button>
          <AnimatedAvatar avatar={avatar} size="sm" speaking={!!speakingText} />
          <button onClick={onChangeAvatar} className="flex-1 min-w-0 text-left hover:opacity-70 transition-opacity" title="changer de prof">
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none flex items-center gap-1.5">
              {avatar.name}
              {!scenario && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest"
                      style={{ fontFamily: 'DM Sans', background: `${lang.accent}18`, color: lang.accent }}>
                  changer
                </span>
              )}
              {scenario && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1"
                      style={{ fontFamily: 'DM Sans', background: `${lang.accent}`, color: 'white' }}>
                  <ScenarioIcon size={12} /> {scenario.title}
                </span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mt-0.5 truncate" style={{ fontFamily:'DM Sans, sans-serif' }}>
              {scenario
                ? <>joue : {scenario.role}</>
                : <>{lang.name} · {level.label.toLowerCase()} · {avatar.location}</>}
            </div>
          </button>
          <button onClick={() => setShowVoicePicker(true)} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)] relative" title="choisir la voix">
            <span className="text-[10px] font-bold" style={{ fontFamily:'DM Sans, sans-serif' }}>A♪</span>
            {voiceURI && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-700 rounded-full" />}
          </button>
          <button onClick={() => setAutoListen(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoListen ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`} title={autoListen ? "conversation mains-libres activée" : "conversation mains-libres désactivée"}>
            <Mic size={14} />
          </button>
          <button onClick={() => setAutoSpeak(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoSpeak ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`} title="lecture auto">
            <Volume2 size={14} />
          </button>
          {scenario && (
            <button onClick={() => setShowVocab(v => !v)}
              className="w-9 h-9 grid place-items-center rounded-full border transition-colors relative"
              style={{
                borderColor: showVocab ? lang.accent : `${lang.accent}55`,
                background: showVocab ? lang.accent : `${lang.accent}15`,
                color: showVocab ? 'white' : lang.accent,
              }}
              title="vocabulaire du scénario">
              <span style={{ fontSize: 15 }}>📖</span>
            </button>
          )}
          {onOpenLexicon && (
            <button onClick={onOpenLexicon}
              className="w-9 h-9 grid place-items-center rounded-full border transition-colors relative"
              style={{ borderColor: `${lang.accent}55`, background: `${lang.accent}15` }}
              title="mon lexique — mots enregistrés">
              <LexiconIcon size={20} />
            </button>
          )}
          {onOpenExercises && (
            <button onClick={onOpenExercises}
              className="w-9 h-9 grid place-items-center rounded-full border transition-colors relative"
              style={{ borderColor: `${lang.accent}55`, background: `${lang.accent}15` }}
              title="générer des exercices ciblés sur vos erreurs">
              <ExercisesIcon size={22} />
            </button>
          )}
          <button onClick={restartChat} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]" title="nouvelle conversation">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">
          {resumedFrom && (
            <div className="rounded-2xl pl-3 pr-3 py-2 mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest"
                 style={{ fontFamily:'DM Sans, sans-serif', background: `${avatar.color}18`, color: avatar.color, border: `1px solid ${avatar.color}33` }}>
              <span>📖</span>
              <span>reprise · dernière visite {timeSince(resumedFrom)}</span>
              {autoSpeak && (
                <span className="flex items-center gap-1 ml-auto" style={{ opacity: 0.85 }}>
                  <Volume2 size={11} /> dernière phrase relue
                </span>
              )}
            </div>
          )}
          {messages.map((m, i) => m.role === 'user'
            ? <UserMessage key={i} message={m} rtl={lang.rtl}
                onReplayCorrection={(corrs) => {
                  const items = corrs.map(c => ({ text: c.spoken_echo || c.corrected })).filter(x => x.text);
                  if (items.length) speakSequence(items, avatar, lang, voiceURI);
                }} />
            : <AssistantMessage key={i} message={m} avatar={avatar} lang={lang}
                onSpeak={() => speakFor(m.reply)}
                speaking={speakingText === m.reply}
                onWordClick={(w, ctx) => setWordPopup({ word: w, context: ctx })}
                boundary={speakingBoundary}
                activeText={speakingText}
                highlightedWord={wordPopup?.word || null} />
          )}
          {loading && <TypingIndicator avatar={avatar} />}
          <div ref={endRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} avatar={avatar} lang={lang}
        autoListen={autoListen} avatarIsSpeaking={!!speakingText} />

      {showVoicePicker && (
        <VoicePicker voices={voices} lang={lang} avatar={avatar} currentURI={voiceURI}
          onChoose={handleChooseVoice} onPreview={handlePreviewVoice}
          onClose={() => setShowVoicePicker(false)} />
      )}
      {wordPopup && (
        <WordExplainPopup word={wordPopup.word} context={wordPopup.context} lang={lang}
          onClose={() => setWordPopup(null)}
          onSpeak={(t) => speakFor(t)} />
      )}

      {/* Vocab side panel — only in scenario mode */}
      {scenario && showVocab && (
        <>
          {/* Backdrop (mobile) */}
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setShowVocab(false)}
          />
          {/* Slide-in panel from the right */}
          <aside
            className="fixed z-50 top-0 right-0 h-full w-full sm:w-96 flex flex-col shadow-2xl"
            style={{
              background: 'white',
              borderLeft: `2px solid ${lang.accent}55`,
              animation: 'slidein-right 220ms ease-out',
            }}>
            <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ background: `linear-gradient(135deg, ${lang.accent}12, transparent)` }}>
              <div className="rounded-full flex items-center justify-center shrink-0"
                   style={{ width: 40, height: 40, background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}CC)`, color: 'white', fontSize: 20 }}>
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  vocabulaire · {scenario.title}
                </div>
                <div style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }} className="text-base font-medium leading-tight truncate">
                  {vocabItems.length} mots utiles
                </div>
              </div>
              <button onClick={() => setShowVocab(false)}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-black/5">
                <X size={16} />
              </button>
            </div>

            {/* Toggle "tout traduire" */}
            <div className="px-4 py-2 flex items-center justify-between text-[11px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              <span>toucher un mot pour la traduction</span>
              <button onClick={() => {
                const next = !vocabShowAllFr;
                setVocabShowAllFr(next);
                if (next) {
                  const all = {}; vocabItems.forEach((_, i) => { all[i] = true; });
                  setVocabRevealed(all);
                } else {
                  setVocabRevealed({});
                }
              }}
                className="font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-colors"
                style={{
                  background: vocabShowAllFr ? lang.accent : 'transparent',
                  color: vocabShowAllFr ? 'white' : lang.accent,
                  border: `1px solid ${lang.accent}55`,
                }}>
                {vocabShowAllFr ? '✓ tout traduit' : 'tout traduire'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {vocabLoading && (
                <div className="flex items-center gap-2 py-6 text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  <Loader2 size={14} className="animate-spin" />
                  <span>chargement du vocabulaire…</span>
                </div>
              )}
              {!vocabLoading && vocabItems.length === 0 && (
                <div className="py-6 text-sm text-center" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
                  Aucun vocabulaire disponible pour l'instant.
                </div>
              )}
              <div className="flex flex-col gap-2">
                {vocabItems.map((item, i) => {
                  const revealed = vocabRevealed[i];
                  return (
                    <button
                      key={i}
                      onClick={() => setVocabRevealed(r => ({ ...r, [i]: !r[i] }))}
                      className="text-left p-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all group"
                      style={{
                        borderRadius: '16px',
                        background: 'white',
                        border: `1px solid ${lang.accent}33`,
                        boxShadow: `0 2px 6px ${lang.accent}12`,
                      }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 16, fontWeight: 500, fontStyle: 'italic' }}
                                dir={lang.rtl ? 'rtl' : 'ltr'}>
                            {item.word}
                          </span>
                          {revealed && (
                            <>
                              <span style={{ color: 'var(--gris)', fontSize: 12 }}>→</span>
                              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: lang.accent, fontSize: 14 }}>
                                {item.fr}
                              </span>
                            </>
                          )}
                          {!revealed && (
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50"
                                  style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                              toucher →
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); speakFor(item.word); }}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/5 shrink-0"
                        title="écouter">
                        <Volume2 size={13} style={{ color: lang.accent }} />
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

// ─── READER MODE ──────────────────────────────────────────────────────────────

const READER_TOPICS = [
  { id: 'daily',    label: 'Vie quotidienne',       icon: '☕' },
  { id: 'travel',   label: 'Voyage & culture',      icon: '✈️' },
  { id: 'work',     label: 'Travail & bureau',      icon: '💼' },
  { id: 'tech',     label: 'Technologie',           icon: '💻' },
  { id: 'food',     label: 'Cuisine',               icon: '🍜' },
  { id: 'news',     label: 'Actualité',             icon: '📰' },
  { id: 'science',  label: 'Sciences',              icon: '🔬' },
  { id: 'story',    label: 'Petite histoire',       icon: '📖' },
];

// ─── SCÉNARIOS (situations de conversation guidée) ───────────────────────────

const SCENARIOS = [
  // ─── DÉBUTANT (A1–A2) ───────────────────────────────────────────
  { id: 'introduce', title: 'Se présenter', emoji: '👋', level: 'beginner', duration: 5, vocabCount: 30,
    description: "Dire bonjour, donner son prénom, son âge, sa nationalité, son travail. Le B.A.-BA de la conversation.",
    role: 'a friendly stranger you meet at a café', userRole: 'the traveler' },
  { id: 'directions', title: 'Demander son chemin', emoji: '🗺️', level: 'beginner', duration: 6, vocabCount: 45,
    description: "Trouver la gare, le musée, la pharmacie. Comprendre à droite, à gauche, tout droit.",
    role: 'a passer-by in the street', userRole: 'a lost tourist' },
  { id: 'cafe', title: 'Commander au café', emoji: '☕', level: 'beginner', duration: 5, vocabCount: 35,
    description: "Un café, un thé, un croissant, l'addition. Les premières phrases utiles au comptoir.",
    role: 'the barista', userRole: 'the customer' },
  { id: 'hotel_checkin', title: "Arriver à l'hôtel", emoji: '🏨', level: 'beginner', duration: 7, vocabCount: 50,
    description: "Donner son nom, montrer sa réservation, prendre la clé, demander le petit-déjeuner.",
    role: 'the hotel receptionist', userRole: 'the guest checking in' },
  { id: 'taxi', title: 'Prendre un taxi', emoji: '🚕', level: 'beginner', duration: 5, vocabCount: 30,
    description: "Donner l'adresse, comprendre le prix, dire arrêtez-vous ici.",
    role: 'the taxi driver', userRole: 'the passenger' },
  { id: 'shopping_basic', title: 'Au supermarché', emoji: '🛒', level: 'beginner', duration: 6, vocabCount: 40,
    description: "Demander un produit, comprendre le prix, payer en espèces ou en carte.",
    role: 'the cashier', userRole: 'the shopper' },

  // ─── INTERMÉDIAIRE (B1–B2) ──────────────────────────────────────
  { id: 'restaurant', title: 'Au restaurant', emoji: '🍽️', level: 'intermediate', duration: 10, vocabCount: 80,
    description: "Réserver une table, commander plats et boissons, poser des questions sur la carte, demander l'addition.",
    role: 'a friendly waiter/waitress', userRole: 'the customer' },
  { id: 'pharmacy', title: 'À la pharmacie', emoji: '💊', level: 'intermediate', duration: 8, vocabCount: 60,
    description: "Décrire un symptôme, demander un médicament, comprendre la posologie.",
    role: 'the pharmacist', userRole: 'a person feeling unwell' },
  { id: 'car_rental', title: 'Louer une voiture', emoji: '🚗', level: 'intermediate', duration: 10, vocabCount: 70,
    description: "Choisir un modèle, comprendre l'assurance, discuter du prix par jour et par kilomètre.",
    role: 'the rental agent', userRole: 'the driver' },
  { id: 'vacation_planning', title: 'Planifier des vacances', emoji: '🏖️', level: 'intermediate', duration: 12, vocabCount: 90,
    description: "Parler de dates, budget, destination, activités, moyens de transport.",
    role: 'a travel agent', userRole: 'the traveler making plans' },
  { id: 'small_talk', title: 'Discussion informelle', emoji: '💬', level: 'intermediate', duration: 10, vocabCount: 75,
    description: "Météo, week-end, projets, loisirs — le small-talk pour tisser du lien.",
    role: "a colleague you've just met", userRole: 'the newcomer at work' },
  { id: 'phone_reservation', title: 'Réserver par téléphone', emoji: '📞', level: 'intermediate', duration: 8, vocabCount: 60,
    description: "Réserver un billet, une table, un rendez-vous par téléphone. Bien épeler son nom.",
    role: 'a booking service agent', userRole: 'the caller' },
  { id: 'doctor', title: 'Chez le médecin', emoji: '🩺', level: 'intermediate', duration: 12, vocabCount: 90,
    description: "Décrire une douleur, répondre à des questions, comprendre un diagnostic.",
    role: 'a general practitioner', userRole: 'the patient' },
  { id: 'movie', title: 'Aller au cinéma', emoji: '🎬', level: 'intermediate', duration: 8, vocabCount: 55,
    description: "Choisir un film, acheter des tickets, discuter du film en sortant.",
    role: 'the ticket vendor then a friend', userRole: 'the moviegoer' },

  // ─── AVANCÉ (C1–C2) ─────────────────────────────────────────────
  { id: 'job_interview', title: "Entretien d'embauche", emoji: '💼', level: 'advanced', duration: 15, vocabCount: 120,
    description: "Présenter son parcours, ses forces et faiblesses, négocier le salaire.",
    role: 'a demanding hiring manager', userRole: 'the candidate' },
  { id: 'negotiation', title: 'Négocier un contrat', emoji: '🤝', level: 'advanced', duration: 15, vocabCount: 120,
    description: "Défendre son prix, faire des concessions, formaliser un accord.",
    role: 'a tough business partner', userRole: 'the negotiator' },
  { id: 'debate', title: 'Débat culturel', emoji: '🗣️', level: 'advanced', duration: 15, vocabCount: 130,
    description: "Défendre un point de vue nuancé, écouter le contradicteur, argumenter.",
    role: 'an opinionated intellectual', userRole: 'the debate opponent' },
  { id: 'complaint', title: 'Se plaindre poliment', emoji: '📣', level: 'advanced', duration: 10, vocabCount: 90,
    description: "Formuler une plainte sans agresser, obtenir une compensation.",
    role: "a customer service manager", userRole: 'an unhappy but polite customer' },
  { id: 'philosophy', title: 'Discussion philosophique', emoji: '🌌', level: 'advanced', duration: 15, vocabCount: 140,
    description: "Réfléchir à haute voix sur le sens, la liberté, le bonheur. Vocabulaire abstrait.",
    role: 'a thoughtful philosophy professor', userRole: 'a curious student' },
];

async function generateReaderText(lang, level, topic, { onPartial } = {}) {
  const lengthByLevel = {
    beginner: '4 short simple sentences (5-10 words max each)',
    intermediate: '5-6 sentences with varied structure (8-18 words each)',
    advanced: '6-7 sentences, rich vocabulary and complex structures',
  };
  const nl = getUserNativeLangName();
  const system = `You write short reading passages for ${nl} speakers learning ${lang.nativeName} (${lang.name}).

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Length: ${lengthByLevel[level.id]}. KEEP IT SHORT.
Topic: ${topic.label}.

Write a self-contained passage in ${lang.nativeName}${lang.code === 'mfe' ? ' (Kreol Morisien, authentic Mauritian Creole)' : ''}.
The vocabulary AND grammar must STRICTLY respect the level constraints above — never exceed them.
Also provide the full ${nl} translation.
Give the passage a short title (in ${lang.nativeName}).

Respond ONLY with JSON, no code fences. Emit fields IN THIS ORDER — title first, then title_fr, then text, then translation:
{
  "title": "<short title in target language>",
  "title_fr": "<${nl} translation of the title>",
  "text": "<the reading passage in target language, plain text>",
  "translation": "<full ${nl} translation of the passage>"
}`;

  // Try streaming with Haiku models first, then non-streaming Sonnet as last resort.
  const streamingModels = ['claude-haiku-4-5', 'claude-3-5-haiku-latest'];
  let accumulated = '';
  let streamSucceeded = false;

  // Wrap the reader system prompt for caching — stable across topics for the same lang+level.
  const cachedSystem = wrapSystemForCaching(system, true);
  for (const model of streamingModels) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model, max_tokens: 800, system: cachedSystem,
          messages: [{ role: 'user', content: `Give me a new passage about "${topic.label}".` }],
          stream: true,
        }),
      });
      if (!response.ok || !response.body) {
        if (response.status === 400 || response.status === 404) continue;
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const evt of events) {
          for (const line of evt.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6);
            try {
              const evtData = JSON.parse(dataStr);
              if (evtData.type === 'content_block_delta' && evtData.delta?.text) {
                accumulated += evtData.delta.text;
                if (onPartial) {
                  const partial = extractPartialJson(accumulated);
                  if (partial) onPartial(partial);
                }
              }
            } catch { /* skip */ }
          }
        }
      }
      streamSucceeded = true;
      break;
    } catch (e) {
      // Try next model
    }
  }

  // Fallback: non-streaming call via chatWithFallback
  if (!streamSucceeded) {
    const data = await chatWithFallback({
      system,
      messages: [{ role: 'user', content: `Give me a new passage about "${topic.label}".` }],
      maxTokens: 800,
    });
    accumulated = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  }

  const cleaned = accumulated.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
  return JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
}

// Given a partial JSON string (still streaming), extract already-completed fields.
function extractPartialJson(raw) {
  const start = raw.indexOf('{');
  if (start === -1) return null;
  const inner = raw.slice(start);
  const out = {};
  const grab = (key) => {
    const re = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, 's');
    const m = inner.match(re);
    if (!m) return null;
    return m[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  };
  const t = grab('title');
  const tx = grab('text');
  const tr = grab('translation');
  if (t !== null) out.title = t;
  if (tx !== null) out.text = tx;
  if (tr !== null) out.translation = tr;
  return (out.title || out.text || out.translation) ? out : null;
}

// Titre en langue cible avec bouton "FR" pour révéler la traduction.
// Utilisé pour tous les titres qui apparaissent en langue étrangère (reader, etc.).
function TranslatableTitle({ text, fr, accent = 'var(--corail)', rtl = false, size = 'lg' }) {
  const [show, setShow] = useState(false);
  if (!text) return <span className="text-[color:rgba(90,78,69,0.55)]">…</span>;
  const cls = size === 'sm'
    ? 'text-lg font-medium leading-tight italic'
    : 'text-2xl sm:text-3xl font-medium leading-tight mt-1 italic';
  return (
    <div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <h2 style={{ fontFamily:'Fraunces, Georgia, serif' }} className={cls} dir={rtl ? 'rtl' : 'ltr'}>
          {text}
        </h2>
        {fr && (
          <button onClick={() => setShow(v => !v)}
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full hover:opacity-80 transition-opacity"
            style={{
              fontFamily: 'DM Sans',
              background: show ? accent : `${accent}22`,
              color: show ? 'white' : accent,
              border: `1px solid ${accent}55`,
            }}
            title={show ? 'masquer la traduction' : 'traduire le titre'}>
            {show ? '✓ FR' : 'FR'}
          </button>
        )}
      </div>
      {show && fr && (
        <div className="mt-1 text-[15px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
          {fr}
        </div>
      )}
    </div>
  );
}

function ReaderScreen({ lang, level, onBack, onOpenLexicon }) {
  const t = useT();
  const [topic, setTopic] = useState(READER_TOPICS[0]);
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState('');
  const [error, setError] = useState(null);
  const [showFr, setShowFr] = useState(false);
  const [wordPopup, setWordPopup] = useState(null);
  const { speak, stop, speakingText, speakingBoundary } = useSpeech();

  // Cache: keep the last passage per topic in memory for instant re-display
  const cacheRef = useRef({});

  const load = async (t, forceNew = false) => {
    // Instant display from cache if available and not forcing new
    const cacheKey = `${lang.code}:${level.id}:${t.id}`;
    if (!forceNew && cacheRef.current[cacheKey]) {
      setPassage(cacheRef.current[cacheKey]);
      setShowFr(false);
      setError(null);
      return;
    }

    setLoading(true); setError(null); setPassage(null); setShowFr(false);
    setLoadingHint('génération…');

    try {
      // Streaming: the passage state updates as tokens arrive.
      const data = await generateReaderText(lang, level, t, {
        onPartial: (partial) => {
          setPassage(prev => ({
            title:       partial.title       || prev?.title       || '',
            title_fr:    partial.title_fr    || prev?.title_fr    || '',
            text:        partial.text        || prev?.text        || '',
            translation: partial.translation || prev?.translation || '',
          }));
          // Once we start receiving text, we can hide the loading state
          if (partial.text) setLoading(false);
        },
      });
      cacheRef.current[cacheKey] = data;
      setPassage(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(topic); return () => stop();
    // eslint-disable-next-line
  }, [topic.id, lang.code, level.id]);

  const speakPassage = () => {
    if (passage) speak(passage.text, null, lang);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:'transparent' }}>
      <div className="border-b wl-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors" title="retour">
            <ArrowLeft size={16} />
          </button>
          <div className="w-11 h-11 rounded-full grid place-items-center shrink-0"
               style={{ background: `linear-gradient(135deg, #FFE5D9, #FFF3E0)`, border: `1.5px solid ${lang.accent}44` }}>
            <ReaderIcon size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none">{t('reader.title')}</div>
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mt-0.5 truncate" style={{ fontFamily:'DM Sans, sans-serif' }}>
              {lang.name} · {level.label.toLowerCase()}
            </div>
          </div>
          {onOpenLexicon && (
            <button onClick={onOpenLexicon}
              className="w-9 h-9 grid place-items-center rounded-full border transition-colors relative"
              style={{ borderColor: `${lang.accent}55`, background: `${lang.accent}15` }}
              title="mon lexique — mots enregistrés">
              <LexiconIcon size={20} />
            </button>
          )}
          <button onClick={() => load(topic, true)} disabled={loading}
            className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)] disabled:opacity-30" title="nouveau texte">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">
          {/* Topic pills */}
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-2" style={{ fontFamily:'DM Sans, sans-serif' }}>
              {t('reader.topic')}
            </div>
            <div className="flex gap-2 flex-wrap">
              {READER_TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    topic.id === t.id
                      ? 'wl-btn-secondary border-transparent'
                      : 'bg-stone-50 border-stone-300 hover:border-[color:rgba(90,78,69,0.3)]'
                  }`}
                  style={{ fontFamily:'DM Sans, sans-serif' }}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && !passage && (
            <div className="wl-card p-5 sm:p-8 relative">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-300">
                <div className="w-9 h-9 grid place-items-center bg-stone-100 border border-stone-300">
                  <Loader2 size={14} className="animate-spin text-[color:var(--gris)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    {topic.icon} {topic.label}
                  </div>
                  <div className="text-sm text-[color:var(--ink)] mt-1" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    {loadingHint || 'préparation…'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[100, 92, 85, 96, 78].map((w, i) => (
                  <div key={i} className="h-4 bg-stone-200 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="border-2 border-amber-700 bg-amber-50 p-4 text-amber-900" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              Impossible de générer un texte. Vérifiez votre connexion et réessayez.
            </div>
          )}

          {passage && (
            <div className="wl-card p-5 sm:p-8 relative"
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px)' }}>
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] flex items-center gap-2" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    <span>{topic.icon} {topic.label}</span>
                    {loading && <Loader2 size={10} className="animate-spin" />}
                  </div>
                  <TranslatableTitle
                    text={passage.title}
                    fr={passage.title_fr}
                    accent={lang.accent}
                    rtl={lang.rtl}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={speakPassage} disabled={loading || !passage.text}
                    className={`w-9 h-9 grid place-items-center transition-colors disabled:opacity-30 ${speakingText === passage.text ? 'bg-amber-700 text-stone-50 animate-pulse' : 'wl-btn-secondary'}`}
                    title="écouter le texte">
                    <Volume2 size={14} />
                  </button>
                  <button onClick={() => load(topic, true)} disabled={loading}
                    className="w-9 h-9 grid place-items-center transition-colors disabled:opacity-30 wl-btn-secondary"
                    title="générer un autre texte sur ce sujet">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  </button>
                  <button onClick={() => setShowFr(s => !s)} disabled={!passage.translation}
                    className={`px-2 py-1 text-[10px] uppercase tracking-widest border disabled:opacity-30 ${showFr ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`}
                    style={{ fontFamily:'DM Sans, sans-serif' }}>
                    fr
                  </button>
                </div>
              </div>

              <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg leading-relaxed text-[color:var(--ink)]" dir={lang.rtl ? 'rtl' : 'ltr'}>
                <ClickableText
                  text={passage.text || ''}
                  onWordClick={(w, ctx) => setWordPopup({ word: w, context: ctx })}
                  rtl={lang.rtl}
                  boundary={speakingBoundary}
                  activeText={speakingText}
                  highlightedWord={wordPopup?.word || null}
                />
                {loading && (
                  <span className="inline-block w-0.5 h-5 bg-[color:var(--ink)] ml-0.5 align-middle" style={{ animation: 'cursor-blink 0.9s steps(2) infinite' }} />
                )}
              </div>

              {showFr && passage.translation && (
                <div className="mt-5 pt-4 border-t border-stone-300">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-2" style={{ fontFamily:'DM Sans, sans-serif' }}>{t('reader.native_translation')}</div>
                  {passage.title_fr && (
                    <h3 className="text-xl font-medium leading-tight italic mb-2"
                        style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                      {passage.title_fr}
                    </h3>
                  )}
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)] leading-relaxed italic">
                    {passage.translation}
                  </div>
                </div>
              )}

              {!loading && (
                <div className="mt-6 text-[10px] uppercase tracking-widest text-[color:rgba(90,78,69,0.55)] text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
                  {t('reader.hint')}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {wordPopup && (
        <WordExplainPopup word={wordPopup.word} context={wordPopup.context} lang={lang}
          onClose={() => setWordPopup(null)}
          onSpeak={(t) => speak(t, null, lang)} />
      )}
    </div>
  );
}

// ─── STEP 2.5: MODE PICKER ────────────────────────────────────────────────────

function ModePicker({ language, level, onSelect, onBack, onResumeChat, profile, onChangeLanguage, signOut, onOpenProfile, onOpenLexicon }) {
  const t = useT();
  const [resumeSession, setResumeSession] = useState(null);

  // Check if there's a saved conversation for this exact language + level (for THIS user).
  useEffect(() => {
    if (!profile?.id) { setResumeSession(null); return; }
    loadLastSession(profile.id).then(s => {
      if (!s) { setResumeSession(null); return; }
      if (s.langCode !== language.code || s.levelId !== level.id) { setResumeSession(null); return; }
      const avatar = language.avatars.find(a => a.id === s.avatarId);
      if (avatar) setResumeSession({ avatar, lastUpdated: s.lastUpdated });
    });
  }, [language.code, level.id]);

  const modes = [
    { id: 'chat',      label: t('mode.discuss'),   icon: null,          emoji: null,   svg: 'discuss',
      desc: t('mode.discuss_sub') },
    { id: 'scenarios', label: t('mode.scenarios'), icon: null,          emoji: null,   svg: 'scenario', badge: 'new',
      desc: t('mode.scenarios_sub') },
    { id: 'reader',    label: t('mode.reader'),    icon: null,          emoji: null,   svg: 'reader',
      desc: t('mode.reader_sub') },
    { id: 'exercises', label: t('mode.exercises'), icon: null,          emoji: null,   svg: 'exercises',
      desc: t('mode.exercises_sub') },
    { id: 'lexicon',   label: t('mode.lexicon'),   icon: null,          emoji: null,   svg: 'lexicon',
      desc: t('mode.lexicon_sub') },
  ];
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-4xl mx-auto">
        {/* Top user bar — reproduit celui de l'écran 1 pour rester à portée */}
        {profile && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <button onClick={onOpenProfile}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
              <div className="rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                   style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 2px 6px rgba(255,56,92,0.25)' }}>
                <span style={{ fontSize: 14, color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
                  {(profile.first_name?.[0] || '?').toUpperCase()}
                </span>
              </div>
              <span className="text-[15px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--corail-2)' }}>
                {t('hello')}, {profile.first_name}
              </span>
            </button>
            <div className="flex items-center gap-4">
              {onOpenLexicon && (
                <button onClick={onOpenLexicon}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <LexiconIcon size={18} /> {t('my_lexicon')}
                </button>
              )}
              {onOpenProfile && (
                <button onClick={onOpenProfile}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <UserCircle size={12} /> {t('my_account')}
                </button>
              )}
              {signOut && (
                <button onClick={signOut}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <LogOut size={11} /> {t('signout')}
                </button>
              )}
            </div>
          </div>
        )}
        {/* No back arrow on Screen 3: once a language + level are set, the user
             changes language via the "autre langue" pill, or level from Mon compte. */}
        <StepHeader step={3} total={4} label="mode" />
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              <em>Comment</em> apprendre ?
            </h1>
            <p className="mt-3 text-[color:var(--gris)]" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              <span className="inline-flex items-center gap-1.5 mr-1 px-2 py-0.5 rounded-full"
                    style={{ background: `${language.accent}18`, color: language.accent, fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans' }}>
                {language.glyph} {language.name}
              </span>
              · {level.label.toLowerCase()}
            </p>
          </div>
          {onChangeLanguage && (
            <button onClick={onChangeLanguage}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: 'white',
                border: `1.5px solid ${language.accent}55`,
                boxShadow: `0 2px 8px ${language.accent}18`,
                fontFamily: 'DM Sans',
                fontWeight: 700,
                fontSize: 12,
                color: language.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
              title={t('mode.change_lang')}>
              <span style={{ fontSize: 14 }}>🌍</span> {t('mode.change_lang')}
            </button>
          )}
        </div>

        {/* Pavé Reprendre — apparaît quand une conversation existe pour ce lang+level */}
        {resumeSession && (
          <button onClick={() => onResumeChat?.(resumeSession.avatar)}
            className="mt-6 w-full text-left hover:-translate-y-1 transition-all p-4 sm:p-5 flex items-center gap-4 group"
            style={{
              borderRadius: '9999px',
              background: `linear-gradient(135deg, ${language.accent}, ${language.accent}DD)`,
              border: 'none',
              boxShadow: `0 6px 20px ${language.accent}55`,
            }}>
            <div className="rounded-full grid place-items-center shrink-0 overflow-hidden"
                 style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.25)', padding: 4 }}>
              <AnimatedAvatar avatar={resumeSession.avatar} size="sm" />
            </div>
            <div className="flex-1 min-w-0 text-white">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span style={{ fontFamily: 'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">
                  Reprendre avec {resumeSession.avatar.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest opacity-80" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {timeSince(resumeSession.lastUpdated)}
                </span>
              </div>
              <p className="text-[13px] opacity-90 mt-0.5" style={{ fontFamily: 'DM Sans' }}>
                Continuer la conversation là où vous l'aviez laissée
              </p>
            </div>
            <span className="text-white text-2xl shrink-0 group-hover:translate-x-1 transition-transform" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>→</span>
          </button>
        )}

        {resumeSession && (
          <div className="mt-6 text-xs font-bold uppercase tracking-wider text-center mb-2" style={{ color: 'var(--gris)' }}>
            · ou choisir un autre mode ·
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {modes.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.id} onClick={() => onSelect(m.id)}
                className="relative text-left hover:-translate-y-1 transition-all p-5 flex flex-col gap-3 items-start group"
                style={{
                  borderRadius: '24px',
                  background: 'white',
                  border: `1.5px solid ${language.accent}44`,
                  boxShadow: `0 3px 12px ${language.accent}18`,
                }}>
                {m.badge && (
                  <span
                    className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white shadow"
                    style={{ fontFamily: 'DM Sans', background: language.accent, boxShadow: `0 3px 10px ${language.accent}88` }}>
                    {m.badge}
                  </span>
                )}
                {(() => {
                  // Per-icon color scheme (each mode gets its own visual identity)
                  const SCHEMES = {
                    discuss:  { bg: 'linear-gradient(135deg, #FFF3D9, #FFFCEF)', border: '#FCD34D' },
                    scenario: { bg: 'linear-gradient(135deg, #F5D9CC, #FBEDE3)', border: '#B85B3F' },
                    reader:   { bg: 'linear-gradient(135deg, #FBFAF3, #EDE7D8)', border: '#1a1a1a' },
                    exercises:{ bg: 'linear-gradient(135deg, #DCF3FA, #F0FBFF)', border: '#0EA5E9' },
                    lexicon:  { bg: 'linear-gradient(135deg, #FFE5D9, #FFF3E0)', border: '#FCD34D' },
                  };
                  const sch = SCHEMES[m.svg];
                  return (
                    <div className="rounded-full grid place-items-center text-white group-hover:scale-105 transition-transform"
                         style={{
                           width: 60, height: 60,
                           background: sch ? sch.bg : `radial-gradient(circle at 30% 30%, ${language.accent}, ${language.accent}CC)`,
                           boxShadow: sch ? `0 4px 14px ${sch.border}55` : `0 4px 14px ${language.accent}55`,
                           fontSize: 26,
                           border: sch ? `2px solid ${sch.border}` : 'none',
                         }}>
                      {m.svg === 'lexicon'
                        ? <LexiconIcon size={36} />
                        : m.svg === 'scenario'
                          ? <ScenarioIcon size={38} />
                          : m.svg === 'reader'
                            ? <ReaderIcon size={38} />
                            : m.svg === 'exercises'
                              ? <ExercisesIcon size={40} />
                              : m.svg === 'discuss'
                                ? <DiscussIcon size={40} />
                                : Icon ? <Icon size={26} /> : <span>{m.emoji}</span>}
                    </div>
                  );
                })()}
                <h3 style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-2xl font-medium leading-none">{m.label}</h3>
                <p style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-sm text-[color:var(--ink)] leading-relaxed">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────

function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false); // password reset flow in progress

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    // Detect recovery link on initial load (hash contains type=recovery)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery') || hash.includes('password-reset')) {
        setRecovering(true);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((ev, sess) => {
      if (ev === 'PASSWORD_RECOVERY') {
        setRecovering(true);
      }
      setSession(sess);
      if (sess) loadProfile(sess.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setProfile(data);
    } catch (e) {}
    setLoading(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    // We do NOT clear META_KEY on sign-out anymore: the session pointer is
    // tagged with the user_id, so loadLastSession(userId) already filters
    // out foreign sessions. Keeping it means the same user reconnecting on
    // this browser lands directly on Screen 3 with their conversation ready.
    setSession(null); setProfile(null);
  };

  const reloadProfile = async () => {
    if (session?.user?.id) await loadProfile(session.user.id);
  };

  const clearRecovery = () => {
    setRecovering(false);
    // Clean the URL hash so it does not re-trigger on refresh
    if (typeof window !== 'undefined' && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return { session, profile, loading, signOut, reloadProfile, recovering, clearRecovery };
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

function MascotHoot({ size = 180 }) {
  return (
    <svg viewBox="0 0 180 180" width={size} height={size}
         style={{ filter: 'drop-shadow(0 6px 12px rgba(255, 107, 74, 0.25))' }}>
      <ellipse cx="90" cy="105" rx="55" ry="60" fill="#FF6B4A" stroke="#2C1B1D" strokeWidth="4"/>
      <ellipse cx="90" cy="115" rx="35" ry="42" fill="#FFF3E0"/>
      <path d="M75 160 L72 170 M80 160 L80 172 M85 160 L88 170" stroke="#2C1B1D" strokeWidth="3" strokeLinecap="round"/>
      <path d="M95 160 L92 170 M100 160 L100 172 M105 160 L108 170" stroke="#2C1B1D" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 100 Q30 130 50 145" stroke="#2C1B1D" strokeWidth="4" fill="#E4522F"/>
      <path d="M140 100 Q150 130 130 145" stroke="#2C1B1D" strokeWidth="4" fill="#E4522F"/>
      <circle cx="70" cy="80" r="20" fill="white" stroke="#2C1B1D" strokeWidth="4"/>
      <circle cx="110" cy="80" r="20" fill="white" stroke="#2C1B1D" strokeWidth="4"/>
      <circle cx="72" cy="82" r="10" fill="#2C1B1D"/>
      <circle cx="112" cy="82" r="10" fill="#2C1B1D"/>
      <circle cx="75" cy="79" r="3" fill="white"/>
      <circle cx="115" cy="79" r="3" fill="white"/>
      <path d="M85 95 L90 108 L95 95 Z" fill="#FFC94D" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M60 55 L55 40 L65 50 Z" fill="#E4522F" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M120 55 L125 40 L115 50 Z" fill="#E4522F" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <circle cx="55" cy="105" r="8" fill="#FF8FB1" opacity="0.6"/>
      <circle cx="125" cy="105" r="8" fill="#FF8FB1" opacity="0.6"/>
      <rect x="75" y="130" width="30" height="22" rx="2" fill="#A78BFA" stroke="#2C1B1D" strokeWidth="3"/>
      <line x1="90" y1="132" x2="90" y2="150" stroke="#2C1B1D" strokeWidth="2"/>
    </svg>
  );
}

// Livre ouvert avec loupe — icône du lexique (remplace l'emoji 📚).
function LexiconIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
      {/* Book spine / cover (yellow) */}
      <path d="M 10 62 L 10 86 L 50 84 L 90 86 L 90 62 L 50 65 Z"
            fill="#FCD34D" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Left page */}
      <path d="M 14 60 L 14 82 L 50 80 L 50 52 Z"
            fill="#FFF3E0" stroke="#2C1B1D" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Right page */}
      <path d="M 86 60 L 86 82 L 50 80 L 50 52 Z"
            fill="#FFF3E0" stroke="#2C1B1D" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Text lines on left page */}
      <line x1="21" y1="60" x2="45" y2="59" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="66" x2="42" y2="65" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="72" x2="45" y2="71" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      {/* Text lines on right page */}
      <line x1="55" y1="59" x2="79" y2="60" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      <line x1="55" y1="65" x2="76" y2="66" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      <line x1="55" y1="71" x2="79" y2="72" stroke="#78716C" strokeWidth="2" strokeLinecap="round"/>
      {/* Magnifying glass lens (upper right, floating) */}
      <circle cx="66" cy="30" r="16" fill="white" stroke="#2C1B1D" strokeWidth="3.5"/>
      <circle cx="60" cy="26" r="4" fill="#DBEAFE" opacity="0.9"/>
      {/* Handle: yellow inner with dark outline */}
      <line x1="77" y1="42" x2="90" y2="55" stroke="#2C1B1D" strokeWidth="7" strokeLinecap="round"/>
      <line x1="77" y1="42" x2="90" y2="55" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round"/>
      {/* Handle tip cap */}
      <circle cx="90" cy="55" r="3.5" fill="#2C1B1D"/>
    </svg>
  );
}

// Deux personnages avec bulles de dialogue — icône du mode discuter (remplace 💬 / MessageCircle).
function DiscussIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
      {/* Pink bubble (behind) */}
      <path d="M 56 18 Q 56 8 68 8 L 84 8 Q 92 8 92 16 L 92 24 Q 92 32 84 32 L 74 32 L 78 40 L 66 32 Q 56 32 56 24 Z"
            fill="#FF6B9D" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Yellow bubble (front) */}
      <path d="M 12 20 Q 12 6 28 6 L 54 6 Q 66 6 66 20 Q 66 33 54 33 L 40 33 L 30 44 L 32 33 Q 12 33 12 20 Z"
            fill="#FFD84D" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round"/>
      {/* Three dots inside yellow bubble */}
      <circle cx="26" cy="20" r="2.5" fill="#1a1a1a"/>
      <circle cx="39" cy="20" r="2.5" fill="#1a1a1a"/>
      <circle cx="52" cy="20" r="2.5" fill="#1a1a1a"/>

      {/* Left person */}
      <circle cx="32" cy="62" r="10" fill="#FFDBB5" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M 14 96 Q 14 80 24 76 L 32 74 L 40 76 Q 50 80 50 96 Z"
            fill="#8ACD8A" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Right person */}
      <circle cx="68" cy="62" r="10" fill="#FFDBB5" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M 50 96 Q 50 80 60 76 L 68 74 L 76 76 Q 86 80 86 96 Z"
            fill="#78BFEB" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

// Cerveau musclé qui soulève des haltères — icône du mode exercices (remplace 🎯).
function ExercisesIcon({ size = 20 }) {
  const line = '#0EA5E9';
  const fill = '#F0FBFF';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
      {/* Barbell — bar */}
      <line x1="18" y1="16" x2="82" y2="16" stroke={line} strokeWidth="3" strokeLinecap="round"/>
      {/* Left plates */}
      <rect x="5" y="8" width="6" height="17" rx="1.5" fill={fill} stroke={line} strokeWidth="2.5"/>
      <rect x="12" y="12" width="4" height="9" rx="1" fill={fill} stroke={line} strokeWidth="2"/>
      {/* Right plates */}
      <rect x="89" y="8" width="6" height="17" rx="1.5" fill={fill} stroke={line} strokeWidth="2.5"/>
      <rect x="84" y="12" width="4" height="9" rx="1" fill={fill} stroke={line} strokeWidth="2"/>
      {/* Arms up */}
      <path d="M 33 38 Q 30 25 34 18" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 67 38 Q 70 25 66 18" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Fists on the bar */}
      <circle cx="34" cy="18" r="3.5" fill={fill} stroke={line} strokeWidth="2.5"/>
      <circle cx="66" cy="18" r="3.5" fill={fill} stroke={line} strokeWidth="2.5"/>
      {/* Brain body — bumpy contour */}
      <path d="M 30 40
               Q 22 40 22 48
               Q 18 52 22 58
               Q 20 66 28 68
               Q 32 76 42 74
               Q 50 78 58 74
               Q 68 76 72 68
               Q 80 66 78 58
               Q 82 52 78 48
               Q 78 40 70 40
               Q 68 34 60 36
               Q 55 32 50 36
               Q 45 32 40 36
               Q 32 34 30 40 Z"
            fill={fill} stroke={line} strokeWidth="2.8" strokeLinejoin="round"/>
      {/* Brain wrinkles (folds) */}
      <path d="M 35 46 Q 38 50 34 55" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M 65 46 Q 62 50 66 55" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M 45 62 Q 50 66 55 62" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M 30 60 Q 32 64 30 68" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M 70 60 Q 68 64 70 68" stroke={line} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M 50 40 Q 50 44 50 47" stroke={line} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* Cool sunglasses */}
      <path d="M 30 51 L 46 51 L 46 58 Q 46 60 44 60 L 32 60 Q 30 60 30 58 Z" fill={line} stroke={line} strokeWidth="1"/>
      <path d="M 54 51 L 70 51 L 70 58 Q 70 60 68 60 L 56 60 Q 54 60 54 58 Z" fill={line} stroke={line} strokeWidth="1"/>
      <line x1="46" y1="53" x2="54" y2="53" stroke={line} strokeWidth="2.5"/>
      {/* Legs */}
      <line x1="42" y1="76" x2="40" y2="87" stroke={line} strokeWidth="3" strokeLinecap="round"/>
      <line x1="58" y1="76" x2="60" y2="87" stroke={line} strokeWidth="3" strokeLinecap="round"/>
      {/* Sneakers */}
      <path d="M 32 90 Q 32 85 40 87 L 47 89 Q 47 92 44 92 L 34 92 Q 32 92 32 90 Z"
            fill={fill} stroke={line} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M 68 90 Q 68 85 60 87 L 53 89 Q 53 92 56 92 L 66 92 Q 68 92 68 90 Z"
            fill={fill} stroke={line} strokeWidth="2.5" strokeLinejoin="round"/>
    </svg>
  );
}

// Journal plié avec gros titre — icône du mode lecture (métaphore "actualité, texte").
function ReaderIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
      {/* Back paper — slightly tilted */}
      <rect x="14" y="20" width="72" height="70" rx="2"
            fill="#EDE7D8" stroke="#1a1a1a" strokeWidth="2" transform="rotate(-4 50 55)"/>
      {/* Front paper */}
      <rect x="12" y="16" width="76" height="74" rx="2"
            fill="#FBFAF3" stroke="#1a1a1a" strokeWidth="3"/>
      {/* Masthead / title bar */}
      <rect x="18" y="22" width="64" height="12" fill="#1a1a1a"/>
      <text x="50" y="31" textAnchor="middle" fontFamily="Georgia, serif"
            fontSize="9" fontWeight="900" fill="#FCD34D" letterSpacing="1">NEWS</text>
      {/* Column separator */}
      <line x1="50" y1="38" x2="50" y2="86" stroke="#94A3B8" strokeWidth="1" strokeDasharray="1,2"/>
      {/* Left column — text lines then image */}
      <line x1="20" y1="42" x2="46" y2="42" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="47" x2="44" y2="47" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="52" x2="46" y2="52" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      {/* Small image placeholder — coral square with sun */}
      <rect x="20" y="58" width="26" height="18" fill="#FCD34D" stroke="#1a1a1a" strokeWidth="1.5"/>
      <circle cx="30" cy="66" r="3" fill="#EA580C"/>
      <line x1="35" y1="75" x2="43" y2="70" stroke="#1a1a1a" strokeWidth="1"/>
      <line x1="35" y1="72" x2="46" y2="65" stroke="#1a1a1a" strokeWidth="1"/>
      <line x1="20" y1="82" x2="46" y2="82" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      {/* Right column */}
      <line x1="54" y1="42" x2="82" y2="42" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="47" x2="80" y2="47" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="52" x2="82" y2="52" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="57" x2="78" y2="57" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="62" x2="82" y2="62" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="67" x2="80" y2="67" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="72" x2="82" y2="72" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="77" x2="76" y2="77" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="54" y1="82" x2="82" y2="82" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Clapperboard de cinéma — icône du mode scénarios (métaphore "scène / rôle").
function ScenarioIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true">
      {/* Body (wooden bottom slate) */}
      <rect x="6" y="42" width="88" height="52" rx="4"
            fill="#B85B3F" stroke="#1a1a1a" strokeWidth="3"/>
      {/* Chalk label area on the wood */}
      <rect x="12" y="52" width="76" height="34" rx="2"
            fill="#F5F1E8" stroke="#1a1a1a" strokeWidth="2"/>
      {/* "SCENE" style chalk lines */}
      <line x1="18" y1="60" x2="60" y2="60" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="68" x2="82" y2="68" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18" y1="76" x2="72" y2="76" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
      {/* Striped hinge on top */}
      <g transform="rotate(-6 50 30)">
        {/* Base bar of the clap */}
        <rect x="4" y="18" width="92" height="16" rx="2"
              fill="#1a1a1a" stroke="#000" strokeWidth="2.5"/>
        {/* White angled stripes */}
        <polygon points="10 18 20 18 14 34 4 34" fill="#F5F5F5" stroke="#000" strokeWidth="1.5"/>
        <polygon points="30 18 40 18 34 34 24 34" fill="#F5F5F5" stroke="#000" strokeWidth="1.5"/>
        <polygon points="50 18 60 18 54 34 44 34" fill="#F5F5F5" stroke="#000" strokeWidth="1.5"/>
        <polygon points="70 18 80 18 74 34 64 34" fill="#F5F5F5" stroke="#000" strokeWidth="1.5"/>
      </g>
      {/* Hinge pin */}
      <circle cx="10" cy="40" r="3" fill="#F5F5F5" stroke="#1a1a1a" strokeWidth="1.5"/>
    </svg>
  );
}

function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero image with sunset gradient + city silhouette */}
      <div className="relative overflow-hidden" style={{ height: '52vh', minHeight: '380px' }}>
        <div className="absolute inset-0 wl-hero-sunset"></div>
        <svg className="absolute bottom-0 left-0 right-0" style={{ height: '130px', opacity: 0.7 }} viewBox="0 0 400 130" preserveAspectRatio="xMidYEnd meet">
          <g fill="#2A1520" opacity="0.7">
            <rect x="0" y="90" width="30" height="40"/>
            <rect x="35" y="70" width="25" height="60"/>
            <path d="M180 20 L195 130 L165 130 Z"/>
            <rect x="70" y="80" width="35" height="50"/>
            <rect x="110" y="60" width="20" height="70"/>
            <rect x="135" y="85" width="25" height="45"/>
            <rect x="205" y="75" width="30" height="55"/>
            <rect x="240" y="65" width="25" height="65"/>
            <rect x="270" y="80" width="35" height="50"/>
            <rect x="310" y="55" width="20" height="75"/>
            <path d="M340 40 L350 60 L340 60 L340 130 L360 130 L360 60 L370 60 L360 40 Z"/>
            <rect x="380" y="75" width="20" height="55"/>
          </g>
        </svg>
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
          {/* Brand + live badge */}
          <div className="flex items-center justify-between">
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '24px', color: 'white' }}>
              MonProf
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--ink)', backdropFilter: 'blur(10px)' }}>
              <span className="wl-dot-live"></span>1 200 en ligne
            </span>
          </div>
          {/* Big headline */}
          <div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 'clamp(32px, 8vw, 46px)', lineHeight: 1.05, letterSpacing: '-0.03em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              Le monde en <em style={{ color: '#FFDBB5' }}>conversations.</em>
            </h1>
            <p className="mt-2 text-[15px] font-medium max-w-xs" style={{ opacity: 0.95, textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
              Rencontrez 33 professeurs à travers 10 pays.
            </p>
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="flex-1 px-6 sm:px-8 pt-8 pb-8 max-w-md mx-auto w-full">
        <p className="text-center text-[15px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          Une nouvelle façon d'apprendre les langues :<br/>
          en conversant, comme en voyage.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button onClick={onSignup} className="wl-btn-primary w-full">
            Commencer l'aventure
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onClick={onLogin} className="wl-btn-secondary w-full">
            J'ai déjà un compte
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          <span className="wl-chip">🇬🇧 Anglais</span>
          <span className="wl-chip">🇪🇸 Español</span>
          <span className="wl-chip">🇯🇵 日本語</span>
          <span className="wl-chip">+7 autres</span>
        </div>
      </div>
    </div>
  );
}

function AuthField({ icon: Icon, type, placeholder, value, onChange, autoComplete, disabled }) {
  const isPassword = type === 'password';
  const [reveal, setReveal] = useState(false);
  const effectiveType = isPassword ? (reveal ? 'text' : 'password') : type;

  return (
    <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl">
      {Icon && <Icon size={16} style={{ color: 'var(--gris)' }} />}
      <input
        type={effectiveType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        className="flex-1 bg-transparent focus:outline-none text-base disabled:opacity-60"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
      />
      {isPassword && !disabled && value && (
        <button
          type="button"
          onClick={() => setReveal(r => !r)}
          className="w-7 h-7 grid place-items-center rounded-full hover:bg-black/5 transition-colors shrink-0"
          title={reveal ? 'masquer le mot de passe' : 'afficher le mot de passe'}
          aria-label={reveal ? 'masquer le mot de passe' : 'afficher le mot de passe'}>
          {reveal
            ? <EyeOffIcon size={16} style={{ color: 'var(--gris)' }} />
            : <EyeIcon size={16} style={{ color: 'var(--gris)' }} />}
        </button>
      )}
    </div>
  );
}

function SelectField({ icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl">
      {Icon && <Icon size={16} style={{ color: 'var(--gris)' }} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none text-base"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: value ? 'var(--ink)' : 'var(--gris)' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function PhoneField({ dialCode, onDialChange, number, onNumberChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 wl-card px-3 py-3 rounded-2xl min-w-[120px]">
        <Globe2 size={16} style={{ color: 'var(--gris)' }} />
        <select
          value={dialCode}
          onChange={(e) => onDialChange(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none text-base"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
        >
          {COUNTRIES.map((c, i) => (
            <option key={`${c.code}-${i}`} value={c.dial}>
              {c.flag} {c.dial} {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl flex-1">
        <Phone size={16} style={{ color: 'var(--gris)' }} />
        <input
          type="tel"
          placeholder="numéro"
          value={number}
          onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s]/g, ''))}
          className="flex-1 bg-transparent focus:outline-none text-base"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
        />
      </div>
    </div>
  );
}

function LoginForm({ onBack, onSuccess, onGoSignup, onGoForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      if (err.message?.includes('Email not confirmed')) {
        setError('Confirmez d\'abord votre email (regardez votre boîte de réception).');
      } else if (err.message?.includes('Invalid')) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(err.message);
      }
    } else if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--soleil)' }}></div>
      <div className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2" style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}><span style={{ fontSize: 34 }}>🌍</span></div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Content de te <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>revoir !</span>
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Mail} type="email" placeholder="votre email"
            value={email} onChange={setEmail} autoComplete="email" />
          <AuthField icon={Lock} type="password" placeholder="mot de passe"
            value={password} onChange={setPassword} autoComplete="current-password" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || !email || !password}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'connexion…' : 'Se connecter →'}
          </button>
        </form>

        <div className="mt-3 text-center text-sm" style={{ fontFamily: 'DM Sans' }}>
          <button onClick={() => onGoForgot?.(email)}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Mot de passe oublié&nbsp;?
          </button>
        </div>

        <div className="mt-4 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Pas encore de compte ?{' '}
          <button onClick={onGoSignup}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Créer un compte →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD (envoi du lien de réinitialisation) ─────────────────────

function ForgotPasswordForm({ onBack, onGoLogin, prefilledEmail }) {
  const [email, setEmail] = useState(prefilledEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    if (!email) { setError('Merci de saisir votre email.'); return; }
    setLoading(true); setError(null);
    // The link brings the user back to /?type=recovery — AuthGate detects it.
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}#password-reset`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4 inline-block">📬</div>
          <h1 className="text-3xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Vérifiez vos <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>emails</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            Un lien de réinitialisation a été envoyé à <strong style={{ color: 'var(--ink)' }}>{email}</strong>.<br/>
            Cliquez dessus pour définir un nouveau mot de passe.
          </p>
          <p className="mt-3 text-[13px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Pensez à regarder dans les spams. Le lien expire dans 1 heure.
          </p>
          <button onClick={onGoLogin} className="wl-btn-primary mt-8">
            Retour à la connexion →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2"
               style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 34 }}>🔑</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Mot de passe <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>oublié&nbsp;?</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Saisissez votre email, nous vous envoyons un lien pour le redéfinir.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Mail} type="email" placeholder="votre email"
            value={email} onChange={setEmail} autoComplete="email" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || !email}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'envoi…' : 'Envoyer le lien 📩'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Vous vous souvenez ?{' '}
          <button onClick={onGoLogin}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Se connecter →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RESET PASSWORD (arrivé via le lien email) ───────────────────────────────

function ResetPasswordScreen({ onDone }) {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    if (newPwd.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (newPwd !== confirmPwd) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: newPwd });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => onDone?.(), 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2"
               style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 34 }}>🔒</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Nouveau <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>mot de passe</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Lock} type="password" placeholder="nouveau mot de passe (6 caractères min.)"
            value={newPwd} onChange={setNewPwd} autoComplete="new-password" />
          <AuthField icon={Lock} type="password" placeholder="confirmer le mot de passe"
            value={confirmPwd} onChange={setConfirmPwd} autoComplete="new-password" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || success || !newPwd || !confirmPwd}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {success ? (<><Check size={16} /> mot de passe mis à jour !</>) : (loading ? 'mise à jour…' : 'Enregistrer le mot de passe')}
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupForm({ onBack, onSuccess, onGoLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Étape 0 = choix de la langue. On démarre sans langue choisie pour forcer l'étape 0.
  const [nativeLang, setNativeLang] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [dialCode, setDialCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(0); // 0: langue / 1: essentiel / 2: profil
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // t() local basé sur la langue choisie (défaut fr avant sélection)
  const t = React.useCallback((key, fallback) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return fallback || key;
    return entry[nativeLang || 'fr'] || entry.fr || fallback || key;
  }, [nativeLang]);

  const pickLangAndContinue = (code) => {
    setNativeLang(code);
    setError(null);
    setStep(1);
  };

  const nextStep = () => {
    if (!firstName || !lastName || !email || !password) {
      setError(t('auth.err_fill_all'));
      return;
    }
    if (!email.includes('@')) {
      setError(t('auth.err_email_required'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.err_password_short'));
      return;
    }
    setError(null);
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError(t('auth.service_missing')); return; }
    if (password.length < 6) { setError(t('auth.err_password_short')); return; }
    // Téléphone OBLIGATOIRE
    if (!phoneNumber || !phoneNumber.trim()) { setError(t('auth.err_phone_required')); return; }
    setLoading(true); setError(null);

    const phoneFull = `${dialCode} ${phoneNumber}`;

    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (err) { setLoading(false); setError(err.message); return; }

    // Create profile row with all fields
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        native_language: nativeLang || 'fr',
        birth_date: birthDate || null,
        address: address || null,
        phone_dial_code: dialCode,
        phone_number: phoneNumber,
        phone_full: phoneFull,
      });
    }
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
        <div className="" style={{ top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'var(--menthe)' }}></div>
        <div className="max-w-md w-full text-center relative z-10">
          <div className="text-6xl mb-4  inline-block">🎉</div>
          <h1 className="text-3xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>{t('auth.check_email')}</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            {t('auth.email_will_send')} <strong style={{ color: 'var(--ink)' }}>{email}</strong>.<br/>
            {t('auth.email_click')}
          </p>
          <button onClick={onGoLogin} className="wl-btn-primary mt-8">
            {t('auth.go_login')}
          </button>
        </div>
      </div>
    );
  }

  // ─── Étape 0 : sélection de la langue ────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
        <div className="" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--menthe)' }}></div>
        <div className="max-w-md w-full relative z-10">
          <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> back · retour
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center rounded-full mb-2"
                 style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
              <span style={{ fontSize: 34 }}>🌍</span>
            </div>
            <h1 className="text-2xl sm:text-3xl leading-tight mt-4"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
              Choose your language
            </h1>
            <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Choisissez votre langue · Elige tu idioma · Escolha o seu idioma · Wählen Sie Ihre Sprache
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-8 h-1.5 rounded-full" style={{ background: 'var(--corail)' }}></div>
              <div className="w-8 h-1.5 rounded-full" style={{ background: 'rgba(90,78,69,0.2)' }}></div>
              <div className="w-8 h-1.5 rounded-full" style={{ background: 'rgba(90,78,69,0.2)' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {Object.values(NATIVE_LANGUAGES).map(l => (
              <button key={l.code} type="button" onClick={() => pickLangAndContinue(l.code)}
                className="flex items-center gap-4 p-4 rounded-2xl hover:-translate-y-0.5 transition-all"
                style={{
                  background: 'white',
                  border: '1.5px solid rgba(90,78,69,0.15)',
                  boxShadow: '0 2px 8px rgba(90,78,69,0.08)',
                }}>
                <span style={{ fontSize: 32 }}>{l.flag}</span>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>
                  {l.label}
                </span>
                <span className="ml-auto" style={{ color: 'var(--gris)' }}>→</span>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Already have an account? · Déjà un compte ?{' '}
            <button onClick={onGoLogin}
              className="font-bold hover:opacity-70"
              style={{ color: 'var(--corail)' }}>
              Sign in →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--menthe)' }}></div>
      <div className="max-w-md w-full relative z-10">
        <button
          onClick={() => { if (step === 1) setStep(0); else if (step === 2) setStep(1); else onBack(); }}
          className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> {t('auth.back')}
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2" style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}>
            <span style={{ fontSize: 34 }}>{NATIVE_LANGUAGES[nativeLang]?.flag || '🌍'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>{t('auth.pleased')}</span>
          </h1>
          <p className="mt-3 text-[15px]"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            {step === 1 ? t('auth.essential') : t('auth.complete')} ✨
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-1.5 rounded-full" style={{ background: 'var(--corail)' }}></div>
            <div className="w-8 h-1.5 rounded-full transition-colors" style={{ background: step >= 1 ? 'var(--corail)' : 'rgba(90,78,69,0.2)' }}></div>
            <div className="w-8 h-1.5 rounded-full transition-colors" style={{ background: step >= 2 ? 'var(--corail)' : 'rgba(90,78,69,0.2)' }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <AuthField icon={User} type="text" placeholder={t('auth.first_name')}
                value={firstName} onChange={setFirstName} autoComplete="given-name" />
              <AuthField icon={User} type="text" placeholder={t('auth.last_name')}
                value={lastName} onChange={setLastName} autoComplete="family-name" />
            </div>
            <AuthField icon={Mail} type="email" placeholder={t('auth.email') + ' *'}
              value={email} onChange={setEmail} autoComplete="email" />
            <AuthField icon={Lock} type="password" placeholder={t('auth.password')}
              value={password} onChange={setPassword} autoComplete="new-password" />

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="button" onClick={nextStep}
              disabled={!firstName || !lastName || !email || !password}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {t('continue')}
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <AuthField icon={Calendar} type="date" placeholder={t('auth.birth')}
              value={birthDate} onChange={setBirthDate} autoComplete="bday" />

            <AuthField icon={MapPin} type="text" placeholder={t('auth.address')}
              value={address} onChange={setAddress} autoComplete="street-address" />

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)' }}>
                {t('auth.phone')} *
              </label>
              <PhoneField
                dialCode={dialCode}
                onDialChange={setDialCode}
                number={phoneNumber}
                onNumberChange={setPhoneNumber} />
            </div>

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => { setStep(1); setError(null); }}
                className="wl-chip px-5 py-3 flex items-center gap-2"
                style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
                <ArrowLeft size={14} /> {t('auth.back')}
              </button>
              <button type="submit" disabled={loading || !phoneNumber}
                className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? t('auth.signing_up') : t('auth.create_account')}
              </button>
            </div>

            <p className="text-xs text-center mt-2" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              {t('auth.editable_later')}
            </p>
          </form>
        )}

        <div className="mt-6 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          {t('auth.have_account')}{' '}
          <button onClick={onGoLogin}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            {t('auth.signin')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE / MON COMPTE ─────────────────────────────────────────────────────

function ProfileScreen({ profile, onBack, onProfileUpdated, onStartTest, onManualLevel, onChangeDevice, device, onOpenLexicon, signOut }) {
  const t = useT();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [nativeLang, setNativeLang] = useState(profile?.native_language || 'fr');
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [dialCode, setDialCode] = useState(profile?.phone_dial_code || '+33');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [expandedTest, setExpandedTest] = useState(null);

  // Account deletion flow
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const deleteAccount = async () => {
    if (!supabase || !profile?.id) return;
    setDeleting(true); setDeleteError(null);
    try {
      // 1) Delete all user data from our tables (RLS scopes this to the current user)
      await Promise.allSettled([
        supabase.from('lexicon').delete().eq('user_id', profile.id),
        supabase.from('exercise_sessions').delete().eq('user_id', profile.id),
        supabase.from('user_errors').delete().eq('user_id', profile.id),
        supabase.from('level_tests').delete().eq('user_id', profile.id),
        supabase.from('profiles').delete().eq('id', profile.id),
      ]);

      // 2) Ask the server to remove the auth user (requires the service_role key
      //    on the server side, which the client must not see). We attach the
      //    caller's access token so the endpoint can verify identity.
      const { data: sessData } = await supabase.auth.getSession();
      const accessToken = sessData?.session?.access_token;
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ user_id: profile.id }),
      });
      // We tolerate a failure here: local data is already deleted, and worst case
      // the auth row is orphaned but the user has no data attached to it.
      if (!res.ok) {
        console.warn('Auth deletion endpoint failed:', await res.text().catch(() => ''));
      }

      // 3) Clear local state — conversations, session pointer, lexicon cache, etc.
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('chat:') || k.startsWith('stats:') || k.startsWith('errors:')
              || k.startsWith('word:') || k === 'meta:lastSession' || k === 'lexicon'
              || k === 'level_tests_cache' || k === 'exercise_sessions'
              || k === 'device_choice' || k.startsWith('voice:')
              || k.startsWith('scen_open:') || k.startsWith('scen_chat:') || k.startsWith('scen_vocab:') || k.startsWith('scen_dialog:') || k.startsWith('scen_dialog_pool:')) {
            localStorage.removeItem(k);
          }
        });
      } catch {}

      // 4) Sign out — this drops the auth session in the browser
      await signOut?.();
    } catch (e) {
      setDeleteError(e.message);
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!profile?.id) return;
    loadLevelTests(profile.id).then(list => {
      setTests(list || []);
      setLoadingTests(false);
    });
  }, [profile?.id]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!supabase || !profile?.id) return;
    setSaving(true); setError(null); setSavedFlash(false);

    const phoneFull = phoneNumber ? `${dialCode} ${phoneNumber}` : null;

    const { error: err } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      native_language: nativeLang,
      birth_date: birthDate || null,
      address: address || null,
      phone_dial_code: dialCode,
      phone_number: phoneNumber || null,
      phone_full: phoneFull,
    }).eq('id', profile.id);

    setSaving(false);
    if (err) { setError(err.message); return; }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
    if (onProfileUpdated) onProfileUpdated();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setPwdError(null); setPwdSuccess(false);
    if (newPassword.length < 6) { setPwdError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (newPassword !== confirmPassword) { setPwdError('Les mots de passe ne correspondent pas.'); return; }
    setChangingPassword(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (err) { setPwdError(err.message); return; }
    setPwdSuccess(true);
    setNewPassword(''); setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        {/* Header avec avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full flex items-center justify-center shrink-0"
               style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}>
            <span style={{ fontSize: 32, color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
              {(firstName?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gris)' }}>
              mon compte
            </div>
            <h1 className="text-3xl sm:text-4xl leading-tight truncate"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, color: 'var(--ink)' }}>
              {firstName || 'Bienvenue'}
            </h1>
            <div className="text-[13px] mt-0.5 truncate" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              {email}
            </div>
          </div>
        </div>

        {/* Section: infos personnelles */}
        <form onSubmit={saveProfile} className="wl-card p-5 sm:p-6" style={{ borderRadius: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <UserCircle size={18} style={{ color: 'var(--corail)' }} />
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              Informations personnelles
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>prénom</label>
                <AuthField icon={User} type="text" placeholder="prénom" value={firstName} onChange={setFirstName} autoComplete="given-name" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>nom</label>
                <AuthField icon={User} type="text" placeholder="nom" value={lastName} onChange={setLastName} autoComplete="family-name" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>email (identifiant)</label>
              <AuthField icon={Mail} type="email" placeholder="email" value={email} onChange={setEmail} autoComplete="email" disabled />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>langue maternelle · native language</label>
              <SelectField icon={Globe2} value={nativeLang} onChange={setNativeLang}
                options={Object.values(NATIVE_LANGUAGES).map(l => ({ value: l.code, label: `${l.flag} ${l.label}` }))} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>date de naissance</label>
              <AuthField icon={Calendar} type="date" placeholder="date de naissance" value={birthDate} onChange={setBirthDate} autoComplete="bday" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>adresse</label>
              <AuthField icon={MapPin} type="text" placeholder="12 rue Lafayette, 75009 Paris" value={address} onChange={setAddress} autoComplete="street-address" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>téléphone</label>
              <PhoneField dialCode={dialCode} onDialChange={setDialCode} number={phoneNumber} onNumberChange={setPhoneNumber} />
            </div>

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={saving}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {savedFlash ? (<><Check size={16} /> enregistré !</>) : (saving ? 'enregistrement…' : 'Enregistrer les modifications')}
            </button>
          </div>
        </form>

        {/* Section: lexique */}
        {onOpenLexicon && (
          <button onClick={onOpenLexicon}
            className="w-full text-left wl-card p-5 sm:p-6 mt-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all group"
            style={{ borderRadius: '24px', border: '1.5px solid rgba(255, 56, 92, 0.22)' }}>
            <div className="rounded-full flex items-center justify-center shrink-0"
                 style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FFE5D9, #FFF3E0)', border: '1.5px solid rgba(255,56,92,0.25)' }}>
              <LexiconIcon size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                  Mon lexique
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ fontFamily: 'DM Sans', color: 'var(--corail)' }}>
                  toutes langues
                </span>
              </div>
              <p className="text-[13px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                Tous les mots dont vous avez demandé la traduction
              </p>
            </div>
            <span className="shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--corail)', fontFamily: 'Fraunces, Georgia, serif', fontSize: 20 }}>→</span>
          </button>
        )}

        {/* Section: appareil */}
        {onChangeDevice && (() => {
          const dev = DEVICES.find(d => d.id === device) || DEVICES.find(d => d.id === 'other') || DEVICES[0];
          const color = dev?.color || 'var(--corail)';
          return (
            <button onClick={onChangeDevice}
              className="w-full text-left wl-card p-5 sm:p-6 mt-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all group"
              style={{ borderRadius: '24px', border: `1.5px solid ${color}33` }}>
              <div className="rounded-full flex items-center justify-center shrink-0"
                   style={{ width: 56, height: 56, background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}18)` }}>
                <span style={{ fontSize: 26 }}>{dev.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    Mon appareil
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ fontFamily: 'DM Sans', color }}>
                    {dev.name}
                  </span>
                </div>
                <p className="text-[13px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  Toucher pour changer l'appareil
                </p>
              </div>
              <span className="shrink-0 group-hover:translate-x-1 transition-transform" style={{ color, fontFamily: 'Fraunces, Georgia, serif', fontSize: 20 }}>→</span>
            </button>
          );
        })()}

        {/* Section: mot de passe */}
        <form onSubmit={changePassword} className="wl-card p-5 sm:p-6 mt-5" style={{ borderRadius: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} style={{ color: 'var(--corail)' }} />
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              Changer mon mot de passe
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>nouveau mot de passe</label>
              <AuthField icon={Lock} type="password" placeholder="6 caractères minimum" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>confirmer</label>
              <AuthField icon={Lock} type="password" placeholder="ressaisir" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            </div>

            {pwdError && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {pwdError}
              </div>
            )}

            <button type="submit" disabled={changingPassword || !newPassword}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {changingPassword && <Loader2 size={16} className="animate-spin" />}
              {pwdSuccess ? (<><Check size={16} /> mot de passe mis à jour</>) : (changingPassword ? 'mise à jour…' : 'Changer mon mot de passe')}
            </button>
          </div>
        </form>

        {/* Section: mes tests de niveau */}
        <div className="wl-card p-5 sm:p-6 mt-5" style={{ borderRadius: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 18 }}>🎯</span>
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              Mes tests de niveau
            </h2>
          </div>

          {/* Deux options pour définir son niveau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            <button onClick={onStartTest}
              className="text-left p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
              style={{
                background: 'linear-gradient(135deg, #FF385C, #E31C5F)',
                boxShadow: '0 4px 14px rgba(255, 56, 92, 0.25)',
                border: 'none',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 18 }}>🎯</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90" style={{ fontFamily: 'DM Sans' }}>
                  auto · 3–4 min
                </span>
              </div>
              <div className="text-white leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500 }}>
                Passer un test
              </div>
              <div className="text-[12px] mt-0.5 text-white/85" style={{ fontFamily: 'DM Sans' }}>
                Discussion avec un tuteur qui évalue votre niveau
              </div>
            </button>

            <button onClick={onManualLevel}
              className="text-left p-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: 'white',
                border: '1.5px solid rgba(255, 56, 92, 0.35)',
                boxShadow: '0 2px 8px rgba(255, 56, 92, 0.10)',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 18 }}>📝</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--corail)' }}>
                  manuel · rapide
                </span>
              </div>
              <div className="leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>
                Choisir mon niveau
              </div>
              <div className="text-[12px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                Je connais déjà mon niveau, je le sélectionne
              </div>
            </button>
          </div>

          {loadingTests && (
            <div className="text-center py-6" style={{ color: 'var(--gris)' }}>
              <Loader2 size={18} className="animate-spin inline mr-2" />
              chargement…
            </div>
          )}

          {!loadingTests && tests.length === 0 && (
            <div className="text-center py-6 text-sm" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
              Aucun test enregistré pour le moment.<br/>
              Faites votre premier test pour connaître votre niveau ✨
            </div>
          )}

          {!loadingTests && tests.length > 0 && (
            <div className="space-y-2.5">
              {tests.map((t, i) => {
                const langObj = LANGUAGES[t.language_code];
                const langAccent = langObj?.accent || 'var(--corail)';
                const cefrColor = { A1:'#78716C', A2:'#A78BFA', B1:'#FF385C', B2:'#E88865', C1:'#FCD34D', C2:'#22C55E' }[t.cefr] || 'var(--corail)';
                const isOpen = expandedTest === (t.id || t._local_id || i);
                return (
                  <div key={t.id || t._local_id || i}
                       style={{
                         borderRadius: '18px',
                         background: 'white',
                         border: `1px solid ${langAccent}33`,
                         boxShadow: `0 2px 6px ${langAccent}12`,
                       }}>
                    <button
                      onClick={() => setExpandedTest(isOpen ? null : (t.id || t._local_id || i))}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-black/5 rounded-[18px] transition-colors">
                      {/* Pastille CEFR */}
                      <div className="shrink-0 rounded-full flex items-center justify-center text-white font-bold"
                           style={{
                             width: 46, height: 46,
                             background: `radial-gradient(circle at 30% 30%, ${cefrColor}, ${cefrColor}CC)`,
                             boxShadow: `0 2px 8px ${cefrColor}55`,
                             fontFamily: 'Fraunces, Georgia, serif',
                             fontSize: 16,
                           }}>
                        {t.cefr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                            {langObj?.glyph} {t.language_name || langObj?.name || t.language_code}
                          </span>
                          {typeof t.score === 'number' && (
                            <span className="text-[11px] font-bold" style={{ fontFamily: 'DM Sans', color: cefrColor }}>
                              {t.score}/100
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                          {formatTestDate(t.taken_at)} · {t.exchanges || '?'} échanges
                        </div>
                      </div>
                      <span className="shrink-0 text-[color:var(--gris)]" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>→</span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-2 text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                        {t.strengths_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#22C55E', fontFamily: 'DM Sans' }}>✓ points forts</span>
                            <p className="mt-0.5">{t.strengths_fr}</p>
                          </div>
                        )}
                        {t.weaknesses_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--corail-2)', fontFamily: 'DM Sans' }}>→ à travailler</span>
                            <p className="mt-0.5">{t.weaknesses_fr}</p>
                          </div>
                        )}
                        {t.advice_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--corail)', fontFamily: 'DM Sans' }}>💡 conseil</span>
                            <p className="mt-0.5">{t.advice_fr}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: zone dangereuse — supprimer le compte */}
        <div className="mt-8 p-5 sm:p-6" style={{ borderRadius: '24px', border: '1.5px solid rgba(220, 38, 38, 0.3)', background: 'white' }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 18 }}>⚠️</span>
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#B91C1C' }}>
              Zone dangereuse
            </h2>
          </div>

          {!showDelete ? (
            <div>
              <p className="text-[13px] mb-3" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                Supprimer votre compte effacera définitivement votre profil, vos conversations, votre lexique, vos tests de niveau et vos exercices. Cette action est irréversible.
              </p>
              <button onClick={() => { setShowDelete(true); setDeleteError(null); }}
                className="px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors"
                style={{
                  fontFamily: 'DM Sans',
                  background: 'white',
                  color: '#B91C1C',
                  border: '1.5px solid #FCA5A5',
                }}>
                <X size={14} /> Supprimer mon compte
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[14px] mb-3" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                Pour confirmer, tapez <strong style={{ color: '#B91C1C' }}>SUPPRIMER</strong> ci-dessous. Toutes vos données seront perdues définitivement.
              </p>
              <input
                type="text"
                placeholder="tapez SUPPRIMER pour confirmer"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deleting}
                className="w-full px-4 py-3 rounded-2xl focus:outline-none disabled:opacity-60"
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: 15,
                  border: '1.5px solid #FCA5A5',
                  background: '#FEF2F2',
                  color: 'var(--ink)',
                }}
              />

              {deleteError && (
                <div className="mt-3 wl-card px-4 py-3 text-sm font-semibold"
                     style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                  ⚠️ {deleteError}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button onClick={() => { setShowDelete(false); setDeleteConfirmText(''); setDeleteError(null); }}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
                  style={{ fontFamily: 'DM Sans', background: 'white', color: 'var(--ink)', border: '1.5px solid rgba(90,78,69,0.2)' }}>
                  Annuler
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleting || deleteConfirmText.trim() !== 'SUPPRIMER'}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'DM Sans',
                    background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                  }}>
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {deleting ? 'suppression…' : 'Supprimer définitivement'}
                </button>
              </div>

              <p className="mt-3 text-[11px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                Un email de confirmation peut vous être envoyé selon la configuration du service.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTestDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `Aujourd'hui à ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── I18n : dictionnaire + contexte React ─────────────────────────────────────
// TRANSLATIONS[key] = { fr, en, es, pt, de } — chaque clé décrit une chaîne
// visible dans l'interface. Le hook useT() retourne t(key) qui rend la version
// dans la langue d'origine de l'utilisateur, avec repli vers le français.
const TRANSLATIONS = {
  // Communes
  'hello':                  { fr: 'bonjour',                       en: 'hello',                        es: 'hola',                          pt: 'olá',                          de: 'hallo' },
  'back':                   { fr: 'retour',                        en: 'back',                         es: 'volver',                        pt: 'voltar',                       de: 'zurück' },
  'continue':               { fr: 'Continuer →',                   en: 'Continue →',                   es: 'Continuar →',                   pt: 'Continuar →',                  de: 'Weiter →' },
  'loading':                { fr: 'un instant…',                   en: 'one moment…',                  es: 'un momento…',                   pt: 'um instante…',                 de: 'einen Moment…' },
  'save':                   { fr: 'Enregistrer',                   en: 'Save',                         es: 'Guardar',                       pt: 'Guardar',                      de: 'Speichern' },
  'saved':                  { fr: 'enregistré !',                  en: 'saved!',                       es: '¡guardado!',                    pt: 'guardado!',                    de: 'gespeichert!' },
  'saving':                 { fr: 'enregistrement…',               en: 'saving…',                      es: 'guardando…',                    pt: 'a guardar…',                   de: 'speichere…' },
  'signout':                { fr: 'déconnexion',                   en: 'sign out',                     es: 'cerrar sesión',                 pt: 'sair',                         de: 'abmelden' },
  'my_account':             { fr: 'mon compte',                    en: 'my account',                   es: 'mi cuenta',                     pt: 'a minha conta',                de: 'mein Konto' },
  'my_lexicon':             { fr: 'mon lexique',                   en: 'my lexicon',                   es: 'mi léxico',                     pt: 'o meu léxico',                 de: 'mein Lexikon' },
  // Langue picker
  'lang.title':             { fr: 'Quelle langue voulez-vous apprendre ?', en: 'Which language do you want to learn?', es: '¿Qué idioma quieres aprender?', pt: 'Que idioma quer aprender?', de: 'Welche Sprache möchten Sie lernen?' },
  'lang.subtitle':          { fr: "Chaque langue est une invitation au voyage. Choisissez celle qui vous fait rêver aujourd'hui.", en: 'Every language is an invitation to travel. Pick the one that inspires you today.', es: 'Cada idioma es una invitación al viaje. Elige el que te haga soñar hoy.', pt: 'Cada idioma é um convite para viajar. Escolha o que o faz sonhar hoje.', de: 'Jede Sprache ist eine Einladung zum Reisen. Wählen Sie die, die Sie heute träumen lässt.' },
  'lang.choose':             { fr: 'choisissez',                   en: 'pick one',                     es: 'elige',                         pt: 'escolha',                      de: 'wählen Sie' },
  'lang.or_another':        { fr: '· ou choisir une autre langue ·', en: '· or pick another language ·', es: '· o elige otro idioma ·',      pt: '· ou escolha outro idioma ·',  de: '· oder wählen Sie eine andere Sprache ·' },
  'lang.resume_with':       { fr: '📖 reprendre avec',              en: '📖 resume with',                es: '📖 continuar con',              pt: '📖 continuar com',             de: '📖 fortsetzen mit' },
  'lang.other_teacher':     { fr: 'autre\nprof',                    en: 'other\nteacher',               es: 'otro\nprofe',                   pt: 'outro\nprof',                  de: 'anderer\nLehrer' },
  'lang.step':              { fr: 'langue',                        en: 'language',                     es: 'idioma',                        pt: 'idioma',                       de: 'Sprache' },
  // Level picker
  'level.your_in':          { fr: 'Votre niveau en',               en: 'Your level in',                es: 'Tu nivel en',                   pt: 'O seu nível em',               de: 'Ihr Niveau in' },
  'level.honest':           { fr: "Soyez honnête — c'est mieux de commencer un peu en dessous et de progresser.", en: 'Be honest — better to start a bit below and progress.', es: 'Sé honesto — mejor empezar un poco por debajo y avanzar.', pt: 'Seja honesto — é melhor começar um pouco abaixo e progredir.', de: 'Seien Sie ehrlich — besser etwas darunter beginnen und wachsen.' },
  'level.evaluate':         { fr: 'Évaluer mon niveau',            en: 'Assess my level',              es: 'Evaluar mi nivel',              pt: 'Avaliar o meu nível',          de: 'Mein Niveau bewerten' },
  'level.evaluate_sub':     { fr: 'Une petite discussion pour déterminer votre niveau automatiquement', en: 'A short chat to determine your level automatically', es: 'Una pequeña charla para determinar tu nivel automáticamente', pt: 'Uma conversa curta para determinar o seu nível automaticamente', de: 'Ein kurzes Gespräch, um Ihr Niveau automatisch zu ermitteln' },
  'level.or_direct':        { fr: '· ou choisir directement ·',    en: '· or pick directly ·',         es: '· o elige directamente ·',      pt: '· ou escolha diretamente ·',   de: '· oder direkt wählen ·' },
  'level.step':             { fr: 'niveau',                        en: 'level',                        es: 'nivel',                         pt: 'nível',                        de: 'Niveau' },
  // Mode picker
  'mode.discuss':           { fr: 'Discuter',                      en: 'Chat',                         es: 'Charlar',                       pt: 'Conversar',                    de: 'Sprechen' },
  'mode.scenarios':         { fr: 'Scénarios',                     en: 'Scenarios',                    es: 'Escenarios',                    pt: 'Cenários',                     de: 'Szenarien' },
  'mode.reader':            { fr: 'Lecture',                       en: 'Reader',                       es: 'Lectura',                       pt: 'Leitura',                      de: 'Lesen' },
  'mode.exercises':         { fr: 'Exercices',                     en: 'Exercises',                    es: 'Ejercicios',                    pt: 'Exercícios',                   de: 'Übungen' },
  'mode.lexicon':           { fr: 'Lexique',                       en: 'Lexicon',                      es: 'Léxico',                        pt: 'Léxico',                       de: 'Lexikon' },
  'mode.discuss_sub':       { fr: 'Conversation libre avec ton prof', en: 'Free conversation with your teacher', es: 'Charla libre con tu profe', pt: 'Conversa livre com o professor', de: 'Freies Gespräch mit Ihrem Lehrer' },
  'mode.scenarios_sub':     { fr: 'Situations réelles à jouer',     en: 'Real-life situations to role-play', es: 'Situaciones reales para jugar', pt: 'Situações reais para representar', de: 'Reale Szenarien zum Nachspielen' },
  'mode.reader_sub':        { fr: 'Textes courts pour lire et apprendre', en: 'Short texts to read and learn', es: 'Textos cortos para leer y aprender', pt: 'Textos curtos para ler e aprender', de: 'Kurze Texte zum Lesen und Lernen' },
  'mode.exercises_sub':     { fr: 'Grammaire, vocabulaire, correction', en: 'Grammar, vocabulary, corrections', es: 'Gramática, vocabulario, corrección', pt: 'Gramática, vocabulário, correção', de: 'Grammatik, Wortschatz, Korrektur' },
  'mode.lexicon_sub':       { fr: 'Tes mots enregistrés',           en: 'Your saved words',             es: 'Tus palabras guardadas',        pt: 'As suas palavras guardadas',    de: 'Ihre gespeicherten Wörter' },
  'mode.change_lang':       { fr: '← changer de langue',            en: '← change language',            es: '← cambiar de idioma',           pt: '← mudar de idioma',            de: '← Sprache wechseln' },
  // Reader
  'reader.title':           { fr: 'Lecture',                       en: 'Reader',                       es: 'Lectura',                       pt: 'Leitura',                      de: 'Lesen' },
  'reader.topic':           { fr: 'sujet',                         en: 'topic',                        es: 'tema',                          pt: 'tema',                         de: 'Thema' },
  'reader.generating':      { fr: 'génération…',                    en: 'generating…',                  es: 'generando…',                    pt: 'a gerar…',                     de: 'wird erstellt…' },
  'reader.new_text':        { fr: 'nouveau texte',                 en: 'new text',                     es: 'nuevo texto',                   pt: 'novo texto',                   de: 'neuer Text' },
  'reader.hint':            { fr: '↳ touchez un mot pour sa traduction et son explication', en: '↳ tap a word for its translation and explanation', es: '↳ toca una palabra para su traducción y explicación', pt: '↳ toque numa palavra para tradução e explicação', de: '↳ tippen Sie ein Wort für Übersetzung und Erklärung an' },
  'reader.native_translation': { fr: 'traduction française',       en: 'English translation',          es: 'traducción española',           pt: 'tradução em português',        de: 'deutsche Übersetzung' },
  // Exercises
  'ex.title':               { fr: 'Exercices',                     en: 'Exercises',                    es: 'Ejercicios',                    pt: 'Exercícios',                   de: 'Übungen' },
  // Scenarios
  'scen.title':             { fr: 'Scénarios de conversation',      en: 'Conversation scenarios',       es: 'Escenarios de conversación',    pt: 'Cenários de conversação',      de: 'Gesprächsszenarien' },
  'scen.listen_read':       { fr: 'écouter · lire',                 en: 'listen · read',                es: 'escuchar · leer',               pt: 'ouvir · ler',                  de: 'hören · lesen' },
  'scen.play':              { fr: 'jouer le scénario',              en: 'play the scenario',            es: 'jugar el escenario',            pt: 'jogar o cenário',              de: 'Szenario spielen' },
  // Signup / profile
  'auth.first_name':        { fr: 'prénom',                        en: 'first name',                   es: 'nombre',                        pt: 'primeiro nome',                de: 'Vorname' },
  'auth.last_name':         { fr: 'nom',                           en: 'last name',                    es: 'apellido',                      pt: 'apelido',                      de: 'Nachname' },
  'auth.email':             { fr: 'votre email',                   en: 'your email',                   es: 'tu correo',                     pt: 'o seu email',                  de: 'Ihre E-Mail' },
  'auth.password':          { fr: 'mot de passe (6 caractères min.)', en: 'password (min 6 chars)',    es: 'contraseña (mín 6)',            pt: 'palavra-passe (mín 6)',        de: 'Passwort (min. 6 Zeichen)' },
  'auth.native_lang':       { fr: 'langue maternelle',              en: 'native language',              es: 'idioma materno',                pt: 'idioma materno',               de: 'Muttersprache' },
  'auth.essential':         { fr: 'Quelques infos essentielles',    en: 'A few essential details',      es: 'Algunos datos esenciales',      pt: 'Alguns dados essenciais',      de: 'Ein paar wichtige Angaben' },
  'auth.complete':          { fr: 'Complétez votre profil',         en: 'Complete your profile',        es: 'Completa tu perfil',            pt: 'Complete o seu perfil',        de: 'Vervollständigen Sie Ihr Profil' },
  'auth.pleased':           { fr: 'Enchanté !',                    en: 'Welcome!',                     es: '¡Encantado!',                   pt: 'Prazer!',                      de: 'Willkommen!' },
  'auth.address':           { fr: 'adresse (ex: 12 rue Lafayette, 75009 Paris)', en: 'address (e.g. 12 Main St, London)', es: 'dirección', pt: 'morada', de: 'Adresse' },
  'auth.phone':             { fr: 'téléphone',                     en: 'phone',                        es: 'teléfono',                      pt: 'telefone',                     de: 'Telefon' },
  'auth.birth':             { fr: 'date de naissance',              en: 'date of birth',                es: 'fecha de nacimiento',           pt: 'data de nascimento',           de: 'Geburtsdatum' },
  'auth.finish':            { fr: '🎉 Terminer',                   en: '🎉 Finish',                    es: '🎉 Finalizar',                  pt: '🎉 Concluir',                  de: '🎉 Fertigstellen' },
  'auth.creating':          { fr: 'création…',                     en: 'creating…',                    es: 'creando…',                      pt: 'a criar…',                     de: 'wird erstellt…' },
  'auth.check_email':       { fr: 'Vérifie tes emails !',           en: 'Check your inbox!',            es: '¡Revisa tu correo!',            pt: 'Verifique o seu email!',       de: 'Prüfen Sie Ihr Postfach!' },
  'auth.go_login':          { fr: 'Aller à la connexion →',         en: 'Go to sign in →',              es: 'Ir a iniciar sesión →',         pt: 'Ir para iniciar sessão →',     de: 'Zur Anmeldung →' },
  'auth.pick_lang':         { fr: 'Choisissez votre langue',        en: 'Choose your language',         es: 'Elige tu idioma',               pt: 'Escolha o seu idioma',         de: 'Wählen Sie Ihre Sprache' },
  'auth.pick_lang_sub':     { fr: "L'application sera dans cette langue", en: 'The app will be in this language', es: 'La aplicación estará en este idioma', pt: 'A aplicação estará neste idioma', de: 'Die App wird in dieser Sprache sein' },
  'auth.email_will_send':   { fr: 'Un email a été envoyé à',        en: 'An email has been sent to',    es: 'Se ha enviado un correo a',     pt: 'Foi enviado um email para',    de: 'Eine E-Mail wurde gesendet an' },
  'auth.email_click':       { fr: "Clique sur le lien pour activer ton compte, puis reviens ici 👇", en: 'Click the link to activate your account, then come back here 👇', es: 'Haz clic en el enlace para activar tu cuenta y vuelve aquí 👇', pt: 'Clique no link para ativar a sua conta, depois volte aqui 👇', de: 'Klicken Sie auf den Link, um Ihr Konto zu aktivieren, dann kommen Sie hierher zurück 👇' },
  'auth.create_account':    { fr: 'Créer mon compte 🚀',            en: 'Create my account 🚀',         es: 'Crear mi cuenta 🚀',            pt: 'Criar a minha conta 🚀',       de: 'Konto erstellen 🚀' },
  'auth.signing_up':        { fr: 'inscription…',                   en: 'signing up…',                  es: 'registrando…',                  pt: 'a registar…',                  de: 'registrieren…' },
  'auth.have_account':      { fr: 'Déjà un compte ?',              en: 'Already have an account?',     es: '¿Ya tienes cuenta?',            pt: 'Já tem uma conta?',            de: 'Schon ein Konto?' },
  'auth.signin':            { fr: 'Se connecter →',                en: 'Sign in →',                    es: 'Iniciar sesión →',              pt: 'Iniciar sessão →',             de: 'Anmelden →' },
  'auth.editable_later':    { fr: 'Ces informations sont modifiables plus tard depuis votre compte.', en: 'You can edit this later from your account.', es: 'Puedes cambiar esto más tarde desde tu cuenta.', pt: 'Pode editar estes dados mais tarde na sua conta.', de: 'Sie können diese Angaben später in Ihrem Konto ändern.' },
  'auth.err_fill_all':      { fr: 'Merci de remplir tous les champs.', en: 'Please fill in all fields.', es: 'Por favor completa todos los campos.', pt: 'Por favor preencha todos os campos.', de: 'Bitte alle Felder ausfüllen.' },
  'auth.err_password_short':{ fr: 'Le mot de passe doit faire au moins 6 caractères.', en: 'Password must be at least 6 characters.', es: 'La contraseña debe tener al menos 6 caracteres.', pt: 'A palavra-passe deve ter pelo menos 6 caracteres.', de: 'Das Passwort muss mindestens 6 Zeichen haben.' },
  'auth.err_phone_required':{ fr: 'Le numéro de téléphone est obligatoire.', en: 'Phone number is required.', es: 'El número de teléfono es obligatorio.', pt: 'O número de telefone é obrigatório.', de: 'Telefonnummer ist erforderlich.' },
  'auth.err_email_required':{ fr: "L'email est obligatoire.",       en: 'Email is required.',           es: 'El correo es obligatorio.',     pt: 'O email é obrigatório.',       de: 'E-Mail ist erforderlich.' },
  'auth.service_missing':   { fr: 'Service non configuré.',         en: 'Service not configured.',      es: 'Servicio no configurado.',      pt: 'Serviço não configurado.',     de: 'Dienst nicht konfiguriert.' },
  'auth.back':              { fr: 'retour',                        en: 'back',                         es: 'volver',                        pt: 'voltar',                       de: 'zurück' },
  // Profile screen
  'profile.title':          { fr: 'Informations personnelles',      en: 'Personal information',         es: 'Información personal',          pt: 'Informação pessoal',           de: 'Persönliche Angaben' },
  'profile.email_login':    { fr: 'email (identifiant)',            en: 'email (login)',                es: 'correo (identificador)',        pt: 'email (identificador)',        de: 'E-Mail (Login)' },
  'profile.welcome':        { fr: 'Bienvenue',                     en: 'Welcome',                      es: 'Bienvenido',                    pt: 'Bem-vindo',                    de: 'Willkommen' },
};

// Contexte React exposant t() dans toute l'app
const I18nContext = React.createContext({ nativeLang: 'fr', t: (k, f) => f || k });

function I18nProvider({ nativeLang, children }) {
  const t = React.useCallback((key, fallback) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return fallback || key;
    return entry[nativeLang] || entry.fr || fallback || key;
  }, [nativeLang]);
  return <I18nContext.Provider value={{ nativeLang, t }}>{children}</I18nContext.Provider>;
}

function useT() { return React.useContext(I18nContext).t; }
function useNativeLang() { return React.useContext(I18nContext).nativeLang; }

function AuthGate({ children }) {
  const { session, profile, loading, signOut, reloadProfile, recovering, clearRecovery } = useAuth();
  const [mode, setMode] = useState('welcome'); // welcome | login | signup | forgot
  const [forgotEmail, setForgotEmail] = useState('');

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="wl-card p-6 max-w-md text-center"
             style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2">configuration manquante</div>
          <p className="italic">
            Les clés Supabase ne sont pas configurées.<br/>
            Ajoutez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> dans les variables d'environnement Vercel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--corail-2)' }} />
      </div>
    );
  }

  // Priority: user arrived from the password-recovery email link.
  // Supabase auto-creates a session bound to the recovery token.
  if (recovering && session) {
    return <ResetPasswordScreen onDone={async () => {
      clearRecovery();
      // Sign out to force a fresh login with the new password
      await supabase.auth.signOut();
      setMode('login');
    }} />;
  }

  if (!session) {
    if (mode === 'forgot') return <ForgotPasswordForm
      prefilledEmail={forgotEmail}
      onBack={() => setMode('login')}
      onGoLogin={() => setMode('login')} />;
    if (mode === 'login')  return <LoginForm
      onBack={() => setMode('welcome')}
      onGoSignup={() => setMode('signup')}
      onGoForgot={(email) => { setForgotEmail(email); setMode('forgot'); }} />;
    if (mode === 'signup') return <SignupForm onBack={() => setMode('welcome')} onGoLogin={() => setMode('login')} />;
    return <WelcomeScreen onLogin={() => setMode('login')} onSignup={() => setMode('signup')} />;
  }

  // User authenticated — render the app with profile context
  return React.cloneElement(children, { profile, signOut, reloadProfile });
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function MainApp({ profile, signOut, reloadProfile }) {
  // First-launch device chooser: show it once if no explicit choice yet.
  const hasDeviceChoice = (() => { try { return !!storage.get(DEVICE_KEY); } catch { return false; } })();
  // Start in a special 'autoloading' state when the device is already set,
  // so we don't flash Screen 1 before we know whether to jump to Screen 3.
  const [step, setStep] = useState(hasDeviceChoice ? 'autoloading' : 'device');
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [deviceChoice, setDeviceChoice] = useState(getUserDevice());
  const [autoloadDone, setAutoloadDone] = useState(false);

  // On first load, if a saved session exists for THIS user, restore language + level
  // and jump straight to the mode picker (screen 3) instead of the language picker.
  // Synchronise le global userNativeLang dès que le profil se charge/change
  // pour que les buildeurs de prompts IA (hors composants) connaissent la
  // langue d'origine sans devoir threader le profil partout.
  useEffect(() => {
    setUserNativeLang(profile?.native_language || 'fr');
  }, [profile?.native_language]);

  useEffect(() => {
    if (autoloadDone) return;
    if (!profile?.id) {
      // No profile yet: keep autoloading state until the profile is ready
      return;
    }
    loadLastSession(profile.id).then(s => {
      setAutoloadDone(true);
      const lang = s && LANGUAGES[s.langCode];
      const lv   = s && LEVELS[s.levelId];
      if (lang && lv) {
        setLanguage(lang);
        setLevel(lv);
        setStep(current => (current === 'autoloading' ? 'mode' : current));
      } else {
        setStep(current => (current === 'autoloading' ? 'language' : current));
      }
    });
  }, [profile?.id, autoloadDone]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

    const style = document.createElement('style');
    style.textContent = `
      @keyframes avatar-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }
      @keyframes avatar-bounce {
        0%, 100% { transform: scale(1.05) translateY(0); }
        50% { transform: scale(1.07) translateY(-2px); }
      }
      @keyframes avatar-ping {
        0% { transform: scale(1); opacity: 0.4; }
        80%, 100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes slidein-right {
        from { transform: translateX(100%); }
        to   { transform: translateX(0); }
      }
      @keyframes avatar-wave {
        0%   { transform: rotate(0deg); opacity: 0; }
        15%  { opacity: 1; }
        25%  { transform: rotate(-20deg); }
        50%  { transform: rotate(20deg); }
        75%  { transform: rotate(-15deg); }
        90%  { transform: rotate(0deg); opacity: 1; }
        100% { transform: rotate(0deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); document.head.removeChild(style); } catch (e) {}
    };
  }, []);

  if (step === 'autoloading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className="text-center">
          <Loader2 size={28} className="animate-spin inline mb-3" style={{ color: 'var(--corail-2)' }} />
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)', fontSize: 15 }}>
            {TRANSLATIONS['loading']?.[profile?.native_language || 'fr'] || 'un instant…'}
          </p>
        </div>
      </div>
    );
  }
  if (step === 'device')   return <DeviceChooserScreen
    forceShow={!hasDeviceChoice}
    currentDevice={deviceChoice}
    onSaved={(d) => { setDeviceChoice(d); setStep(hasDeviceChoice ? 'profile' : 'language'); }}
    onSkip={hasDeviceChoice ? () => setStep('profile') : null} />;
  if (step === 'profile')  return <ProfileScreen profile={profile}
    onBack={() => setStep(language ? 'mode' : 'language')}
    onProfileUpdated={reloadProfile}
    onStartTest={() => setStep('picklangfortest')}
    onManualLevel={() => setStep('manuallevel')}
    onChangeDevice={() => setStep('device')}
    onOpenLexicon={() => setStep('lexicon')}
    signOut={signOut}
    device={deviceChoice} />;
  if (step === 'picklangfortest') return <LanguagePickForTest
    onBack={() => setStep('profile')}
    onSelect={(l) => { setLanguage(l); setStep('leveltest'); }} />;
  if (step === 'manuallevel') return <ManualLevelPickerScreen
    onBack={() => setStep('profile')}
    onSaved={() => setStep('profile')} />;
  if (step === 'language') return <LanguagePicker
    profile={profile} signOut={signOut}
    onSelect={(l) => {
      setLanguage(l);
      // Si on est déjà venu dans cette langue, on retrouve son niveau + son prof.
      const prev = loadLangChoice(profile?.id, l.code);
      if (prev) {
        const lv = LEVELS[prev.levelId];
        const av = l.avatars.find(a => a.id === prev.avatarId);
        if (lv && av) {
          setLevel(lv);
          setAvatar(av);
          return setStep('mode');
        }
      }
      setStep('level');
    }}
    onOpenProfile={() => setStep('profile')}
    onOpenLexicon={() => setStep('lexicon')}
    onResumeLast={(s) => { setLanguage(s.lang); setLevel(s.level); setAvatar(s.avatar); setStep('chat'); }}
    onChangeAvatarForLast={(s) => { setLanguage(s.lang); setLevel(s.level); setAvatar(null); setStep('avatar'); }}
  />;
  if (step === 'level')    return <LevelPicker language={language}
    onSelect={(lv) => { setLevel(lv); setStep('mode'); }}
    onStartTest={() => setStep('leveltest')}
    onBack={() => setStep('language')} />;
  if (step === 'leveltest') return <LevelTestScreen language={language}
    onLevelDetermined={(lv) => { setLevel(lv); setStep('mode'); }}
    onBack={() => setStep('level')} />;
  if (step === 'mode')     return <ModePicker language={language} level={level}
    profile={profile}
    signOut={signOut}
    onOpenProfile={() => setStep('profile')}
    onOpenLexicon={() => setStep('lexicon')}
    onSelect={(m) => {
      if (m === 'chat') { setScenario(null); return setStep('avatar'); }
      if (m === 'reader') return setStep('reader');
      if (m === 'exercises') return setStep('exercises');
      if (m === 'lexicon') return setStep('lexicon');
      if (m === 'scenarios') return setStep('scenarios');
    }}
    onResumeChat={(av) => { setScenario(null); setAvatar(av); setStep('chat'); }}
    onChangeLanguage={() => setStep('language')}
    onBack={() => setStep('level')} />;
  if (step === 'scenarios') return <ScenariosScreen lang={language} level={level}
    onBack={() => setStep('mode')}
    onStartScenario={(sc) => {
      setScenario(sc);
      // Utilise le prof déjà sélectionné pour cette langue :
      //   1. Le prof en cours (avatar) s'il est chargé
      //   2. Sinon, celui qu'on a stocké pour cette langue (loadLangChoice)
      //   3. Sinon, le 1er prof de la langue (pas au hasard — comportement stable)
      let av = avatar;
      if (!av) {
        const prev = loadLangChoice(profile?.id, language.code);
        if (prev) av = language.avatars.find(a => a.id === prev.avatarId) || null;
      }
      if (!av) av = language.avatars[0];
      setAvatar(av);
      // On mémorise aussi ce prof comme choix pour cette langue
      saveLangChoice(profile?.id, language.code, level.id, av.id);
      setStep('chat');
    }} />;
  if (step === 'avatar')   return <AvatarPicker language={language} level={level} onSelect={(a) => {
    setAvatar(a);
    // Sauvegarde dès la sélection du prof (avant même le 1er message)
    saveLangChoice(profile?.id, language.code, level.id, a.id);
    setStep('chat');
  }} onBack={() => setStep('mode')} />;
  // All 4 mode screens return to Screen 3 (ModePicker) on exit, keeping the
  // language + level context — the user changes language only by explicit choice.
  if (step === 'reader')   return <ReaderScreen lang={language} level={level}
    onBack={() => setStep('mode')}
    onOpenLexicon={() => setStep('lexicon')} />;
  if (step === 'exercises') return <ExercisesScreen lang={language} level={level} onBack={() => setStep('mode')} />;
  if (step === 'lexicon')  return <LexiconScreen lang={language} profile={profile}
    onBack={() => setStep(language ? 'mode' : 'language')} />;
  return <ChatScreen lang={language} level={level} avatar={avatar} profile={profile}
    scenario={scenario}
    onChangeAvatar={() => { setScenario(null); setStep('avatar'); }}
    onBackHome={() => { setScenario(null); setStep('mode'); }}
    onOpenExercises={() => setStep('exercises')}
    onOpenLexicon={() => setStep('lexicon')} />;
}

// Wrapper qui fournit le contexte i18n en fonction de la langue d'origine du profil
function I18nMainApp(props) {
  const nativeLang = props.profile?.native_language || 'fr';
  return (
    <I18nProvider nativeLang={nativeLang}>
      <MainApp {...props} />
    </I18nProvider>
  );
}

export default function App() {
  return <AuthGate><I18nMainApp /></AuthGate>;
}
