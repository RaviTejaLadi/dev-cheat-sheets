# Contributing to DevSheets

You can help by fixing an incorrect command, replacing a broken link, adding a cheat sheet, or improving the app. Please follow the [code of conduct](CODE_OF_CONDUCT.md) in all project discussions.

## Report a bug or suggest an improvement

Search the [issue tracker](https://github.com/RaviTejaLadi/dev-cheat-sheets/issues) for an existing report. For a content correction, include the sheet and section, the current entry, and a source for the proposed change. For an app bug, include the steps to reproduce it, what you expected, what happened, and your browser. For a substantial change, open an issue to discuss the scope before starting.

## Add or update a cheat sheet

1. Find the topic in [`src/catalog.json`](src/catalog.json) and open the corresponding file in [`public/references/`](public/references/). For a new topic, add a catalog entry with `name`, `letter` (the alphabetical group), and a unique lowercase slug with hyphens between words. Name the new file `public/references/<slug>.json`.
2. Organize entries into groups with a `title`, a `section`, and a `links` array. Each entry has a `name` and a `url`. Use `null` for plain commands or examples. For links to other sheets, use `#/sheet/<slug>`.
3. Verify commands and syntax against official documentation when available. Mention version or platform requirements when they affect the example. Use content you wrote or have permission to share, and include required attribution.

```json
[
  {
    "title": "Working tree",
    "section": "Local changes",
    "links": [
      { "name": "git status", "url": null },
      { "name": "git status documentation", "url": "https://git-scm.com/docs/git-status" }
    ]
  }
]
```

## Submit a pull request

1. Fork the [repository](https://github.com/RaviTejaLadi/dev-cheat-sheets), clone your fork, and create a branch from `main`. Follow the [local setup instructions](README.md#run-locally).
2. Run `npm run build`. For a sheet change, find the topic in the library, open it, search for the changed entry, and try any links you added or updated. For an app change, exercise the affected behavior in the browser.
3. Push your branch and open a pull request against `main`. Summarize what changed, list the checks you ran, and link the related issue if there is one. Include screenshots for visible UI changes when they help explain the change.
