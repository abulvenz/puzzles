import m from 'mithril';

import fn from './fn'


let compis = [];

let draggableMixin = (data, options={}) => {
	return Object.assign({
		draggable:true,				
			ondragstart:e=>{
				console.log(e); 
				e.dataTransfer.setData('text', data)
				e.target.style.opacity = "0.6"
			},
			ondragend:e=>{
				console.log(e); 
				e.target.style.opacity = "1.0"
			}
	}, options);
};

let dropzoneMixin = (options) => {
	let res = Object.assign({
		ondragover:e=>{e.preventDefault();console.log('dragover',e);},
		ondragenter:e=>{ e.preventDefault(); console.log('dragenter',e)},
		ondrop:e=>{
			e.preventDefault(); 
			console.log('drop',e);			
			res.dropped(e.dataTransfer.getData('text'));
		}		
	}, options);
	return res;
};

export default class Editor {
    view(vnode) {
        return m('.container', 
			m('h1', 'Drag\'n\'Drop '),
//            m('.form-group', m('input', { type: 'range', min: 4, max: 8, onchange: (ev) => setSize(ev.target.valueAsNumber) })),
            m('.leftbox',
				fn.interval(1,10).map(val=>m('.badge',draggableMixin(val+''),val))
			),
			m('.rightbox',dropzoneMixin({
				style:'width:250px;height:250px; border:1px solid red',
				dropped:d=>compis.push(d)
			}), compis.map(c=>m('.badge',c))
		
            )
            )
    }
}
