# Decisiones — Expansión Criaturas especiales v1.0

## Decisiones tomadas

### D1 — La expansión se llamará Criaturas especiales
Motivo: permite que el modo PvE no quede atado a un único jefe y abre una línea de enemigos públicos automáticos.

### D2 — La expansión incluirá Dragón y Monstruo Gigante
El Dragón será el jefe inicial/normal. El Monstruo Gigante será una criatura más difícil de vencer, con más vida y/o una pasiva defensiva.

### D3 — Las cartas del NPC son públicas
La fila de amenaza muestra 3 cartas. La próxima acción del jefe siempre es visible. Esto cumple la idea central: el desafío es coordinarse contra un mazo automático, no adivinar información oculta.

### D4 — El jefe no usa IA compleja
Las cartas se resuelven con prioridades impresas. Esto permite jugar físico sin app y reduce bugs en simulador.

### D5 — El modo PvE no reemplaza el clásico
Será un modo/expansión seleccionable. El mazo clásico y el simulador clásico deben seguir funcionando igual.

### D6 — MVP con 1-2 jugadores, reglas escalables para 3+
La idea soporta “1, 2 o más”, pero la primera implementación completa debe cubrir 1 y 2 jugadores. El escalado 3+ se documenta y se puede ampliar luego.

### D7 — Datos NPC separados del mazo normal
Las cartas NPC no deben entrar accidentalmente en `cards`. Tendrán export propio y estilo propio.

### D8 — Furia como mecánica de presión
La Furia evita partidas estáticas y permite que el Dragón escale si los jugadores tardan demasiado.

## Decisiones pendientes

### P1 — Nombres finales de las criaturas
Defaults propuestos: **Dragón del Volcán** y **Monstruo Gigante Ancestral**. Alternativas para el gigante: Coloso Salvaje, Titán Dormido, Bestia Montaña.

### P2 — Tono visual
Default: Dragón lava/obsidiana con acentos naranja/rojo; Monstruo Gigante con piedra, musgo, huesos o montaña. Alternativas futuras: dragón verde del bosque, dragón helado, slime gigante, robot jefe.

### P3 — Derrota por mazo NPC agotado
Default recomendado: barajar descarte, subir Furia +2 y seguir. Alternativa más dura: Devastación final y derrota si los jugadores no lo vencen antes.

### P4 — Soporte UI para más de 2 jugadores
Default MVP: 1-2 jugadores en app; reglas impresas escalables para 3+. Si el usuario quiere 3+ completo en app desde el inicio, ampliar Fase 2 y Fase 3.

### P5 — Amenazas invocadas

Default: incluir pocas cartas con crías/tesoros como objetivos simples. Si complican demasiado, dejarlas para v1.1.
