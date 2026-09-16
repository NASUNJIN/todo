# Third-Party Notices

This document identifies third-party software and visual assets used by Done It.
The project source code is licensed under the [MIT License](LICENSE). Third-party
materials remain subject to their own license terms.

## Lordicon animation

- Asset: `src/assets/check_logo.json`
- Source: [Lordicon](https://lordicon.com/)
- License: [Lordicon Free License](https://lordicon.com/docs/license/free)
- Attribution: [Animated icons by Lordicon.com](https://lordicon.com/)

The asset is used only as an incorporated decorative animation in the application.
Lordicon's Free License requires attribution; the application footer includes the
required attribution link. Do not extract, redistribute, or use this asset outside
this project without checking Lordicon's current terms.

## Icon sets used through `@kalimahapps/vue-icons`

`@kalimahapps/vue-icons` is licensed under [MIT](https://www.npmjs.com/package/@kalimahapps/vue-icons).
The package bundles icons from multiple icon sets; the following sets are used by
this project and retain their original licenses.

| Icons used in this project | Original icon set | License |
| --- | --- | --- |
| `HiArchiveBox`, `HiTag` | [Heroicons](https://heroicons.com/) | [MIT](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE) |
| `MdOutlinedBarChart`, `MdRoundAutoGraph` | [Material Icons](https://fonts.google.com/icons) | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) |
| `BxSolidDoughnutChart` | [Boxicons](https://boxicons.com/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `AkCalendar`, `AkHistory` | [Akar Icons](https://akaricons.com/) | [MIT](https://github.com/artcoholic/akar-icons/blob/master/LICENSE) |
| `RaCalendar` | [Radix Icons](https://www.radix-ui.com/icons) | [MIT](https://github.com/radix-ui/icons/blob/master/LICENSE) |

## Runtime packages

| Package | Version range | License |
| --- | --- | --- |
| Vue | `^3.5.40` | MIT |
| Vue Router | `^5.2.0` | MIT |
| Pinia | `^4.0.2` | MIT |
| vue3-lottie | `^3.3.1` | MIT |
| @kalimahapps/vue-icons | `^1.9.7` | MIT (icon-set licenses above also apply) |

## Build and development dependencies

The resolved dependency tree was checked from `package-lock.json` and installed
package metadata. The declared licenses are MIT, Apache-2.0, BSD-2-Clause,
BSD-3-Clause, ISC, MPL-2.0, BlueOak-1.0.0, and CC-BY-4.0. One development-only
transitive package, `memorystream@0.3.1` (via `npm-run-all2`), does not declare
a license field in its package metadata; it is not part of the production build.
`node_modules` and build output are excluded from version control.

For a production distribution, re-check the lockfile after every dependency update.
