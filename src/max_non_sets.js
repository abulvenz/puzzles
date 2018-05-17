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

var farben = [1, 2, 3];
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
    for (let p in k1) {
        if (!setCondition(..._.pluck([k1, k2, k3], p)))
            return false;
    }
    return true;
};

var createCards = () => {
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
    /*
    karten = [];
    
    // Grün
    // Eckig
    karten.push(karte(2,2,2,1));
    karten.push(karte(2,2,2,2));
    karten.push(karte(2,2,1,1));
    karten.push(karte(2,2,1,2));
    
    // Rund
    karten.push(karte(2,1,2,3));
    karten.push(karte(2,1,3,3));
    
    // Schwänzchen
    karten.push(karte(2,3,3,3));
    karten.push(karte(2,3,1,2));
    karten.push(karte(2,3,1,1));
    
    // Rot
    // Rund
    karten.push(karte(1,1,1,1));
    karten.push(karte(1,1,1,2));
    karten.push(karte(1,1,3,3));
    
    // Eckig
    karten.push(karte(1,2,2,1));
    karten.push(karte(1,2,2,2));
    karten.push(karte(1,2,1,1));
    karten.push(karte(1,2,1,2));
    
    // Schwänzchen
    karten.push(karte(1,3,3,3));
    karten.push(karte(1,3,2,3));
    
    // Lila
    karten.push(karte(3,3,2,3));
    karten.push(karte(3,1,2,3));
    
    */
    return karten;
};

var getSets = (kartenMenge) => {
    let sets = [];
    var combis = getThree(kartenMenge);
    combis.forEach(combi => {
        if (isSet(...combi)) {
            sets.push(combi);
        }
    });
    return sets;
}

var equal = (k1, k2) => {
    return k1.form === k2.form &&
        k1.farbe === k2.farbe &&
        k1.anzahl === k2.anzahl &&
        k1.muster === k2.muster;
}



var drawKart = () => {
    if (karten.length > 0) {
        var idx = Math.random() * karten.length;
        aufDemTisch.push(karten.splice(idx, 1)[0]);
    }
}

var cardToString = (card) => {
    return '' + card.farbe + card.form + card.muster + card.anzahl;
}

var countCardsInSets = (sets) => {
    let map = {};
    sets.forEach(set => {
        set.forEach(card => {
            let key = cardToString(card);
            if (!_.has(map, key)) {
                map[key] = {
                    count: 0,
                    card: card
                };
            }
            map[key].count++;
        });
    });
    let cardCountInSet = [];

    for (let prop in map) {
        cardCountInSet.push(map[prop]);
    }
    return cardCountInSet;
};

var f = () => { 
for (let k = 0; k < 50; k++) {

    var karten = createCards();

    var sorted = [];
    var aufDemTisch = [];
    for (let i = 0; i < 81; i++) {
        drawKart();
    }

    while (true) {
        let sets = getSets(aufDemTisch);
        if (sets.length === 0)
            break;
        var cardCountInSet = countCardsInSets(sets);
        sorted = _.sortBy(cardCountInSet, 'count');
        var idx = Math.floor(Math.random() * sorted.length);
        aufDemTisch = _.filter(aufDemTisch, card => {
            return !equal(card, sorted[idx].card);
        });
    }

    console.log('aufDemTisch', aufDemTisch.length);
}
}

export default class SetFragment {
    view(vnode) {
        return m('h1', 'SetFragment')
    }
}