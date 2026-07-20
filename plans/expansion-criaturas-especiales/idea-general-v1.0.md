# Expansión: Criaturas especiales — Jefes NPC públicos v1.0

## Resumen
Agregar una expansión cooperativa/solo contra un mazo NPC público que juega solo. La primera familia de jefes propuesta se llama **Criaturas especiales** e incluye un **Dragón** y un **Monstruo Gigante** más difícil: no es un tercer jugador normal, sino un enemigo con tablero propio, vida de jefe, cartas boca arriba y una rutina automática fácil de ejecutar por humanos o por el simulador web.

## Objetivo de juego
Permitir que **1, 2 o más jugadores** se unan para pelear contra un mazo de jefe visible. Los jugadores siguen usando sus mazos normales; el NPC usa un mazo especial de acciones públicas con orden visible o parcialmente preparado.

## Concepto principal
- Modo: **Cooperativo PvE**.
- Nombre de expansión: **Criaturas especiales**.
- Jefes iniciales: **Dragón del Volcán** y **Monstruo Gigante Ancestral**.
- Dificultad: el Dragón es el jefe inicial/normal; el Monstruo Gigante es un reto superior.
- Participantes: 1+ jugadores humanos contra 1 jefe NPC.
- Información del NPC: **cartas públicas**. La gracia no es adivinar la mano del jefe, sino coordinarse contra amenazas conocidas.
- Automatización: el jefe no toma decisiones complejas; cada carta trae una prioridad clara.
- Compatibilidad: debe poder jugarse físico/impreso y también simularse en la app.

## Modelo de mesa propuesto
### Zona de jugadores
Cada jugador conserva:
- Vida propia.
- Mano, mazo, descarte.
- Hasta 3 monstruitos en mesa.
- Mejoras de ataque/defensa/vida por monstruito.

### Zona del jefe
El jefe tiene:
- **Vida de jefe**: sugerido 30 en solo, 45 con 2 jugadores, +12 por jugador extra.
- **Armadura/escamas** opcional: defensa global del turno, no un monstruo común.
- **Mazo NPC público**: cartas de acción de la criatura especial elegida.
- **Fila de amenaza**: 3 cartas reveladas del mazo NPC. La carta más a la izquierda se resuelve en el turno del jefe.
- **Descarte NPC**.
- **Medidor de Furia**: sube cuando la criatura recibe daño o cuando se agota la fila; habilita cartas más fuertes.

## Turno de ronda
Una ronda tiene:
1. Turno de cada jugador, en orden.
2. Turno del jefe.
3. Reponer fila pública del jefe hasta 3 cartas.

## Turno de jugador contra jefe
En su turno, cada jugador puede:
- Bajar monstruito si tiene espacio.
- Jugar mejoras y especiales normales.
- Atacar al jefe o a una amenaza activa si se incorporan cartas objetivo.
- Coordinar objetivos: el modo premia combinar daño y defensa entre jugadores.

## Turno automático del jefe
La carta pública de la izquierda se resuelve automáticamente:
1. Si la carta dice objetivo específico, se aplica.
2. Si necesita elegir, usa prioridades impresas:
   - Atacar al jugador con menos vida.
   - Si empatan, atacar al que tenga el monstruito con más ataque.
   - Si no hay monstruos, daño directo al jugador inicial/activo.
3. La carta va al descarte NPC.
4. La fila se corre hacia la izquierda y se revela una nueva carta.

## Criaturas especiales iniciales

### Dragón del Volcán
Jefe recomendado para introducir el modo. Usa fuego, garras, escamas, rugidos e invocaciones menores. Debe ser peligroso pero ganable en primeras pruebas.

Parámetros iniciales sugeridos:
- Solo: 30 vida.
- 2 jugadores: 45 vida.
- +12 vida por jugador extra.
- Furia máxima: 5.

### Monstruo Gigante Ancestral
Jefe más difícil, pensado como desafío avanzado de la expansión. Tiene más vida, pega menos veces pero más fuerte, y castiga mesas que no coordinen defensa/daño.

Parámetros iniciales sugeridos:
- Solo: 42 vida.
- 2 jugadores: 65 vida.
- +18 vida por jugador extra.
- Furia máxima: 6.
- Puede tener una regla pasiva: **Piel Colosal** — reduce en 1 el daño de cada ataque recibido, mínimo 0.

## Tipos de cartas NPC
### 1. Aliento
Daño directo o daño a varios objetivos.
- Ejemplo: **Aliento de Fuego** — hace 2 de daño a cada jugador. Si Furia ≥ 3, hace 3.

