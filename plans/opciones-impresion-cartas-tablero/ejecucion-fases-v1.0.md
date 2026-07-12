# Ejecución por fases v1.0 — Opciones de impresión para cartas y tablero

## Fase 1 — Modelo de opciones de impresión

### ID
F1-print-options-model

### Objetivo
Separar la configuración de impresión de cartas y tablero del `PrintMode` actual.

### Scope
- In: tipos TS, estado React, props entre `App`, `PrintArea` y `CardFace`.
- Out: rediseño completo visual, generación de PDFs estáticos en `public/pdf`.

### Interaction mode
single-turn

### Files/areas touched
- `src/types/print.ts`
- `src/App.tsx`
- `src/components/PrintArea.tsx`
- `src/components/CardFace.tsx`

### Implementation checklist
1. Extender `src/types/print.ts` con `CardPrintOptions` y `BoardPrintOptions` o tipos equivalentes.
2. Reemplazar `hideMonsterArt` por estado más semántico, por ejemplo:
   - `hideCardTitleAndArt`
   - `statIconsOnly`
   - `printBoardA3`
3. Pasar las opciones desde `App` hacia `PrintArea`.
4. Pasar las opciones relevantes de carta desde `PrintArea` hacia `CardFace`.
5. Mantener compatibilidad visual por defecto: todos los checks apagados deben renderizar lo mismo que antes.

### Verification gate
```bash
npm run build
```
Expected: TypeScript compila y Vite genera build sin errores.

### Definition of done
Los tipos y props reflejan explícitamente los tres checks pedidos y no queda el nombre interno `hideMonsterArt` como concepto de UI principal.

### Rollback/fallback
Si aparece demasiado acoplamiento en `CardFace`, mantener props booleanas simples pero con nombres semánticos (`hideTitleAndArt`, `hideStatValues`).

---

## Fase 2 — UI de opciones de impresión

### ID
F2-print-options-ui

### Objetivo
Reemplazar “Modo stickers” por controles entendibles para quien imprime/descarga.

### Scope
- In: copia, layout, accesibilidad básica de checkboxes.
- Out: cambios de navegación o tabs.

### Interaction mode
single-turn

### Files/areas touched
- `src/App.tsx`
- `src/styles.css`

### Implementation checklist
1. Reemplazar el label `.print-sticker-switch` o generalizarlo a `.print-option-switch` / `.print-options`.
2. Eliminar texto visible `Modo stickers`.
3. Agregar checkbox `Sin título y dibujo`.
4. Agregar checkbox `Solo iconos de vida, ataque y defensa`.
5. Agregar checkbox `Tablero A3`.
6. Mantener botones existentes: `Imprimir cartas`, `Imprimir dorsos`, `Imprimir tablero`, `Imprimir reglas`, `Imprimir consumibles`, `Descargar JSON`.
7. Asegurar que los labels sean clickeables y tengan texto descriptivo.

### Verification gate
Manual + build:
```bash
npm run build
```
Manual QA en navegador local:
- Ver que no exista `Modo stickers`.
- Ver los tres checks en la zona de impresión.
- Tildar/destildar cada check y confirmar que no rompe la UI.

### Definition of done
La UI expresa claramente las tres opciones pedidas sin mencionar stickers.

### Rollback/fallback
Si el espacio del hero queda saturado, agrupar los checks bajo un `<details>` o bloque compacto “Opciones de impresión”.

---

## Fase 3 — Variante de cartas editables

### ID
F3-editable-cards-print

### Objetivo
Implementar los dos checks de cartas en el render imprimible.

### Scope
- In: monstruos impresos en `CardFace`.
- Out: cartas de mejora salvo que se decida ocultar también sus valores en una fase futura.

### Interaction mode
single-turn

### Files/areas touched
- `src/components/CardFace.tsx`
- `src/components/PrintArea.tsx`
- `src/styles.css`

### Implementation checklist
1. Para `Sin título y dibujo`:
   - En monstruos, ocultar texto de `card.name.toUpperCase()`.
   - Ocultar `MonsterArt`.
   - Mostrar un área vacía tipo `sticker-space` o renombrarla a clase semántica (`custom-art-space`).
2. Para `Solo iconos de vida, ataque y defensa`:
   - En monstruos, renderizar `StatIcon` para `life`, `attack`, `defense`.
   - Ocultar el `<dd>` con el valor original (`card[stat]`) o reemplazarlo por espacio/linea para completar a mano.
   - Mantener `aria-label` sin anunciar valores falsos.
