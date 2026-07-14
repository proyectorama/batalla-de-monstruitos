export type PrintMode = "cards" | "backs" | "boards" | "rules" | "consumables";

export type BoardPrintSize = "A4" | "A3";

export const defaultCardSizeWidth = 57;
export const defaultCardSizeHeight = 66;
export const spanishSizeWidth = 57;
export const spanishSizeHeight = 92;

export type CardPrintOptions = {
  hideTitleAndArt: boolean;
  showStatIconsOnly: boolean;
  width: number;
  height: number;
};

export type BoardPrintOptions = {
  size: BoardPrintSize;
};
