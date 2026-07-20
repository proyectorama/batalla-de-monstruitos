import type { CardSizeMode } from "../types/print";

type ExpansionSelectorProps = {
  mode: "classic" | "creative" | "special_creatures";
  onChange: (mode: "classic" | "creative" | "special_creatures") => void;
  hideTitleAndArt: boolean;
  showStatIconsOnly: boolean;
  hideBoostValues: boolean;
  cardSizeMode: CardSizeMode;
  onHideTitleAndArtChange: (value: boolean) => void;
  onShowStatIconsOnlyChange: (value: boolean) => void;
  onHideBoostValuesChange: (value: boolean) => void;
  onCardSizeModeChange: (value: CardSizeMode) => void;
};

export function ExpansionSelector({ mode, onChange, hideTitleAndArt, showStatIconsOnly, hideBoostValues, cardSizeMode, onHideTitleAndArtChange, onShowStatIconsOnlyChange, onHideBoostValuesChange, onCardSizeModeChange }: ExpansionSelectorProps) {
  return (
    <details className="expansion-library">
      <summary className="expansion-library-heading">
        <div>
          <p className="eyebrow">Biblioteca de juego</p>
          <h2 id="expansion-title">Elegí tu aventura</h2>
        </div>
        <div className="expansion-heading-copy">
          <p>Elegí cartas completas o personalizalas para crear las tuyas.</p>
        </div>
        <span className="expansion-chevron" aria-hidden="true" />
      </summary>

      <div className="expansion-library-body">
        <div className="expansion-shelf" role="radiogroup" aria-label="Modo de juego">
          <button className={`expansion-tile base-expansion ${mode === "classic" ? "active" : ""}`} type="button" role="radio" aria-checked={mode === "classic"} onClick={() => onChange("classic")}>
          <span className="expansion-number">00</span>
          <span className="expansion-tile-copy"><small>Modo de juego</small><strong>Clásico</strong><span>El mazo completo: 12 monstruos, 27 mejoras y 11 poderes especiales.</span></span>
          <b>50 cartas</b>
          </button>
          <button className={`expansion-tile expansion-pack ${mode === "creative" ? "active" : ""}`} type="button" role="radio" aria-checked={mode === "creative"} onClick={() => onChange("creative")}>
            <span className="expansion-number">01</span>
            <span className="expansion-tile-copy"><small>Personalizá</small><strong>Creativo</strong><span>Creá monstruos propios: activa dibujo, título y estadísticas para completar a mano.</span></span>
            <b>50 cartas</b>
          </button>
          <button className={`expansion-tile expansion-pack ${mode === "special_creatures" ? "active" : ""}`} type="button" role="radio" aria-checked={mode === "special_creatures"} onClick={() => onChange("special_creatures")}>
            <span className="expansion-number">02</span>
            <span className="expansion-tile-copy"><small>Cooperativo</small><strong>Criaturas especiales</strong><span>Dragón y Monstruo Gigante contra un mazo NPC público de 3 amenazas.</span></span>
            <b>20 cartas</b>
          </button>
        </div>

        {mode === "creative" ? (
          <div className="creative-options">
            <p className="eyebrow">Opciones creativas</p>
            <label className="print-option-switch">
              <input type="checkbox" checked={hideTitleAndArt} onChange={(event) => onHideTitleAndArtChange(event.target.checked)} />
              <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
              <span className="switch-copy"><strong>Sin título y dibujo</strong><small>Deja espacio para crear o pegar tu propio dibujo.</small></span>
            </label>
            <label className="print-option-switch">
              <input type="checkbox" checked={showStatIconsOnly} onChange={(event) => onShowStatIconsOnlyChange(event.target.checked)} />
              <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
              <span className="switch-copy"><strong>Cartas sin números de vida, defensa y ataque</strong><small>Conserva los iconos para escribir valores propios.</small></span>
            </label>
            <label className="print-option-switch">
              <input type="checkbox" checked={hideBoostValues} onChange={(event) => onHideBoostValuesChange(event.target.checked)} />
              <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
              <span className="switch-copy"><strong>Mejoras sin números</strong><small>Conserva el signo + para completar el valor a mano.</small></span>
            </label>
            <fieldset className="card-size-options">
              <legend>Formato de impresión</legend>
              <label><input type="radio" name="card-size" checked={cardSizeMode === "spanish"} onChange={() => onCardSizeModeChange("spanish")} /> Cartas españolas (57 × 92 mm)</label>
              <label><input type="radio" name="card-size" checked={cardSizeMode === "max-per-sheet"} onChange={() => onCardSizeModeChange("max-per-sheet")} /> Máxima cantidad por hoja (57 × 66 mm)</label>
            </fieldset>
          </div>
        ) : null}
      </div>
    </details>
  );
}
