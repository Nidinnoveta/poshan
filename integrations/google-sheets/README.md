# Collect Poshan sample requests in a Google Sheet

Every free-sample request from the website becomes a row in a Google Sheet you
own: first name, email, suburb, optional mobile, their goal, the blend they'd
like to try, which community link they came from, and when. Free, and about
five minutes.

## Set it up

1. Create a new Google Sheet, for example **Poshan sign-ups**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's in the editor, paste in everything from [`Code.gs`](Code.gs),
   and click **Save**.
4. Optional: set `NOTIFY_EMAIL` near the top to get an email for each new
   sign-up.
5. Click **Deploy → New deployment**. Choose type **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy** and approve the permissions Google asks for. It needs to
   edit this sheet, and send email if you turned that on.
7. Copy the **Web app URL**. It ends in `/exec`.
8. In the website project, create a file called `.env` next to
   `package.json` containing:

   ```
   PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/…/exec
   ```

   If you host on Netlify, Vercel or Cloudflare Pages, add the same
   `PUBLIC_FORM_ENDPOINT` variable in the host's environment settings instead.
9. Rebuild and deploy the site. Open the web app URL in your browser first: it
   should say `"service":"poshan-signups"`.

The sheet tab **Sign-ups** is created automatically on the first submission.

## Good to know

- **Duplicates:** if someone signs up twice with the same email, their row is
  updated rather than duplicated, and the original sign-up date is kept.
- **Already set up an older version?** The columns changed. Delete the
  **Sign-ups** tab (or rename it) so the new headings are created, then
  redeploy as below.
- **Changing the script:** after editing `Code.gs`, use **Deploy → Manage
  deployments → Edit → New version**. That keeps the same URL.
- **Privacy:** the sheet holds personal details. Share it only with people
  who need it, and delete rows when someone asks.
