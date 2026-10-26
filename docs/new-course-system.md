# SCOPE New Course System

This is an additive course publishing and registration workflow. It leaves the existing MEAL/MIS pages, registration form, Apps Script project, and spreadsheet untouched.

## What is included

- A new, private Google Sheet: **SCOPE New Course System — Course Catalog and Registrations**.
- `Course Catalog` stores the public course definition and its draft/published state.
- Each course gets two private registration tabs when saved. The first Case Management course uses the already prepared `Case Mgmt - Bangladesh` and `Case Mgmt - International` tabs; later courses get tabs named from their course slug.
- The first course template is preloaded as a draft for **Humanitarian Case Management: Child Protection and GBV**. It has BDT 650 / USD 50 fees, a 100-person international-interest threshold, and the 24-session, 9+3 / 9+3 learning structure discussed with SCOPE. The owner can edit the draft before publishing.
- An owner-only Apps Script Admin Manager creates/edits courses, publishes them, counts international interest, and opens international registration only when the configured threshold is met.
- A separate public Apps Script API serves only published course information and accepts learner registration submissions. It never returns registration rows.
- New pages at `/new-courses/` and `/new-courses/course.html?slug=...` use one bilingual, responsive template for every new course.

## Data flow

1. An administrator opens the private Admin Manager and creates a course draft.
2. Saving writes the bilingual course definition to `Course Catalog` and creates its Bangladesh and International tabs.
3. Publishing makes only the course definition visible through the public catalog endpoint.
4. Bangladesh learners submit a registration to the course's Bangladesh tab. International learners initially submit an expression of interest to the International tab.
5. The Admin Manager counts rows whose status is `Interest`. It refuses to launch the international batch until the threshold is met. After launch, the same international tab accepts registrations.
6. Registration status and payment review remain internal to authorized SCOPE staff. The Google Sheet is not shared publicly.

The registration form collects learner information only. It must not collect names, contact details, protection concerns, or other information about children, survivors, or real humanitarian cases.

## One-time setup

### 1. Prepare the new spreadsheet

Open the new Sheet and set **File → Settings → Time zone** to **(GMT+06:00) Dhaka**. Keep access restricted to the SCOPE owner and staff who need to handle learner registration data. Do not change sharing to “Anyone with the link.”

### 2. Create the private Admin Manager

1. Create a new Apps Script project at `script.google.com` named `SCOPE Course Admin Manager`.
2. Add the contents of `course-system/apps-script/admin/Code.gs` as `Code.gs`; also add `Visuals.gs`. Add the HTML files `Admin.html`, `VisualEditor.html`, `VisualRenderer.html`, and `VisualStyles.html` with those exact names.
3. In **Project Settings → Script properties**, add `SCOPE_NEW_COURSE_SPREADSHEET_ID` with the ID from the new Sheet URL.
4. Deploy as a web app, **Execute as: Me**, **Who has access: Only myself**. Do not use the public registration deployment for this project.
5. Open the Admin Manager URL. Its first setup creates the Case Management draft if it is not already in the catalog.

### 3. Create the public registration API

1. Create a separate Apps Script project named `SCOPE New Course Registration API`.
2. Add `course-system/apps-script/public/Code.gs` as `Code.gs`.
3. Add Script Properties:
   - `SCOPE_NEW_COURSE_SPREADSHEET_ID`: ID of the new Sheet.
   - `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret for the website hostname.
   - `PUBLIC_HOSTNAME`: `scopeweb.github.io` for the current GitHub Pages host.
4. Deploy as a web app, **Execute as: Me**, **Who has access: Anyone**. This public endpoint must remain separate from the owner-only Admin Manager.
5. Add the deployed `/exec` URL and the matching public Turnstile site key to `course-system/assets/config.js`:

   ```js
   window.SCOPE_NEW_COURSE_API_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
   window.SCOPE_NEW_COURSE_TURNSTILE_SITE_KEY = 'PUBLIC_SITE_KEY';
   ```

   Keep the Turnstile secret in Script Properties only. Do not place it in GitHub.

### 4. Publish the site changes

After the branch is merged and GitHub Pages publishes it, open `/new-courses/`. The Case Management course is a draft until the Admin Manager publishes it. New courses do not need a new HTML file: each uses the same course page with its slug, for example `/new-courses/course.html?slug=case-management`.

## Admin workflow

- **Create draft:** enter course identity, bilingual descriptions, fees, dates, time zones, languages, delivery, assessment and policies; add as many bilingual content sections as needed.
- **Save:** the two course-specific tabs are created automatically. A draft stays private from the public catalog.
- **Publish:** publishes the course definition only after bilingual titles and at least one titled section exist.
- **Open international registration:** becomes available only after the minimum interest threshold is met. The administrator must still make this decision explicitly.

Course titles and section copy are capped to reduce accidental oversized data. A course slug is stable after creation to keep registration history associated with the right course.

## Data and deployment limits

- The GitHub Pages files are static. The Admin Manager and public API are Apps Script deployments; the Sheet cannot receive registrations until the public deployment and site configuration are completed.
- The website catalog displays no unpublished course and no learner record. The public API returns the aggregate international interest count only.
- The new system does not write to, migrate, rename, or read the existing MEAL/MIS registration spreadsheet.
- For any Apps Script code change, deploy a new version through **Deploy → Manage deployments → Edit → New version**.

## Visual course builder

The Admin Manager has repeatable, reorderable bilingual editors for instructors, software/tools, benefits, outcomes, roadmaps, workflows, projects, syllabus, assessment steps, grade bands, retakes, certification and enrolment policies. Projects store weeks, sessions, hours and internal credits; totals and credit bars are computed from those values. These are SCOPE internal training credits, not university accreditation. A separate bar/donut chart accepts administrator-defined labels, values, title and unit.

Instructor cards support a portrait, name, designation, organization/current work, experience, biography and teaching responsibilities. Software cards support a logo, name and bilingual explanation. Upload PNG, JPEG or WebP files up to 8 MB; the browser resizes and compresses to at most 180 KB per image before upload. Unsupported formats and invalid signatures are rejected. Images live in a private Drive folder created by the admin deployment, while the Sheet stores file IDs. Both deployments must run under the same owner, with Drive authorization. Only images referenced by published courses can be retrieved through the public API; neither the media folder nor learner records need public sharing. Removing a card does not delete its underlying Drive file.

English/Bangla previews use the same renderer and styles as public course pages. The visual template uses glass cards, instructor portrait/detail layouts, tool tiles, numbered roadmaps, two-column expandable syllabus, project bars and accessible grading tables. Existing MEAL/MIS pages remain unchanged. Grade bands must cover 0–100 without gaps or overlaps; upper bounds are exclusive except 100. Course JSON is capped at 45,000 characters to stay below the Sheet cell limit.

`VisualRenderer.html` and `VisualStyles.html` are exact wrappers of the shared JS/CSS. Keep them synchronized when changing the public renderer. Verification: `node --test course-system/tests/visuals.test.cjs`. Local tests cover validation, escaping, persistence mappings, media rejection and shared preview consistency. Actual Apps Script authorization, Drive upload and public registration require deployment and must be tested before launch.
