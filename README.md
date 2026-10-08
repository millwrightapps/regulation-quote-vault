# Regulation Quote Vault

A community collection of **verified, timestamped quotes** from the Regulation Podcast and F\*\*kface, plus the free tools to grow it.

**Just want quotes?** Browse them at **[millwrightapps.com/regulation-quote-vault](https://millwrightapps.com/regulation-quote-vault/)**, tick the ones you like, and download your selection as a JSON file for your own project.

**Want to add quotes, or run your own collection?** Everything you need is in this repo. It transcribes episodes on your own computer, suggests lines worth keeping, and gives you a simple review page where you listen, credit the right person, and publish.

## All credit to the crew

Every quote in here belongs to **Andrew Panton, Gavin Free, Geoff Ramsey, Eric Baudour and Nick Schwartz**. It's their show, their jokes and their stories. This project just helps fans find their favourite moments and point back to them.

This is a fan project. It isn't affiliated with or endorsed by the Regulation Podcast or anyone on it. If you use quotes from here:

- Credit the speaker and the show every time.
- Link back to the episode. Every quote comes with a YouTube link to the exact moment.
- Keep it to short excerpts. Never post full transcripts.
- Support the show: watch, listen and subscribe on the [official YouTube playlist](https://www.youtube.com/playlist?list=PL0YaZqNO5Z3ds7_sVSEP-FTjvvfWWWY8O) or wherever you get your podcasts.

If anyone from the show would like something changed or taken down, open an issue and it'll be handled right away.

## Being respectful

A few ground rules, which the review page also reminds you of:

- **Respect Geoff's sobriety.** Geoff has been open about his sobriety, and he sometimes talks about his drinking past on the show. The vault doesn't publish quotes that tie him to drinking, even when he's the one telling the story. If a quote touches on it, remove it rather than crediting someone else. The validation catches obvious words, but it can't understand context, so this one is on the reviewer.
- **Never guess who's talking.** Credit a speaker only after you've listened and you're sure. If you can't tell, leave it.
- **Leave out anything that would be unkind out of context.** A bit that lands in the room can read differently as a one-liner on someone's phone.

## Using the quotes

The website reads `published/catalog.json`, the full list of approved quotes. You can:

- **Pick a selection on the website** and download it. The file has the same format as the full catalog, just with your picks, so you can host it anywhere.
- **Read the whole catalog** from `https://raw.githubusercontent.com/millwrightapps/regulation-quote-vault/main/published/catalog.json`.

```json
{
  "schemaVersion": 1,
  "revision": 26,
  "retiredIds": ["reg_047"],
  "quotes": [
    {
      "id": "manual_35e543d57b4245a70bdc",
      "quote": "…",
      "speaker": "GAVIN_FREE",
      "show": "FF",
      "episode": 206,
      "episodeTitle": "The Last Episode of F**kface // Firing Squad [206]",
      "timestamp": "13:54",
      "timestampSeconds": 834,
      "youtubeVideoId": "ccBukHBOrb0",
      "listenUrl": "https://www.youtube.com/watch?v=ccBukHBOrb0&t=834s",
      "weatherTags": ["chaos"],
      "review": { "status": "verified", "reviewer": "…", "checkedAt": "2026-10-02" }
    }
  ]
}
```

- **Speakers:** `ANDREW_PANTON`, `GAVIN_FREE`, `GEOFF_RAMSEY`, `ERIC_BAUDOUR` or `NICK_SCHWARTZ`. A dialogue quote also has a `secondarySpeaker`.
- **Shows:** `RP` for the Regulation Podcast, `FF` for F\*\*kface.
- **Tags:** `weatherTags` describe the mood or weather a quote suits, such as `rain`, `chaos` or `random`. They started life in a weather app, and they work for anything mood-based.
- **Updates:** when `revision` goes up, replace your copy, because quotes can be corrected or removed. Never show an ID listed in `retiredIds`.
- **Display:** please show the speaker's name and link to `listenUrl` wherever you display a quote.

## How finding quotes works

```
YouTube playlist ──► one episode's audio ──► Whisper on your computer ──► timed transcript
                                                                              │
   published/catalog.json ◄── Approve ◄── you listen and credit ◄── candidate quotes
```

- **Timestamps match YouTube.** Whisper transcribes the YouTube upload itself, so every link jumps to the right second. The podcast feed has different ads, so its timing doesn't line up.
- **Nothing publishes itself.** Candidates come in as drafts with no speaker. Only a person who has listened can approve one.
- **It's free, and it runs on your computer.** Transcription uses [whisper.cpp](https://github.com/ggml-org/whisper.cpp). The audio is deleted as soon as an episode is done.

### Why it has to run on your own computer

It would be lovely if GitHub could transcribe new episodes automatically, but **YouTube blocks GitHub's servers** (and most cloud servers), asking them to prove they aren't bots. Downloads only work reliably from a normal home connection, so transcription happens on your Mac or PC when you click the button. If YouTube gets suspicious of your connection too, collection waits 30 minutes and then carries on.

### Sharing the work

When you collect candidates, the drafts (short excerpts) and the list of episodes already transcribed (`inbox/whisper_processed.json`) are saved to your copy of the repo. If you send them back as a pull request, nobody has to transcribe those episodes again. Full transcripts stay on your computer in `transcripts/`. They're the show's content, so they don't belong in a public repo.

## What you need

**Mac**
- Apple Silicon (M1 or newer) is best. Intel Macs work too, just more slowly.
- [Homebrew](https://brew.sh) and Python 3.10 or newer.
- The [GitHub CLI](https://cli.github.com): `brew install gh`.

**Windows**
- Windows 10 or 11, 64-bit.
- [Python 3.10 or newer](https://www.python.org/downloads/). Tick "Add python.exe to PATH" when installing.
- [Git](https://git-scm.com/download/win) and the GitHub CLI: `winget install GitHub.cli`.
- Transcription runs on the processor, so expect roughly 15 to 30 minutes an episode, depending on your PC.

**Both**
- About 2 GB of free space: the Whisper model is 550 MB, plus one episode's audio while it's being transcribed.
- A GitHub account.

The launcher installs everything else the first time you open it: yt-dlp, whisper.cpp, ffmpeg and the model.

## Getting started

1. **Fork this repo** on GitHub to get your own copy.
2. **Clone it and sign in to GitHub:**
   ```sh
   git clone https://github.com/YOUR-NAME/regulation-quote-vault.git
   cd regulation-quote-vault
   gh auth login
   ```
3. **Open the review page.**
   - **Mac:** double-click `Open Quote Review.command`.
   - **Windows:** double-click `Open Quote Review.bat`.

   Then go to **http://127.0.0.1:8765**. The first launch takes a few minutes while it installs everything. Leave that window open while you work.

The review page figures out which repo to save to from your clone, so there's nothing to configure. Your fork comes with the approved quotes already in this vault. Approvals you make go to your fork, and you can send them back here as a pull request.

To publish your own website from your fork, go to your repo's **Settings → Pages** and set **Source** to **GitHub Actions**. It updates every time the catalog changes.

## Finding quotes

Click **Transcribe next episode** or **Transcribe 5**. A Mac with Apple Silicon takes about 5 minutes an episode. You can keep reviewing while it runs. Progress shows at the bottom of the page, and **Stop after this episode** ends it cleanly. Each finished episode is saved straight away, so stopping never loses anything.

It works through the playlist from the oldest episode and skips anything it has already done. Each episode gives you up to 10 candidates. Along the way it:

- skips the first two minutes, ad reads (including the setup line before a sponsor is named), and the show intro
- drops half-sentences and anything already in the vault
- ranks self-contained lines higher, with a bump for running bits from the [Regulation Lore dictionary](https://www.regulationlore.com.au/dictionary)
- leaves out unnumbered videos like supplementals and specials. You can add quotes from those by hand.

Prefer the terminal? On Windows, use `.venv\Scripts\python.exe` instead.

```sh
.venv/bin/python scripts/whisper_youtube.py --batch 5         # next 5 episodes into drafts/
.venv/bin/python scripts/whisper_youtube.py --video VIDEO_ID  # transcribe one video into transcripts/
```

## Reviewing

Pick a candidate, then:

1. **Play the preview.** It starts at the candidate's spot in the YouTube video and plays for 35 seconds.
2. **Get the words exactly right, and credit the speaker by ear.** For a back-and-forth, add the second speaker and keep the names in the text. Split anything with three or more people into separate quotes.
3. **Check the show, episode and start time,** and add a few tags such as `rain`, `cloudy` or `chaos`. `random` fits anywhere.
4. **Tick the box to confirm you listened,** then **Approve & publish**.

Approving moves the quote into `quotes/` and updates the catalog in a single commit. **Remove quote** moves it to `quarantine/` so it won't be suggested again. **Add quote** lets you save something you found yourself.

The review page only suggests a speaker when the exact same quote from the same episode has already been credited by a person. Nothing here recognises voices.

### Reviewing from your phone

Open **Open Phone Quote Review** (`.command` on a Mac, `.bat` on Windows). It shows an address and a pairing code. Open the address on your phone while it's on the same Wi-Fi, then enter the code. Your GitHub login never leaves your computer. The connection is plain HTTP on your home network, so only use it on Wi-Fi you trust. On Windows, allow Python through the firewall if it asks.

## What's where

| Path | What's in it |
|---|---|
| `site/` | The website for browsing quotes and downloading a selection |
| `drafts/` | Candidates waiting for someone to listen |
| `quotes/` | Approved quotes, one file each |
| `quarantine/` | Removed candidates, kept so they don't come back |
| `published/catalog.json` | The public catalog, generated from `quotes/` |
| `catalog.json` | The revision number and retired IDs |
| `inbox/` | Transcription progress, the lore dictionary list, and F\*\*kface archive recordings (episodes 1–56) |
| `scripts/` | The review server, Whisper collector, filters, validation, tests and setup |
| `dashboard/` | The review page |
| `transcripts/`, `models/`, `tools/` | Stay on your computer and are never committed |

## Editing by hand

You can skip the review page entirely:

1. Copy an existing draft and keep its `id`. Never reuse a retired one.
2. Listen to the recording, then fill in every `review` field: `status` set to `verified`, plus `reviewer`, `checkedAt`, `sourceUrl` and the five `…Checked` flags.
3. Move the file to `quotes/` and increase `revision` in `catalog.json`.
4. Rebuild and test:
   ```sh
   python3 scripts/build_catalog.py
   python3 -m unittest discover -s scripts -p 'test_*.py'
   ```
5. Commit the quote, `catalog.json` and `published/catalog.json` together. GitHub checks the catalog and runs the tests on every push.

## A note on downloading

To transcribe an episode, the collector downloads its audio, transcribes it on your computer and deletes it straight away. It goes one episode at a time with pauses in between. Please keep it gentle, only publish short credited excerpts, and follow YouTube's terms where you live.

## Thanks

- **Andrew, Gavin, Geoff, Eric and Nick**, for years of F\*\*kface and the Regulation Podcast, and for every bit, story and tangent worth quoting.
- The fans behind the [Regulation Lore dictionary](https://www.regulationlore.com.au/dictionary), which helps the collector spot running bits.
- [@tgb20](https://github.com/tgb20), who runs Regulation Search, for sharing how he uses Whisper to build his transcripts and for pointing to other community work. That's what got this project going.
- [@michaelbooth1](https://github.com/michaelbooth1), whose [regulationproject](https://github.com/michaelbooth1/regulationproject) has full episode transcripts and speaker analysis, and is well worth a look.
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp) and OpenAI's Whisper model, for speech-to-text.
- [yt-dlp](https://github.com/yt-dlp/yt-dlp), for the playlist and audio.

## License

The code in this repo (the scripts, review page, website and setup) is released under the [MIT License](LICENSE), so you're free to fork it, change it and use it in your own projects.

The quotes aren't covered by that license. They belong to the Regulation Podcast and its hosts. Please use them the way this README describes: short excerpts, full credit, and a link back to the episode.
