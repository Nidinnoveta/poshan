# Poshan

Demand-validation landing page for **Poshan**: fresh, stone-ground atta milled
to order in Melbourne. One page, image-led, built to measure how many Melbourne
households want to try it.

Astro 5 + Tailwind CSS 4. Static output, no backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve the built site
```

## The two switches you will actually touch

Both live at the top of [`src/data/site.ts`](src/data/site.ts).

**`config.trialConfirmed`** (default `false`). The page leads with a free
sample: every CTA, including the mobile sticky button, reads *Get a free
sample*, and the form says samples are limited and confirmed by email. Set it
to `true` once a specific offer is locked in (a free 2 kg trial pack for the
first 100 households) and the whole page switches to that wording.

**Where sign-ups go: `PUBLIC_FORM_ENDPOINT`.** Sign-ups are collected in a
Google Sheet you own. Follow [`integrations/google-sheets/README.md`](integrations/google-sheets/README.md)
(about five minutes), then put the web app URL in a `.env` file:

```
PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/…/exec
```

Until it is set:

- `npm run dev` runs in **test mode**: the whole flow works, and the
  confirmation says clearly that nothing was saved;
- a production build refuses to submit and tells visitors sign-ups aren't
  open yet, rather than losing their details.

## What the signup sends

| Field | What it is |
| --- | --- |
| `goal`, `goal_label`, `goal_other` | What matters most (step 1), and their own words if they chose *Something else* |
| `blend` | The blend they'd like to try. Pre-selected when they click *Sample this blend*, otherwise *Not sure yet* |
| `first_name`, `email`, `suburb` | Required |
| `mobile` | Optional, for WhatsApp updates |
| `source` | From `?src=` or `?utm_source=` on the link they arrived through |
| `page` | The page URL |

Give each Facebook or WhatsApp group its own link, e.g.
`poshan.com.au/?src=tarneit-fb`, and `source` tells you which communities respond.

## How the page is put together

| Section | Component | Job |
| --- | --- | --- |
| Hero | `Hero.astro` | Keep your rotis. Upgrade your atta. |
| Concern | `Concern.astro` | You care about what your family eats… |
| Food safety | `Safety.astro` | What you can't see in your food still matters. |
| Difference | `Difference.astro` | Freshly milled. Thoughtfully made. + CTA |
| Heritage band | `Heritage.astro` | The same rotis. Better atta. |
| Range | `Range.astro` | Your family. Your preferences. Better choices. + CTA |
| Made and delivered | `Process.astro` | Milled clean. At your door before you run out. Four making steps, then how delivery will work, + CTA |
| Founding families | `Founding.astro` | Be among the first to bring Poshan home. + CTA |
| Goal picker | `GoalPicker.astro` | What matters most to your family? |
| FAQs | `Faq.astro` | |
| Closing CTA | `FinalCta.astro` | |
| Signup panel | `SignupModal.astro` | Free-sample request in two steps: goal tile, then blend, name, email and suburb |
| Sticky CTA | `StickyCta.astro` | Mobile only, appears after the hero |

Copy, blends and FAQs live in `src/data/site.ts`; images are registered in
`src/data/images.ts`; behaviour (reveals, signup panel, sticky bar) is in
`src/scripts/site.ts`. Motion respects `prefers-reduced-motion`.

No prices appear anywhere on the page, by design: this is demand validation.

## Images

| Files | Source | Licence |
| --- | --- | --- |
| `logo-*.png` | Your logo, background removed and trimmed | Yours |
| `hero-atta-bag`, `quality-atta`, `adulteration-risk`, `man-checking-atta`, `family-checking-pack`, `chapati-stack`, `flour-wheat`, `chakki-mill` | Supplied by you | Confirm you hold the rights |
| `tava-roti`, `rolling-chapati`, `hands-flour`, `flour-close`, `wheat-field`, `grains-flatlay`, `chickpeas-grains`, `oats-grains`, `couple-kitchen`, `grain-hands`, `flour-sifting`, `pouch-sealed`, `paratha-kitchen` | Pexels | Free for commercial use, no attribution required |

The `Imgaes/` drop folder and all `*.pdf` files are gitignored. **This repository
is public**, and the planning PDFs contain margins and budget figures.

## Before launch

1. Connect the Google Sheet, set `PUBLIC_FORM_ENDPOINT`, and send a real test sign-up.
2. Decide `trialConfirmed`.
3. Read the food-safety section with a food-labelling adviser. The border
   figures (lead 5.5×, arsenic 37× the Australian limit) are real and sourced
   on the page, from the Department of Agriculture's Failing Food Reports. The
   adulteration infographic and the blend descriptions make claims you have
   chosen to run ahead of lab testing.
4. Set the real domain in `astro.config.mjs` if it isn't `poshan.com.au`.
