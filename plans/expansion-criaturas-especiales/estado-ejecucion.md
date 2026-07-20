# Estado de ejecución — expansion-criaturas-especiales

## Plan folder name
`expansion-criaturas-especiales`

## Current status
`done`

## Current phase
`F5-balance-release`

## Iteration
`1`

## Phase checklist
- [x] F0 — Crear plan de expansión Criaturas especiales con Dragón y Monstruo Gigante
- [x] F1 — Modelo de cartas NPC y datos base
- [x] F2 — Motor de simulación PvE/NPC
- [x] F3 — UI del modo jefe NPC
- [x] F4 — Cartas imprimibles y reglas de expansión
- [x] F5 — Balance, QA y release

## Verification gate log
- 2026-07-20 — Plan creado sólo con archivos Markdown. Sin ejecución de build porque todavía no hay cambios de código.
- 2026-07-20 — `npm run build` PASS. TypeScript y Vite generaron `docs/` correctamente.
- 2026-07-20 — `npm run check:simulation` PASS. Mazo clásico verificado en 60 partidas.
- 2026-07-20 — `npm run check:npc-simulation` PASS. Dragón y Monstruo Gigante verificados en 20 seeds por configuración 1J/2J.
- 2026-07-20 — Browser smoke PASS en `http://127.0.0.1:4178/batalla-de-monstruitos/`: pestaña `Criaturas especiales` visible, simulador NPC inicia y muestra fila pública/evento inicial.

## Last commit/branch touched
- Rama actual observada: `master`
- Cambios implementados localmente; commit pendiente si se decide publicar.

## Next action
Revisar visualmente en la app y, si está aprobado, hacer commit/push enfocado de la expansión.

## Open decisions before build
- Cerrado para MVP: app soporta 1-2 jugadores; 3+ queda escalado en reglas para iteración posterior.
- Cerrado para MVP: al agotarse el mazo NPC, se remezcla descarte y la criatura gana Furia +2.
