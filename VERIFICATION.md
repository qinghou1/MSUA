# Package verification

Source: `20260930_UF_Urban_Analytics_Self_Contained_v3.html`  
GitHub Pages package: v5

## Content and resources

The packaged page's body text matches the approved v3. The included single-file HTML is byte-identical to that source. The five project abstracts and their order are unchanged, with Yuqi Zhou first. No figure numbers, duplicate Connect contact cards, or Ilir Bejleri profile have been reintroduced.

All referenced local resources and both standalone curriculum pages exist. All internal anchor targets exist, and the main page has no duplicate element IDs. The two standalone curricula match their embedded payloads byte-for-byte and match their stored SHA-256 checksums. COP 3502C and EEL 3850 each show 4 credits in the packaged M.S. curriculum and in the embedded viewers.

Seven content images are bundled and decoded successfully: five project figures and the supplied portraits of Zhaoxi Zhang and Vivian Wong. CSS and JavaScript are bundled locally. A local HTTP server returned the exact packaged bytes for the homepage, stylesheet, main script, and both curriculum pages.

## Layout and interactions

The automated verification completed 61 checks successfully. Browser layout checks covered 1440, 1024, 390, and 320 pixel viewport widths with no page-level horizontal overflow. Both detailed-course buttons align at the same vertical position in the desktop two-column layout. A screenshot comparison of the program section matched the approved v3 exactly.

The student-research carousel has equal-width cards, Yuqi Zhou first, working previous/next controls, correct disabled states, and Home/End keyboard navigation. Abstracts expand and collapse, project figures enlarge and close, and the faculty carousel still scrolls. Both curriculum viewers open; the M.S. viewer shows the corrected 4-credit values. No JavaScript errors occurred during these interaction tests. Desktop and mobile screenshots of the programs and student research were visually reviewed.

## Scope and limitations

Browser navigation is restricted in the packaging environment. Browser rendering and interaction tests therefore used the actual packaged CSS, JavaScript, and local images temporarily inlined for testing. The delivered website still uses ordinary relative paths. File existence, checksum, and local HTTP tests were performed separately on the delivered files. A live GitHub Pages deployment and outgoing research, Google Scholar, and admissions links were not tested.

Four portraits retain their existing UF-hosted URLs: Zhong-Ren Peng, Emre Tepe, Shenhao Wang, and Yan Wang. Their image bytes could not be fetched in this environment, so these four images are not bundled and depend on the original online hosts. The approved initials fallback remains. Their URLs are recorded in `assets/faculty/remote-portraits.json`.

No program facts, faculty information, research abstracts, or policy statements were independently re-researched or changed while packaging this version. Unconfirmed ECE profile templates remain exactly as approved in v3.
