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

var fac = (n) => {
    let p = 1;
    for (let i = 1; i <= n; i++)
        p *= i;
    return p;
};

var binaryFunctions = [
    {
        name: '+',
        fcn: (x, y) => x + y,
        wrap: (x, y) => '(' + x + ' + ' + y + ')',
        inv: (x, y) => x - y,
        active: true
    }, {
        name: '-',
        fcn: (x, y) => x - y,
        wrap: (x, y) => '(' + x + ' - ' + y + ')',
        inv: (x, y) => x + y,
        active: true
    }, {
        name: '*',
        fcn: (x, y) => x * y,
        wrap: (x, y) => '(' + x + ' * ' + y + ')',
        inv: (x, y) => x / y,
        active: true
    }, {
        name: '/',
        fcn: (x, y) => x / y,
        wrap: (x, y) => '(' + x + ' / ' + y + ')',
        inv: (x, y) => x * y,
        active: true
    }, {
        name: '**',
        fcn: (x, y) => Math.pow(x, y),
        wrap: (x, y) => '(' + x + ' ** ' + y + ')',
        inv: (x, y) => Math.pow(x, 1 / y),
        active: true
    }, {
        name: '**1/',
        fcn: (x, y) => Math.pow(x, 1 / y),
        wrap: (x, y) => '(' + x + ' **1/ ' + y + ')',
        inv: (x, y) => Math.pow(x, y),
        active: false
    }, {
        name: 'mean',
        fcn: (x, y) => (x + y) / 2.,
        wrap: (x, y) => 'mean(' + x + ' , ' + y + ')',
        inv: (x, y) => Math.pow(x, y),
        active: false
    }, {
        name: 'over',
        fcn: (x, y) => fac(x) / fac(y) / fac(x - y),
        wrap: (x, y) => '(' + x + ' over ' + y + ')',
        inv: (x, y) => Math.pow(x, y),
        active: false
    }, {
        name: 'places',
        fcn: (x, y) => x * 10 + y,
        wrap: (x, y) => 'str(\'' + x + '\', \'' + y + '\')',
        inv: (x, y) => null,
        active: false
    }
];

var unaryFunctions = [
    {
        name: 'id',
        fcn: x => x,
        wrap: x => x,
        active: true
    }, {
        name: '-',
        fcn: x => -x,
        wrap: x => '-' + x,
        active: false
    }, {
        name: '1/',
        fcn: x => 1 / x,
        wrap: x => '(1 / ' + x + ')',
        active: false
    }, {
        name: 'fac',
        fcn: x => x < 10 && x > 1 ? fac(x) : x,
        wrap: x => x < 10 && x > 1 ? '!(' + x + ')' : x,
        active: false
    }, {
        name: 'round',
        fcn: x => Math.round(x),
        wrap: x => '~(' + x + ')',
        active: false
    }, {
        name: 'floor',
        fcn: x => Math.floor(x),
        wrap: x => Math.floor(x) !== x ? '~>(' + x + ')' : x,
        active: false
    }, {
        name: 'ceil',
        fcn: x => Math.ceil(x),
        wrap: x => Math.ceil(x) !== x ? '~<(' + x + ')' : x,
        active: false
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

var special_permut = a => {
    var result = [];
    a.forEach((e, idx) => {
        let c = a.slice();
        c.splice(idx, 1);
        result.push(_.flatten([e, c]));
    });
    return result;
};

var no_permut = a => [a];

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

var bifcn = t => (a, b) => {
    return {
        name: () => t.name,
        wrap: () => t.wrap(a.wrap(), b.wrap()),
        fcn: () => t.fcn(a.fcn(), b.fcn())
    };
};

var unfcn = t => (a) => {
    return {
        name: () => t.name,
        wrap: () => t.wrap(a.wrap()),
        fcn: () => t.fcn(a.fcn())
    };
};

var nofcn = (val) => {
    return {
        name: () => 'value (' + val + ')',
        wrap: () => val,
        fcn: () => val
    };
};

var pattern1 = (b1, b2, u1, u2, u3, u4, u5, v1, v2, v3) => {
    return u1(b1(u2(v1), u3(b2(u4(v2), u5(v3)))));
}

var pattern2 = (b1, b2, u1, u2, u3, u4, u5, v1, v2, v3) => {
    return u1(b1(u3(b2(u4(v2), u5(v3))), u2(v1)));
}

var solve = (numbers) => {
    var bifcns = binaryFunctions.filter(f => f.active).map(bifcn);
    var unfcns = unaryFunctions.filter(f => f.active).map(unfcn);
    var noops = numbers.map(nofcn);
    var unops = getFive(unfcns);
    var biops = getTwo(bifcns);
    var nums = special_permut(noops);
    var comps = [pattern1, pattern2];
    simplesolution = [];
    closest = [];
    let ncomb = nums.length * unops.length * biops.length * comps.length;
    console.log('testing', ncomb, 'combinations')
    nums.forEach(num => {
        unops.forEach(unop => {
            biops.forEach(biop => {
                comps.forEach(comp => {
                    let finalF = comp(...biop, ...unop, ...num);
                    if (finalF.fcn() === targetNumber) {
                        simplesolution.push(finalF.wrap());
                    } else {
                        closest.push({ diff: Math.abs(targetNumber - finalF.fcn()), text: finalF.wrap() });
                    }
                });
            });
        });
    });
    closest = _.sortBy(closest, 'diff');
};

class DiceInput {
    constructor(vnode) {
        this.numbers = [1, 2, 3, 4, 5, 6];
    }
    view(vnode) {
        return m('table', m('tr',
            _.map(this.numbers, n => m('td', m('button.btn.btn-default', {
                style: (_.find(inputs, i => i.key === vnode.attrs.key).number === n) ?
                    'background-color:red' : '',
                onclick: vnode.attrs.onchange(n)
            },
                n))))
        );
    }
}

var setInput = inputNumber => selectedNumber => () => {
    _.find(inputs, i => i.key === inputNumber).number = selectedNumber;
    solve(_.pluck(inputs, 'number'));
};

class BiFuncView {
    view(vnode) {
        return [m('input[type=checkbox]', {
            checked: vnode.attrs.fn.active,
            onchange: e => vnode.attrs.fn.active = e.target.checked
        }
        ), vnode.attrs.fn.name];
    }
}

export default class Router {
    view(vnode) {
        return m('.container', [
            m('h1', '15-15-15-15'),
            m('h3', 'binary'),
            m('.row', [
                binaryFunctions.map(bifn => m('.col-md-2.col-xs-2', m(BiFuncView, { fn: bifn }))),
            ]),
            m('h3', 'unary'),
            m('.row', [
                unaryFunctions.map(bifn => m('.col-md-2.col-xs-2', m(BiFuncView, { fn: bifn })))
            ]),
            m('h3', 'Dice'),
            _.map(inputs, i => [
                m(DiceInput, {
                    key: i.key,
                    number: i.number,
                    onchange: setInput(i.key)
                })
            ]),
            m('br'),
            simplesolution.map(solution => m('pre', solution)),
            m('hr'),
            _.first(closest, 30).map(solution => m('pre', JSON.stringify(solution.diff) + ': ' + JSON.stringify(solution.text)))
        ]);
    }
}
