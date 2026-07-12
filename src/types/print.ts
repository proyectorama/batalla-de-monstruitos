export type PrintMode = "cards" | "backs" | "boards" | "rules" | "consumables";

export type BoardPrintSize = "A4" | "A3";

export type CardPrintOptions = {
  hideTitleAndArt: boolean;
  showStatIconsOnly: boolean;
};

export type BoardPrintOptions = {
  size: BoardPrintSize;
};
