/**
 * ─── Campaign switch ──────────────────────────────────────────────────────────
 * The page leads with a free sample: every CTA reads "Get a free sample", and
 * the copy says samples are limited and confirmed by email.
 *
 * Set `trialConfirmed` to true once a specific offer is locked in (a free 2 kg
 * trial pack for the first 100 households). The whole page then switches to
 * that wording, including the mobile sticky CTA and the confirmation message.
 */
export const config = {
  trialConfirmed: false,
};

/**
 * Where sign-ups are sent. Set PUBLIC_FORM_ENDPOINT in a .env file (or in your
 * host's environment settings) to your Google Apps Script web app URL; see
 * docs/SETUP.md, part 2. Any service that accepts a form POST
 * and returns 2xx also works (Formspree, Basin).
 *
 * While it is not set:
 *  - `npm run dev` runs in test mode: the flow completes and the confirmation
 *    says clearly that nothing was saved;
 *  - a production build refuses to submit and tells the visitor sign-ups are
 *    not open yet, rather than quietly losing their details.
 */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT || "PLACEHOLDER";

export const site = {
  name: "Poshan",
  tagline: "Better Choices. Better Life.",
  description:
    "Fresh chakki atta, just like back home. Stone-ground in Melbourne and delivered to your door. Get a free sample.",
  email: "hello@poshan.com.au",
  url: "https://poshan.com.au",
};

export const cta = config.trialConfirmed
  ? {
      primary: "Get my free trial pack",
      nav: "Get my free trial",
      sticky: "Get my free trial pack",
      submit: "Claim my free trial pack",
      reassure: "Free 2 kg trial pack · First 100 households · Melbourne",
      sampleNote: "Free 2 kg trial packs go to the first 100 households. We'll email to arrange delivery.",
    }
  : {
      primary: "Get a free sample",
      nav: "Get a free sample",
      sticky: "Get a free sample",
      submit: "Request my free sample",
      reassure: "Limited samples · No payment · Melbourne families first",
      sampleNote: "Samples are limited. We'll email to confirm before anything is sent.",
    };

export const founding = config.trialConfirmed
  ? {
      body: "The first 100 Melbourne households to register get a free 2 kg trial pack of the blend that suits them. We'll reach out personally to arrange it and set up your deliveries.",
      badge: "First 100 households",
    }
  : {
      body: "We're starting small, with a limited number of Melbourne households. Request a free sample and we'll reach out personally to send it, hear what your family needs, and set up your deliveries.",
      badge: "Limited samples",
    };

export const goals = [
  { id: "protein", label: "More protein", hint: "For active bodies and growing kids" },
  { id: "fibre", label: "More fibre", hint: "Wholegrains, pulses and oats" },
  { id: "fresher", label: "Fresher atta", hint: "Milled days ago, not months" },
  { id: "family", label: "Family nutrition", hint: "Better everyday rotis for everyone" },
  { id: "other", label: "Something else", hint: "Tell us in a few words" },
] as const;

export type GoalId = (typeof goals)[number]["id"];

export const blends = [
  {
    id: "chakki",
    name: "Fresh chakki atta",
    tag: "The classic",
    body: "100% whole wheat, stone-ground and milled to order. The atta you already know, just fresher.",
    recipe: [{ grain: "Whole wheat", pct: 100 }],
  },
  {
    id: "multigrain",
    name: "Everyday Multigrain",
    tag: "For every day",
    body: "Wheat with chana, oats, jowar, soy and flax. More grains in every roti, for the whole family.",
    recipe: [
      { grain: "Wheat", pct: 70 },
      { grain: "Chana", pct: 10 },
      { grain: "Oats", pct: 8 },
      { grain: "Jowar", pct: 7 },
      { grain: "Soy", pct: 3 },
      { grain: "Flax", pct: 2 },
    ],
  },
  {
    id: "protein",
    name: "Lean Protein",
    tag: "For active families",
    body: "Half wheat, with lupin and chana blended in. For gym-goers and anyone after more protein and fewer carbs per roti.",
    recipe: [
      { grain: "Wheat", pct: 50 },
      { grain: "Lupin", pct: 20 },
      { grain: "Chana", pct: 15 },
      { grain: "Flax", pct: 5 },
      { grain: "Oats", pct: 5 },
      { grain: "Psyllium", pct: 5 },
    ],
  },
];

export const comingNext = [
  { name: "Balance", body: "With barley, methi and psyllium, for steadier everyday energy." },
  { name: "Heart", body: "With oat bran and barley, for families watching cholesterol." },
  { name: "Build your own", body: "Choose your grains within ranges that still make soft rotis." },
];

export const faqs = [
  {
    q: "What is Poshan?",
    a: "Poshan means nourishment in Hindi. We're a small Melbourne business stone-grinding fresh atta and wholegrain blends to order, starting with families in Melbourne's west.",
  },
  {
    q: "Will my rotis still turn out soft?",
    a: "That's the whole test. Every blend is at least half wheat, so the dough behaves the way you're used to, and we're trialling each one in Melbourne kitchens before we launch.",
  },
  {
    q: "Where will you deliver?",
    a: "Melbourne first, starting in the west. Your suburb helps us plan where to deliver first, which is why we ask for it.",
  },
  {
    q: "Is the sample really free?",
    a: "Yes. No payment and no commitment. Samples are limited, so we'll email to confirm before anything is sent.",
  },
  {
    q: "How does delivery work?",
    a: "Choose a pack size and how often you'd like it: every 2, 4 or 6 weeks. We mill each pack the week it's due and deliver it to your door. Pause, skip or change your blend whenever you like.",
  },
  {
    q: "How much will it cost?",
    a: "We'll share pricing when we set up your schedule, before you order anything. Registering is free and doesn't commit you to anything.",
  },
  {
    q: "What happens after I join?",
    a: "We'll email to confirm your free sample, then help set up a delivery schedule that suits your family. Only Poshan news, never spam, and you can unsubscribe any time.",
  },
  {
    q: "How should I store fresh atta?",
    a: "Airtight, in a cool, dry cupboard, and use it within a month or so. That's exactly why we mill smaller amounts, more often.",
  },
];

export const journey = {
  steps: [
    { title: "Grain, checked by hand", body: "Whole grain from Victorian farms is cleaned, sorted and checked before a single batch is milled." },
    { title: "Clean, hygienic milling", body: "Stone-milled in council-registered food premises, with sealed grain storage, hairnets, gloves and a certified food safety supervisor." },
    { title: "Stone-milled in small batches", body: "Ground slowly and sifted in the week your delivery is due. Never weeks ahead, and never in bulk." },
    { title: "Sealed and dated", body: "Packed into sealed, food-grade pouches labelled with the blend, every grain's percentage and the day it was milled." },
  ],
  hygiene: [
    "Council-registered food premises",
    "Certified food safety supervisor",
    "Sealed, pest-proof grain storage",
    "Benches cleaned between every batch",
    "Allergens labelled on every pack",
  ],
  delivery: [
    { title: "Request your free sample", body: "It takes 30 seconds. No payment and no commitment." },
    { title: "Taste the difference", body: "We'll get in touch and send your sample, so your family can try it in your own rotis." },
    { title: "We set up your schedule together", body: "Choose your blend, a pack size (2, 5 or 10 kg) and how often. Pause, skip or change any time." },
  ],
};
