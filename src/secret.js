import m from "mithril";
import tagl from "./tagl";
import fn from "./fn";

const camelToHyphen = s => s.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

const tagl_hyperscript = tagl(function(tagName, classes, ...args) {
  let cls = classes.map(camelToHyphen).join(".");
  return m([tagName, cls].join(".").replace(".$", "#"), ...args);
});

const {
  input,
  form,
  formfield,
  label,
  a,
  button,
  div,
  span,
  textarea,
  table,
  tr,
  br,
  td
} = tagl_hyperscript;

let botschaft = localStorage.getItem("botschaft") || "";
let dec = true;
const save = () => localStorage.setItem("botschaft", botschaft);

let key = "";

let map = {};
let map2 = {};

let klartext = "";

const arrayify = str => fn.range(0, str.length).map(i => str[i]);

const decrypt = _map => {
  klartext = arrayify(botschaft)
    .map(c => _map[c] || c)
    .join("");
};

const alphabet = fn
  .range(0, 26)
  .map(i => "a".charCodeAt(0) + i)
  .map(ni => String.fromCharCode(ni));

const setKey = _key => {
  let alphabet = fn
    .range(0, 26)
    .map(i => "a".charCodeAt(0) + i)
    .map(ni => String.fromCharCode(ni));
  key = _key;
  let kk = fn.unique(arrayify(key));

  let newAlphabet = fn.reverse([...kk, ...fn.without(alphabet, kk)]);

  map = {};
  newAlphabet.forEach((n, i) => (map[n] = alphabet[i]));

  map2 = {};
  newAlphabet.forEach((n, i) => (map2[alphabet[i]] = n));

  if (dec) decrypt(map);
  else decrypt(map2);

  console.log(map);
};

let map3 = {};

alphabet.forEach(k => (map3[k] = k));

export default {
  view(vnode) {
    return div.container([
      form(
        formfield(
          label("Schlüssel"),
          input.formControl({
            value: key,
            oninput: m.withAttr("value", v => setKey(v))
          })
        ),
        br(),
        formfield(
          label("Botschaft"),
          textarea.formControl({
            value: botschaft,
            oninput: m.withAttr("value", v => (botschaft = v))
          })
        ),        
        br(),
        div.formGroup(
          button.btn.btnPrimary(
            {
              onclick: () => {
                dec = true;
                setKey(key);
              }
            },
            "^^ entschlüsseln"
          ),
          span.badge(dec ? "^" : "v"),
          button.btn.btnPrimary(
            {
              onclick: () => {
                dec = false;
                setKey(key);
              }
            },
            "verschlüsseln vv"
          ),
          button.btn.btnSuccess(
            { onclick: () => save() },
            "Botschaft speichern"
          )
        ),
        br(),
        formfield(
          label("Klartext oder Geheimbotschaft"),
          textarea.formControl({
            value: klartext,
            oninput: m.withAttr("value", v => (klartext = v))
          })
        )
      ),
      table.table(
        tr(Object.keys(map).map(k => td(map[k]))),
        tr(Object.keys(map).map(k => td(k)))
      ),
      table.table(
        tr(alphabet.map(k => td(k))),
        tr(
          alphabet.map(k =>
            td(
              input.formControl({
                value: map3[k],
                oninput: m.withAttr("value", v => {
                  map3[k] = v;
                  decrypt(map3);
                })
              })
            )
          )
        )
      )
      /*      br(),
      br(),
      table.table(
        tr(alphabet.map(k => td(k))),
        tr(alphabet.map(k =>td(Object.keys(map3).filter(map3_key => map3[map3_key] === k)[0] ))),
        tr(alphabet.map(k => td(k)))
      )*/
      //      table(Object.keys(map).map(k => tr(td(map[k]), td(k))))
    ]);
  }
};
