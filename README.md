# UF Urban Analytics website
https://qinghou1.github.io/MSUA/
## Files
- index.html: program homepage with fixed section navigation and an embedded curriculum fallback.
- 20260921_Curriculum_MSUA.html: the supplied M.S. curriculum, unchanged.
- 20260921_Curriculum_Certificate.html: the supplied certificate curriculum, unchanged.
- .nojekyll: static-site marker.

Keep index.html and the two curriculum files together in the published directory.
The package uses relative URLs and works at a site root or a repository subdirectory.
No build step, JavaScript framework, package installation, or separate data file is needed.

## Offline and external resources
The program text, curriculum source data, layout, and scripts are contained within index.html.
The separate standalone HTML download uses its embedded curriculum viewer for every curriculum link.
In the hosted package, curriculum buttons navigate to the matching sibling HTML files.
A built-in embedded viewer is used when a matching sibling file cannot be retrieved.

Faculty photographs retain their existing online source URLs. They require internet access
and show the existing initials fallback when unavailable. These image files could not be
retrieved for embedding during this revision. Research websites, Google Scholar, application
portals, and email links also point to external services.
ECE cards remain unconfirmed profile templates. URP email addresses remain directly visible.

## This revision
Fixed all nine navigation-bar links, the hero section links, Review Admissions, and Read FAQ.
Added section focus, sticky-navigation offsets, and active-section indication.
Why UF? combines the slogan "Urban planning expertise meets technical AI training." with three concise program-strength cards.
Removed the requested job-title disclaimer.
All source curriculum requirements and application requirement text were retained.
