# SCOPE website (static, GitHub Pages ready, no build step)
## Structure
```
index.html              Home        about/ learn/ contact/   inner pages
register/index.html     Course registration (3 steps, bKash) and interest form
courses/index.html      Catalogue   courses/<slug>/index.html          one folder per course
404.html                Not-found page
assets/js/data.js       ALL course data, MEAL facts, links and English/Bangla text (edit here)
assets/js/app.js        Header, footer, pages, language switch, catalogue, form
assets/js/fx.js         Universe backdrop, orbit physics, motion levels, springs, reveal
assets/css/site.css     Design system + motion       assets/img/  logo (original + trimmed copy)
tools/check.py          Browser QA suite             tools/apps-script.gs  Google Sheets backend (registrations, bKash TrxID check, emails)
```
## Preview locally
`python3 -m http.server` in this folder, open http://localhost:8000. (Opening index.html by double-click also works.)
## Publish on GitHub Pages
1. New repository on github.com. 2. Upload everything in this folder. 3. Settings > Pages > Deploy from a branch > main / root. 4. Site appears at https://USERNAME.github.io/REPOSITORY/.
The 404 page finds its base path itself on github.io. For another host with a subfolder, edit `BASE` at the top of 404.html.
## Change course details / language text / links
Edit `assets/js/data.js` to update course details. The bKash number is in `pay.to`; each live course has its own `fee` value. Keep each fee synchronized with the matching entry in `COURSES` in `tools/apps-script.gs`. Current live courses are MEAL (BDT 650) and MIS (BDT 850). Course status values: `current`, `soon`, `planned`.
## Replace the logo
Overwrite `assets/img/logo.png` (favicon, original) and `assets/img/logo-trim.png` (header: same logo with empty white margin removed).
## Registrations: Google Sheets (not connected until you do this)
1. Create a NEW Google Sheet (any name). Open **Extensions > Apps Script**, delete the sample code, paste all of `tools/apps-script.gs`, Save.
2. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and allow the permissions it asks for (Sheets, Gmail sending, and external requests for Turnstile validation).
3. In Apps Script **Project Settings > Script properties**, add `TURNSTILE_SECRET_KEY` with the Turnstile Secret Key. Never put this secret in website files or GitHub. The public Site Key is configured in `assets/js/data.js` as `turnstileSiteKey`.
4. Copy the web-app URL (ends with `/exec`) and paste it into `endpoint` in `assets/js/data.js`.
5. Open the live site's registration page. One form serves all live courses; select MEAL or MIS before entering payment details. The first MEAL submission creates a `MEAL Registrations` tab, and the first MIS submission creates a `MIS Registrations` tab. Existing `Registrations` rows remain supported.
6. In Apps Script, open **Triggers** (clock icon) > **Add Trigger**; choose `statusChanged`, event source **From spreadsheet**, event type **On edit**, then authorize it. This is required because Google restricts email sending from simple triggers.
7. Paste your Meet link in `MEET_LINK` if you want it in the payment confirmation email. After each real bKash payment, check the TrxID in the matching course tab and set **Status** to Verified. The trigger sends email to the registrant and fills **Verified email sent** with the sent time. If it fails, the cell note records the error; use **SCOPE > Retry unsent verification emails** after fixing the issue. The registrant confirmation page checks the status in either course tab and changes its badge to green after verification.
8. After changing Apps Script code or Script Properties, deploy a new version from **Deploy > Manage deployments > Edit > New version**. Turnstile validates on the server; submissions are rejected if the secret property is missing or validation fails.
If you edit the script later, use **Deploy > Manage deployments > Edit > New version**, otherwise the live URL keeps the old code.
The Sheet stays private; the web app accepts submissions and exposes only the verified/pending state for a registration when queried with its unguessable reference. Duplicate TrxIDs are rejected. Gmail sending from a normal Google account is limited to about 100 emails a day. A honeypot and Cloudflare Turnstile protect the forms; Turnstile tokens are verified server-side. Never put credentials in the site.
## bKash payment (manual)
Students use **Send Money** to the number in `data.js`, then enter their own bKash number and the TrxID. The site cannot check the payment itself (GitHub Pages has no server), so you verify each TrxID in your bKash history. Never put bKash API keys or PINs in the site.
## Motion
Levels: Full, Balanced (phones, <4 cores, save-data), Reduced (OS setting). Footer button overrides. No external libraries; fonts (Sora, Noto Sans Bengali) load from Google Fonts with system fallbacks.
## Verify
`pip install playwright && playwright install chromium && python3 tools/check.py` (serves the site from a repo-like subpath and runs every check).

## International bank-transfer instructions (manual)
International learners can first submit the existing free-interest form. On the live international MEAL/MIS flow, learners who confirm the USD fee can request bank-transfer instructions by email. The public website never returns or embeds the bank account details. The payment-instructions button appears only when the API confirms that the owner-only setup is complete and the payment window is open; the public status response contains only an open/closed flag.

Before enabling this:
1. Replace `tools/apps-script.gs` in the connected Apps Script project with the current repository version. Save, then deploy a new web-app version (Execute as **Me**, access **Anyone**). The existing public endpoint URL stays the same.
2. In Apps Script **Project Settings → Script properties**, add these values privately:
   - `SCOPE_INTL_PAYMENTS_OPEN`: set to `false` until SCOPE is ready to accept international payments; set to `true` only after confirming the batch/payment window is open.
   - `SCOPE_REMITTANCE_BANK_NAME`
   - `SCOPE_REMITTANCE_SWIFT`
   - `SCOPE_REMITTANCE_ROUTING`
   - `SCOPE_REMITTANCE_ACCOUNT_NUMBER`
   - `SCOPE_REMITTANCE_ACCOUNT_NAME`
   - `SCOPE_PAYMENT_ADMIN_EMAIL`: the SCOPE inbox that receives request alerts and learner replies.
3. Enter the bank's exact details in Script Properties. Never paste account details into `assets/js/data.js`, HTML/JavaScript, email templates committed to GitHub, or a public spreadsheet. Script Properties remain server-side.
4. Deploy a **new version** after the script and properties are ready. The first eligible request creates a private `International Payments` sheet tab and emails transfer instructions to the learner. The learner's amount and payment ID are recorded; the browser page never receives the account details.
5. Confirm the incoming bank credit against Pubali's record. In `International Payments`, set column **K — Status** to **Verified** only after funds arrive. The existing installable `statusChanged` spreadsheet trigger sends the payment-verification email. If no trigger exists, install the same From spreadsheet → On edit trigger described above. Use **SCOPE → Retry unsent verification emails** if an email fails.
6. Leave `SCOPE_INTL_PAYMENTS_OPEN=false` again when the payment window closes. A bank transfer request or receipt does not itself confirm payment; confirmation is sent only after the sheet status is changed to Verified.

The fee is read from `COURSES` in `tools/apps-script.gs` (MEAL USD 80, MIS USD 100). Update it there if the course fee changes. The automated mail account is subject to Google's sending limits.
