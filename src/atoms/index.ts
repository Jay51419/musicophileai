import { atom } from "jotai";
import { Genres, Languages, Moods, Tempos } from "~/utils/constants";

export const languageAtom = atom(Languages[0])
export const moodAtom = atom(Moods[0])
export const genreAtom = atom(Genres[0])
export const tempoAtom = atom(Tempos[4])