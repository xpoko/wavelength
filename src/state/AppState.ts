import { RandomSpectrumCard } from "./SpectrumCards";
import { RandomSpectrumTarget } from "./RandomSpectrumTarget";

export interface AppState {
  roomId: string;
}

export enum RoundPhase {
  SetupGame,
  GiveClue,
  MakeGuess,
  ViewScore
}

export type PlayersTeams = {
  [playerId: string]: {
    name: string,
    team: "left" | "right" | "none"
  }
}

export interface GameState {
  roundPhase: RoundPhase;
  spectrumCard: [string, string];
  spectrumTarget: number;
  clue: string;
  guess: number;
  players: PlayersTeams;
  clueGiver: string;
  leftScore: number;
  rightScore: number;
}

export function InitialGameState(): GameState {
  return {
    roundPhase: RoundPhase.SetupGame,
    spectrumCard: RandomSpectrumCard(),
    spectrumTarget: RandomSpectrumTarget(),
    clue: "",
    guess: 0,
    players: {},
    clueGiver: "",
    leftScore: 0,
    rightScore: 0
  }
}