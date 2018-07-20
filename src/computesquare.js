import m from 'mithril';


let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let results = [66, 13, 60, 3, 72, 30];

let times_ = (a, b) => a * b;
let minus_ = (a, b) => a - b;

let fs = [
    [times_, minus_],
    [times_, minus_],
    [times_, times_],
    [minus_, times_],
    [times_, times_],
    [times_, times_]
];

let empty = '';
let equals = '=';
let times = 'x';
let minus = '-';

let createEquation = (f1, f2, n1, n2, n3, r) => f2(f1(n1, n2), n3) - r;

let equations = [
    numbers => fs[0][1](fs[0][0](numbers[0], numbers[1]), numbers[2]) - results[0],
    numbers => fs[1][1](fs[1][0](numbers[3], numbers[4]), numbers[5]) - results[1],
    numbers => fs[2][1](fs[2][0](numbers[6], numbers[7]), numbers[8]) - results[2],
    numbers => fs[3][1](fs[3][0](numbers[0], numbers[3]), numbers[6]) - results[3],
    numbers => fs[4][1](fs[4][0](numbers[1], numbers[4]), numbers[7]) - results[4],
    numbers => fs[5][1](fs[5][0](numbers[2], numbers[5]), numbers[8]) - results[5]
];

const test = numbers =>
    equations.every(equation => equation(numbers) === 0);

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

console.log(permute(numbers))
console.log(numbers = permute(numbers).filter(test)[0]);

let A = numbers[0];
let B = numbers[1];
let C = numbers[2];
let D = numbers[3];
let E = numbers[4];
let F = numbers[5];
let G = numbers[6];
let H = numbers[7];
let I = numbers[8];

let op1 = times;
let op2 = minus;
let op3 = times;
let op4 = minus;
let op5 = times;
let op6 = times;

let ops1 = minus;
let ops2 = times;
let ops3 = times;
let ops4 = times;
let ops5 = times;
let ops6 = times;

let R1 = 66;
let R2 = 13;
let R3 = 60;
let R4 = 3;
let R5 = 72;
let R6 = 30;


let fields = [
    [A, op1, B, op2, C, equals, R1],
    [ops1, empty, ops2, empty, ops3, empty, empty],
    [D, op3, E, op4, F, equals, R2],
    [ops4, empty, ops5, empty, ops6, empty, empty],
    [G, op5, H, op6, I, equals, R3],
    [equals, empty, equals, empty, equals, empty, empty],
    [R4, empty, R5, empty, R6, empty, empty]
];

console.log(fields)

let fac = n => n === 1 ? 1 : n * fac(n - 1)

console.log(fac(9))

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
            )
        );
    }
};