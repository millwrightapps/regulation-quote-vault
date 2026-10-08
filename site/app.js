'use strict';
const $ = id => document.getElementById(id);
const NAMES = { ANDREW_PANTON: 'Andrew Panton', GAVIN_FREE: 'Gavin Free', GEOFF_RAMSEY: 'Geoff Ramsey', ERIC_BAUDOUR: 'Eric Baudour', NICK_SCHWARTZ: 'Nick Schwartz' };
const SHOWS = { RP: 'Regulation Podcast', FF: 'F**kface' };
const STORE = 'rqv-selection';

let catalog = null;
const selected = new Set(load());
const filters = { speakers: new Set(), shows: new Set(), tags: new Set(), text: '' };

function load() { try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; } }
function save() { try { localStorage.setItem(STORE, JSON.stringify([...selected])); } catch { /* private mode: selection just won't persist */ } }

// The GitHub link points at this site's own repo (owner.github.io/repo → github.com/owner/repo).
(() => {
  const owner = location.hostname.endsWith('.github.io') ? location.hostname.split('.')[0] : null;
  const repo = location.pathname.split('/').filter(Boolean)[0];
  if (owner && repo) $('repo').href = `https://github.com/${owner}/${repo}`;
})();

function chip(label, set, value, container) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip'; b.textContent = label;
  b.setAttribute('aria-pressed', 'false');
  b.onclick = () => { set.has(value) ? set.delete(value) : set.add(value); b.setAttribute('aria-pressed', String(set.has(value))); render(); };
  container.append(b);
}

function speakers(q) { return [q.speaker, q.secondarySpeaker].filter(Boolean); }

function matches(q) {
  if (filters.speakers.size && !speakers(q).some(s => filters.speakers.has(s))) return false;
  if (filters.shows.size && !filters.shows.has(q.show)) return false;
  if (filters.tags.size && !(q.weatherTags || []).some(t => filters.tags.has(t))) return false;
  if (filters.text) {
    const hay = [q.quote, q.episodeTitle, ...(q.weatherTags || []), ...speakers(q).map(s => NAMES[s])].join(' ').toLowerCase();
    if (!filters.text.split(/\s+/).every(word => hay.includes(word))) return false;
  }
  return true;
}

function card(q) {
  const li = document.createElement('li');
  li.className = 'quote';
  const box = document.createElement('input');
  box.type = 'checkbox'; box.id = 'q-' + q.id; box.checked = selected.has(q.id);
  box.onchange = () => { box.checked ? selected.add(q.id) : selected.delete(q.id); save(); summary(); li.classList.toggle('picked', box.checked); };
  li.classList.toggle('picked', box.checked);
  const label = document.createElement('label');
  label.htmlFor = box.id;
  const text = document.createElement('blockquote');
  text.textContent = `“${q.quote}”`;
  const who = document.createElement('p');
  who.className = 'who';
  who.textContent = speakers(q).map(s => NAMES[s] || s).join(' & ');
  label.append(text, who);
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.append(`${SHOWS[q.show] || q.show} · Episode ${q.episode} · ${q.episodeTitle.replace(/\s*\[\d+\]\s*$/, '')} · `);
  const link = document.createElement('a');
  link.href = q.listenUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = `Watch at ${q.timestamp}`;
  meta.append(link);
  const tags = document.createElement('p');
  tags.className = 'tags';
  for (const t of q.weatherTags || []) { const s = document.createElement('span'); s.textContent = t; tags.append(s); }
  const body = document.createElement('div');
  body.append(label, meta, tags);
  li.append(box, body);
  return li;
}

function shown() { return catalog.quotes.filter(matches); }

function summary() {
  const n = selected.size, visible = shown().length;
  $('summary').textContent = `${visible} of ${catalog.quotes.length} quotes shown · ${n} selected`;
  $('download').disabled = n === 0;
  $('download').textContent = n ? `Download ${n} as JSON` : 'Download JSON';
}

function render() {
  const list = shown();
  $('quotes').replaceChildren(...list.map(card));
  $('empty').hidden = list.length > 0;
  summary();
}

$('search').oninput = e => { filters.text = e.target.value.trim().toLowerCase(); render(); };
$('select-shown').onclick = () => { for (const q of shown()) selected.add(q.id); save(); render(); };
$('clear').onclick = () => { selected.clear(); save(); render(); };
$('download').onclick = () => {
  const picks = catalog.quotes.filter(q => selected.has(q.id));
  const out = { ...catalog, quotes: picks, selection: { source: new URL('catalog.json', location.href).href, createdAt: new Date().toISOString() } };
  const blob = new Blob([JSON.stringify(out, null, 2) + '\n'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'regulation-quotes.json';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

fetch('catalog.json', { cache: 'no-cache' })
  .then(r => { if (!r.ok) throw Error(); return r.json(); })
  .then(data => {
    const retired = new Set(data.retiredIds || []);
    catalog = { ...data, quotes: data.quotes.filter(q => !retired.has(q.id)) };
    // Drop picks that no longer exist (corrected or removed quotes).
    const ids = new Set(catalog.quotes.map(q => q.id));
    for (const id of [...selected]) if (!ids.has(id)) selected.delete(id);
    save();
    const used = new Set(catalog.quotes.flatMap(speakers));
    for (const [id, name] of Object.entries(NAMES)) if (used.has(id)) chip(name.split(' ')[0], filters.speakers, id, $('speakers'));
    for (const show of ['RP', 'FF']) if (catalog.quotes.some(q => q.show === show)) chip(SHOWS[show], filters.shows, show, $('shows'));
    const counts = {};
    for (const q of catalog.quotes) for (const t of q.weatherTags || []) counts[t] = (counts[t] || 0) + 1;
    // The most-used tags first; the long tail sits behind "More tags".
    const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
    for (const t of tags) chip(t, filters.tags, t, $('tags'));
    if (tags.length > 12) {
      const extra = [...$('tags').children].slice(12);
      extra.forEach(c => { c.hidden = true; });
      const more = document.createElement('button');
      more.type = 'button'; more.className = 'chip more'; more.textContent = `More tags (${extra.length})`;
      more.onclick = () => { extra.forEach(c => { c.hidden = false; }); more.remove(); };
      $('tags').append(more);
    }
    render();
  })
  .catch(() => { $('summary').textContent = 'Could not load the quotes. Try refreshing the page.'; });
