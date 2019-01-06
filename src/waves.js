"use strict";

import m from 'mithril';
import fn from './fn';
import tagl from './tagl';


const camelToHyphen = s =>
    s.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

const tagl_hyperscript = tagl(function (tagName, classes, ...args) {
    let cls = classes
        .map(camelToHyphen)
        .join('.');
    return m([tagName, cls].join('.').replace('.$', '#'), ...args);
});

const {
    div,
    svg,
    input,
    button,
    polygon,
    polyline,
    rect,
    circle,
    g,
    foreignObject,
    body,
    pre,
    text,
    textarea
} = tagl_hyperscript;


let xres = 60;
let yres = Math.round(xres / innerWidth * innerHeight);

yres += yres % 2;

let time = 0;

setInterval(() => {
    time += 0.05;
   // console.log(velocity)
    m.redraw();
}, 50);

let evilGuy = {
    x: xres / 2,
    y: yres / 2
};

let player = {
    x: 0,
    y: 0
};

let velocity = 85;

const color = (x, y) => {
    if (x === player.x && y === player.y)
        return `rgba(255,255,255,1)`;
    if (x === evilGuy.x && y === evilGuy.y)
        return `rgba(255,255,0,1)`;

    let dx = player.x - evilGuy.x;
    let dy = player.y - evilGuy.y;

    let d1 = Math.sqrt(Math.pow(x - evilGuy.x, 2) + Math.pow(y - evilGuy.y, 2))
    let d2 = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2))

    let f1 = 0.25 * (Math.sin(-d1 - time * velocity)) + 0.5;
    let f2 = -0.25 * (Math.sin(-d2 - time * velocity)) + 0.5;
    //   let f1 = 0.5*(Math.sin(evilGuy.x+x)+Math.sin(time) + Math.cos(evilGuy.y+y)+Math.cos(time));
    //   let f2 = -0.5*(Math.sin(player.x+x)+Math.sin(time) + Math.cos(player.y+y)+Math.cos(time));

    return `rgba(${(f1+f2)*255},${Math.cos(f1+f2)*255},150,1)`;
};

export default {
    view(vnode) {
        return [svg.debug({
                width: innerWidth,
                height: innerHeight,
                style: 'background-color:black',
                onmousemove: e => {
                    player.x = Math.round(e.clientX / innerWidth * xres);
                    player.y = Math.round(e.clientY / innerHeight * yres);
                }
            },
            fn.range(0, xres).map(x =>
                fn.range(0, yres).map(y => rect.debug({
                    x: x * innerWidth / xres,
                    y: y * innerHeight / yres,
                    width: innerWidth / xres,
                    height: innerHeight / yres,
                    //      stroke:'red',
                    fill: color(x, y)
                }))
            )
        ), input({
            type: 'range',
            min:0,
            max:200,
            oninput:  m.withAttr('value', v => velocity = v),
            onchange:  m.withAttr('value', v => velocity = v)
        })];
    }
};