# Ejecución por fases — Expansión Criaturas especiales v1.0

## Fase 1 — Modelo de cartas NPC y datos base
**ID:** F1-modelo-npc  
**Objetivo:** Incorporar tipos y datos para jefe/acciones NPC sin alterar el modo clásico.

**Scope in**
- Nuevos tipos TypeScript para cartas NPC.
- Archivo de datos de las criaturas especiales y sus mazos.
- Utilidades de conteo/selección de expansión.

**Scope out**
- Simulación completa.
- UI final del tablero PvE.

**Interaction mode:** single-turn

**Files/areas touched**
- `src/types/cards.ts`
- `src/data/deck.ts`
- Nuevo `src/data/npcDragon.json` o `src/data/npcDragon.ts`
- `src/components/ExpansionSelector.tsx` si aplica

**Implementation checklist**
1. Agregar `SpecialCreatureBossCard`, `NpcActionCard`, opcional `NpcMinionCard`.
2. Definir efectos NPC tipados: daño directo, ataque a monstruo, defensa temporal, furia, invocación, recompensa/riesgo.
3. Crear mazos iniciales para Dragón y Monstruo Gigante con 12-18 cartas cada uno, o mazo base compartido con exclusivas por criatura.
4. Exportar `specialCreatureNpcCards`/mazos por criatura separados de `cards` para no mezclarlo con el mazo clásico.
5. Agregar conteos de NPC en utilidades si se muestran en la UI.

**Verification gate**
- `npm run build` debe pasar.
- Revisión manual: el modo clásico debe seguir usando las mismas cartas que antes.

**Definition of done**
- Los datos de Dragón y Monstruo Gigante compilan y no contaminan el mazo clásico.

**Rollback/fallback**
- Revertir sólo los tipos/datos nuevos; el clásico queda intacto.

---

## Fase 2 — Motor de simulación PvE/NPC
**ID:** F2-simulador-pve  
**Objetivo:** Crear un motor separado para resolver partidas contra una criatura especial con cartas públicas y decisiones automáticas.

**Scope in**
- Estado PvE tipado.
- Turnos de 1 o 2 jugadores contra jefe.
- Fila pública de 3 cartas.
- Furia y vida escalada por cantidad de jugadores.
- Log paso a paso.

**Scope out**
- Multiplayer real online.
- IA con decisiones ocultas.

**Interaction mode:** multi-turn, 2 iteraciones esperadas

**Files/areas touched**
- Nuevo `src/utils/npcSimulator.ts`
- `src/utils/simulator.ts` sólo si conviene extraer helpers comunes
- `src/scripts/checkSimulation.ts` o nuevo `src/scripts/checkNpcSimulation.ts`

**Implementation checklist**
1. Definir `NpcGameState`, `NpcBossState`, `NpcPlayerState`, `NpcThreatRow`, `NpcSimulationStep`.
2. Implementar setup: jugadores con mazo normal, criatura con vida escalada y dificultad seleccionada y fila pública inicial.
3. Implementar ronda: turno jugador 1, jugador 2 si existe, turno jefe, reposición de fila.
4. Resolver cartas NPC por prioridad impresa, sin elección manual.
5. Soportar derrota/victoria y límite de turnos anti-loop.
6. Agregar script de check para correr múltiples seeds.

**Verification gate**
- `npm run build` debe pasar.
- `npm run check:simulation` debe seguir pasando.
- Nuevo check NPC debe ejecutar al menos 20 seeds y reportar ganadores/turnos sin errores.

**Definition of done**
- Cada criatura especial puede jugar sola de punta a punta contra 1 o 2 jugadores.

**Rollback/fallback**
- Mantener simulador clásico separado para evitar regresiones.

---

## Fase 3 — UI del modo jefe NPC
**ID:** F3-ui-jefe-npc  
**Objetivo:** Agregar una pantalla jugable/simulable donde las cartas públicas de la criatura especial sean visibles y fáciles de seguir.

**Scope in**
- Selector `Modo clásico` / `Modo jefe NPC`.
- Selector de criatura especial y panel del jefe con vida, furia y fila pública.
- Tableros de jugadores reutilizando componentes existentes donde convenga.
- Controles de simulación/ronda.

**Scope out**
- Editor de jefes custom.
- Persistencia de partidas.

**Interaction mode:** multi-turn, 2 iteraciones esperadas

