import { baseCards, expansions, type DeckMode } from "../data/deck";

type ExpansionSelectorProps = {
  mode: DeckMode;
  onChange: (mode: DeckMode) => void;
  onPrintExpansion: () => void;
};

export function ExpansionSelector({ mode, onChange, onPrintExpansion }: ExpansionSelectorProps) {
  return (
    <details className="expansion-library">
      <summary className="expansion-library-heading">
        <div>
          <p className="eyebrow">Biblioteca de juego</p>
          <h2 id="expansion-title">Elegí tu aventura</h2>
        </div>
        <div className="expansion-heading-copy">
          <p>Podés elegir expansiones o cambios estéticos.</p>
        </div>
        <span className="expansion-chevron" aria-hidden="true" />
      </summary>

      <div className="expansion-library-body">
        <div className="expansion-shelf" role="radiogroup" aria-label="Modalidad de mazo">
          <button className={`expansion-tile base-expansion ${mode === "base" ? "active" : ""}`} type="button" role="radio" aria-checked={mode === "base"} onClick={() => onChange("base")}>
          <span className="expansion-number">00</span>
          <span className="expansion-tile-copy"><small>Juego original</small><strong>Mazo clásico</strong><span>La forma original de jugar: 18 monstruos y 27 mejoras.</span></span>
          <b>{baseCards.length} cartas</b>
        </button>

        {expansions.map((expansion, index) => {
          const active = mode === expansion.id;
          return (
            <article className={`expansion-tile expansion-pack ${active ? "active" : ""}`} key={expansion.id}>
              <button className="expansion-select" type="button" role="radio" aria-checked={active} onClick={() => onChange(expansion.id)}>
                <span className="expansion-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="expansion-tile-copy"><small>Expansión</small><strong>{expansion.name}</strong><span>Cambia 6 monstruos por 11 poderes de acción. Mazo final: 50 cartas.</span></span>
                <b>50 cartas</b>
              </button>
              <button className="expansion-print" type="button" onClick={onPrintExpansion}>Imprimir solo las {expansion.cards.length} nuevas</button>
            </article>
          );
        })}

        <div className="expansion-coming" aria-label="Espacio para próximas expansiones">
          <span>+</span><strong>Próxima expansión</strong><small>Este estante está listo para crecer.</small>
        </div>
        </div>

        {mode !== "base" ? (
          <div className="expansion-recipe">
            <strong>45 base</strong><span>−</span><strong>6 monstruos</strong><span>+</span><strong>11 especiales</strong><span>=</span><strong>50 cartas</strong>
          </div>
        ) : null}
      </div>
    </details>
  );
}
