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

var farben = ['ForestGreen', 'DarkViolet', 'OrangeRed'];
var formen = [1, 2, 3];
var musters = [1, 2, 3];
var anzahlen = [1, 2, 3];

var count = 0;

var karte = (farbe, form, muster, anzahl) => {
    return {
        farbe: farbe,
        form: form,
        muster: muster,
        anzahl: anzahl
    }
};

var getThree = a => {
    var result = [];
    if (a.length > 2) {
        for (let i = 0; i < a.length - 2; i++)
            for (let j = i + 1; j < a.length - 1; j++)
                for (let k = j + 1; k < a.length; k++)
                    result.push([a[i], a[j], a[k]]);
    }
    return result;
};

var setCondition = (f1, f2, f3) => {
    return ((f1 === f2) && (f1 === f3))
        || ((f1 !== f2) && (f1 !== f3) && (f2 !== f3));
};

var isSet = (k1, k2, k3) => {
    if (!(k1 && k2 && k3))
        return false;
    for (let p in k1) {
        if (!setCondition(..._.pluck([k1, k2, k3], p)))
            return false;
    }
    return true;
};

var karten = [];

farben.forEach(farbe => {
    formen.forEach(form => {
        musters.forEach(muster => {
            anzahlen.forEach(anzahl => {
                karten.push(karte(farbe, form, muster, anzahl));
            });
        });
    });
});

var aufDemTisch = [];
var sets = [];

var checkForSet = () => {
    sets = [];
    var combis = getThree(aufDemTisch);
    console.log('combis', combis);
    combis.forEach(combi => {
        if (isSet(...combi)) {
            sets.push(combi);
        }
    });
}


var drawKart = () => {
    if (karten.length > 0) {
        var idx = Math.random() * karten.length;
        aufDemTisch.push(karten.splice(idx, 1)[0]);
    }
    checkForSet();
}

console.log('count', karten);

var selectedKarten = [];

var equal = (k1, k2) => {
    return k1.form === k2.form &&
        k1.farbe === k2.farbe &&
        k1.anzahl === k2.anzahl &&
        k1.muster === k2.muster;

}

var select = (karte) => () => {
    if (_.contains(selectedKarten, karte)) {
        selectedKarten = _.filter(selectedKarten, (karteInSet) => !equal(karteInSet, karte));
    } else {
        selectedKarten.push(karte);
    }
    while (selectedKarten.length > 3)
        selectedKarten.splice(0, 1);
}

class Karte {
    view(vnode) {
        //  console.log(vnode.attrs.karte)
        return m('.col-md-1.col-xs-1' + (_.contains(selectedKarten, vnode.attrs.karte) ? '.debug' : ''), {
            style: 'height:120px;width:50px',
            onclick: select(vnode.attrs.karte)
        },
            m('.muster' + vnode.attrs.karte.muster + '.form' + vnode.attrs.karte.form, {
                style: 'height:' + (vnode.attrs.karte.anzahl * 30) + 'px;background-color:' + vnode.attrs.karte.farbe
            })
        );
    }
}

var removeSet = (set) => () => {
    aufDemTisch = _.filter(aufDemTisch, e => !_.contains(set, e));
    checkForSet();
}

var collapsed1 = true;
var collapsed2 = true;
var collapsed3 = true;

var setsOfPlayer1 = [];
var setsOfPlayer2 = [];

var set1 = () => {
    console.log('set1');
    if (isSet(...selectedKarten)) {
        removeSet(selectedKarten)();
        setsOfPlayer1.push(selectedKarten);
    }
    selectedKarten=[];
}

var set2 = () => {
    console.log('set1');
    if (isSet(...selectedKarten)) {
        removeSet(selectedKarten)();
        setsOfPlayer2.push(selectedKarten);
    }
    selectedKarten=[];
}

export default class Router {
    view(vnode) {
        return m('.container', [
            m('h1', 'Tisch ' + aufDemTisch.length),
            m('button.btn.btn-primary', { onclick: e => drawKart() }, 'Zieh'),
            m('button.btn.btn-success', { onclick: set1 }, 'Set Spieler 1'),
            m('button.btn.btn-success', { onclick: set2 }, 'Set Spieler 2'),
            m('.row', [
                aufDemTisch.map(k => m(Karte, { karte: k }))
            ]),
            m('hr'),
            m('h1', 'Sets auf dem Tisch: ' + sets.length+' ', m('button.btn.btn-primary', { onclick: () => collapsed1 = !collapsed1 }, 'Zeigen')),
            collapsed1 ? null : sets.map(set => m('.row', [set.map(k => m(Karte, { karte: k })), m('button.btn.btn-danger', { onclick: removeSet(set) }, '«'), m('hr')])),
            m('hr'),
            m('h1', 'Sets Player 1: ' + setsOfPlayer1.length+' ', m('button.btn.btn-primary', { onclick: () => collapsed2 = !collapsed2 }, 'Zeigen')),
            collapsed2 ? null : setsOfPlayer1.map(set => m('.row', [set.map(k => m(Karte, { karte: k })), m('hr')])),
            m('hr'),
            m('h1', 'Sets Player 2: ' + setsOfPlayer2.length+' ', m('button.btn.btn-primary', { onclick: () => collapsed3 = !collapsed3 }, 'Zeigen')),
            collapsed3 ? null : setsOfPlayer2.map(set => m('.row', [set.map(k => m(Karte, { karte: k })), m('hr')]))
        ]);
    }
}

