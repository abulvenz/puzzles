import m from 'mithril';
import tagl from './tagl';
import fn from './fn';

import stack from './stack';

import {
    randomBytes
} from 'crypto';

const tagl_hyperscript = tagl(function (tagName, classes, ...args) {
    return m([tagName, ...classes].join('.'), ...args)
});

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
    polygon,
    polyline
} = tagl_hyperscript;

let innerHeight = window.innerHeight;
let innerWidth = window.innerWidth;

window.addEventListener('resize', ev => {
    innerHeight = ev.target.innerHeight;
    innerWidth = ev.target.innerWidth;
    m.redraw();
});

let gameWidth = 12;

const type = Object.freeze(Object.assign({}, {
    UNKNOWN: 0,
    WATER: 1,
    SHIP_UNKNOWN: 2,
    SHIP_MIDDLE: 3,
    SHIP_NORTH_END: 4,
    SHIP_WEST_END: 5,
    SHIP_SOUTH_END: 6,
    SHIP_EAST_END: 7
}));

let gameModel = width => {
    let cb = null;
    let hintsRow = fn.range(0, width).map(l => 0);
    let hintsColumn = fn.range(0, width).map(l => 0);
    let field = fn.range(0, width).
    map(k => fn.range(0, width).map(l => type.UNKNOWN));
    let ships = [4, 5];

    return {
        hintAt: (r, c) => {
            return r === 0 ? hintsRow[c - 1] : hintsColumn[r - 1];
        },
        setHintAt: (r, c, v) => {
            if (r === 0) hintsRow[c - 1] = v;
            else hintsColumn[r - 1] = v;
            cb && cb();
        },
        fieldAt: (r, c) => field[r][c],
        setFieldAt: (r, c, v) => {
            field[r][c] = v;
            cb && cb();
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
        ships: () => ships,
        width: () => width,
        setChangeCallback: f => cb = f,
        data: () => {
            return {
                hintsRow,
                hintsColumn,
                width,
                field,
                ships
            }
        },
        fromData: (d) => {
            hintsRow = d.hintsRow;
            hintsColumn = d.hintsColumn;
            width = d.width;
            field = d.field;
            ships = d.ships;
        }
    }
}

let g = gameModel(gameWidth);

let history = stack(g.data());
g.setChangeCallback(() => history.push(g.data()));

class GameField {
    view(vnode) {
        let w = g.width() + 1;
        return div.gamefield([
            fn.range(0, w * w).
            map(l => {
                return {
                    x: Math.floor(l / w),
                    y: l % w
                };
            }).
            map(l => l.x !== 0 || l.y !== 0 ? (
                l.x === 0 || l.y === 0 ?
                input.box.input({
                    value: g.hintAt(l.y, l.x),
                    oninput: m.withAttr('value', (v) => g.setHintAt(l.y, l.x, v))
                }) :
                (g.fieldAt(l.y - 1, l.x - 1) === type.UNKNOWN ?
                    div.box.empty({
                        onclick: () => g.setFieldAt(l.y - 1, l.x - 1, type.WATER)
                    }) :
                    g.fieldAt(l.y - 1, l.x - 1) === type.WATER ?
                    div.box.water({
                        onclick: () => g.setFieldAt(l.y - 1, l.x - 1, type.SHIP_UNKNOWN)
                    }) :
                    div.box['ship-' + g.fieldAt(l.y - 1, l.x - 1)]({
                        onclick: () => g.setFieldAt(l.y - 1, l.x - 1, (g.fieldAt(l.y - 1, l.x - 1) + 1) % 8)
                    }, ''))
            ) : history.dirty() ? button.box.empty({
                onclick: () => g.fromData(history.pop())
            }, '⬅️') : div.box.empty())
        ]);
    }
}

class Ships {
    view(vnode) {
        return [
            div.ships([
                g.ships().map((shipSize, shipIdx) =>
                    div.ship({
                        key: shipIdx
                    }, [
                        button.shipcell.shipcellfirst({
                            onclick: () => (shipSize - 1 >= 2 ? g.setShip(shipIdx, shipSize - 1) :
                                g.removeShip(shipIdx))
                        }, '-'),
                        fn.range(0, shipSize - 2)
                        .map(i =>
                            div.shipcell({
                                key: i
                            })
                        ),
                        button.shipcell.shipcelllast({
                            onclick: () => g.setShip(shipIdx, shipSize + 1)
                        }, '+')
                    ])),
                button.box.empty({
                    onclick: () => g.addShip()
                }, '+')
            ])
        ]
    }
}


export default class ShipsView {
    view(vnode) {
        return div.container([
            m('h1', 'Ships'),
            div.maingrid([
                m(GameField),
                m(Ships)
            ]),
            JSON.stringify(g.ships())

        ]);
    }
}