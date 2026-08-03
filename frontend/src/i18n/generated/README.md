Machine-generated dictionaries, one per language, keyed on the English source
string exactly as the site renders it.

These files start empty. Fill them by running, from `frontend/`:

    ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-strings.mjs

The script reads `src/i18n/strings.json` — every text fragment the site renders,
extracted from the built pages — translates whatever is missing, and writes the
result back here. Entries in `src/i18n/languages.js` are hand-written and always
win over anything in this directory, so a machine pass can never overwrite the
brand's own wording.

Commit the results: they are part of the build, not a build artefact.
