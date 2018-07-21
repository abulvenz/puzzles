import m from 'mithril';
import _ from 'underscore';

let n = {
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};
let results__ = [66, 13, 60, 3, 72, 30];
let results = [6, 15, 24, 12, 15, 18];

let times_ = (a, b) => a * b;
let minus_ = (a, b) => a - b;
let add___ = (a, b) => a + b;
let div___ = (a, b) => a / b;

let id = a => a;
let union = (...a) => [...a];

let peek = a => {
    // console.log(a);
    return a;
}

var range = (startInclusive, endExclusive) => {
    let result = [];
    for (let i = startInclusive; i < endExclusive; i++) {
        result.push(i);
    }
    return result;
};

let fs____ = [
    [times_, minus_],
    [times_, minus_],
    [times_, times_],
    [minus_, times_],
    [times_, times_],
    [times_, times_]
];
let fs = [
    [add___, add___],
    [add___, add___],
    [add___, add___],
    [add___, add___],
    [add___, add___],
    [add___, add___]
];
let empty = '';
let equals = '=';
let times = 'x';
let minus = '-';

let createEquation = (f, r) => n => {
    //  console.log('create', f, r, n)
    return f[1](f[0](n[0], n[1]), n[2]) - r
};

const split = (arr, n) => {
    let result = [];
    do {
        result.push(_.first(arr, n));
    } while ((arr = _.rest(arr, n)).length >= n);
    return result;
};

var zipWith = (fn, ...arrs) => {
    return range(0, Math.min(...arrs.map(arr => arr.length))).
    map(i => fn(...(arrs.map(arr => arr[i]))));
};

const transpose = (...arrOArrs) => zipWith(union, ...arrOArrs);

console.log(transpose([0, 1], [2, 3]))

//console.log('tr', transpose(...split(numbers, 3)));
//console.log('id', split(numbers, 3));

// let equations_ = numbers => [union, transpose].map(tr => tr(numbers));

let on = (fns, arr) => fns.map((f, idx) => {
    //    console.log('on', f, arr[idx]);
    return f(arr[idx]);
});

let equations = ()=> fs
    .map((f, idx) => createEquation(f, results[idx]))


let splitter = numbers => [...split(numbers, 3), ...transpose(...split(numbers, 3))]

const test_ = numbers => on(equations(), splitter(numbers).map(peek)).map(peek).every(e => e === 0);

//console.log(test_(equations)([1, 2, 3, 4, 5, 6, 7, 8, 9]));

const test = numbers =>
    equations().every(equation => equation(numbers) === 0);

const permute = permutation => {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1,
        k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

//console.log(permute(numbers))

//console.log(numbers = permute(numbers).filter(test_)[0]);

const functions = [{
        text: '+',
        f: add___
    },
    {
        text: '-',
        f: minus_
    },
    {
        text: 'x',
        f: times_
    },
    {
        text: '/',
        f: div___
    }
];

const findSolution = () => permute([1,2,3,4,5,6,7,8,9])
    .filter(test_)
    [0];


const fn2str = (f) => functions.filter(fn => fn.f === f)[0].text;

console.log(fields)

let getNumber = idx => n.numbers[idx];

let setNumbers = num => n.numbers = num;

class NumberView {
    view(vnode) {
        console.log(vnode.attrs)
        return m('span', getNumber(vnode.attrs.idx));
    }
}

class ResultInput {
    view(vnode) {
        return m('input[type=number,max=720]', {
            oninput: e => console.log(results[vnode.attrs.idx] =  Number( e.target.value)),
            value: results[vnode.attrs.idx],
            style: 'width:30px'
        });
    }
}

class FunctionChooser {
    view(vnode) {
        return m('select', {
            onchange: (e) => fs[vnode.attrs.eq][vnode.attrs.idx] = functions.filter(f => e.target.value === f.text)[0].f,
            value: functions.filter(f => f.f === fs[vnode.attrs.eq][vnode.attrs.idx])[0].text
        }, functions.map(f => m('option', f.text)))
    }
}

let fields = [
    [
        m(NumberView, {
            idx: 0,
            n: n.numbers
        }),
        m(FunctionChooser, {
            eq: 0,
            idx: 0
        }), m(NumberView, {
            idx: 1
        }),
        m(FunctionChooser, {
            eq: 0,
            idx: 1
        }), m(NumberView, {
            idx: 2
        }), '=', m(ResultInput, {
            idx: 0
        })
    ],
    [
        m(FunctionChooser, {
            eq: 3,
            idx: 0
        }), empty, m(FunctionChooser, {
            eq: 4,
            idx: 0
        }), empty, m(FunctionChooser, {
            eq: 5,
            idx: 0
        }), empty, empty
    ],
    [m(NumberView, {
            idx: 3
        }),
        m(FunctionChooser, {
            eq: 1,
            idx: 0
        }), m(NumberView, {
            idx: 4
        }),
        m(FunctionChooser, {
            eq: 1,
            idx: 1
        }), m(NumberView, {
            idx: 5
        }), equals, m(ResultInput, {
            idx: 1
        })
    ],
    [
        m(FunctionChooser, {
            eq: 3,
            idx: 1
        }), empty,
        m(FunctionChooser, {
            eq: 4,
            idx: 1
        }), empty,
        m(FunctionChooser, {
            eq: 5,
            idx: 1
        }), empty, empty
    ],
    [m(NumberView, {
        idx: 6
    }), m(FunctionChooser, {
        eq: 2,
        idx: 0
    }), m(NumberView, {
        idx: 7
    }), m(FunctionChooser, {
        eq: 2,
        idx: 1
    }), m(NumberView, {
        idx: 8
    }), equals, m(ResultInput, {
        idx: 2
    })],
    [equals, empty, equals, empty, equals, empty, empty],
    [m(ResultInput, {
        idx: 3
    }), empty, m(ResultInput, {
        idx: 4
    }), empty, m(ResultInput, {
        idx: 5
    }), empty, m('button', {
        onclick: () => {
            console.log(setNumbers(
                _.flatten(permute([1, 2, 3, 4, 5, 6, 7, 8, 9]).filter(test_)[0])
                //     [1,2,3,4,5,6,7,8,9]
            ));
            m.redraw()
        }
    }, 'go')]
];

export default class ComputeSquare {
    view(vnode) {
        return m('.container',
            m('table',
                fields.map(
                    row => m('tr', {
                            style: "height:20px"
                        },
                        row.map(col => m('td', {
                            style: "padding:3px;border-width:1px;border-color:black;border-style:solid;width:20px;"
                        }, col))
                    )

                )

            ),
            m('pre', JSON.stringify(results)),
            m('pre', JSON.stringify(n.numbers)),
            m('pre', JSON.stringify(_.flatten(fs).map(fn2str)))

            //     m('pre', JSON.stringify(numbers))
        );
    }
};