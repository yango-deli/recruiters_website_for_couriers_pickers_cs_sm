# Релизы через GitHub

GitHub — единственный источник правды для кода и релизов. Production на Vercel обновляется **только** после успешного push в `main`.

## Схема

```
feature branch → Pull Request → merge в main → GitHub Actions → Vercel production
```

1. **Разработка** — ветка от `main`, локально `npm run dev`
2. **Проверка** — `npm run lint` и `npm run build` перед PR
3. **Pull Request** — в `main`; CI запускает lint + build
4. **Merge** — после ревью; CI снова собирает проект
5. **Deploy** — job `Deploy to Vercel (production)` выкатывает на https://yangodeli-couriers-carriers-website.vercel.app

## Что не делать

- Не выкатывать на прод через `vercel --prod` с локальной машины (только аварийный обход, если Actions недоступен)
- Не коммитить `.env.local`, `.vercel`, скриншоты и черновые Zoho-скрипты из `scripts/`

## Секреты GitHub (один раз)

В [Settings → Secrets → Actions](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/settings/secrets/actions):

| Secret | Значение |
|--------|----------|
| `VERCEL_TOKEN` | Токен Vercel (Account → Tokens) |
| `VERCEL_ORG_ID` | `team_g7rv4WZMHEpPS5kUUkYjl4Re` |
| `VERCEL_PROJECT_ID` | `prj_RteDbZeITDPEc4VaTtIAbjM8njIk` |

## Контент и ассеты

```bash
# Расширить perks/trust/benefits для всех ролей (en, ru, he)
node scripts/expand-role-content.mjs

# Синхронизировать бренд-ассеты с Yandex Disk (локально)
python3 scripts/sync-brand-from-yadisk.py
```

После изменений в `src/messages/*.json` — commit → PR → merge → автодеплой.

### Версионирование

1. Обновить `package.json` (`npm version patch|minor --no-git-tag-version`)
2. Записать изменения в [`CHANGELOG.md`](CHANGELOG.md)
3. Обновить строку **Версия** в [`README.md`](README.md)
4. PR → merge в `main` → CI деплоит production и можно создать git tag `vX.Y.Z`

## Мониторинг

- **CI / Release:** [GitHub Actions](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/actions)
- **Production:** https://yangodeli-couriers-carriers-website.vercel.app
- **Vercel dashboard:** https://vercel.com/igoryangotaxi-bytes-projects/yangodeli-couriers-carriers-website
