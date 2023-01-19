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
  {
    name: "Hexagon",
    vertices: [
      {
        x: 50.0,
        y: 10.0,
      },
      {
        x: 15.36,
        y: 30.0,
      },
      {
        x: 15.36,
        y: 70.0,
      },
      {
        x: 50.0,
        y: 90.0,
      },
      {
        x: 84.64,
        y: 70.0,
      },
      {
        x: 84.64,
        y: 30.0,
      },
    ],
    adjacencyList: [
      [5, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 0],
    ],
  },
];

const PLAYER_TYPES = ["Random", "MENACE"];
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
        <line
          key={`${i},${j}`}
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke="black"
        ></line>
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
      <form onSubmit={formSubmit} className="space-y-2">
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
        <input
          type="submit"
          value="Start"
          className="bg-sky-800 text-white px-3 py-1 rounded"
        />
      </form>
    </div>
  );
}

interface Cop {
  begin: (random: number) => {
    newCop: Cop;
    newCopPositions: number[];
  };
  move: (
    copPositions: number[],
    robberPosition: number,
    random: number
  ) => {
    newCop: Cop;
    newCopPositions: number[];
  };
  end: (copPositions: number[], robberPosition: number) => Cop;
}

interface Bag {
  choose: (random: number) => number;
  increase: (index: number, amount: number) => Bag;
  decrease: (index: number, amount: number) => Bag;
}

function createBag(counts: number[]): Bag {
  return {
    choose: (random: number) => {
      let total = 0;
      counts.forEach((count) => {
        total += count;
      });
      let choice = Math.floor(random * total) + 1;
      let curr = 0;
      for (let i = 0; i < counts.length; i++) {
        if (curr + 1 <= choice && choice <= curr + counts[i]) {
          return i;
        }
        curr += counts[i];
      }
      return -1;
    },
    increase: (index: number, amount: number) => {
      return createBag([
        ...counts.slice(0, index),
        counts[index] + amount,
        ...counts.slice(index + 1),
      ]);
    },
    decrease: (index: number, amount: number) => {
      let newCounts = [...counts];
      newCounts[index] =
        newCounts[index] - amount > 0 ? newCounts[index] - amount : 0;
      let total = 0;
      newCounts.forEach((count) => {
        total += count;
      });
      if (total > 0) {
        return createBag(newCounts);
      } else {
        return createBag(new Array(newCounts.length).fill(50));
      }
    },
  };
}

