# Riesgos — Expansión Criaturas especiales v1.0

## Riesgo 1: que el NPC sea demasiado complejo para juego físico
**Impacto:** alto  
**Probabilidad:** media  
**Mitigación:** cada carta NPC debe resolver con una prioridad corta y pública. Evitar decisiones tipo IA. Si hay empate, usar regla fija: jugador con menos vida, luego mayor ataque, luego orden de turno.

## Riesgo 2: mezclar cartas NPC con mazos normales
**Impacto:** medio  
**Probabilidad:** media  
**Mitigación:** tipos y export separados (`dragonNpcCards`), selector visual de expansión y estilo de carta claramente distinto.

## Riesgo 3: balance malo en 1 jugador vs 2 jugadores
**Impacto:** alto  
**Probabilidad:** alta  
**Mitigación:** vida escalada por cantidad de jugadores y simulaciones por seed. Parámetros iniciales: 30 vida solo, 45 vida dos jugadores, +12 por jugador extra.

## Riesgo 4: partidas trabadas por curación/defensa
**Impacto:** medio  
**Probabilidad:** media  
**Mitigación:** límite de rondas en simulador, Furia que escala, Devastación final o reshuffle con penalidad.

## Riesgo 5: UI sobrecargada
**Impacto:** medio  
**Probabilidad:** media  
**Mitigación:** priorizar lectura: Dragón arriba, fila pública grande, jugadores abajo. No mostrar todo con el mismo peso visual. En móvil, colapsar mano/log si hace falta.

## Riesgo 6: romper el modo clásico
**Impacto:** alto  
**Probabilidad:** baja-media  
**Mitigación:** simulador PvE separado, datos separados, checks del modo clásico obligatorios en cada fase.

## Riesgo 7: cartas NPC con demasiado texto
**Impacto:** medio  
**Probabilidad:** alta  
**Mitigación:** cartas con efecto corto + iconos; prioridades comunes en hoja de reglas. Sólo excepciones específicas escritas en carta.

## Riesgo 8: expectativas de “1, 2 o más jugadores” demasiado amplias para MVP
**Impacto:** medio  
**Probabilidad:** media  
**Mitigación:** MVP soporta 1 y 2 jugadores en UI/simulador; reglas documentan escalado para 3+. Soporte UI completo 3+ queda como fase posterior si hace falta.
