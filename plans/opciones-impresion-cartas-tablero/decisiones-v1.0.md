# Decisiones v1.0 — Opciones de impresión

## D1 — Reemplazo de “Modo stickers”
Se reemplaza el texto visible `Modo stickers` porque el nuevo objetivo no es solo stickers: es impresión editable/personalizable.

## D2 — Checks independientes
`Sin título y dibujo`, `Solo iconos de vida, ataque y defensa` y `Tablero A3` serán checkboxes independientes.

## D3 — Alcance de “Solo iconos...”
La primera implementación aplica a cartas de monstruo, porque son las que tienen vida/ataque/defensa base. Las cartas de mejora mantienen su render actual salvo pedido posterior.

## D4 — A3 solo para tablero
`Tablero A3` afecta únicamente `Imprimir tablero`. Cartas, dorsos, reglas y consumibles siguen A4.

## D5 — Build como gate mínimo
El repo no trae tests unitarios/E2E. El gate automático mínimo será `npm run build`, complementado por QA manual de impresión.