function createMenaceCop(
  gameDetails: GameDetails,
  bags: Map<string, Bag>,
  moves: { bagKey: string; move: number }[]
) {
  let { graphIndex, numberOfCops } = gameDetails;
  let player = {
    begin: (random: number) => {
      let startBag = bags.get("");
      if (!startBag) {
        let numberOfVertices = TEMPLATE_GRAPHS[graphIndex].vertices.length;
        let newBags = new Map(bags);
        let bag = createBag(
          new Array(Math.pow(numberOfVertices, numberOfCops)).fill(50)
        );
        newBags.set("", bag);

        let choice = bag.choose(random);
        let newCop = createMenaceCop(gameDetails, newBags, [
          { bagKey: "", move: choice },
        ]);
        let newCopPositions = [];
        for (let i = 0; i < numberOfCops; i++) {
          newCopPositions.push(choice % numberOfVertices);
          choice = Math.floor(choice / numberOfVertices);
        }
        return {
          newCop,
          newCopPositions,
        };
      } else {
        let choice = startBag.choose(random);
        let newCop = createMenaceCop(gameDetails, bags, [
          { bagKey: "", move: choice },
        ]);
        let numberOfVertices = TEMPLATE_GRAPHS[graphIndex].vertices.length;
        let newCopPositions = [];
        for (let i = 0; i < numberOfCops; i++) {
          newCopPositions.push(choice % numberOfVertices);
          choice = Math.floor(choice / numberOfVertices);
        }
        return {
          newCop,
          newCopPositions,
        };
      }
    },
    move: (copPositions: number[], robberPosition: number, random: number) => {
      let bagKey = JSON.stringify([...copPositions, robberPosition]);
      let moveBag = bags.get(bagKey);
      if (!moveBag) {
        let newBags = new Map(bags);
        let totalChoices = 1;
        copPositions.forEach((cop) => {
          let adjacentVertices = TEMPLATE_GRAPHS[graphIndex].adjacencyList[cop];
          totalChoices *= adjacentVertices.length + 1;
        });
        let bag = createBag(new Array(totalChoices).fill(50));
        newBags.set(bagKey, bag);

        let choice = bag.choose(random);
        let newCop = createMenaceCop(gameDetails, newBags, [
          ...moves,
          { bagKey, move: choice },
        ]);
        let newCopPositions = [];
        for (let i = 0; i < numberOfCops; i++) {
          let adjacentVertices =
            TEMPLATE_GRAPHS[graphIndex].adjacencyList[copPositions[i]];
          let currChoice = choice % (adjacentVertices.length + 1);
          if (currChoice === adjacentVertices.length) {
            newCopPositions.push(copPositions[i]);
          } else {
            newCopPositions.push(adjacentVertices[currChoice]);
          }
          choice = Math.floor(choice / (adjacentVertices.length + 1));
        }

        return {
          newCop,
          newCopPositions,
        };
      } else {
        let choice = moveBag.choose(random);
        let newCop = createMenaceCop(gameDetails, bags, [
          ...moves,
          { bagKey, move: choice },
        ]);
        let newCopPositions = [];
        for (let i = 0; i < numberOfCops; i++) {
          let adjacentVertices =
            TEMPLATE_GRAPHS[graphIndex].adjacencyList[copPositions[i]];
          let currChoice = choice % (adjacentVertices.length + 1);
          if (currChoice === adjacentVertices.length) {
            newCopPositions.push(copPositions[i]);
          } else {
            newCopPositions.push(adjacentVertices[currChoice]);
          }
          choice = Math.floor(choice / (adjacentVertices.length + 1));
        }

        return {
          newCop,
          newCopPositions,
        };
      }
    },
    end: (copPositions: number[], robberPosition: number) => {
      let newBags = new Map(bags);
      if (copPositions.findIndex((cop) => cop === robberPosition) !== -1) {
        moves.forEach(({ bagKey, move }) => {
          let bag = newBags.get(bagKey);
          let newBag = (bag as Bag).increase(move, 3);
          newBags.set(bagKey, newBag);
        });
      } else {
        moves.forEach(({ bagKey, move }) => {
          let bag = newBags.get(bagKey);
          let newBag = (bag as Bag).decrease(move, 1);
          newBags.set(bagKey, newBag);
        });
      }
      return createMenaceCop(gameDetails, newBags, []);
    },
  };
  return player;
}

function createMenaceRobber(
  gameDetails: GameDetails,
  bags: Map<string, Bag>,
  moves: { bagKey: string; move: number }[]
): Robber {
  let { graphIndex } = gameDetails;
  let player = {
    begin: (copPositions: number[], random: number) => {
      let bagKey = JSON.stringify([...copPositions]);
      let startBag = bags.get(bagKey);
      if (!startBag) {
        let numberOfVertices = TEMPLATE_GRAPHS[graphIndex].vertices.length;
        let newBags = new Map(bags);
        let bag = createBag(new Array(numberOfVertices).fill(50));
        newBags.set(bagKey, bag);

        let choice = bag.choose(random);
        let newRobber = createMenaceRobber(gameDetails, newBags, [
          { bagKey, move: choice },
        ]);
        return {
          newRobber,
          newRobberPosition: choice,
        };
      } else {
        let choice = startBag.choose(random);
        let newRobber = createMenaceRobber(gameDetails, bags, [
          { bagKey, move: choice },
        ]);
        return {
          newRobber,
          newRobberPosition: choice,
        };
      }
    },
    move: (copPositions: number[], robberPosition: number, random: number) => {
      let bagKey = JSON.stringify([...copPositions, robberPosition]);
      let moveBag = bags.get(bagKey);
      if (!moveBag) {
        let newBags = new Map(bags);
        let adjacentVertices =
          TEMPLATE_GRAPHS[graphIndex].adjacencyList[robberPosition];
        let bag = createBag(new Array(adjacentVertices.length + 1).fill(50));
        newBags.set(bagKey, bag);

        let choice = bag.choose(random);
        let newRobber = createMenaceRobber(gameDetails, newBags, [
          ...moves,
          { bagKey, move: choice },
        ]);

        return {
          newRobber,
          newRobberPosition:
            choice === adjacentVertices.length
              ? robberPosition
              : adjacentVertices[choice],
        };
      } else {
        let choice = moveBag.choose(random);
        let newRobber = createMenaceRobber(gameDetails, bags, [
          ...moves,
          { bagKey, move: choice },
        ]);
        let adjacentVertices =
          TEMPLATE_GRAPHS[graphIndex].adjacencyList[robberPosition];

        return {
          newRobber,
          newRobberPosition:
            choice === adjacentVertices.length
              ? robberPosition
              : adjacentVertices[choice],
        };
      }
    },
    end: (copPositions: number[], robberPosition: number) => {
      let newBags = new Map(bags);
      if (copPositions.findIndex((cop) => cop === robberPosition) !== -1) {
        moves.forEach(({ bagKey, move }) => {
          let bag = newBags.get(bagKey);
          let newBag = (bag as Bag).decrease(move, 1);
          newBags.set(bagKey, newBag);
        });
      } else {
        moves.forEach(({ bagKey, move }) => {
          let bag = newBags.get(bagKey);
          let newBag = (bag as Bag).increase(move, 3);
          newBags.set(bagKey, newBag);
        });
      }
      return createMenaceRobber(gameDetails, newBags, []);
    },
  };
  return player;
}

