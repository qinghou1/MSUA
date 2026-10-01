# UF Urban Analytics 

https://qinghou1.github.io/MSUA/

This package is built from the approved **20260930_UF_Urban_Analytics_Self_Contained_v3.html**. It preserves the latest page design and content, including the aligned program buttons and horizontal student-research carousel with Yuqi Zhou first.

## Publish the website

Extract the ZIP and place its **contents** in your GitHub Pages publishing directory. `index.html` must be at the top level of that directory, next to `assets/` and the two curriculum HTML files. Do not upload only the ZIP file. Preserve the relative folder structure and include `.nojekyll`.

This website is static. The package contains no build process, package installation, server-side code, custom-domain configuration, or account credentials. Publish the extracted directory using your repository's GitHub Pages configuration.

## Files

- `index.html`: the website entry point.
- `20260921_Curriculum_MSUA.html`: the detailed M.S. curriculum, with COP 3502C and EEL 3850 each shown as 4 credits.
- `20260921_Curriculum_Certificate.html`: the detailed certificate curriculum.
- `assets/css/site.css`: the original approved styles, in their original cascade order.
- `assets/js/`: section navigation, curriculum handling, faculty scrolling, figure enlargement, and student-research carousel scripts.
- `assets/projects/`: the five original project figures and a reference export of the displayed research content.
- `assets/faculty/`: the two supplied faculty portraits and a manifest of the four existing online portraits.
- `20260930_UF_Urban_Analytics_Self_Contained_v3.html`: an unchanged copy of the approved single-file version.
- `PACKAGE_MANIFEST.json`: source and asset hashes and resource inventory.
- `VERIFICATION.md`: package checks and known limitations.

## Local preview

Open `index.html` for a file-based preview. To test the hosted curriculum links from the extracted directory, serve it with a local static server, for example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## What is preserved

The two detailed-course buttons are aligned in the desktop two-column layout. Student research uses a horizontal carousel with arrow controls, touch scrolling, consistent cards, click-to-expand abstracts, and click-to-enlarge figures. Yuqi Zhou's research appears first, followed by Qingqi Song, Mia L. J. Ciceri, Ryan Chisholm, and Chi Zhang.

The larger hero title, approved introduction, supplied Zhaoxi Zhang and Vivian Wong portraits, corrected Peng research interests and Scholar link, `INFORM` label, and application-area contacts are preserved. The duplicate large contact cards below the Connect section remain removed. Ilir Bejleri is not included.

## Faculty image dependency

All five research figures and the supplied portraits for **Zhaoxi Zhang** and **Vivian Wong** are included as local files. The four existing portraits for **Zhong-Ren Peng, Emre Tepe, Shenhao Wang, and Yan Wang** retain the same UF-hosted image URLs used in the approved v3. Those four files could not be fetched in the packaging environment and are **not bundled**. Their existing initials fallback appears if the remote image cannot load. This also applies to the included single-file HTML.

All CSS and JavaScript are local. Research websites, Google Scholar links, admissions links, email links, and phone links keep their approved destinations. The ECE profile templates remain unchanged from v3; no unconfirmed faculty information has been added.

## Maintaining the content

Edit the website text in `index.html`. `assets/projects/projects.json` is a reference export, not a dynamic data source. Update it separately when editing the research content.

The two detailed curriculum files are identical to the base64 source payloads embedded in `index.html`. On a hosted website, matching curriculum files open directly; local previews use the embedded viewer. When editing a curriculum in a future version, update both its HTML file and corresponding embedded payload (including its SHA-256 value). Regenerate the single-file version separately to keep it in sync. The current package is already synchronized.

No original student manuscripts or PDFs are included, only the previously approved displayed abstracts and figures.
