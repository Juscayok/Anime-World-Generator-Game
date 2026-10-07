# Expressive reaction artwork — version 1.10

Created with the built-in imagegen tool. The original Natsu/Lucy and Goku/Vegeta sheets provide the style reference; reaction-cast-v3.png provides the newer character designs. Previous artwork is retained.

## Assets

- reaction-expressions-1.png: Nobara, Nanami, Sakura, Kakashi, Nami, Sanji.
- reaction-expressions-2.png: Renji, Urahara, Piccolo, Bulma, Gray, Erza.
- reaction-expressions-3.png: Todoroki, Uraraka, Levi, Armin, Kurapika, Leorio.

Each PNG is 1536 × 1024 with six columns and four rows of square 256 × 256 portraits. Columns retain one character across all rows; rows are crying, thoughtful, approving and celebrating. All 72 frames were visually inspected. The shared portraitStyle function routes crops consistently through desktop, mobile and both previews.

## Prompts

The complete three generation prompts are stored in ART-EXPRESSIONS-PROMPTS.json. Common direction: match the originals' expressive chibi busts with large round heads, compact torsos, bold dark outlines, saturated cel shading and navy/purple backgrounds. Keep character identities and costumes consistent, within a strict 6 × 4 equal grid. Crying uses exaggerated tears and clenched fists; thought uses chin-hands and skeptical eyes; approval uses smiles and thumbs-up; celebration uses joyous faces and raised fists. Kakashi keeps his face mask in all expressions.

## Behavior and validation

Result benefit selects crying, thought or approval. Scores of six or above celebrate when favorable. Victory forces celebration and defeat forces crying. Knowledge rolls retain thoughtful expressions. Both newer speakers in a conversation receive the relevant expression. Old saved reactions lacking the expression field use their stored benefit, or default to thought.

The lost-Zoro cameos retain their original eligibility, probability, cooldown, artwork and dialogue. The expression selection runs after cameo selection and cannot replace a cameo with a conversation. Selected opponents retain their actual opponent artwork and reveal timing.

Run node test-expressions.cjs to verify all 72 combinations, saved routing, outcomes, desktop/mobile partners and the eight eligible Zoro cameo worlds. Open qa-expressions.html for comparison with Natsu/Lucy, qa-variety.html for the complete gallery, and qa-reactions.html for conversations.
