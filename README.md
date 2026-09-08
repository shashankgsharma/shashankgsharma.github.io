# shashankgsharma.github.io

Personal and academic website of Shashank Sharma — research engineer at TCS Research
working on neuromorphic computing.

Built with [Hugo](https://gohugo.io) (extended, v0.155+) using a custom theme; no
third-party theme dependency. Deployed to GitHub Pages by
[`.github/workflows/hugo.yml`](.github/workflows/hugo.yml) on every push to `main`.

## Running locally

```bash
hugo server        # http://localhost:1313
hugo --gc --minify # production build into ./public (git-ignored)
```

## Where things live

| Path | What it holds |
| --- | --- |
| `hugo.toml` | Site config: identity, links, hero copy, navigation menu |
| `content/` | Page content — `about/`, `research/`, `projects/`, `posts/` |
| `data/` | Structured content rendered by templates, not by markdown |
| `layouts/` | Templates. `_partials/` for shared pieces, `_markup/` for render hooks |
| `assets/css/main.css` | The whole design system — tokens at the top |
| `assets/js/main.js` | Theme toggle, mobile nav, scroll reveal, hero raster |
| `static/` | Files served verbatim: `profile.jpg`, `files/resume.pdf`, favicons |

## Updating content

**Personal details, hero text, social links** — `hugo.toml`, under `[params]`. That
includes `scholar`, `orcid` and `orcidId`, which feed the hero profile row, the footer,
the About contact block, the "Full record" line above the publication list, and the
`sameAs` array in the home page's JSON-LD.

**A new publication** — add an entry to `data/publications.yaml`. It appears on the home
page and on `/research/` automatically. Keep `authors:` as the exact, full list in
published order (never "et al." — a reader is looking for your position in it), and keep
`contribution:` honest about which part was yours. `bibtex:` powers the copy button;
`page:` optionally links to a project write-up.

**The trajectory graph** on the home page — `data/journey.yaml`. Nodes carry their own
`x`/`y` inside a 1000×300 viewBox, and `edges` are literal SVG paths, so moving a node
means moving the paths that touch it. Lanes sit at y=70 (perception), y=155 (spine) and
y=240 (language). Exactly one node should have `current: true`; that is what loads in the
panel and what the list expands by default. Below 760px the graph is replaced by the
same data as an accordion, which is also what renders without JavaScript.

**The bookshelf** on the About page — `data/bookshelf.yaml`. `spine:` picks one of six
colours (`clay`, `slate`, `ochre`, `sage`, `plum`, `ink`), `height:` is a percentage of
the shelf so the spines are not all level. The `note:` lines describe each book rather
than voice an opinion — swap them for your own whenever you like.

**A new project** — add `content/projects/<slug>.md`. Useful front matter:

```yaml
title: "…"
date: 2025-09-01          # controls ordering
ptype: "research"         # "research" groups it separately on /projects/
summary: "One or two lines shown in listings."
affiliation: "…"
guide: "…"                # advisor(s)
timeline: "Sept 2025 – present"
venue: "…"                # if published
paper: "https://…"
github: "https://…"
tags: ["…"]
```

**Experience, education, awards, skills, research themes** — the YAML files in `data/`.

**A blog post** — `content/posts/<slug>.md` with `title`, `date`, `summary`, `tags`.
Set `draft: true` to keep it out of the build.

## The neuromorphic layer

Two things, both living behind the content rather than inside it:

- **`.bg-net`** (`assets/js/main.js`, `initNetwork`) — an actual toy leaky
  integrate-and-fire network on a fixed canvas. Neurons leak, charge from arriving
  spikes, fire past threshold, then go refractory; spikes travel along axons at a speed
  set by axon length. It is masked twice: `.bg-net-wrap` fades it at the top and bottom
  of the viewport, and `.bg-net` itself drops to ~17% behind the reading column so it
  never competes with text, staying full strength in the margins. Under
  `prefers-reduced-motion` it settles 260 steps and draws one static frame. Colours come
  from `--net-line`, `--net-cell` and `--net-spike`, so it follows the theme.
- **membrane divider** (`layouts/_partials/spike-rule.html`) — a LIF trace that charges
  and resets, used once on the home page above the contact block.

## Colour bands

The page walks through six colour bands as you scroll. `.bg-tint` is one
document-height gradient, so each band fades into the next with no seam, and every
section carries `data-band="1".."6"` which re-points `--accent`. Numbers, links, rules
and active states therefore drift through the spectrum as you read.

**Dark is the base theme.** The dark palette lives in plain `:root`, and light is the
override under `:root[data-theme="light"]`, so a visitor with no stored preference (and
a visitor with no JavaScript) gets dark. System preference is deliberately not followed.

The identity colour is **indigo** (`--a1`), used for the italic "Sharma" in the hero, the
brand mark, the favicon and the spikes in the background network. The band accents run
indigo → magenta → violet → cyan → green → indigo, closing the loop at the foot of the
page. Both palettes are the `--band-1..6` and `--a1..6` values at the top of
`assets/css/main.css`; body text sits at 15–18:1 against every band and accents at
5.7–9.1:1, so changing a colour means re-checking those two numbers.

Cards do not sit on an opaque colour — they use `--surface` (translucent) plus a backdrop
blur, so the gradient and the network read through them.

## Mark and favicon

The brand mark, the favicon and the `spike-rule` divider are all the same drawing: a
leaky integrate-and-fire membrane trace that charges, fires, and resets. The navbar mark
is `{{ partial "icon.html" "mark" }}` in `layouts/_partials/icon.html`; the favicon source
of truth is **`assets/favicon/favicon.svg`** (white trace on an indigo tile, so it stays
visible on both light and dark browser tab strips — a dark tile disappears against dark
chrome).

Icon links are **fingerprinted** through Hugo pipes, so editing the icon changes its URL.
Browsers cache favicons hard and a stale one shows as *no icon at all* rather than as an
old icon, which is very hard to debug. `static/favicon.ico` also exists at the site root
because browsers request that path implicitly, whatever the `<link>` tags say.

To regenerate the raster sizes after editing the SVG: render it at 512/192/180/48/32/16
(Chrome headless with `--screenshot` and a matching `--window-size` works), write the
PNGs into `static/favicon/` and `assets/favicon/apple-touch-icon.png`, then build the
`.ico` with Pillow from the separately rendered 16/32/48 PNGs — downscaling one large
bitmap gives a muddier small icon than rendering each size.

## Design notes## Design notes

The palette, type scale and spacing all live as CSS custom properties at the top of
`assets/css/main.css`. Light is the default; the dark palette is defined once under
`:root[data-theme="dark"]`, and the theme is resolved before first paint by an inline
script in `layouts/_partials/head.html` (system preference, overridable by the toggle
and remembered in `localStorage`).

Type is **Newsreader** for display, **IBM Plex Sans** for reading and **IBM Plex Mono**
for metadata labels. Newsreader replaced Fraunces because Fraunces draws `j` with a
slanted tittle and a curled descender by design — it is a deliberately wonky face, and
the `j` in "Projects" looked broken rather than characterful. Any replacement display
face should be checked against `Projects / Journey` before it is adopted.

`assets/js/main.js` keeps every feature in its own `init*()` function on purpose. An
earlier version had all of it in one scope, where a `var current = <element>` silently
overwrote a `function current()` and killed the theme toggle site-wide. Keep new features
in their own function.
