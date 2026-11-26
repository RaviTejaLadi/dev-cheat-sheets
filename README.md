# DevSheets

DevSheets is a searchable library of developer cheat sheets. Browse topics such as Git, Python, Docker, and SQL, then search within a sheet for commands, syntax, and links to documentation. Save frequently used sheets in your browser for quick access.

## Run locally

Install Git and Node.js 22.12 or later with npm, then run:

```sh
git clone https://github.com/RaviTejaLadi/dev-cheat-sheets.git
cd dev-cheat-sheets
npm ci
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

Run `npm run build` to type-check the app and create a production build in `dist/`.

## Project structure

- [`src/main.tsx`](src/main.tsx) renders the React app, including the topic library and individual sheets.
- [`src/catalog.json`](src/catalog.json) defines the topics shown in the library.
- [`public/references/`](public/references/) contains one JSON file per cheat sheet, named by topic slug.

## Contributing

Corrections, new cheat sheets, and app improvements are welcome. See the [contribution guidelines](CONTRIBUTING.md) for the sheet format and pull request workflow, and read the [code of conduct](CODE_OF_CONDUCT.md) before participating.

## License

See the [MIT license](LICENSE).
