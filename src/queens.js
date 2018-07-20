import m from 'mithril';

var optional = (value) => {
    var isPresent = () => !!value;
    var map = fn => isPresent() ? optional(fn(value)) : optional(null);
    var ifPresent = fn => isPresent() ? fn(value) : null;
    return {
        isPresent,
        map,
        ifPresent
    };
};

var plus = (a, b) => a + b;

var range = (startInclusive, endExclusive) => {
    let result = [];
    for (let i = startInclusive; i < endExclusive; i++) {
        result.push(i);
    }
    return result;
};

var nFrom = (start, number) => {
    return range(start, start + number);
};

var interval = (startInclusive, endInclusive) => {
    return range(startInclusive, endInclusive + 1);
};

var zipWith = (fn, ...arrs) => {
    return range(0, Math.min(...arrs.map(arr => arr.length))).
    map(i => fn(...(arrs.map(arr => arr[i]))));
};

var tail = arr => {
    return arr[arr.length - 1];
}

var head = arr => {
    return arr[0];
}

var withoutLast = (arr = []) => {
    return arr.length > 1 ? arr.slice(0, arr.length - 1) : [];
}

var flatten = (arr, depth = 100) => {
    var merged = [];
    for (let step = 0; step < depth; step++) {
        if (merged.length === 0) {
            merged = arr.slice(0);
        }
        let l1 = merged.length;
        merged = [].concat.apply([], merged);
        let l2 = merged.length;
        if (l1 === l2)
            break;
    }
    return merged;
};

var testOk = () => {
    console.log('true?', okToAdd(1, id, []));
    console.log('false?', okToAdd(0, id, [0]));
    console.log('true?', okToAdd(1, id, [0]));
    console.log('true?', okToAdd(1, id, [0, 4, 2]));
    console.log('false?', okToAdd(2, succ, [0, 4, 3]));
    console.log('true?', okToAdd(3, succ, [0, 3, 2]));
    console.log('false?', okToAdd(3, pred, [0, 4, 2]));
    console.log('false?', okToAdd(1, succ, [0, 4, 2]));

    console.log('', zipWith((a, b) => a + b, ['a', 'b', 'c', 'd'], [1, 2, 3]));
    console.log('true?', nFrom(0, 8).length === 8);
    console.log('true?', interval(0, 3).length === range(0, 4).length);

    console.log(optional(null).map(e => plus(1, e)))
    optional('nullo').map(e => plus(1, e)).ifPresent(console.log)

    console.log('[0,0]?', flatten([0, 0]))
    console.log('[0,0]?', flatten([0, [0]]))
    console.log('[0,0]?', flatten([
        [0], 0
    ]))
    console.log('[0,0,0,0]?', flatten([0, [0, [0],
        [0]
    ]]))
    console.log('[0,0,[0],[0]]?', flatten([0, [0, [0],
        [0]
    ]], 1))
    console.log('[0,0,{help: "help"}]?', flatten([
        [0, 0], {
            help: "help"
        }
    ]))
}

var transpose = solution => {
    let transposed = [];
    solution.forEach((v, i) => {
        transposed[v] = i;
    });
    return transposed;
};

var flip = solution => {
    let flipped = [];
    solution.forEach((v, i) => flipped[i] = size_ - 1 - v);
    return flipped;
};

var flipY = solution => {
    let flipped = [];
    solution.forEach((v, i) => flipped[size_ - 1 - i] = v);
    return flipped;
};

var comp = (a, b) => {
    return a.every((v, i) => b[i] === v);
};




var foldLeft = (arr, start, fn) => {
    return arr.reduce(fn, start);
}
var foldRight = (arr, start, fn) => {
    return arr.reverse().reduce(fn, start);
}

var and = (acc, curr) => acc && curr;

var id = n => n;
var succ = n => n + 1;
var pred = n => n - 1;

var directions = [id, succ, pred];

// 
var okToAdd = (pos, walk, partialSolution) => {
    return partialSolution.length === 0 ?
        true :
        (tail(partialSolution) === walk(pos)) ?
        false :
        okToAdd(walk(pos), walk, withoutLast(partialSolution));
};

var fieldOk = (pos, partialSolution = []) => {
    return directions
        .map(d => okToAdd(pos, d, partialSolution))
        .reduce(and, true);
};

// Given one partial solution returns a list of all
// extended solutions of the partial one.
var extendSolution = (partialSolution = [], size = 8) => {
    return range(0, size).
    filter(newField => fieldOk(newField, partialSolution)).
    map(newField => partialSolution.concat(newField));
};

// 
var allSolutions = (size = 8, solutions = [
    []
]) => {
    return (solutions.length > 0 && solutions[0].length === size) ?
        solutions :
        allSolutions(size, flatten(solutions.map(solution => extendSolution(solution, size)), 1));
};

var size_ = 8;

var setSize = (size) => {
    size_ = size;
    solutions = allSolutions(size_);
    console.log('size', size)
}

var solutions = allSolutions(size_);


let solutions_ = [];

let pipe = (fns, obj) => {
    let r = obj;
    fns.map(f => {
        r = f(r);
    })
    return r;
};


const sym = [
    [id],
    [transpose],
    [flip],
    [transpose, flip],
    [flipY],
    [transpose, flipY],
    [flip, flipY],
    [transpose, flip, flipY]
];
let symmetrics = (solution) => sym
    .map(s => pipe(s, solution));

solutions.forEach(solution => {

        let differentFromAllExisting = solutions_.map(exsol => symmetrics(exsol)
            .every(symsol => !comp(symsol, solution))).every(b => b === true);

        if (differentFromAllExisting)
            solutions_.push(solution);

        console.log(differentFromAllExisting, 'different');
        //	
    }

);


console.log('length', solutions_.length);

class SolutionView {
    view(vnode) {
        console.log('vnode.dom', this.dom)
        return m('table', range(0, size_).map(row => m('tr', range(0, size_).map(column => m('td', {
            style: 'border-style:solid; border-width:1px;border-color:lightgray;height:' + vnode.attrs.size + 'px;width:' + vnode.attrs.size + 'px;' + [
                `background-color:red;
                    -webkit-border-radius: ${vnode.attrs.size / 2}px;
                    -moz-border-radius: ${vnode.attrs.size / 2}px;
                    border-radius: ${vnode.attrs.size / 2}px;`,
                'background-color:white',
                'background-color:black'
            ][
                vnode.attrs.solution[row] === column ? 0 : ((row + column) % 2) ? 1 : 2
            ]
        }, ' ')))));
    }
}

export default class Comp {
    view(vnode) {
        return m('.container', m('h1', 'Queens ' + size_ + 'x' + size_ + ' has ' + solutions.length + ' solutions'),
            m('.form-group', m('input', {
                type: 'range',
                min: 4,
                max: 8,
                onchange: (ev) => setSize(ev.target.valueAsNumber)
            })), m('.row', [
                solutions.map(solution => m('.col-md-4.col-xs-12', {
                    style: 'margin-bottom:40px'
                }, m(SolutionView, {
                    solution,
                    size: 30
                })))
            ]))
    }
}