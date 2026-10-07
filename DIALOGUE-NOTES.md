# Character opinions and conversations

The dialogue expansion adds 216 individually written host lines (two new lines per mood for each of 36 hosts), 44 knowledge topics, individual comments for all 93 opponents, four general exchanges per anime, and distinct paired victory/defeat reactions. All text is original fan dialogue, not dialogue quoted from the shows.

Knowledge topics are matched against the current roll's label and question, scoped to the selected anime. A mastery roll can also refer to its actual previously selected technique; equipment mastery can refer to the selected weapon. Unrelated stat rolls do not borrow a previous power's topic. Expert speakers give their own opinion instead of simply announcing the power's name.

Conversations have a 28% chance on eligible reactions after the first two reactions, with at least three reaction turns between exchanges. Both speakers are named, their lines are connected, and both portraits appear in the desktop verdict and mobile popup. Two-speaker conversations remain distinct from lost-Zoro cameos. Cameos retain their own rules and priority. Selected enemies can exchange comments with a regular host only beginning with their actual selection; a reroll replaces the revealed opponent. Non-speaking Titan opponents use action descriptions rather than invented fluent speech.

Recent dialogue history is extended to 100 entries. A bounded per-pool last-line record prevents an immediately repeated line after that pool falls out of the recent-history window. Conversations have several variants and also use the history. These fields serialize with existing run saves and do not change spins, odds, stats, rewards or reroll costs.

Try `http://127.0.0.1:4189/qa-reactions.html` with the local preview server running. The demo includes solo power opinions, power conversations, selected-enemy exchanges, and another-response controls; it does not touch browser saves. Run `node test-dialogue-expansion.cjs` to check expertise, mastery references, world scoping, all speakers/enemies, conversation frequency gating, cooldowns, saved repeat avoidance, unchanged gameplay, and both desktop/mobile portraits.

## Reference checks

Opinions are written for the game's own rules and are not promises about canonical matchup outcomes. Character and power reference material was checked against official anime/publisher pages, including [Jujutsu Kaisen characters](https://jujutsukaisen.jp/character/category3.php), [Sakura's chakra-control background](https://naruto-official.com/fr/news/01_1743), [Piccolo's techniques](https://en.dragon-ball-official.com/news/01_210.html), and [Hunter × Hunter](https://www.ntv.co.jp/hunterhunter/). No source dialogue was copied into the game.
