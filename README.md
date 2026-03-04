# My Project (gpt-ai-journal)

В поле для Production (и для Preview, если оно есть) нажми Add flag и выбери из списка или впиши вручную: nodejs_compat

Зайди в Cloudflare → Workers & Pages → aitalk.
Перейди во вкладку Settings → Variables and Secrets.
Нажми Add variable.
В поле Variable name напиши: NEXT_PUBLIC_SANITY_PROJECT_ID
В поле Value вставь свой ID из Sanity.
Нажми Save.

Зайди в Settings -> Variables and Secrets.
Добавь переменную:
Name: NPM_FLAGS
Value: --legacy-peer-deps
