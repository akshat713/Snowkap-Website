Full-coverage dictionaries, one per language, keyed on the English source string
exactly as the site renders it.

`de.json`, `hi.json` and `ar.json` are complete — every one of the ~500 fragments
in `src/i18n/strings.json` is translated, which is why those three are the
languages `LANGUAGES` offers. A language with a partial dictionary is deliberately
not offered: a switcher that flips the navigation and leaves the body copy in
English reads as broken rather than as multilingual.

`src/i18n/languages.js` holds the hand-written chrome and headline wording and
always wins over anything here, so a later pass can never overwrite a brand
decision.

## Adding a language

`src/i18n/strings.json` is the catalogue: every text fragment the site renders,
extracted from the built pages in every interactive state — each sector tab, each
dossier step, the modals, the tray, the mobile drawer. To translate it:

    ANTHROPIC_API_KEY=sk-ant-... yarn translate fr

Then add the language to `LANGUAGES` in `src/i18n/languages.js` and move its
chrome dictionary from `PARTIAL_DICT` into `BASE_DICT`. French, Spanish and
Chinese already have their chrome authored and are waiting on exactly this.

## Refreshing after a copy change

New or reworded copy will not be in the catalogue. Re-extract it, then translate
only what is missing — the script skips keys that already have a translation, so
a re-run costs only the new strings:

    ANTHROPIC_API_KEY=sk-ant-... yarn translate

Commit the results. They are part of the build, not a build artefact.
