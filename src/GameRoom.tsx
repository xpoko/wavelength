import { useParams } from "react-router-dom";
import React from "react";
import { RoundPhase } from "./AppState";
import { GiveClue } from "./GiveClue";
import { MakeGuess } from "./MakeGuess";
import { ViewScore } from "./ViewScore";
import { useStorageBackedState } from "./useStorageBackedState";
import { useNetworkBackedGameState } from "./useNetworkBackedGameState";
import { InputName } from "./InputName";
import { JoinTeam } from "./JoinTeam";
import { RandomSpectrumCard } from "./SpectrumCards";
import { RandomSpectrumTarget } from "./RandomSpectrumTarget";
import { Lobby } from "./Lobby";

export function GameRoom() {
  const { roomId } = useParams();
  if (roomId === undefined) {
    throw new Error("RoomId missing");
  }

  const [name, setName] = useStorageBackedState("", "name");
  const [gameState, setGameState] = useNetworkBackedGameState(roomId, name);

  if (name.length === 0) {
    return <InputName setName={setName} />;
  }

  if (!gameState.leftTeam?.[name] && !gameState.rightTeam?.[name]) {
    return (
      <JoinTeam
        {...gameState}
        joinTeam={(team) => {
          setGameState({
            [team]: {
              ...gameState[team],
              [name]: true,
            },
          });
        }}
      />
    );
  }

  return (
    <div>
      <h1>{roomId}</h1>
      {gameState.roundPhase === RoundPhase.SetupGame && (
        <Lobby
          {...gameState}
          startGame={() => {
            setGameState({
              roundPhase: RoundPhase.GiveClue,
            });
          }}
        />
      )}
      {gameState.roundPhase === RoundPhase.GiveClue && (
        <GiveClue
          spectrumCard={gameState.spectrumCard}
          spectrumTarget={gameState.spectrumTarget}
          submitClue={(clue) => {
            setGameState({
              clue,
              roundPhase: RoundPhase.MakeGuess,
            });
          }}
        />
      )}
      {gameState.roundPhase === RoundPhase.MakeGuess && (
        <MakeGuess
          clue={gameState.clue}
          spectrumCard={gameState.spectrumCard}
          submitGuess={(guess) => {
            setGameState({
              guess,
              roundPhase: RoundPhase.ViewScore,
            });
          }}
        />
      )}
      {gameState.roundPhase === RoundPhase.ViewScore && (
        <ViewScore
          spectrumTarget={gameState.spectrumTarget}
          guess={gameState.guess}
          nextRound={() =>
            setGameState({
              roundPhase: RoundPhase.GiveClue,
              spectrumCard: RandomSpectrumCard(),
              spectrumTarget: RandomSpectrumTarget(),
            })
          }
        />
      )}
    </div>
  );
}
