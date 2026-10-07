# Release 1.7

- Added 216 original reaction lines across all 36 hosts.
- Added 44 power and topic opinion banks with comments from characters familiar with the subject.
- Added occasional connected two-character conversations with both portraits visible on desktop and mobile.
- Added individual comments for all 93 enemies after selection, plus paired victory and defeat exchanges.
- Improved saved dialogue repeat avoidance and conversation cooldowns.
- Updated app version, cache keys, launcher metadata and offline build configuration to 1.7.
- See RELEASE-1.7.md for details and validation.

# Release 1.6

- Replaced assembled player parts with cohesive full-body character models: 36 stable identities and 216 poses across nine anime.
- Added two reaction hosts per anime and expanded original contextual dialogue.
- All 93 enemies can react only once selected; rerolls replace the revealed opponent.
- Removed the ghost-like player aura oval and isolated each pose with a native silhouette mask to exclude detached pixels and neighboring artwork.
- Preserved character saves, gems, bonus rerolls, auto-spin and battle rules.
- Updated version labels, Windows launcher, offline packages and SHA-256 verification.
- See RELEASE-1.6.md for downloads, validation and artwork details.

# Release 1.5

- Earn one gem per newly completed victory, with duplicate-reward protection.
- Persistent gem shop: one gem buys one bonus reroll, shared across worlds and carried into future runs.
- Three free rerolls remain available for each new run and are consumed before bonus rerolls.
- Buy directly from reaction pop-ups; failed storage writes do not spend gems.
- Visible wallet balance, victory reward message, and updated tutorial/offline packages.

# Release 1.4

- First-visit tutorial with Skip, Back, Next, and replay from Settings.
- Single horizontal anime row with scrolling/swiping and arrow buttons on desktop and mobile.
- Identity badges and question headings in reaction pop-ups.
- 72 additional original anime-aware lines across the nine worlds; existing character recognition and lost-Zoro cameos retained.
- Modest improvements to stat, ability-count, unlock and enemy-condition weights; final victory chance increased by five percentage points within the existing 5–95% bounds. Displayed odds match selection weights.
- Fixed neck/wrist alignment and mobile right-hand visibility without replacing artwork.
- Auto-spin retained, saved characters preserved, and offline packages rebuilt.

# Release 1.3

- Male, Female, and Random appearance choices before the first spin; the resolved appearance persists through rerolls, reloads, and saved characters. Existing saves keep their male appearance.
- Female illustrated age layers and matching equipment/outfit composition.
- Automatic final battle reveal after accepting the final outcome, with your actual generated build and the exact selected opponent. Victory and defeat use different poses; all 93 opponent entries are covered, including squads.
- Saved characters reopen the same scene, with links to stats, clean portrait, and text download. Opponent condition and battlefield are displayed; a condition adds visual emphasis rather than inventing an unrolled form.
- Measured artwork bounds prevent neighboring sprites appearing in the scene. No runtime image API or network access is required.
- Visible version 1.3 and updated Windows/browser packages.

# Release 1.2

- Added Fairy Tail (Natsu/Lucy), My Hero Academia (Deku/Bakugo), Attack on Titan (Eren/Mikasa), and Hunter × Hunter (Gon/Killua), each with branching wheels and twelve reaction frames.
- Added evolving layered portraits: age, outfit, affiliation coloring, origin tint, equipment and power motifs, with previews during pending rolls and saved-character viewing. Portraits run offline.
- Added delete confirmation per saved character, including cancellation and storage-failure handling; the active run is preserved.
- Added original personality dialogue for eight new speakers, self-recognition plus partner responses for all eighteen characters, and Zoro visits to all eight other worlds. Self-recognition takes priority over cameos.
- Compact anime dropdown accommodates nine worlds on desktop and phone. Automatic mobile verdicts remain available.
- Visible version 1.2, updated offline packaging, 21 verified embedded assets. Existing browser storage key and save schema retained. The 1.2 EXE extracts to its own version directory.

# Release 1.1

- Enemy Full Power and Prime results now receive negative player-benefit verdicts and sounds; weakened enemies receive favorable verdicts. Battle calculations are unchanged.
- Expanded original dialogue for all ten characters, contextual comments, and specific opinions on Frieza-related traits, Limitless, Uchiha, and Gum-Gum results.
- Recent dialogue is remembered per run to reduce repeats, including across saved sessions.
- Lost Zoro may appear in another anime after the first two reactions: 5% per eligible reaction with at least eight reactions between cameos. He appears beside the local speaker with an exchange; cameos never change stats or odds and do not interrupt final battle verdicts.
- Automatic mobile reaction pop-ups with Continue, Reroll, and Close, plus paired cameo portraits.
- Version 1.1 app labels, cache-versioned assets, and rebuilt Windows/browser packages. Existing browser saves retain their storage key and schema.

# Release 1.0

- Five anime worlds with branching character-generation wheels.
- Exact-age spins after age ranges, including an Ancient age branch.
- Individual technique and mastery spins, stats, weighted encounters and rerolls.
- Ten recognizable reaction characters with solo and duo artwork.
- Desktop layout fitted to the viewport, mobile panel tabs, paged character sheets and odds.
- Local autosave, saved characters and text exports.
- Visible application version and a single-file Windows launcher containing the offline game.
