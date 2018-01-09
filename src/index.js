import m from 'mithril';
import * as d1 from './index.1';
import * as d2 from './index.2';
import * as d3 from './index.3';
import * as d4 from './index.4';
import * as d5 from './index.5';
import * as d6 from './index.6';
import * as d7 from './index.7';

var links = [
    {
        link: '/queens',
        text: 'Queens',
        component: d6.default
    }, /*{
        link: '/15',
        text: '15',
        component: d1.default
    },*/ {
        link: '/15',
        text: '15',
        component: d2.default
    },{
        link: '/set',
        text: 'Set',
        component: d3.default
    }, {
        link: '/todo',
        text: 'Todo',
        component: d5.default
    }, {
        link: '/blackbox',
        text: 'Blackbox',
        component: d7.default
    }
];

class Router {
    oncreate(vnode) {
        m.route(vnode.dom, '/queens',
            links.reduce((acc, { link, component }) => {
                acc[link] = component;
                return acc;
            }, {})
        );
    }
    view(vnode) {
        return m('');
    }
}

class Navbar {
    view(vnode) {
        return m("nav.navbar.navbar-default",
            m(".container-fluid",
                m(".navbar-header",
                    m("ul.nav.navbar-nav", [
                        links.map(link =>
                            m("li",
                                m("a[href=#!" + link.link + "]",
                                    link.text
                                ))
                        )
                    ])
                )
            )
        )
    }
}

m.mount(document.body, { view: vnode => [m(Navbar), m(Router)] });