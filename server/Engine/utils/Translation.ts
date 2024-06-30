import { Errors } from "./Errors";

export const pl = {
  [Errors.PLAYER_NOT_FOUND]: "Nie znaleziono gracza",
  [Errors.MAX_PLAYERS_REACHED]: "Osiągnięto maksymalną liczbę graczy",
  [Errors.INVALID_QUEUING_METHOD]: "Nieprawidłowa metoda kolejkowania",
  [Errors.CURRENT_PLAYER_FAULT]: "Błąd aktualnego gracza",
  [Errors.NO_PLAYERS]: "Brak graczy",

  ["princess"]: {
    name: "Księżniczka",
    description:
      "Księżniczka jest jedyną kartą, która nie może być odrzucona. Jeśli zostanie odrzucona, gracz, który to zrobił, przegrywa grę.",
    descript: "Jeśli odrzucisz tę kartę, wypadasz z rundy.",
  },
};
