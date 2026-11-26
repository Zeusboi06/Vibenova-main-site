# Logo Assets — VibeNova

Place client logo files in this directory. Supported formats: PNG (preferred), SVG, WebP.

## Expected files

| File | Used in | Notes |
|------|---------|-------|
| `sholay-logo.png` | Work card + case study hero | Monochrome or full-colour |
| `aerosapien-logo.png` | Work card + case study hero | Monochrome or full-colour |
| `pakelo-logo.png` | Work card + case study hero | Monochrome or full-colour |

## Logo strip (optional)

When all 3 logos are uploaded, uncomment the logo strip HTML block in `index.html`
(search for `<!-- Logo strip — uncomment when 3+ logos are ready`).

## Notes

- Max logo height on work cards: **48px**
- Max logo height on case-study hero: **68px**
- If a file is missing, a dashed-gold placeholder appears automatically
- Logo images are referenced with `onerror="this.style.display='none'"` so broken images are invisible