### 2. Garra
Ataque contra un monstruito o jugador.
- Ejemplo: **Garra Colosal** — ataca al monstruito con más ataque. Daño 4, reducido por defensa disponible.

### 3. Escamas
Defensa temporal del jefe.
- Ejemplo: **Escamas de Obsidiana** — hasta el próximo turno del jefe, el primer 3 de daño recibido se ignora.

### 4. Rugido
Control/penalización.
- Ejemplo: **Rugido Aterrador** — cada jugador descarta 1 carta o gira/bloquea su monstruito de mayor ataque durante su próximo ataque.

### 5. Invocación
Amenazas menores del jefe.
- Ejemplo Dragón: **Cría de Dragón** — aparece una amenaza con 3 vida / 2 ataque. Mientras viva, absorbe ataques dirigidos al jefe.

### 6. Tesoro maldito
Riesgo/recompensa.
- Ejemplo Dragón: **Tesoro Ardiente** — si los jugadores destruyen esta carta antes del turno del jefe, roban 1 carta cada uno; si no, el jefe gana 2 Furia.

## Condición de victoria
Los jugadores ganan si la vida del jefe llega a 0.

## Condición de derrota
Los jugadores pierden si:
- Todos los jugadores quedan en 0 vida, o
- El mazo NPC debe revelar y no quedan cartas, disparando **Devastación final**: la criatura especial hace daño masivo. Alternativa más suave: barajar descarte y subir Furia +2.

## Balance inicial sugerido
### Dragón del Volcán
- Jefe solo: 30 vida, daño promedio 2-3 por turno.
- Jefe 2 jugadores: 45 vida, daño promedio 3-5 distribuido.
- 3+ jugadores: +12 vida por jugador y +1 carta extra en fila cada 2 jugadores.
- Furia: empieza en 0, máximo 5.

### Monstruo Gigante Ancestral
- Jefe solo: 42 vida, daño promedio 3-4 por turno.
- Jefe 2 jugadores: 65 vida, daño promedio 5-7 distribuido o concentrado.
- 3+ jugadores: +18 vida por jugador y +1 carta extra en fila cada 2 jugadores.
- Furia: empieza en 1, máximo 6.
- Pasiva recomendada: **Piel Colosal** — reduce en 1 cada ataque recibido.

### Regla común
- Sube Furia +1 cada vez que la criatura recibe 5+ daño en una ronda, y +1 cuando una carta lo indique.

## Integración con el juego actual
El repo ya tiene:
- Tipos de cartas `monster`, boosts y `special`.
- Simulador automático 1v1.
- Galería/impresión de cartas.
- Expansiones/cartas especiales separadas.

La expansión debe sumar tipos nuevos sin romper lo actual:
- `npc_boss` para la ficha/carta de cada criatura especial.
- `npc_action` para acciones públicas del jefe.
- `npc_minion` si una criatura invoca amenazas propias.
- Modo de simulación nuevo: clásico 1v1 vs criaturas especiales cooperativo.

## UX en app
Agregar selector de modo:
- **Modo clásico**: como ahora.
- **Modo criaturas especiales**: selector entre Dragón y Monstruo Gigante.

Pantalla del modo jefe:
- Arriba: zona de la criatura especial con vida grande, Furia y fila pública de amenaza.
- Centro: log de resolución automática.
- Abajo: jugadores/mesas.
- Botones: `Iniciar jefe`, `Resolver turno del jefe`, `Siguiente jugador`, `Simular ronda`.

## MVP recomendado
No implementar todavía un sistema infinito de jefes. Hacer una primera vertical completa:
1. Expansión **Criaturas especiales**.
2. Dos criaturas iniciales: Dragón del Volcán y Monstruo Gigante Ancestral.
3. 12-18 cartas NPC para Dragón y 12-18 para Monstruo Gigante, o un mazo base compartido con cartas exclusivas por criatura si conviene para MVP.
4. Fila pública de 3 cartas.
5. 1 o 2 jugadores soportados en simulador.
6. Reglas impresas y cartas imprimibles.

## Criterios de aceptación de producto
- Se puede explicar la expansión en una hoja de reglas.
- Se puede jugar físicamente sin app porque las cartas del NPC son públicas y tienen prioridades simples.
- La app puede simular cada criatura especial sin decisiones manuales ambiguas.
- El modo no reemplaza el clásico; aparece como expansión seleccionable.
- Las cartas NPC se distinguen visualmente de monstruitos/cartas normales.
- El Monstruo Gigante debe sentirse claramente más difícil que el Dragón: más vida, más castigo por turno o una pasiva defensiva.
