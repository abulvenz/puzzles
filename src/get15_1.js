import m from 'mithril';
import _ from 'underscore';

var targetNumber = 15;

var inputs = [{
    key: 0,
    number: 1
}, {
    key: 1,
    number: 1
}, {
    key: 2,
    number: 1
}];

var fac = (n, s = 1) => (n <= 1) ? s : fac(n - 1, s * n);

var fcns = [
    {
        name: '+',
        fcn: (x, y) => x + y,
        wrap: (x, y) => '(' + x + ' + ' + y + ')',
        inv: (x, y) => x - y
    }, {
        name: '-',
        fcn: (x, y) => x - y,
        wrap: (x, y) => '(' + x + ' - ' + y + ')',
        inv: (x, y) => x + y
    }, {
        name: '*',
        fcn: (x, y) => x * y,
        wrap: (x, y) => '(' + x + ' * ' + y + ')',
        inv: (x, y) => x / y
    }, {
        name: '/',
        fcn: (x, y) => x / y,
        wrap: (x, y) => '(' + x + ' / ' + y + ')',
        inv: (x, y) => x * y
    }, {
        name: '**',
        fcn: (x, y) => Math.pow(x, y),
        wrap: (x, y) => '(' + x + ' ** ' + y + ')',
        inv: (x, y) => Math.pow(x, 1 / y)
    }, {
        name: '**1/',
        fcn: (x, y) => Math.pow(x, 1 / y),
        wrap: (x, y) => '(' + x + ' **1/ ' + y + ')',
        inv: (x, y) => Math.pow(x, y)
    }, {
        name: 'mean',
        fcn: (x, y) => (x + y) / 2,
        wrap: (x, y) => 'mean(' + x + ' , ' + y + ')',
        inv: (x, y) => Math.pow(x, y)
    }, {
        name: 'over',
        fcn: (x, y) => fac(x) / fac(y) / fac(x - y),
        wrap: (x, y) => '(' + x + ' over ' + y + ')',
        inv: (x, y) => Math.pow(x, y)
    }
];

var unaryFcns = [
    {
        name: 'id',
        fcn: x => x,
        wrap: x => x
    }
];

var permut = a => {
    if (a.length === 1)
        return a;
    var result = [];
    a.forEach((e, idx) => {
        let c = a.slice();
        c.splice(idx, 1);
        var r = permut(c);
        r.forEach(el => result.push(_.flatten([e, el])));
    });
    return result;
};

var getTwo = a => {
    var result = [];
    a.forEach(e1 => a.map(e2 => result.push([e1, e2])));
    return result;
};

var getThree = a => {
    var result = [];
    a.forEach(e1 => a.map(e2 => a.map(e3 => result.push([e1, e2, e3]))));
    return result;
};

var getFive = a => {
    var result = [];
    a.forEach(e1 =>
        a.map(e2 =>
            a.map(e3 =>
                a.map(e4 =>
                    a.map(e5 =>
                        result.push([e1, e2, e3, e4, e5]))))));
    return result;
};

var closest = [];
var simplesolution = [];

var solve_ = (numbers) => {
    var twoops = getTwo(fcns);
    var unopNum = getThree(unaryFcns);
    var unopFns = getTwo(unaryFcns);

    simplesolution = [];
    closest = [];
    var c = 0;
    permut(numbers).forEach(arr_ => {
        twoops.forEach(twoop => {
            unopNum.forEach(unop => {
                let arr = (fp) => arr_.map((e, idx) => unop[idx][fp](e));
                var a_bc = (f, g, fp) => (a0, a1, a2) => f[fp](a0[fp], g[fp](a1[fp], a2[fp]));
                var ab_c = (f, g, fp) => (a0, a1, a2) => f[fp](g[fp](a0[fp], a1[fp]), a2[fp]);
                var comps = [a_bc, ab_c];
                comps.forEach(comp => {
                    var evaluate = member => comp(...twoop, member)(...arr(member))
                    c++;
                    var stringResult = evaluate('wrap');
                    var result = evaluate('fcn');
                    if (result === targetNumber) {
                        simplesolution.push(stringResult);
                    } else {
                        closest.push({
                            diff: Math.abs(result - targetNumber),
                            text: stringResult
                        });
                    }
                });
            });
        });
    });
    closest = _.sortBy(closest, 'diff');
    console.log('tested',c,'combinations')

};


var solve = (numbers) => {
    var twoops = getTwo(fcns);
    var unops = getFive(unaryFcns);
    simplesolution = [];
    closest = [];
    var c = 0;

    permut(numbers).forEach(arr => {
        twoops.forEach(twoop => {
            var a_bc = (f, g, fp) => (a0, a1, a2) => f[fp](a0, g[fp](a1, a2));
            var ab_c = (f, g, fp) => (a0, a1, a2) => f[fp](g[fp](a0, a1), a2);
            var comps = [a_bc, ab_c];
            comps.forEach(comp => {
                c++;

                var result = comp(...twoop, 'fcn')(...arr);
                if (result === targetNumber) {
                    simplesolution.push(comp(...twoop, 'wrap')(...arr));
                } else {
                    closest.push({
                        diff: Math.abs(result - targetNumber),
                        text: comp(...twoop, 'wrap')(...arr)
                    });
                }
            });
        });
    });
    closest = _.sortBy(closest, 'diff');
    console.log('tested',c,'combinations')

};

class DiceInput {
    constructor(vnode) {
        this.numbers = [1, 2, 3, 4, 5, 6];
    }
    view(vnode) {
        return m('table', m('tr',
            _.map(this.numbers, n => m('td', m('button', {
                style: (_.find(inputs, i => i.key === vnode.attrs.key).number === n) ?
                    'background-color:red' : '',
                onclick: vnode.attrs.onchange(n)
            }, n))))
        );
    }
}

var setInput = inputNumber => selectedNumber => () => {
    _.find(inputs, i => i.key === inputNumber).number = selectedNumber;
    solve(_.pluck(inputs, 'number'));
};

function findSolution(target) {
    function find(current, history) {
        if (current == target)
            return history;
        else if (current > target)
            return null;
        else
            return find(current + 5, "(" + history + " + 5)") ||
                find(current * 3, "(" + history + " * 3)");
    }
    return find(1, "1");
}

export default class Router {
    view(vnode) {
        return [
            m('h1', '15-15-15-15'),
            _.map(inputs, i => [
                m(DiceInput, {
                    key: i.key,
                    number: i.number,
                    onchange: setInput(i.key)
                })
            ]),
            simplesolution.map(solution => m('pre', solution)),
            m('hr'),
            _.first(closest,30).map(solution => m('pre', JSON.stringify(solution.diff) + ': ' + JSON.stringify(solution.text)))
        ];
    }
}