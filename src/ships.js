import m from "mithril";
import tagl from "tagl-mithril";
import fn from "./fn";

import stack from "./stack";

const debug = a => e => {
  console.log(a, e);
  return e;
};

const games = {
  "15./16.12. 2018": {
    hintsRow: [9, 1, 8, 1, 6, 2, 2, 5, 3, 4, 3, 1],
    hintsColumn: [3, 6, 2, 3, 7, 2, 1, 7, 2, 2, 6, 4],
    width: 12,
    field: [
      [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ships: [5, 4, 4, 2, 6, 5, 3, 7, 6, 3]
  },
  "12./13.01. 2019": {
    hintsRow: [2, 6, 1, 6, 3, 3, 4, 4, 2, 4, 7, 3],
    hintsColumn: [6, 3, 9, 1, 1, 7, 2, 3, 6, 3, 2, 2],
    width: 12,
    field: [
      [0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
      [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ships: [5, 4, 4, 2, 6, 5, 3, 7, 6, 3]
  },
  "12./13.01. 2019 partly solved": {
    hintsRow: [2, 6, 1, 6, 3, 3, 4, 4, 2, 4, 7, 3],
    hintsColumn: [6, 3, 9, 1, 1, 7, 2, 3, 6, 3, 2, 2],
    width: 12,
    field: [
      [1, 5, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 3, 1, 0, 0, 0, 0, 3, 0, 0, 0],
      [2, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [5, 3, 3, 7, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 2, 3, 3, 3, 3, 2, 0],
      [5, 3, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    ships: [5, 4, 4, 2, 6, 5, 3, 7, 6, 3]
  },
  test: {
    hintsRow: [2, 6, 1, 6, 3, 3, 4, 4, 2, 4, 7, 3],
    hintsColumn: [6, 3, 9, 1, 1, 7, 2, 3, 6, 3, 2, 2],
    width: 12,
    field: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    ships: [5, 4, 4, 2, 6, 5, 3, 7, 6, 3]
  }
};

const {
  nav,
  article,
  a,
  div,
  h1,
  h2,
  h3,
  svg,
  input,
  button,
  pre,
  polygon,
  polyline
} = tagl(m);

let innerHeight = window.innerHeight;
let innerWidth = window.innerWidth;

window.addEventListener("resize", ev => {
  innerHeight = ev.target.innerHeight;
  innerWidth = ev.target.innerWidth;
  m.redraw();
});

let gameWidth = 12;

const type = Object.freeze(
  Object.assign(
    {},
    {
      UNKNOWN: 0,
      WATER: 1,
      SHIP_UNKNOWN: 2,
      SHIP_MIDDLE: 3,
      SHIP_NORTH_END: 4,
      SHIP_WEST_END: 5,
      SHIP_SOUTH_END: 6,
      SHIP_EAST_END: 7
    }
  )
);

const direction = Object.freeze({
  HORIZONTAL: 0,
  VERTICAL: 1
});

let gameModel = width => {
  let cb = null;
  let hintsRow = fn.range(0, width).map(l => 0);
  let hintsColumn = fn.range(0, width).map(l => 0);
  let field = fn
    .range(0, width)
    .map(k => fn.range(0, width).map(l => type.UNKNOWN));
  let ships = [4, 5];
  const setFieldAt = (r, c, v) => {
    field[r][c] = v;
    cb && cb();
  };
  const fieldAt = (r, c) => field[r][c];
  const fieldCoords = () => {
    let res = [];
    fn.range(0, width).forEach(x =>
      fn.range(0, width).forEach(y => res.push({ x, y }))
    );
    return res;
  };
  const neighbours = ({ x, y }) => {
    let res = [];
    fn.interval(Math.max(0, x - 1), Math.min(x + 1, width - 1)).forEach(nx =>
      fn
        .interval(Math.max(0, y - 1), Math.min(y + 1, width - 1))
        .filter(ny => !(nx === x && ny === y))
        .forEach(ny => res.push({ x: nx, y: ny }))
    );
    return res;
  };
  const clearWater = () => {
    fieldCoords().forEach(p =>
      fieldAt(p.y, p.x) === type.WATER
        ? setFieldAt(p.y, p.x, type.UNKNOWN)
        : null
    );
  };
  const refreshWater = () =>
    fieldCoords().forEach(p => {
      if (fieldAt(p.y, p.x) === type.UNKNOWN) {
        let neighbourValues = neighbours(p).map(pos => fieldAt(pos.y, pos.x));
        if (neighbourValues.find(v => v >= type.SHIP_UNKNOWN)) {
          setFieldAt(p.y, p.x, type.WATER);
        }
      }
    });
  return {
    hintAt: (r, c) => {
      return r === 0 ? hintsColumn[c - 1] : hintsRow[r - 1];
    },
    setHintAt: (r, c, v) => {
      if (r === 0) hintsColumn[c - 1] = v;
      else hintsRow[r - 1] = v;
      cb && cb();
    },
    fieldAt,
    setFieldAt,
    placeShip: (r, c, l, d) => {
      let shipCoords = fn
        .range(0, l)
        .map(segment => {
          return {
            x: c + (d === direction.HORIZONTAL ? segment : 0),
            y: r + (d === direction.VERTICAL ? segment : 0)
          };
        })
        .filter(p => p.x >= 0 && p.x < width && p.y >= 0 && p.y < width);

      if (shipCoords.length !== l) return false;

      if (
        !shipCoords.map(p => fieldAt(p.y, p.x)).every(v => v === type.UNKNOWN)
      ) {
        return false;
      }

      switch (d) {
        case direction.VERTICAL:
          setFieldAt(r, c, type.SHIP_NORTH_END);
          fn.range(1, l - 1).forEach(i =>
            setFieldAt(r + i, c, type.SHIP_MIDDLE)
          );
          setFieldAt(r + l - 1, c, type.SHIP_SOUTH_END);
          break;
        case direction.HORIZONTAL:
          setFieldAt(r, c, type.SHIP_WEST_END);
          fn.range(1, l - 1).forEach(i =>
            setFieldAt(r, c + i, type.SHIP_MIDDLE)
          );
          setFieldAt(r, c + l - 1, type.SHIP_EAST_END);
          break;
        default:
          break;
      }
      clearWater();
      refreshWater();
      return true;
    },
    setShip: (idx, size) => {
      ships[idx] = Math.min(width, size);
      cb && cb();
    },
    removeShip: idx => {
      ships.splice(idx, 1);
      cb && cb();
    },
    addShip: () => {
      ships.push(2);
      cb && cb();
    },
    isWon: () => {
      return false;
    },
    ships: () => ships,
    width: () => width,
    setChangeCallback: f => (cb = f),
    data: () => {
      return {
        hintsRow,
        hintsColumn,
        width,
        field,
        ships
      };
    },
    fromData: d => {
      hintsRow = d.hintsRow;
      hintsColumn = d.hintsColumn;
      width = d.width;
      field = d.field;
      ships = d.ships;
    }
  };
};

let g = gameModel(gameWidth);

g.fromData(games[Object.keys(games)[1]]);

let history = stack(g.data());
g.setChangeCallback(() => history.push(g.data()));

let shipsToPlace = g.ships().map(e => e);

const varyPropertyArrays = arrays =>
  Object.keys(arrays).reduce(
    (acc, key) =>
      arrays[key].flatMap && arrays[key].length > 0
        ? arrays[key].flatMap(v =>
            acc.map(obj => Object.assign({ [key]: v }, obj))
          )
        : acc.map(obj => Object.assign({ [key]: arrays[key] }, obj)),
    [{}]
  );

const solve = () => {
  let solution = [];

  const possibleSolutionsForOneShip = varyPropertyArrays({
    x: fn.range(0, 12),
    y: fn.range(0, 12),
    direction: [direction.VERTICAL, direction.HORIZONTAL]
  });

  const extendSolution = (solution, ships) => {
    if (ships.length === 0) return solution;
  };

  extendSolution(solution, shipsToPlace);

  solution.forEach(ship => {
    g.placeShip(ship.y, ship.x, ship.length, ship.direction);
  });
};

if (false)
  shipsToPlace.forEach(ship => {
    let possiblePositions = [];
    fn.range(0, gameWidth).map(x =>
      fn.range(0, gameWidth).map(y =>
        [direction.VERTICAL, direction.HORIZONTAL].map(direction => {
          possiblePositions.push({ x, y, direction });
        })
      )
    );
    let idx = 0;
    while (
      !g.placeShip(
        possiblePositions[idx].y,
        possiblePositions[idx].x,
        ship,
        possiblePositions[idx].direction
      )
    )
      idx++;
    solution.push(possiblePositions[idx]);
  });

class GameField {
  view(vnode) {
    let w = g.width() + 1;
    return div.gamefield([
      fn
        .range(0, w * w)
        .map(l => {
          return {
            x: l % w,
            y: Math.floor(l / w)
          };
        })
        .map(l =>
          l.x !== 0 || l.y !== 0
            ? l.x === 0 || l.y === 0
              ? input.box.input({
                  value: g.hintAt(l.y, l.x),
                  oninput: m.withAttr("value", v =>
                    g.setHintAt(l.y, l.x, Number(v))
                  )
                })
              : g.fieldAt(l.y - 1, l.x - 1) === type.UNKNOWN
              ? div.box.empty({
                  onclick: () => g.setFieldAt(l.y - 1, l.x - 1, type.WATER)
                })
              : g.fieldAt(l.y - 1, l.x - 1) === type.WATER
              ? div.box.water({
                  onclick: () =>
                    g.setFieldAt(l.y - 1, l.x - 1, type.SHIP_UNKNOWN)
                })
              : div.box["ship-" + g.fieldAt(l.y - 1, l.x - 1)](
                  {
                    onclick: () =>
                      g.setFieldAt(
                        l.y - 1,
                        l.x - 1,
                        (g.fieldAt(l.y - 1, l.x - 1) + 1) % 8
                      )
                  },
                  "" + l.x + "," + l.y
                )
            : history.dirty()
            ? button.box.empty(
                {
                  onclick: () => g.fromData(history.pop())
                },
                "⬅️"
              )
            : div.box.empty()
        )
    ]);
  }
}

class Ships {
  view(vnode) {
    return [
      div.ships([
        g.ships().map((shipSize, shipIdx) =>
          div.ship(
            {
              key: shipIdx
            },
            [
              button.shipcell.shipcellfirst(
                {
                  onclick: () =>
                    shipSize - 1 >= 2
                      ? g.setShip(shipIdx, shipSize - 1)
                      : g.removeShip(shipIdx)
                },
                "-"
              ),
              fn.range(0, shipSize - 2).map(i =>
                div.shipcell({
                  key: i
                })
              ),
              button.shipcell.shipcelllast(
                {
                  onclick: () => g.setShip(shipIdx, shipSize + 1)
                },
                "+"
              )
            ]
          )
        ),
        button.box.empty(
          {
            onclick: () => g.addShip()
          },
          "+"
        )
      ])
    ];
  }
}

export default class ShipsView {
  view(vnode) {
    return div.container([
      m(
        "h1",
        "Ships " + (g.isWon() ? "Won" : "Not won"),
        button.btn.btnPrimary(
          { onclick: () => g.fromData(history.clear()) },
          "Clear"
        )
      ),
      div.maingrid([m(GameField), m(Ships)]),
      pre(
        JSON.stringify({
          rowSum: g.data().hintsRow.reduce((a, b) => a + b, 0),
          colSum: g.data().hintsColumn.reduce((a, b) => a + b, 0)
        })
      ),
      pre(JSON.stringify(g.data(), null, 2))
    ]);
  }
}
