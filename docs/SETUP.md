# Poshan website: setup and launch runbook

Everything needed to take this repo from a fresh clone to a live site that
collects free-sample requests in a Google Sheet. Follow the parts in order.
Nothing here needs a developer beyond copying and pasting.

1. [Run it on your computer](#1-run-it-on-your-computer)
2. [Collect sample requests in a Google Sheet](#2-collect-sample-requests-in-a-google-sheet)
3. [Test the connection](#3-test-the-connection)
4. [Put the site online](#4-put-the-site-online)
5. [Before you share the link](#5-before-you-share-the-link)
6. [Everyday changes](#6-everyday-changes)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer and git.

```bash
git clone https://github.com/Nidinnoveta/poshan.git
cd poshan
npm install
npm run dev
```

Open http://localhost:4321. Until part 2 is done the signup runs in **test
mode**: it works end to end, and the confirmation says plainly that nothing
was saved.

---

## 2. Collect sample requests in a Google Sheet

Each request becomes one row: date, first name, email, suburb, optional
mobile, goal, the blend they want to try, the community link they came from,
and the page. About ten minutes. Use the Google account that should own the
data.

### 2a. Create the sheet

1. Go to [sheets.new](https://sheets.new) to create a blank Google Sheet.
2. Rename it (top left) to **Poshan sample requests**.

### 2b. Add the script

1. In the sheet, open **Extensions → Apps Script**. A new tab opens.
2. Delete everything in the editor.
3. Open [`integrations/google-sheets/Code.gs`](../integrations/google-sheets/Code.gs)
   in this repo, copy all of it, and paste it into the editor.
4. Optional: near the top, set `NOTIFY_EMAIL` to an address that should get an
   email for every new request, for example `const NOTIFY_EMAIL = 'you@example.com';`
5. Click the **Save** icon. Rename the project (top left) to **Poshan sign-ups**
   if you like.

### 2c. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Set:
   - **Description:** `Poshan sign-ups`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. Click **Authorize access** and choose your Google account.
6. Google warns that it **hasn't verified this app**. That's expected: it's
   your own script. Click **Advanced**, then **Go to Poshan sign-ups (unsafe)**,
   then **Allow**. It asks to edit this spreadsheet, and to send email if you
   set `NOTIFY_EMAIL`.
7. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`. Keep it handy.

"Anyone" means anyone can *send* a request to the script, which is how the
website reaches it. Nobody can read the sheet unless you share it.

### 2d. Connect the website

In the project folder, create a file called `.env` next to `package.json`:

```
PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/AKfy…/exec
```

Use your own URL. `.env` is gitignored, so it never reaches GitHub. There's a
template in [`.env.example`](../.env.example).

Stop the dev server (Ctrl+C) and run `npm run dev` again. Environment values
are only read at start-up.

---

## 3. Test the connection

1. Paste the Web app URL into your browser. You should see
   `{"ok":true,"service":"poshan-signups"}`. If not, see
   [Troubleshooting](#7-troubleshooting).
2. On http://localhost:4321, click **Get a free sample**, pick a goal, and fill
   in a test request, for example name `Test`, email `test@example.com`, suburb
   `Tarneit`.
3. The confirmation should **not** mention test mode.
4. In the Google Sheet, a tab called **Sign-ups** appears with your test row.
5. Delete the test row.

To check community tracking, open `http://localhost:4321/?src=test-group` and
submit again. The **Source** column should say `test-group`.

---

## 4. Put the site online

Any static host works. Netlify, Vercel and Cloudflare Pages all have free
tiers and deploy automatically from GitHub on every push to `main`.

| Setting | Value |
| --- | --- |
| Repository | `Nidinnoveta/poshan`, branch `main` |
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Node version | 20 or newer |
| Environment variable | `PUBLIC_FORM_ENDPOINT` = your Web app URL |

**Netlify:** Add new site → Import an existing project → GitHub → `poshan`.
Enter the build settings above, then go to **Site configuration → Environment
variables** and add `PUBLIC_FORM_ENDPOINT`. Trigger a deploy.

**Vercel:** Add New → Project → import `poshan`. It detects Astro on its own.
Add `PUBLIC_FORM_ENDPOINT` under **Environment Variables** and deploy.

**Cloudflare Pages:** Create → Pages → Connect to Git → `poshan`. Framework
preset **Astro**, then add `PUBLIC_FORM_ENDPOINT` under **Variables and
secrets** and deploy.

The endpoint is baked in at build time, so after adding or changing the
variable you must **redeploy**.

### Custom domain

Connect the domain in your host's dashboard, for example `poshan.com.au`. If
it's anything other than `https://poshan.com.au`, update `site` in
[`astro.config.mjs`](../astro.config.mjs) and push, so links shared on social
media point to the right address.

---

## 5. Before you share the link

- [ ] Submit one real request on the **live** site and see it land in the sheet.
- [ ] Decide how many free samples you can actually send, and who sends them.
- [ ] Turn on `NOTIFY_EMAIL`, or check the sheet daily.
- [ ] Have a food-labelling adviser read the food-safety section and the blend
      descriptions. Health and safety claims in advertising fall under FSANZ
      Standard 1.2.7 and the Australian Consumer Law.
- [ ] The page promises council-registered premises and a certified food
      safety supervisor. Make sure both are true before launch.
- [ ] Make a tracking link for each community group: `…/?src=tarneit-fb`,
      `…/?src=pointcook-whatsapp`, and so on.
- [ ] Check the site on a phone. Most visitors will come from WhatsApp and
      Facebook.

---

## 6. Everyday changes

| To change | Edit | Notes |
| --- | --- | --- |
| Most copy, blends, FAQs, delivery steps | `src/data/site.ts` | Plain text in one file |
| Button wording site-wide | `cta` in `src/data/site.ts` | Applies to every button at once |
| Switch to a fixed offer (free 2 kg trial pack for the first 100) | `config.trialConfirmed = true` in `src/data/site.ts` | Rewords every CTA and the confirmation |
| Headlines and section copy | `src/components/*.astro` | One file per section |
| A photo | Replace the file in `src/assets/img/` with the same name | Keep it 1,200px wide or more |
| Colours and type | `src/styles/global.css` | Tokens at the top |
| Sheet columns | `integrations/google-sheets/Code.gs` | Then redeploy: see below |

Push to `main` and the host rebuilds the live site automatically.

**After editing `Code.gs`:** paste the new version into Apps Script, then
**Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
This keeps the same URL. If the columns changed, rename or delete the old
**Sign-ups** tab first so the new headings are created.

House style for any new copy: no em dashes, no prices, no named competitor
brands, plain English for Indian and South Asian families, and real sourced
figures only.

---

## 7. Troubleshooting

**The form says "Sign-ups aren't switched on just yet".**
The site was built without `PUBLIC_FORM_ENDPOINT`. Set it (part 2d locally, or
part 4 on your host) and rebuild or redeploy.

**The form says "Something went wrong on our side".**
Open the Web app URL in a browser.
- A Google sign-in page means **Who has access** isn't `Anyone`. Edit the
  deployment and fix it.
- A page saying the script isn't found means the URL is wrong. Copy it again
  from **Deploy → Manage deployments**, and make sure it ends in `/exec`.

**A request went through but there's no row.**
Make sure you're looking at the sheet the script was created from (Extensions
→ Apps Script on *that* sheet), and at the **Sign-ups** tab.

**The same person appears once even though they submitted twice.**
That's deliberate: a repeat email updates its existing row and keeps the
first date.

**I edited the script and nothing changed.**
Saving isn't enough. Publish a new version (see section 6).

**Columns are in the wrong order after an update.**
Rename the old **Sign-ups** tab and submit a test request. A fresh tab is
created with the current headings.

---

The sheet holds personal details. Share it only with people who need it, and
delete someone's row if they ask.
