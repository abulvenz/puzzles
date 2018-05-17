import m from 'mithril';
import * as get15_1 from './get15_1';
import * as get15_2 from './get15_2';
import * as set from './set';
import * as max_non_sets from './max_non_sets';
import * as todo from './todo';
import * as queens from './queens';
import * as blackbox from './blackbox';
import * as dragdrop from './dragdrop';
    

var links = [
    {
        link: '/queens',
        text: 'Queens',
        component: queens.default
    }, /*{
        link: '/15',
        text: '15',
        component: get15_1.default
    },*/ {
        link: '/15',
        text: '15',
        component: get15_2.default
    },{
        link: '/set',
        text: 'Set',
        component: set.default
    }, {
        link: '/todo',
        text: 'Todo',
        component: todo.default
    }, {
        link: '/blackbox',
        text: 'Blackbox',
        component: blackbox.default
    }, {
        link: '/dragndrop',
        text: 'DragNDrop',
        component: dragdrop.default
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
