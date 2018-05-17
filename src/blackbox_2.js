import m from 'mithril';

import fn from './fn'

const directions = {
    topToBottom: {
        name: 'topToBottom',
        dRow: 1,
        dColumn: 0
    },
    bottomToTop: {
        name: 'bottomToTop',
        dRow: -1,
        dColumn: 0
    },
    leftToRight: {
        name: 'leftToRight',
        dRow: 0,
        dColumn: 1
    },
    rightToLeft: {
        name: 'rightToLeft',
        dRow: 0,
        dColumn: -1
    },
};

class Slot {
    constructor() {
        this.ball = false;
        this.guess = false;
        this.fixed = false;
    }
    isGuessed() {
        return this.guess;
    }
    occupied() {
        return this.ball;
    }
    addBall() {
        if (this.ball) return false;
        this.ball = true;
        return true;
    }
    toggleGuess() {
        this.guess = !this.guess;
    }
}

class Field {
    constructor(size, min, max) {
        this.size = size;
        this.rows = fn.range(0, size).map(i => fn.range(0, size).map(j => { return new Slot(); }));
        var numberOfBalls = Math.floor(Math.random() * (max - min) + min);
        var balls = fn.range(0, numberOfBalls);
        balls.forEach(ball => { while (!this.random().addBall()); })
    }
    random() {
        /**
         * e.g. rows=3 columns=8 -> 24 fields
         *      random=9 
         * => 9 / 8 = 1 remainder 1 => 1,1
         */
        let index = Math.floor(Math.random() * this.rows.length * this.rows[0].length);
        let row = Math.floor(index / this.rows[0].length);
        let column = index % this.rows[0].length;
        console.log(this.rows, row, column)
        return this.rows[row][column];
    }
    field(row, column) {
        return this.rows[row][column];
    }
    addBall(row, column) {
        return this.field(row, column).addBall();
    }
    occupied(row, column) {
        return field(row, column).occupied();
    }
}

var size = 8;
var min = 3;
var max = 5;
var field = new Field(size, min, max);

const hintCases = {
    reflection: (r, c, l) => {
        return {
            text: () => 'R'
        };
    },
    mirror: (r, c, l) => {
        return {
            text: () => 'H'
        }
    },
    wall: (r, c, l) => {
        return {
            text: () => l
        }
    },
    nothing: (r, c, l) => {
        return {
            text: () => ''
        }
    }
}

var leftNeighbour = (field, row, column, direction) => {
    switch (direction.name) {
        case directions.bottomToTop.name:
            return column - 1 < 0 ? undefined : field.field(row, column - 1);
        case directions.topToBottom.name:
            return column + 1 >= field.size ? undefined : field.field(row, column + 1);
        case directions.leftToRight.name:
            return row - 1 < 0 ? undefined : field.field(row - 1, column);
        case directions.rightToLeft.name:
            return row + 1 >= field.size ? undefined : field.field(row + 1, column);
        default:
            break;
    }
};

var rightNeighbour = (field, row, column, direction) => {
    switch (direction.name) {
        case directions.bottomToTop.name:
            return column + 1 < 0 ? undefined : field.field(row, column + 1);
        case directions.topToBottom.name:
            return column - 1 >= field.size ? undefined : field.field(row, column - 1);
        case directions.leftToRight.name:
            return row + 1 >= field.size ? undefined : field.field(row + 1, column);
        case directions.rightToLeft.name:
            return row - 1 < 0 ? undefined : field.field(row - 1, column);
        default:
            break;
    }
};

var turnRight = (direction) => {
    switch (direction.name) {
        case directions.bottomToTop.name:
            return directions.leftToRight;
        case directions.topToBottom.name:
            return directions.rightToLeft;
        case directions.leftToRight.name:
            return directions.topToBottom;
        case directions.rightToLeft.name:
            return directions.bottomToTop;
        default:
            break;
    }
};

var turnLeft = (direction) => {
    switch (direction.name) {
        case directions.bottomToTop.name:
            return directions.rightToLeft;
        case directions.topToBottom.name:
            return directions.leftToRight;
        case directions.leftToRight.name:
            return directions.bottomToTop;
        case directions.rightToLeft.name:
            return directions.topToBottom;
        default:
            break;
    }
};

var walk = (field, row, column, direction, length = 0) => {
    console.log('walk', row, column, direction.name)
    if (row < 0 || column < 0 || row >= field.rows.length || column >= field.rows[0].length) {
        console.log('wall')
        return hintCases.wall(row - direction.dRow, column - direction.dColumn, length - 1);
    }
    if (field.field(row, column).occupied()) {
        console.log('mirror')
        return hintCases.mirror(row, column, length);
    }
    var left = leftNeighbour(field, row, column, direction);
    var right = rightNeighbour(field, row, column, direction);
    if (left && left.occupied() && right && right.occupied()) {
        console.log('reflection')
        return hintCases.reflection(row, column, length);
    }
    if (left && left.occupied()) {
        if (length === 0) {
            console.log('reflection')
            return hintCases.reflection(row, column, length);
        }
        console.log('turnRight')
        return walk(field, row - direction.dRow, column - direction.dColumn, turnRight(direction), length);
    }
    if (right && right.occupied()) {
        if (length === 0) {
            console.log('reflection')
            return hintCases.reflection(row, column, length);
        }
        console.log('turnLeft')
        return walk(field, row - direction.dRow, column - direction.dColumn, turnLeft(direction), length);
    }
    console.log('jjust walk')
    return walk(field, row + direction.dRow, column + direction.dColumn, direction, length + 1);
};


var setSize = size_ => {
    size = size_;
    field = new Field(size, min, max);
}

class HintView {
    constructor() {
        this.text = '';
    }
    view(vnode) {
        return m('td.bb-hint', {
            onclick: e => {
                this.text = walk(field,
                    vnode.attrs.start.row,
                    vnode.attrs.start.column,
                    vnode.attrs.direction).text();
            }
        }, this.text)
    }
}

class SlotView {
    view(vnode) {
        return m('td.bb' + (vnode.attrs.field.isGuessed() ? '.bb-guess' : ''), {
            onclick: e => vnode.attrs.field.toggleGuess()
        }, vnode.attrs.field.occupied() ? '' : '', vnode.attrs.field.isGuessed() ? 'g' : '')
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
        return m('table',
            m(RowView, [
                m(ColumnView),
                fn.range(0, size).map(i =>
                    m(ColumnView,
                        m(HintView, {
                            start: { row: 0, column: i },
                            direction: directions.topToBottom
                        })
                    )
                )
            ]),
            vnode.attrs.field.rows.map((row, rowNumber) =>
                m(RowView, m(ColumnView, m(HintView, {
                    start: { row: rowNumber, column: 0 },
                    direction: directions.leftToRight
                })),
                    row.map(column =>
                        m(ColumnView, m(SlotView, { field: column }))
                    ),
                    m(ColumnView, m(HintView, {
                        start: { row: rowNumber, column: size - 1 },
                        direction: directions.rightToLeft
                    }))
                )
            ),
            m(RowView, [
                m(ColumnView),
                fn.range(0, size).map(i =>
                    m(ColumnView,
                        m(HintView, {
                            start: { row: size - 1, column: i },
                            direction: directions.bottomToTop
                        })
                    )
                )
            ]),
        );
    }
}

export default class Comp {
    view(vnode) {
        return m('.container', m('h1', 'Blackbox ' + size + 'x' + size
        ),
            m('.form-group', m('input', { type: 'range', min: 4, max: 8, onchange: (ev) => setSize(ev.target.valueAsNumber) }))
            , m(FieldView, { field, size: 30 }))
    }
}