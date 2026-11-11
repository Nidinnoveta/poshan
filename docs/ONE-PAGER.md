# Poshan website: one-pager

**Read this first if you're picking up the project.** Then use
[SETUP.md](SETUP.md) for the step-by-step.

## What it is

A single landing page for **Poshan**: fresh chakki atta, stone-ground to order
in Melbourne and delivered to the door. Poshan hasn't launched. This page is a
**demand test**: it measures how many Melbourne households ask for a free
sample. It does not sell anything, and it shows no prices.

**Audience:** Indian and South Asian families in Melbourne, starting in the
west (Tarneit, Point Cook, Truganina, Werribee), who make rotis most days.

**One job:** get them to click **Get a free sample** and leave a name, email
and suburb.

## Where things stand

| | Status |
| --- | --- |
| Website code | Done. On GitHub at `Nidinnoveta/poshan`, branch `main` |
| Collecting requests | **Not connected yet.** Needs the Google Sheet: [SETUP.md part 2](SETUP.md#2-collect-sample-requests-in-a-google-sheet) |
| Hosting and domain | **Not set up.** [SETUP.md part 4](SETUP.md#4-put-the-site-online) |
| Claims review | **Not done.** Food-safety and blend copy need an adviser before launch |
| Sample fulfilment | **Not decided.** How many samples, who packs and sends them |

## The page, top to bottom

1. **Hero:** "Fresh chakki atta, just like back home."
2. **Concern:** "You care about what your family eats. But have you thought about your atta?"
3. **Food safety:** "What you can't see in your food still matters." Real Australian border-test figures, sourced.
4. **Difference:** "Freshly milled. Thoughtfully made." Milled to order, Australian grain, every grain's % on the pack, nothing added.
5. **Heritage band:** "The same rotis. Better atta."
6. **Range:** three blends (Fresh chakki atta, Everyday Multigrain, Lean Protein), plus three coming later.
7. **How it works:** grain checked → clean milling → stone-milled in small batches → sealed and dated. Then delivery explained: request a sample → taste it → set up a schedule.
8. **Founding families**, **goal picker**, **FAQs**, **closing CTA**.

## The signup

Every button opens a short panel. On phones it slides up from the bottom.

- **Step 1:** "What matters most to you?" More protein, more fibre, fresher atta, family nutrition, or something else.
- **Step 2:** blend to try (pre-selected), first name, email, suburb, optional mobile.
- **From a blend card**, it skips step 1 and goes straight to step 2 with that blend chosen.
- Each request is one row in the Google Sheet. `?src=` on the link records which community group it came from.

## Stack and where things live

Astro 5 + Tailwind CSS 4. A static site with no server or database; the
Google Sheet is the database.

| What | Where |
| --- | --- |
| Copy, blends, FAQs, button wording, campaign switch | `src/data/site.ts` |
| Sections | `src/components/` (one file each) |
| Signup behaviour | `src/components/SignupModal.astro`, `src/scripts/site.ts` |
| Photos | `src/assets/img/` (registered in `src/data/images.ts`) |
| Colours and type | `src/styles/global.css` |
| Sheet script | `integrations/google-sheets/Code.gs` |
| Evidence behind the safety claims | `docs/health-risks-research.md` |

## House rules (agreed with the founder)

- **No em dashes** anywhere in the copy.
- **One heading style:** Plus Jakarta Sans, extra-bold, upright. No serif or italics. Emphasis by colour only.
- **Image-led:** large, professional photography in every section.
- **No Indian flags or festival themes** in photos. The audience is Indian families living in Australia.
- **Plain, warm English.** "Chakki" is fine; avoid heavy Hindi.
- **No prices** while this is a demand test.
- **No named brands** in comparisons, and only real, sourced figures.
- **The repo is public.** Planning PDFs, the `Imgaes/` photo drop folder and `.env` stay out of git.

## Two switches worth knowing

- `PUBLIC_FORM_ENDPOINT` (in `.env` or the host's settings): where requests go. Unset means test mode locally, and a polite "not open yet" on a live build.
- `config.trialConfirmed` in `src/data/site.ts`: flip it to `true` once a fixed offer is locked in (a free 2 kg trial pack for the first 100). The whole page rewords itself.

## Run it

```bash
npm install && npm run dev   # http://localhost:4321
```
