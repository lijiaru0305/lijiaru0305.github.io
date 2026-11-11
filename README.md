# lijiaru0305.github.io

Personal academic website of Jiaru Li — hand-built static HTML/CSS/JS, no build step
and no Ruby/Jekyll toolchain.

## Structure

```
index.html          About / landing page
research.html       Research themes + simulation movies
publications.html   All papers, with abstracts and topic filtering
talks.html          Talks and posters
teaching.html       Teaching, mentoring and TA history
notes.html          Notes index (no entries yet)
cv.html             Web CV
404.html            Not-found page

assets/css/site.css Single stylesheet
assets/js/site.js   Nav toggle + publication filter
assets/favicon.svg

files/              PDFs (papers, CV, slides, posters) and simulation movies
images/             Photos
images/posters/     Poster frames shown before each movie plays
notes/_template.html  Copy this to start a new note

_archive/           The previous academicpages (Jekyll) site, kept for reference.
                    Safe to delete once you are happy with the new site.
```

## Previewing locally

```sh
python3 -m http.server 8000
```

then open <http://localhost:8000>.

Opening `index.html` directly with `file://` mostly works too, but a local server is
closer to how GitHub Pages serves the site.

## Deploying

The site is plain static files at the repository root, so GitHub Pages serves it
as-is. `.nojekyll` is present to tell Pages not to run Jekyll over it.

```sh
git add -A
git commit -m "Update site"
git push
```

## Adding a paper

Open `publications.html`, copy an existing `<article class="pub">` block into the
right year group, and edit it. Two details matter:

- `id="pub-XXXX"` — the anchor that `research.html` links to.
- `data-topic="..."` — one or more of `exoplanets`, `disks`, `agn`, `other`
  (chemical physics), `ml` (machine learning). This drives the filter buttons.

The site's factual content (positions, dates, awards, service, mentoring,
publication list) is kept in sync with `files/CV_Jiaru_Li.pdf`. When the CV is
updated, re-check `cv.html`, `publications.html`, `teaching.html`, `talks.html`
and the news list on `index.html`.

## Link convention

Anything that takes the reader away from a page -- another site, or a PDF or
movie under `files/` -- opens in a new tab and carries `rel="noopener noreferrer"`:

```html
<a href="https://arxiv.org/abs/..." target="_blank" rel="noopener noreferrer">arXiv</a>
<a href="files/talk-BHCE-DDA-2022.pdf" target="_blank" rel="noopener noreferrer">Slides</a>
```

Links between pages of the site, in-page `#anchor` links, and the `mailto:`
links open in the same tab. Keep this consistent when adding entries.

## Adding a talk

Open `talks.html` and copy an existing `<article class="talk">` block.

## Adding a note

Copy `notes/_template.html` to `notes/<slug>.html`, write it, then add a list entry
to `notes.html` (there is a commented-out example in the source).
