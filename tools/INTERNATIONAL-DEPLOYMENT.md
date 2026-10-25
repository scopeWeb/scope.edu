# Activate international interest collection

The website requires an explicit international save response. Until the existing Apps Script is redeployed, submissions will show a retry message and will not claim success.

1. Open the existing connected Google spreadsheet. Choose Extensions > Apps Script.
2. Back up the existing script and compare its deployment-specific configuration with tools/apps-script.gs. Preserve SHEET_ID, MEET_LINK, Script Properties (including TURNSTILE_SECRET_KEY), existing triggers and any private customizations.
3. Update the existing script with tools/apps-script.gs. Do not create a spreadsheet or a new deployment.
4. Choose Deploy > Manage deployments > edit the existing web app > Version: New version > Deploy. Preserve Execute as and access settings. The current /exec URL must remain unchanged.
5. Submit clearly labelled test details through the international form. Confirm the International Interest tab in the same spreadsheet, all fields and the reference. Repeat with the same reference to verify a single row. Remove the test row afterwards. No email is sent by this new handler.

Automated local checks covered syntax, server validation, formula escaping and idempotent row handling with mocked Sheets. Live saving and mobile/browser behavior still require verification.

Country names and calling codes use the mledoze/countries dataset. Country selection fills the calling code; learners may select another code for their phone. Four required Yes/No answers record willingness to study in English for USD 80, internet access, reliable connectivity and laptop access. Redeploy the updated backend to validate and save these new fields. Existing columns remain in their original order; new columns are appended.

Updated course routing: upcoming/general interest goes to Course Interest in the existing spreadsheet, without fixed fees or dates. International MEAL remains USD 80 with its November threshold. International MIS is USD 100, at least 500 interested learners by 30 December 2026, conditional January 2027 launch. Redeploy this version before collection: the website requires schema 2 confirmation to avoid accepting outdated fee metadata.
