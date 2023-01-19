const GRAPH = {
  name: "5 vertex path",
  vertices: [
    {
      x: 10.0,
      y: 10.0,
    },
    {
      x: 30.0,
      y: 10.0,
    },
    {
      x: 50.0,
      y: 10.0,
    },
    {
      x: 70.0,
      y: 10.0,
    },
    {
      x: 90.0,
      y: 10.0,
    },
  ],
  adjacencyList: [[1], [0, 2], [1, 3], [2, 4], [3]],
};

interface ExampleGraphProps {
  cops: null | number[];
  robber: null | number;
}

function ExampleGraph({ cops, robber }: ExampleGraphProps) {
  let graphEdges: JSX.Element[] = [];
  for (let i = 0; i < GRAPH.vertices.length; i++) {
    GRAPH.adjacencyList[i].forEach((j) => {
      let v1 = GRAPH.vertices[i];
      let v2 = GRAPH.vertices[j];
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
  }
  return (
    <svg width="250" height="50" viewBox="0 0 100 20">
      {graphEdges}
      {GRAPH.vertices.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r="2"></circle>
      ))}
      {robber !== null && (
        <circle
          cx={GRAPH.vertices[robber].x}
          cy={GRAPH.vertices[robber].y}
          r="3"
          fill="blue"
        ></circle>
      )}
      {cops !== null &&
        cops.map((cop, i) => (
          <circle
            key={i}
            cx={GRAPH.vertices[cop].x}
            cy={GRAPH.vertices[cop].y}
            r="3"
            fill="red"
          ></circle>
        ))}
    </svg>
  );
}

function About() {
  return (
    <div className="space-y-3">
      <p className="text-3xl font-bold">About</p>
      <p>
        This website demonstrates various algorithms playing the game Cops and
        Robbers.
      </p>
      <p className="text-2xl font-bold">Cops and Robbers</p>
      <p>Cops and robbers is a two player game on a graph.</p>
      <p>We start with a graph.</p>
      <ExampleGraph cops={null} robber={null} />
      <p>
        The first player places a fixed number of tokens (the cops) on the
        vertices of the graph. Multiple tokens can be placed on the same vertex.
      </p>
      <ExampleGraph cops={[0, 3]} robber={null} />
      <p>
        Then the second player places a single token (the robber) on some
        vertex.
      </p>
      <ExampleGraph cops={[0, 3]} robber={2} />
      <p>
        Then the first and second player alternate playing moves. In their move,
        a player goes through each of their tokens, and either moves them to a
        adjacent vertex, or keeps them at the same place.
      </p>
      <ExampleGraph cops={[1, 4]} robber={2} />
      <ExampleGraph cops={[1, 4]} robber={3} />
      <ExampleGraph cops={[1, 3]} robber={3} />
      <p>
        They keep doing so until either one of the cops catches the robber, or
        the robber survives for some fixed number of rounds.
      </p>
      <p className="text-2xl font-bold">Algorithms</p>
      <p>Random: The algorithm makes a random move.</p>
      <p>
        MENACE: The MENACE algorithm is an algorithm which learns to play over
        multiple games.
      </p>
      <p>
        Imagine playing a game and reaching the following game state (cops
        move):
      </p>
      <ExampleGraph cops={[0, 3]} robber={2} />
      <p>The player has 6 possible moves they can play.</p>
      <ExampleGraph cops={[0, 3]} robber={2} />
      <ExampleGraph cops={[0, 2]} robber={2} />
      <ExampleGraph cops={[0, 4]} robber={2} />
      <ExampleGraph cops={[1, 3]} robber={2} />
      <ExampleGraph cops={[1, 2]} robber={2} />
      <ExampleGraph cops={[1, 4]} robber={2} />
      <p>
        The algorithm maintains a bag for each possible game state it can move
        on. For each state, the corresponding bag contains tokens for each
        possible move the player can play at that state. (Initially we have 50
        tokens per move.)
      </p>
      <p>
        For example, initially for the above state we have 50 * 6 = 300 tokens
        in the corresponding bag, 50 for each move.
      </p>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 2]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 4]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 2]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 4]} robber={2} />
        <span>50</span>
      </div>
      <p>
        Now when we are at a state and we need to make a move, we randomly draw
        a token from the corresponding bag, and make that move (we place the
        token back). We keep track of the moves we played.
      </p>
      <p>For example, say we do this for the above state and play the move:</p>
      <ExampleGraph cops={[0, 2]} robber={2} />
      <p>
        In this case, we win. If we win a game, we go through each move we
        played and add 3 tokens corresponding to the move to the bag we drew the
        move from.
      </p>
      <p>For example, for our chosen state, the bag will be updated to:</p>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 2]} robber={2} />
        <span>53</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 4]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 2]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 4]} robber={2} />
        <span>50</span>
      </div>
      <p>On the other hand, imagine that we had instead chosen the move:</p>
      <ExampleGraph cops={[0, 4]} robber={2} />
      <p>played a few more moves and lost the game.</p>
      <p>
        If we lose a game, we go through each move we played and remove 1 token
        corresponding to the move from the bag we drew the move from.
      </p>
      <p>For example, for our chosen state, the bag will be updated to:</p>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 2]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[0, 4]} robber={2} />
        <span>49</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 3]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 2]} robber={2} />
        <span>50</span>
      </div>
      <div className="flex items-center">
        <ExampleGraph cops={[1, 4]} robber={2} />
        <span>50</span>
      </div>
      <p>We keep playing games, updating the bags depending on the outcome.</p>
    </div>
  );
}

export default About;
