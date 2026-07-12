# Riesgos v1.0 — Opciones de impresión

## Riesgo 1 — `@page` dinámico limitado por navegador
CSS `@page` no siempre puede cambiarse condicionalmente por estado React. El tamaño A3 puede requerir usar página nombrada o depender de que el usuario seleccione A3 horizontal en el diálogo de impresión.

Mitigación:
- Usar atributo de body para dimensionar `.board-page`.
- Intentar `@page board-a3 { size: A3 landscape; }` + `page: board-a3`.
- Mantener texto de ayuda si el navegador no respeta el tamaño automáticamente.

## Riesgo 2 — Combinación de checks confusa
Si `Sin título y dibujo` y `Solo iconos...` se interpretan como modos excluyentes, se puede romper la expectativa del usuario.

Mitigación:
- Implementarlos como checks independientes y combinables.
- Mantener defaults idénticos al comportamiento actual.

## Riesgo 3 — Layout de cartas al ocultar números
Quitar los `<dd>` puede compactar demasiado la fila de stats.

Mitigación:
- Reemplazar valores por espacio/línea de escritura en lugar de remover el bloque completo.
- Ajustar CSS solo en modo print/options.

## Riesgo 4 — Afectar impresiones no relacionadas
El check A3 del tablero podría alterar cartas/reglas/consumibles si el CSS se aplica globalmente.

Mitigación:
- Condicionar estilos A3 a `body[data-print-mode="boards"][data-board-print-size="A3"]`.
- QA explícita de otros modos con el check activado.

## Riesgo 5 — PDFs estáticos obsoletos
Hay PDFs en `public/pdf`, pero la app imprime desde componentes. Si los usuarios descargan PDFs estáticos, estos no reflejarán la nueva opción.

Mitigación:
- No tocar PDFs en este plan.
- Si luego se requiere, crear una fase separada para regenerar PDFs.
