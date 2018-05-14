import m from 'mithril';

import fn from './fn'

const Ball = (r, c) => {
    return {
        pos: r + ', ' + c,
        getRow: () => r,
        getColumn: () => c,
        equal: (other) => other.getRow() === r && other.getColumn() === c
    };
};

const Point = Ball;

const Directions = {
    topToBottom: 'topToBottom',
    bottomToTop: 'bottomToTop',
    leftToRight: 'leftToRight',
    rightToLeft: 'rightToLeft'
};

const Direction = (value) => {
    const possibleDirections = [
        {
            name: Directions.topToBottom,
            dRow: 1,
            dColumn: 0,
            idx: 0
        }, {
            name: Directions.rightToLeft,
            dRow: 0,
            dColumn: -1,
            idx: 1
        }, {
            name: Directions.bottomToTop,
            dRow: -1,
            dColumn: 0,
            idx: 2
        }, {
            name: Directions.leftToRight,
            dRow: 0,
            dColumn: 1,
            idx: 3
        }
    ];
    let idx_ = possibleDirections.filter(d_ => d_.name === value)[0].idx;
    const createFromIdx = (idx) => {
        let d = () => possibleDirections[idx];
        return {
            name: () => d().name,
            turnLeft: () => createFromIdx((idx - 1) + (idx === 0 ? 4 : 0)),
            turnRight: () => createFromIdx((idx + 1) % 4),
            walk: ({ getRow, getColumn }) => Point(getRow() + d().dRow, getColumn() + d().dColumn)
        };
    }
    return createFromIdx(idx_);
}

const Field = () => {
    let size = 8;
    let min = 4;
    let max = 8;
    let balls = [];
    let placeBallRec = (balls_, count) => {
        let ball = Ball(Math.floor(Math.random() * size), Math.floor(Math.random() * size));
        return (count === 0) ? balls_ : balls_.
            filter(ballInside => ballInside.equal(ball)).
            length > 0 ? placeBallRec(balls_, count) : placeBallRec(fn.flatten([balls_, ball]), count - 1);
    };
    const hasBall = (ball) => !fn.isEmpty(balls.filter(ball.equal));
    const contains = ({ getRow, getColumn }) => getRow() >= 0 && getColumn() >= 0 && getRow() < size && getColumn() < size;
    const assume = (direction, position, steps = 0) => {
        var front = direction.walk(position);
        var frontLeft = direction.turnLeft().walk(front);
        var frontRight = direction.turnRight().walk(front);
        if (!contains(front))
            return steps;
        if (hasBall(front))
            return 'H';
        if (hasBall(frontLeft) && hasBall(frontRight))
            return 'R';
        if (hasBall(frontLeft)) {
            if (steps === 0)
                return 'R';
            return assume(direction.turnRight(), position, steps);
        }
        if (hasBall(frontRight)) {
            if (steps === 0)
                return 'R';
            return assume(direction.turnLeft(), position, steps);
        }
        return assume(direction, direction.walk(position), steps + 1);
    };
    return {
        getSize: () => size,
        getBalls: () => balls,
        hasBall: hasBall,
        placeBall: (ball) => {
            if (balls.filter(ball.equal).length > 0)
                balls = balls.filter(b => !ball.equal(b));
            else
                balls.push(ball);
        },
        contains: contains,
        placeBalls: () => {
            let ballCount = Math.floor((Math.random() * (max - min)) + min);
            balls = placeBallRec(balls, ballCount);
        },
        assume: assume
    };
};

let field = Field();
field.placeBalls();

let guessField = Field();

class HintView {
    constructor() {
        this.text = '';
    }
    view(vnode) {
        return m('td.bb-hint', {
            onclick: e => {
                this.text = field.assume(Direction(vnode.attrs.direction),
                    Point(vnode.attrs.start.row,
                    vnode.attrs.start.column),
                    );
            }
        }, this.text)
    }
}

class SlotView {
    view(vnode) {
        let p = Point(vnode.attrs.row,vnode.attrs.column);
        return m('td.bb' + (guessField.hasBall(p) ? '.bb-guess' : ''), {
            onclick: e => guessField.placeBall(p)
        }, guessField.hasBall(p) ? 'g' : '')
    }
}

class ColumnView {
    view(vnode) {
        return m('td.bb-empty', vnode.attrs, vnode.children);
    }
}

class RowView {
    view(vnode) {
        return m('tr', vnode.attrs, vnode.children);
    }
}

class FieldView {
    view(vnode) {
        let size = field.getSize();
        return m('table',
            m(RowView, [
                m(ColumnView),
                fn.range(0, size).map(i =>
                    m(ColumnView,
                        m(HintView, {
                            start: { row: -1, column: i },
                            direction: Directions.topToBottom
                        })
                    )
                )
            ]),
            fn.range(0, size).map((rowNumber) =>
                m(RowView, m(ColumnView, m(HintView, {
                    start: { row: rowNumber, column: -1 },
                    direction: Directions.leftToRight
                })),
                fn.range(0, size).map(column =>
                        m(ColumnView, m(SlotView, { row:rowNumber,column }))
                    ),
                    m(ColumnView, m(HintView, {
                        start: { row: rowNumber, column: size  },
                        direction: Directions.rightToLeft
                    }))
                )
            ),
            m(RowView, [
                m(ColumnView),
                fn.range(0, size).map(i =>
                    m(ColumnView,
                        m(HintView, {
                            start: { row: size , column: i },
                            direction: Directions.bottomToTop
                        })
                    )
                )
            ]),
        );
    }
}

export default class Comp {
    view(vnode) {
        return m('.container', m('h1', 'Blackbox ' + field.getSize() + 'x' + field.getSize()
        ),
            m('.form-group', m('input', { type: 'range', min: 4, max: 8, onchange: (ev) => setSize(ev.target.valueAsNumber) }))
            , m(FieldView, { field, size: 30 }))
    }
}