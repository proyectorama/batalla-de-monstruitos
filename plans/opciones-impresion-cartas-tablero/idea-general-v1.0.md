# Idea general v1.0 — Opciones de impresión para cartas y tablero

## Objetivo
Reemplazar el actual “Modo stickers” por controles de impresión más claros y sumar una opción para imprimir el tablero en A3.

## Problema actual
En `src/App.tsx` existe un único checkbox `Modo stickers` que activa `hideMonsterArt`. Su texto dice “Imprime monstruos sin dibujo ni nombre”, pero el pedido necesita separar mejor los casos de uso:

1. Imprimir cartas sin título y sin dibujo, para dejar espacio libre personalizable.
2. Imprimir cartas con solo los iconos de vida, ataque y defensa, pero sin valores numéricos, para que quien descarga complete sus propios números.
3. Imprimir el tablero en A3 en lugar de A4 para que salga más grande.

## Estado actual detectado
- App React + TypeScript + Vite.
- UI principal: `src/App.tsx`.
- Área imprimible: `src/components/PrintArea.tsx`.
- Cara de carta: `src/components/CardFace.tsx`.
- Tipo de modo de impresión: `src/types/print.ts`.
- Estilos de impresión: `src/styles.css`.
- El CSS global usa `@page { size: A4 landscape; }` y dimensiones A4 en `@media print`.
- El botón “Imprimir tablero” usa `handlePrint("boards")` y luego `window.print()`.

## Modelo propuesto
Crear una configuración explícita de impresión, separada del modo de impresión:

```ts
type CardPrintVariant = "full" | "blankArtAndTitle" | "statIconsOnly";
type BoardPrintSize = "A4" | "A3";
```

### Controles visibles
En la zona de acciones del hero:

- Reemplazar `Modo stickers` por un bloque “Opciones de impresión”.
- Checkbox 1: `Sin título y dibujo`.
  - Efecto: monstruos sin nombre/título y sin dibujo; se mantiene el espacio/área para completar o pegar dibujo propio.
- Checkbox 2: `Solo iconos de vida, ataque y defensa`.
  - Efecto: en monstruos se ven los iconos de vida/ataque/defensa pero no los números; deja espacio visual para que el usuario escriba sus valores.
- Checkbox 3: `Tablero A3`.
  - Efecto: cuando se imprime tablero, la página usa tamaño A3 apaisado y el tablero escala a `420mm × 297mm` en lugar de `297mm × 210mm`.

## Regla de combinación
Los dos checks de cartas pueden combinarse:
- Ninguno: cartas completas actuales.
- `Sin título y dibujo`: oculta título/dibujo, mantiene stats normales salvo que también esté activo el segundo check.
- `Solo iconos...`: oculta valores numéricos en monstruos, mantiene título/dibujo salvo que también esté activo el primer check.
- Ambos: carta editable con espacio de dibujo/título vacío e iconos sin números.

`Tablero A3` afecta solo `printMode="boards"`; cartas, dorsos, reglas y consumibles siguen en A4 salvo decisión futura.

## Criterios de aceptación
- Ya no aparece el texto `Modo stickers`.
- Aparece un control con copia clara para `Sin título y dibujo`.
- Aparece un control con copia clara para `Solo iconos de vida, ataque y defensa`.
- Aparece un control `Tablero A3`.
- Al imprimir cartas con `Sin título y dibujo`, los monstruos no muestran nombre ni arte.
- Al imprimir cartas con `Solo iconos...`, los monstruos muestran iconos de vida/ataque/defensa sin los valores originales.
- Al imprimir tablero con `Tablero A3`, el `@page` efectivo es A3 landscape y `.board-page` usa dimensiones A3.
- Al imprimir tablero sin `Tablero A3`, se mantiene A4 landscape.
- Build TypeScript/Vite pasa.
