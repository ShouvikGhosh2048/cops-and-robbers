import { FormEvent, useEffect, useState } from "react";

interface Graph {
  name: string;
  vertices: {
    x: number;
    y: number;
  }[];
  adjacencyList: number[][];
}

const TEMPLATE_GRAPHS: Graph[] = [
  {
    name: "2 vertex path",
    vertices: [
      {
        x: 50.0,
        y: 10.0,
      },
      {
        x: 50.0,
        y: 90.0,
      },
    ],
    adjacencyList: [[1], [0]],
  },
  {
    name: "5 vertex path",
    vertices: [
      {
        x: 50.0,
        y: 10.0,
      },
      {
        x: 50.0,
        y: 30.0,
      },
      {
        x: 50.0,
        y: 50.0,
      },
      {
        x: 50.0,
        y: 70.0,
      },
      {
        x: 50.0,
        y: 90.0,
      },
    ],
    adjacencyList: [[1], [0, 2], [1, 3], [2, 4], [3]],
  },
];

const PLAYER_TYPES = ["Random"];
type AppView = "GameSelection" | "Game";

interface GameDetails {
  graphIndex: number;
  numberOfCops: number;
  numberOfSteps: number;
  cop: string;
  robber: string;
}

interface GameSelectionProps {
  gameDetails: GameDetails;
  setGameDetails: (gameDetails: GameDetails) => void;
  setView: (view: AppView) => void;
}