**Files/areas touched**
- Nuevo `src/components/NpcBossSimulator.tsx`
- `src/components/GameSimulator.tsx` si se extraen componentes compartidos
- `src/App.tsx`
- `src/styles.css`

**Implementation checklist**
1. Crear `NpcBossSimulator` con estado de seed/paso/pausa/velocidad.
2. Renderizar zona de la criatura especial arriba: nombre, vida, furia, armadura temporal.
3. Renderizar fila pública de amenaza con 3 cartas grandes.
4. Renderizar jugadores debajo con vida, tablero, mano, descarte.
5. Mostrar evento actual y log en castellano claro.
6. Agregar controles: iniciar, pausar, siguiente evento, siguiente ronda.
7. Mantener UI responsive para pantalla chica sin tapar cartas.

**Verification gate**
- `npm run build` debe pasar.
- Smoke manual en browser: seleccionar modo jefe, iniciar simulación, avanzar turnos, verificar que la fila pública rota y que el log coincide.

**Definition of done**
- Se entiende visualmente qué va a hacer la criatura especial antes de que actúe.

**Rollback/fallback**
- Si la UI se complica, mantener primera versión como simulador textual con fila pública visible.

---

## Fase 4 — Cartas imprimibles y reglas de expansión
**ID:** F4-print-reglas  
**Objetivo:** Hacer que la expansión sea jugable en físico, no sólo dentro del simulador.

**Scope in**
- Cartas de Criaturas especiales diferenciadas visualmente.
- Hoja de reglas del Dragón.
- Inclusión de cartas NPC en área de impresión/export.

**Scope out**
- PDFs perfectos finales si el flujo actual requiere ajuste manual posterior.

**Interaction mode:** single-turn

**Files/areas touched**
- `src/components/CardFace.tsx`
- `src/components/MonsterArt.tsx` o arte nuevo si aplica
- `src/components/PrintArea.tsx`
- `src/components/RulesPanel.tsx`
- `src/styles.css`

**Implementation checklist**
1. Diseñar marco visual de cartas NPC: Dragón lava/oscuro y Monstruo Gigante piedra/montaña, icono de jefe, texto de prioridad.
2. Agregar render de `npc_action` y `npc_boss` en `CardFace`.
3. Permitir imprimir mazo NPC separado del mazo clásico.
4. Agregar reglas resumidas: setup, ronda, fila pública, furia, victoria/derrota.
5. Asegurar que las prioridades de objetivo entren en la carta o reglas.

**Verification gate**
- `npm run build` debe pasar.
- Smoke manual: vista de impresión muestra cartas NPC y reglas sin mezclarlas de forma confusa con cartas normales.

**Definition of done**
- Un usuario puede imprimir y probar el Dragón siguiendo la hoja de reglas.

**Rollback/fallback**
- Si el layout impreso no entra, mover prioridades largas a reglas y dejar en cartas sólo efecto corto + icono.

---

## Fase 5 — Balance, QA y release
**ID:** F5-balance-release  
**Objetivo:** Ajustar números iniciales y dejar la expansión lista para publicar.

**Scope in**
- Tuning de vida/daño/furia diferenciando Dragón normal y Monstruo Gigante difícil.
- Checks automáticos de simulación.
- Build de `docs/` si el repo publica por GitHub Pages.
- Commit enfocado.

**Scope out**
- Balance competitivo perfecto.

**Interaction mode:** multi-turn, 2 iteraciones esperadas

**Files/areas touched**
- `src/data/npcDragon.*`
- `src/utils/npcSimulator.ts`
- `docs/` build output si corresponde
- `package.json` si se agrega script `check:npc-simulation`

**Implementation checklist**
1. Correr simulaciones para 1 y 2 jugadores en muchas seeds.
2. Ajustar vida del jefe y daño promedio hasta que la partida dure aprox. 8-14 rondas.
3. Verificar que no haya locks por defensa/curación infinita.
4. Ejecutar build final.
5. Generar artefactos `docs/` si el flujo actual lo requiere.
6. Commit y push si el usuario lo pide en build.

**Verification gate**
- `npm run build` pasa.
- `npm run check:simulation` pasa.
- `npm run check:npc-simulation` pasa si se agrega.
- Smoke UI manual del modo clásico y modo jefe.

**Definition of done**
- Modo jefe integrado, verificable y listo para iterar con playtesting.

**Rollback/fallback**
- Publicar como beta/experimental si los números aún necesitan testeo real.
