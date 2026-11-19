# Virtual Physics Lab (hub)

One site for several physics-lab simulations. The student first picks a laboratory, then an experiment.
The hub is only the chooser and the lab pages; each simulation lives in its own repository and is built and
copied into the hub's `dist/` by `scripts/assemble.mjs`.

| URL | What |
|---|---|
| `/` | laboratory chooser |
| `/mechanics/`, `/atomic/` | experiment cards of a lab |
| `/mechanics/mruv/`, `/mechanics/parabolico/`, `/mechanics/segunda-ley/`, `/mechanics/rozamiento/`, `/mechanics/pendulum-incline/` | mecanica-labs (private) |
| `/mechanics/parametric-resonance/` | parametricResonance (`simulator/`, private) |
| `/atomic/x-ray/` | AtomicSimulation (`web/`, private) |
| `/atomic/photoelectric/` | photoelectric-sim (private) |

Hosted here, the three simulations without their own link back (parametricResonance, AtomicSimulation, photoelectric-sim)
show an "All experiments" link to their lab page: `assemble` sets `<meta name="vlabs-home" content="">` to `../` in the copied
`index.html` (and fails if the tag is missing). Standalone, the tag stays empty and no link shows. mecanica-labs links back
to `../index.html?lang=<lang>` on its own.

English by default, Spanish with the toggle or `?lang=es`. Light, dark or automatic theme. No external requests.

Cards: a chooser card has a title link and an "Enter laboratory" link to the lab page, plus one link per experiment that opens it
directly; an experiment card on a lab page has a title link and an "Open" link. The title link is stretched over the card as a big
click area; the other links sit above it, so nothing interactive is covered. Experiment links are relative, end with a slash and
carry `?lang=`, plus `&theme=light|dark` when the hub's theme is explicit (none for automatic); the simulations store them and drop
them from their address. The hub does the same with its own `?lang=` / `?theme=` (the simulations' back links): it stores them and
removes them with `history.replaceState`.

## Run

```bash
npm install
npm run dev      # the hub only (the experiment links 404 in dev: use the assembled site for those)
npm test         # Vitest: data, links, language, assembly path mapping
npm run build    # tsc && vite build -> dist/ with the hub pages ONLY (no simulations: that is expected)
```

## Assemble the whole site

```bash
npm run assemble                              # sources are siblings of this folder
npm run assemble -- --base /path/to/clones    # or SOURCES_DIR=/path/to/clones
npm run assemble -- --skip-source-build       # reuse each source's existing build output
npm run preview:site                          # serve the assembled dist/ locally (vite preview, no rebuild)
```

A plain `npm run build` leaves only the hub pages in `dist/`; `npm run assemble` is what produces the full site
(it rebuilds the hub, so run it, then `npm run preview:site`).

The script builds the hub, builds each source (running `npm ci` first if its `node_modules` is missing), and copies:
mecanica-labs `dist/` into `dist/mechanics/` (without its own `index.html`), `parametricResonance/simulator/` into
`dist/mechanics/parametric-resonance/` (without `tests/`, `dev/`, `tools/`, `README.md`), `AtomicSimulation/web/dist`
into `dist/atomic/x-ray/`, `photoelectric-sim/dist` into `dist/atomic/photoelectric/`. It fails with the repo's name if a
folder or build is missing, and refuses to overwrite a file that is already in `dist/`. The hub keeps its own files in
`dist/hub-assets/` so they cannot clash with mecanica-labs' `assets/` and `favicon.svg`.

Deploy: `.github/workflows/deploy.yml` checks out the five repos side by side (the four sources are private, so each is
checked out over SSH with a read-only deploy key), tests, assembles and publishes to GitHub
Pages on push to main, manually, nightly, and on `repository_dispatch` type `sim-updated` (a source repo can trigger it
with `gh api repos/kairi99/virtual-labs/dispatches -f event_type=sim-updated`, using a token with access to this repo).

### Deploy keys (secrets of this repository)

For each source repo, create a key pair (`ssh-keygen -t ed25519 -N '' -f key`), add the public half as a read-only
**deploy key** of that source repo (Settings, Deploy keys, leave "Allow write access" off), and store the private half
as an Actions secret of `kairi99/virtual-labs`:

| Secret | Source repository |
|---|---|
| `DEPLOY_KEY_MECANICA_LABS` | kairi99/mecanica-labs |
| `DEPLOY_KEY_PARAMETRIC_RESONANCE` | kairi99/parametricResonance |
| `DEPLOY_KEY_ATOMIC_SIMULATION` | kairi99/AtomicSimulation |
| `DEPLOY_KEY_PHOTOELECTRIC_SIM` | kairi99/photoelectric-sim |

`test.yml` (pull requests) tests and builds the hub only and needs no secrets. A source repo's `repository_dispatch`
trigger still works: the dispatch token only needs access to this repo.

## Add an experiment

1. Add an entry to the lab's `experiments` in `src/labs.ts`: `id`, `slug`, `title`, `summary`, `topic` (all in both languages), `thumb`,
   `status`, and `source` (repo, build command and output folder, or a plain `folder`).
2. If it needs a new card drawing, add a `ThumbKind` and a function in `src/thumbs.ts`.
3. If it is in a new repo, add the checkout to `deploy.yml`.
4. The simulation must use relative asset paths (Vite `base: './'`) and accept `?lang=en|es`. Use `status: 'soon'` until it is ready.
5. `npm test`, then `npm run assemble`.

## Add a laboratory

1. Add a lab object (`id`, `slug`, `title`, `summary`, `experiments`) to `labs` in `src/labs.ts`.
2. That is all: the lab page `/<slug>/` is generated from the data (`vite.config.ts`, `scripts/pages.ts`) and the chooser
   card appears. Then add its experiments as above.

## Licence

Code: MIT (`LICENSE`). Content: CC BY 4.0 (`LICENSE-CONTENT`). Each simulation has its own licence in its repository.
