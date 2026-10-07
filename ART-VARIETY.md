# Character variety artwork

Generated with the built-in imagegen tool. Original atlas assets are retained; the new assets are stored beside them.

## Reaction portraits

File: `reaction-cast-v2.png` (1536 × 1024; 6 columns × 3 rows).

Prompt:

Use case: stylized-concept. Asset type: anime game reaction portrait atlas. Create exactly 18 separate bust portraits in a strict equal 6-column by 3-row grid, each centered within its own cell, no overlap, dark navy background, no text or borders. Landscape 1536x1024. Detailed clean anime cel shading, expressive recognizable faces, shoulders visible. Row 1 left to right: Nobara Kugisaki (orange bob, navy uniform, confident); Kento Nanami (blond side part, glasses, tan suit, composed); Sakura Haruno (pink hair red outfit, assertive); Kakashi Hatake (silver hair, headband covering one eye, black mask, green vest); Nami (orange hair, cheerful); Sanji (blond hair covering one eye, black suit, sly smile). Row 2: Renji Abarai (red hair and forehead tattoos, black shinigami robes); Kisuke Urahara (striped green white bucket hat, green coat, amused); Piccolo (green skin, antennae, white turban and cape, serious); Bulma (blue hair, utility jacket, inquisitive); Gray Fullbuster (black hair, dark open jacket, confident); Erza Scarlet (long red hair, silver armor, stern). Row 3: Shoto Todoroki (half white half red hair, scar, navy hero outfit, calm); Ochaco Uraraka (brown bob, black pink hero suit, upbeat); Levi Ackerman (short black undercut, scout cloak, stern); Armin Arlert (blond bob, scout uniform, thoughtful); Kurapika (blond bob, blue gold outfit, focused); Leorio (black spiky hair, small round glasses, blue suit, animated). All portraits same scale, fully contained in exact cells. No duplicate characters, no captions, no watermarks.

## Battle pose layers

File: `battle-poses-v2.png` (1536 × 1024, transparent). Alpha bounds are measured in `battle.js`; the cell padding is excluded when rendering. Normal-height proportions are set in `fit.css`.

Prompt:

Use case: stylized-concept. Asset type: transparent sprite atlas for anime game lower-body pose layers. Exactly 12 separate waist-down adult human body illustrations in a strict 6-column by 2-row grid. Landscape image 1536x1024. Entire background genuinely transparent, no shadows, no labels, no borders, no heads, torsos, arms or hands. Each sprite fully contained in its equal 256x512 cell with ample margin. Anime cel shaded realistic normal adult proportions, long legs, dark navy fitted adventurer trousers, brown leather belt and tall dark brown boots, matching outfits across all sprites. Every sprite waist centered at same top position within its cell and feet at same baseline. Top row male waist-down poses left-to-right: 1 standing balanced confident feet shoulder-width; 2 relaxed standing with weight on one leg and one knee slightly bent; 3 resolute wide standing stance; 4 defeated kneeling on both knees; 5 defeated sitting on ground with bent knees facing front; 6 exhausted one knee on ground other boot planted forward. Bottom row female waist-down versions of those same six poses, long adult proportions, same practical trousers boots and belt. For standing poses both full legs and entire boots visible. For seated/kneeling poses their silhouette naturally shorter but align waist at cell top, use only upper part of cell so sprite bounding boxes can be cropped. Clean separated sprites, no overlapping cells, no extra limbs. Neutral front or mild three-quarter perspective suitable for attaching an upper-body layer at the waist.

## Verification

`qa-variety.html` shows all 12 gender/outcome/pose combinations and all 18 new reaction portraits. It is available through the local preview, excluded from release packaging. `node test-variety.cjs` checks all 36 reaction hosts, the 93 selected opponents, selection and reroll timing, saved appearance stability, and desktop/mobile artwork routing.


## Reaction style revision

Active asset: reaction-cast-v3.png (1536 x 1024), replacing v2 in the app and release packaging. The previous atlas remains as a source reference. Generated with built-in imagegen using reactions-fairytail.png (Natsu/Lucy), reactions-dragonball.png (Goku/Vegeta), and reaction-cast-v2.png as references.

Prompt: Redraw all 18 characters in the same order and costumes as v2, matching the original sheets' expressive chibi busts: large round heads, compact torsos, bold dark outlines, saturated cel shading, playful expressions and dark navy/purple backgrounds. Strict six-column, three-row grid; no text or borders. Use each character's recognizable hairstyle, outfit and accessories.

Measured row boundaries are 0,338,656,1024; columns are 256 pixels wide. App and both preview pages crop those exact rows so neighboring artwork stays outside the frame. Desktop/mobile solo and paired routing retain the same character indices.