function createCop(gameDetails: GameDetails): Cop {
  let { graphIndex, numberOfCops, cop } = gameDetails;
  switch (cop) {
    case "MENACE": {
      return createMenaceCop(gameDetails, new Map(), []);
    }
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

interface Robber {
  begin: (
    copPositions: number[],
    random: number
  ) => {
    newRobber: Robber;
    newRobberPosition: number;
  };
  move: (
    copPositions: number[],
    robberPosition: number,
    random: number
  ) => {
    newRobber: Robber;
    newRobberPosition: number;
  };
  end: (copPositions: number[], robberPosition: number) => Robber;
}

function createRobber(gameDetails: GameDetails): Robber {
  let { graphIndex, robber } = gameDetails;
  switch (robber) {
    case "MENACE": {
      return createMenaceRobber(gameDetails, new Map(), []);
    }
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

interface GameState {
  score: [number, number];
  cop: Cop;
  robber: Robber;
  copPositions: null | number[];
  robberPosition: null | number;
  roundsLeft: number;
  turn: "Cop" | "Robber" | "Over";
}

function nextGameState(
  state: GameState,
  gameDetails: GameDetails,
  random: number
): GameState {
  let { score, cop, robber, copPositions, robberPosition, roundsLeft, turn } =
    state;

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
        let newRobber = robber.end(newCopPositions, robberPosition as number);
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
      (copPositions as number[]).findIndex((v) => v === newRobberPosition) !==
      -1
    ) {
      let newCop = cop.end(copPositions as number[], newRobberPosition);
      newRobber = newRobber.end(copPositions as number[], newRobberPosition);
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
    if (roundsLeft === 0 || (roundsLeft === 1 && robberPosition !== null)) {
      let newCop = cop.end(copPositions as number[], newRobberPosition);
      newRobber = newRobber.end(copPositions as number[], newRobberPosition);
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
  } as GameState);

  useEffect(() => {
    let interval = setInterval(() => {
      let random = Math.random();
      setGameState((state) => nextGameState(state, gameDetails, random));
    }, 700);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function play1000Games() {
    let state = gameState;
    let games = 0;
    while (games < 1000) {
      state = nextGameState(state, gameDetails, Math.random());
      if (state.turn === "Over") {
        games++;
      }
    }
    state = nextGameState(state, gameDetails, Math.random()); // Start the new game
    setGameState(state);
  }

  let graph = TEMPLATE_GRAPHS[gameDetails.graphIndex];
  let graphEdges: JSX.Element[] = [];
  graph.adjacencyList.forEach((list, i) => {
    list.forEach((j) => {
      let v1 = graph.vertices[i];
      let v2 = graph.vertices[j];
      graphEdges.push(
        <line
          key={`${i},${j}`}
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke="black"
        ></line>
      );
    });
  });

  return (
    <div>
      <div className="flex justify-between my-3">
        <button
          onClick={play1000Games}
          className="bg-sky-800 text-white px-2 py-1 rounded"
        >
          Play 1000 games
        </button>
        <button
          onClick={() => {
            setView("GameSelection");
          }}
          className="bg-sky-800 text-white px-2 py-1 rounded"
        >
          New game
        </button>
      </div>
      <p className="text-2xl text-center">
        {gameState.score[0]} - {gameState.score[1]}
      </p>
      <svg width="300" height="300" viewBox="0 0 100 100" className="mx-auto">
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
