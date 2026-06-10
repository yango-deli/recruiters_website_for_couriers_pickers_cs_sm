# Reference clones

Local snapshots of inspiration repos and upstream skills. **Committed to git** (without nested `.git/` folders) so agents and new machines have the same context.

| Folder | Upstream | Why it's here |
|--------|----------|---------------|
| `chicago-current/` | [ryancalacsan/chicago-current](https://github.com/ryancalacsan/chicago-current) | Lenis + GSAP pinned scroll narrative — motion reference for this landing |
| `hallmark/` | [nutlope/hallmark](https://github.com/nutlope/hallmark) | Anti-AI-slop design skill source (also vendored under `.cursor/skills/hallmark/`) |
| `uupm/` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | UI UX Pro Max skill source (also vendored under `.cursor/skills/ui-ux-pro-max/`) |
| `ia-startup/` | [MrInspection/ia-startup-landing-page](https://github.com/MrInspection/ia-startup-landing-page) | Startup landing layout reference |

## Refresh from upstream

```bash
cd .reference/chicago-current && git pull
cd ../hallmark && git pull
cd ../uupm && git pull
cd ../ia-startup && git pull
```

After pull, commit updated files (nested `.git/` is gitignored).

## Prefer vendored skills for agents

For Cursor agent work, use **`.cursor/skills/`** — that's the project-pinned copy. `.reference/` is for reading full upstream repos and diffing against originals.
