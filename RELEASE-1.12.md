# Anime World Generator 1.12 — Tournament

Tournament combines all eleven anime into a mixed build. Each identity, origin, faction, energy source, technique, special talent and equipment result records its own source world. All worlds have the same chance in a mixed pool; the existing weights apply within each world's pool. The odds dialog lists every possible result and source. Learned technique names do not repeat.

The tournament has eight contenders and three rounds: quarterfinal, semifinal and final. Seven rivals are drawn from seven different worlds. Their bracket matches resolve alongside yours; your wins advance you and a defeat eliminates you. The full bracket, current rival, results and champion survive saving and reopening. This mode uses the game's own cross-world balance rules.

Rivals respond in 22 individual competitive voices, with comments about the selected result, your mixed build, weak mastery, technique openings, prior opponents and match outcomes. Rival artwork follows their own anime and uses defeated/celebrating expressions from the rival's perspective.

Cowboy Bebop and One Punch Man are also complete standalone worlds. Each includes identities, roots, factions, twelve techniques, conditional specialties, equipment, ten enemies and four reaction hosts. New art includes 48 complete player poses, 40 opponent poses, 32 expressive host portraits, an eleven-world icon atlas and the tournament arena.

One gem now restores the current run's rerolls to three, capped at three. Full or finished runs cannot spend a gem on a refill. The charge and refill credit share one durable wallet record, so a failed save cannot spend a gem without delivering a refill. Old unused paid bonus rerolls are refunded one-for-one as gems. Normal victories and tournament championships each award one gem, once per run.

Desktop and mobile retain manual rolls, section simulation, appearance selection, odds, character sheets and the library. Tournament simulation stops at each match boundary. Existing saved characters remain readable.

Artwork was generated with the built-in image_gen tool. Asset prompts are in ART-1.12-PROMPTS.json. Files: new-reactions.png, character-models-cowboy.png, character-models-opm.png, battle-enemies-cowboy.png, battle-enemies-opm.png, tournament-icons.png and tournament-arena.png. measure-new-art.cjs derives full-silhouette display crops and masks into new-art.js without changing source pixels.

Validation includes the full Node regression suite, 2,200 standard runs across eleven worlds, 264 section-simulated runs, 100 seeded tournament brackets, equal-world odds, bracket loss/champion paths, source-aware appearances, rival lines, legacy wallet refunds and durable refills. Browser checks cover desktop/mobile wheels, world sources, rival portraits, bracket access, both new worlds and match results. The Windows and browser packages embed every new asset and are verified against source hashes.