function GameSelection({
  gameDetails,
  setGameDetails,
  setView,
}: GameSelectionProps) {
  let { graphIndex, numberOfCops, numberOfSteps, cop, robber } = gameDetails;

  let graphEdges: JSX.Element[] = [];
  TEMPLATE_GRAPHS[graphIndex].adjacencyList.forEach((list, i) => {
    list.forEach((j) => {
      let v1 = TEMPLATE_GRAPHS[graphIndex].vertices[i];
      let v2 = TEMPLATE_GRAPHS[graphIndex].vertices[j];
      graphEdges.push(
        <line x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke="black"></line>
      );
    });
  });

  function formSubmit(e: FormEvent) {
    e.preventDefault();
    setView("Game");
  }

  return (
    <div>
      <p className="text-3xl font-bold">Cops and Robbers</p>
      <form onSubmit={formSubmit}>
        <div>
          <span>Graph: </span>
          <select
            value={graphIndex}
            onChange={(e) => {
              setGameDetails({
                ...gameDetails,
                graphIndex: Number(e.target.value),
              });
            }}
          >
            {TEMPLATE_GRAPHS.map((graph, i) => (
              <option key={i} value={i}>
                {graph.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <svg width="300" height="300" viewBox="0 0 100 100">
            {graphEdges}
            {TEMPLATE_GRAPHS[graphIndex].vertices.map((v, i) => (
              <circle key={i} cx={v.x} cy={v.y} r="2"></circle>
            ))}
          </svg>
        </div>
        <div>
          <span>Number of cops: </span>
          <input
            type="number"
            value={numberOfCops}
            min="1"
            max="3"
            step="1"
            onChange={(e) => {
              setGameDetails({
                ...gameDetails,
                numberOfCops: Number(e.target.value),
              });
            }}
          />
        </div>
        <div>
          <span>Number of steps: </span>
          <input
            type="number"
            value={numberOfSteps}
            min="0"
            max="100"
            step="1"
            onChange={(e) => {
              setGameDetails({
                ...gameDetails,
                numberOfSteps: Number(e.target.value),
              });
            }}
          />
        </div>
        <div>
          <span>Cop: </span>
          <select
            value={cop}
            onChange={(e) => {
              setGameDetails({ ...gameDetails, cop: e.target.value });
            }}
          >
            {PLAYER_TYPES.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span>Robber: </span>
          <select
            value={robber}
            onChange={(e) => {
              setGameDetails({ ...gameDetails, robber: e.target.value });
            }}
          >
            {PLAYER_TYPES.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
        <input type="submit" value="Start" />
      </form>
    </div>
  );
}

function createCop(gameDetails: GameDetails) {
  let { graphIndex, numberOfCops, cop } = gameDetails;
  switch (cop) {
    default: {
      let player = {
        begin: (random: number) => {
          let numberOfVertices = TEMPLATE_GRAPHS[graphIndex].vertices.length;
          let newCopPositions = [];
          for (let i = 0; i < numberOfCops; i++) {
            random *= numberOfVertices;
            let choice = Math.floor(random);
            newCopPositions.push(choice);
            random -= choice;
          }
          return {
            newCop: player,
            newCopPositions,
          };
        },
        move: (
          copPositions: number[],
          robberPosition: number,
          random: number
        ) => {
          let newCopPositions = [];
          for (let i = 0; i < numberOfCops; i++) {
            let adjacentVertices =
              TEMPLATE_GRAPHS[graphIndex].adjacencyList[copPositions[i]];
            random *= adjacentVertices.length + 1;
            let choice = Math.floor(random);
            if (choice === adjacentVertices.length) {
              newCopPositions.push(copPositions[i]);
            } else {
              newCopPositions.push(adjacentVertices[choice]);
            }
            random -= choice;
          }
          return {
            newCop: player,
            newCopPositions,
          };
        },
        end: (copPositions: number[], robberPosition: number) => player,
      };
      return player;
    }
  }
}

function createRobber(gameDetails: GameDetails) {
  let { graphIndex, robber } = gameDetails;
  switch (robber) {
    default: {
      let player = {
        begin: (copPositions: number[], random: number) => {
          return {
            newRobber: player,
            newRobberPosition: Math.floor(
              random * TEMPLATE_GRAPHS[graphIndex].vertices.length
            ),
          };
        },
        move: (
          copPositions: number[],
          robberPosition: number,
          random: number
        ) => {
          let adjacentVertices =
            TEMPLATE_GRAPHS[graphIndex].adjacencyList[robberPosition];
          let choice = Math.floor(random * (adjacentVertices.length + 1));
          let newRobberPosition;
          if (choice === adjacentVertices.length) {
            newRobberPosition = robberPosition;
          } else {
            newRobberPosition = adjacentVertices[choice];
          }
          return {
            newRobber: player,
            newRobberPosition,
          };
        },
        end: (copPositions: number[], robberPosition: number) => player,
      };
      return player;
    }
  }
}

interface GameProps {
  gameDetails: GameDetails;
  setView: (view: AppView) => void;
}

function Game({ gameDetails, setView }: GameProps) {
  const [gameState, setGameState] = useState({
    score: [0, 0],
    cop: createCop(gameDetails),
    robber: createRobber(gameDetails),
    copPositions: null as null | number[],
    robberPosition: null as null | number,
    roundsLeft: gameDetails.numberOfSteps,
    turn: "Cop" as "Cop" | "Robber" | "Over",
  });

  useEffect(() => {
    let interval = setInterval(() => {
      let random = Math.random();
      setGameState((state) => {
        let {
          score,
          cop,
          robber,
          copPositions,
          robberPosition,
          roundsLeft,
          turn,
        } = state;

        if (turn === "Over") {
          return {
            score,
            cop,
            robber,
            copPositions: null,
            robberPosition: null,
            roundsLeft: gameDetails.numberOfSteps,
            turn: "Cop",
          };
        } else if (turn === "Cop") {
          if (copPositions === null) {
            let { newCop, newCopPositions } = cop.begin(random);
            return {
              score,
              cop: newCop,
              robber,
              copPositions: newCopPositions,
              robberPosition,
              roundsLeft,
              turn: "Robber",
            };
          } else {
            let { newCop, newCopPositions } = cop.move(
              copPositions,
              robberPosition as number,
              random
            );
            // One of the cops is at the same position as the robber.
            if (newCopPositions.findIndex((v) => v === robberPosition) !== -1) {
              newCop = newCop.end(newCopPositions, robberPosition as number);
              let newRobber = robber.end(
                newCopPositions,
                robberPosition as number
              );
              return {
                score: [score[0] + 1, score[1]],
                cop: newCop,
                robber: newRobber,
                copPositions: newCopPositions,
                robberPosition,
                roundsLeft,
                turn: "Over",
              };
            }
            return {
              score,
              cop: newCop,
              robber,
              copPositions: newCopPositions,
              robberPosition,
              roundsLeft,
              turn: "Robber",
            };
          }
        } else {
          let newRobber;
          let newRobberPosition: number;
          if (robberPosition === null) {
            let beginResult = robber.begin(copPositions as number[], random);
            newRobber = beginResult.newRobber;
            newRobberPosition = beginResult.newRobberPosition;
          } else {
            let moveResult = robber.move(
              copPositions as number[],
              robberPosition,
              random
            );
            newRobber = moveResult.newRobber;
            newRobberPosition = moveResult.newRobberPosition;
          }
          // One of the cops is at the same position as the robber.
          if (
            (copPositions as number[]).findIndex(
              (v) => v === newRobberPosition
            ) !== -1
          ) {
            let newCop = cop.end(
              copPositions as number[],
              robberPosition as number
            );
            newRobber = newRobber.end(
              copPositions as number[],
              robberPosition as number
            );
            return {
              score: [score[0] + 1, score[1]],
              cop: newCop,
              robber: newRobber,
              copPositions,
              robberPosition: newRobberPosition,
              roundsLeft,
              turn: "Over",
            };
          }
          // No more rounds left, so robber wins.
          if (
            roundsLeft === 0 ||
            (roundsLeft === 1 && robberPosition !== null)
          ) {
            let newCop = cop.end(
              copPositions as number[],
              robberPosition as number
            );
            newRobber = newRobber.end(
              copPositions as number[],
              robberPosition as number
            );
            return {
              score: [score[0], score[1] + 1],
              cop: newCop,
              robber: newRobber,
              copPositions,
              robberPosition: newRobberPosition,
              roundsLeft: 0,
              turn: "Over",
            };
          }
          return {
            score,
            cop,
            robber: newRobber,
            copPositions,
            robberPosition: newRobberPosition,
            roundsLeft: robberPosition !== null ? roundsLeft - 1 : roundsLeft,
            turn: "Cop",
          };
        }
      });
    }, 700);
    return () => {
      clearInterval(interval);
    };
  }, []);

  let graph = TEMPLATE_GRAPHS[gameDetails.graphIndex];
  let graphEdges: JSX.Element[] = [];
  graph.adjacencyList.forEach((list, i) => {
    list.forEach((j) => {
      let v1 = graph.vertices[i];
      let v2 = graph.vertices[j];
      graphEdges.push(
        <line x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke="black"></line>
      );
    });
  });

  return (
    <div>
      <button
        onClick={() => {
          setView("GameSelection");
        }}
      >
        New game
      </button>
      <span>
        {gameState.score[0]} - {gameState.score[1]}
      </span>
      <svg width="300" height="300" viewBox="0 0 100 100">
        {graphEdges}
        {graph.vertices.map((v, i) => (
          <circle cx={v.x} cy={v.y} r="2" key={i}></circle>
        ))}
        {gameState.robberPosition !== null && (
          <circle
            cx={graph.vertices[gameState.robberPosition].x}
            cy={graph.vertices[gameState.robberPosition].y}
            r="3"
            fill="blue"
            className="transition-all duration-500"
          ></circle>
        )}
        {gameState.copPositions !== null &&
          gameState.copPositions.map((v, i) => (
            <circle
              cx={graph.vertices[v].x}
              cy={graph.vertices[v].y}
              r="3"
              fill="red"
              className="transition-all duration-500"
              key={i}
            ></circle>
          ))}
      </svg>
    </div>
  );
}

function App() {
  const [gameDetails, setGameDetails] = useState({
    graphIndex: 0,
    numberOfCops: 1,
    numberOfSteps: 0,
    cop: PLAYER_TYPES[0],
    robber: PLAYER_TYPES[0],
  });
  const [view, setView] = useState("GameSelection" as AppView);

  switch (view) {
    case "GameSelection": {
      return (
        <GameSelection
          gameDetails={gameDetails}
          setGameDetails={setGameDetails}
          setView={setView}
        />
      );
    }
    case "Game": {
      return <Game gameDetails={gameDetails} setView={setView} />;
    }
  }
}

export default App;