3. Validar combinación de ambos checks.
4. Revisar CSS de impresión para que los iconos sin números tengan buen tamaño y lugar para escribir.

### Verification gate
```bash
npm run build
```
Manual QA con vista de impresión:
- Cartas completas: sin cambios respecto al estado actual.
- Solo `Sin título y dibujo`: nombre y dibujo no aparecen.
- Solo `Solo iconos...`: iconos aparecen, valores no.
- Ambos: no nombre/dibujo y stats sin números.

### Definition of done
Las cartas impresas pueden usarse como plantilla editable por el usuario sin perder los iconos base.

### Rollback/fallback
Si ocultar `<dd>` rompe layout, reemplazar número por un espacio no separable o una línea (`____`) estilizada para escritura manual.

---

## Fase 4 — Tablero A3

### ID
F4-board-a3-print

### Objetivo
Permitir imprimir el tablero más grande en A3 sin afectar el resto de impresiones.

### Scope
- In: selector `Tablero A3`, dataset/body class y CSS print para `boards`.
- Out: remaquetar reglas, consumibles, cartas o PDFs estáticos.

### Interaction mode
single-turn

### Files/areas touched
- `src/App.tsx`
- `src/components/PrintArea.tsx`
- `src/styles.css`

### Implementation checklist
1. Antes de `window.print()`, setear un atributo de body, por ejemplo:
   - `document.body.dataset.boardPrintSize = printBoardA3 ? "A3" : "A4"`.
2. Mantener `document.body.dataset.printMode = mode`.
3. Ajustar CSS print:
   - Default A4: comportamiento actual.
   - A3 solo cuando `body[data-print-mode="boards"][data-board-print-size="A3"]`.
4. Implementar tamaño A3 landscape:
   - `@page` no puede variar de forma confiable por selector en todos los navegadores, por lo tanto evaluar una de estas opciones:
     - Opción preferida: usar `@page { size: A4 landscape; }` por defecto y agregar `@page board-a3 { size: A3 landscape; }` si el navegador lo soporta con `page: board-a3` en `.board-page`.
     - Fallback: dimensionar `.board-page` a `420mm × 297mm` y documentar que el diálogo de impresión debe seleccionar A3 si el navegador ignora páginas nombradas.
5. Escalar `html/body`, `.board-page`, `.player-life-track` y grillas internas para A3.
6. Asegurar que A4 siga igual si el check está apagado.

### Verification gate
```bash
npm run build
```
Manual QA:
- Vista de impresión tablero A4: tablero ocupa A4 landscape como antes.
- Vista de impresión tablero A3: tablero se ve más grande y está dimensionado para A3 landscape.
- Vista de impresión cartas/reglas/consumibles con `Tablero A3` activado: no cambian de tamaño.

### Definition of done
El usuario puede elegir tablero A3 desde la UI y el CSS imprime/renderiza el tablero en tamaño mayor sin afectar otros documentos.

### Rollback/fallback
Si el navegador no respeta `@page` nombrado, dejar el tablero dimensionado en A3 y añadir texto de ayuda en la UI: “Elegí A3 horizontal en el diálogo de impresión”.

---

## Fase 5 — Validación final y limpieza

### ID
F5-validation-cleanup

### Objetivo
Asegurar que no quedan nombres/copias viejas y que la app sigue compilando.

### Scope
- In: build, búsquedas de strings, revisión de estado git.
- Out: deploy automático salvo pedido explícito.

### Interaction mode
single-turn

### Files/areas touched
- Repo completo en modo lectura/verificación.

### Implementation checklist
1. Buscar `Modo stickers` y confirmar que no queda visible.
2. Buscar `hideMonsterArt`; si queda, justificarlo o renombrarlo.
3. Ejecutar build.
4. Revisar `git diff`.
5. Preparar resumen de cambios.

### Verification gate
```bash
npm run build
```
```bash
git diff -- src/App.tsx src/components/PrintArea.tsx src/components/CardFace.tsx src/types/print.ts src/styles.css
```
Expected: diff enfocado en opciones de impresión.

### Definition of done
Cambios listos para commit con verificación real y sin deriva de alcance.

### Rollback/fallback
Revertir solo archivos tocados en esta feature si el build falla por una incompatibilidad no resuelta.
