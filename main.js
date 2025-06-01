// src/tts.ts
var TTS_KEY = "tts-settings";
function loadSettings() {
  const json = self.localStorage.getItem(TTS_KEY);
  return json === null ? void 0 : JSON.parse(json);
}
function saveSettings(settings) {
  self.localStorage.setItem(TTS_KEY, JSON.stringify(settings));
}
var memoVoice;
function utterance(txt) {
  const settings = loadSettings();
  if (settings === void 0) throw new Error(`TTS settings unset`);
  if (memoVoice === void 0 || memoVoice.voiceURI !== settings.voice) {
    memoVoice = self.speechSynthesis.getVoices().find((v3) => v3.voiceURI === settings.voice);
    if (memoVoice === void 0)
      throw new Error(`Could not find voice '${settings.voice}'`);
  }
  const u4 = new SpeechSynthesisUtterance(txt);
  u4.rate = settings.rate;
  u4.voice = memoVoice;
  return u4;
}

// src/utils.ts
function querySelectorOrDie(elemType, root, query) {
  const found = root.querySelector(query);
  if (found instanceof elemType) return found;
  console.error("Could not find", elemType, query, root);
  throw new Error(`Could not find child`);
}

// src/components/tts.ts
var TTSSettings = class extends HTMLElement {
  connectedCallback() {
    self.speechSynthesis.addEventListener(
      "voiceschanged",
      this.refresh.bind(this)
    );
    this.addEventListener("submit", this.formSubmit.bind(this));
    this.addEventListener("click", (ev) => {
      if (ev.target instanceof HTMLButtonElement && ev.target.name === "save")
        this.save();
    });
    this.refresh();
  }
  formSubmit(ev) {
    ev.preventDefault();
    const formData = this.readForm();
    if (formData) {
      const voice = self.speechSynthesis.getVoices().find((v3) => v3.voiceURI === formData.voice);
      if (voice) {
        const previewText = querySelectorOrDie(
          HTMLInputElement,
          this,
          'input[name="preview"]'
        ).value;
        const utterance2 = new SpeechSynthesisUtterance(previewText);
        utterance2.rate = formData.rate;
        utterance2.voice = voice;
        self.speechSynthesis.cancel();
        self.speechSynthesis.speak(utterance2);
      }
    }
  }
  save() {
    const formData = this.readForm();
    if (formData) {
      saveSettings(formData);
      window.location.hash = "";
    }
  }
  readForm() {
    const rateElem = querySelectorOrDie(
      HTMLInputElement,
      this,
      'input[name="rate"]'
    );
    const select = querySelectorOrDie(HTMLSelectElement, this, "select");
    const rate = parseFloat(rateElem.value);
    if (Number.isFinite(rate) && select.value) {
      return {
        rate,
        voice: select.value
      };
    } else {
      return void 0;
    }
  }
  refresh() {
    const settings = loadSettings();
    const rate = settings === void 0 ? 1 : settings.rate;
    const selectedVoice = settings?.voice;
    const voices = self.speechSynthesis.getVoices().filter((v3) => v3.lang.startsWith("zh-"));
    const voiceChoices = voices.length === 0 ? "<option disabled>No voices available</option>" : voices.map(
      (v3) => `<option value="${v3.voiceURI}" ${selectedVoice === v3.voiceURI ? "selected" : ""}>
          ${v3.name} (${v3.localService ? "Local" : "Non-local"})
        </option>`
    );
    this.innerHTML = `<form>
      <fieldset>
        <label>Voice</label>
        <select>${voiceChoices}</select>
      </fieldset>
      <fieldset>
        <label>Rate</label>
        <input name="rate" type="number" step="0.05" value="${rate}"/>
      </fieldset>
      <fieldset>
        <input placeholder="Preview text" name="preview" />
        <button>Test voice</button>
      </fieldset>
    </form>

    <button name="save">Save</button>
    <a href="#">Go Home</a>
    `;
  }
};
self.customElements.define("writing-tts-settings", TTSSettings);

// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var w = Array.isArray;
function d(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i4, r3, null);
}
function m(n2, t3, i4, r3, o3) {
  var e3 = { type: n2, props: t3, key: i4, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function S(n2, l3) {
  if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
      n2.__e = n2.__c.base = u4.__e;
      break;
    }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n2, u4, t3, r3, o3, f4, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, o3 = (r3 = (u4 = n2).__v).__e, f4 = [], c3 = [], u4.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u4.__P, t3, r3, u4.__n, u4.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f4, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, z(f4, t3, c3), t3.__e != o3 && C(t3)));
  $.__r = 0;
}
function I(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, w3, d3, g2, _2 = t3 && t3.__k || v, m3 = l3.length;
  for (f4 = P(u4, l3, _2, f4, m3), a3 = 0; a3 < m3; a3++) null != (y3 = u4.__k[a3]) && (h3 = -1 == y3.__i ? p : _2[y3.__i] || p, y3.__i = a3, g2 = O(n2, y3, h3, i4, r3, o3, e3, f4, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && q(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), 4 & y3.__u || h3.__k === y3.__k ? f4 = A(y3, f4, n2) : "function" == typeof y3.type && void 0 !== g2 ? f4 = g2 : w3 && (f4 = w3.nextSibling), y3.__u &= -7);
  return u4.__e = d3, f4;
}
function P(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i4 > s3 ? h3-- : i4 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), B(e3, e3));
  return t3;
}
function A(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++) t3[i4] && (t3[i4].__ = n2, l3 = A(t3[i4], l3, u4));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !u4.contains(l3) && (l3 = S(n2)), u4.insertBefore(n2.__e, l3 || null), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function L(n2, l3, u4, t3) {
  var i4, r3, o3 = n2.key, e3 = n2.type, f4 = l3[u4];
  if (null === f4 && null == n2.key || f4 && o3 == f4.key && e3 == f4.type && 0 == (2 & f4.__u)) return u4;
  if (t3 > (null != f4 && 0 == (2 & f4.__u) ? 1 : 0)) for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) {
    if (i4 >= 0) {
      if ((f4 = l3[i4]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 == f4.type) return i4;
      i4--;
    }
    if (r3 < l3.length) {
      if ((f4 = l3[r3]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 == f4.type) return r3;
      r3++;
    }
  }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function j(n2, l3, u4, t3, i4) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || T(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || T(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u4 ? "" : u4;
      break n;
    } catch (n3) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function F(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t3.u) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, _2, m3, b, S2, C3, M2, $2, P2, A3, H, L2, T3, j3 = u4.type;
  if (null != u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof j3) try {
    if (b = u4.props, S2 = "prototype" in j3 && j3.prototype.render, C3 = (a3 = j3.contextType) && i4[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i4, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (S2 ? u4.__c = h3 = new j3(b, M2) : (u4.__c = h3 = new x(b, M2), h3.constructor = j3, h3.render = D), C3 && C3.sub(h3), h3.props = b, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i4, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j3.getDerivedStateFromProps(b, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3) S2 && null == j3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (S2 && null == j3.getDerivedStateFromProps && b !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b, h3.__s, M2) || u4.__v == t3.__v) {
        for (u4.__v != t3.__v && (h3.props = b, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
          n3 && (n3.__ = u4);
        }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
        h3._sb = [], h3.__h.length && e3.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(b, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v3, y3, _2);
      });
    }
    if (h3.context = M2, h3.props = b, h3.__P = n2, h3.__e = false, P2 = l.__r, A3 = 0, S2) {
      for (h3.state = h3.__s, h3.__d = false, P2 && P2(u4), a3 = h3.render(h3.props, h3.state, h3.context), H = 0; H < h3._sb.length; H++) h3.__h.push(h3._sb[H]);
      h3._sb = [];
    } else do {
      h3.__d = false, P2 && P2(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++A3 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i4 = d(d({}, i4), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_2 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = N(a3.props.children)), f4 = I(n2, w(L2) ? L2 : [L2], u4, t3, i4, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
  } catch (n3) {
    if (u4.__v = null, c3 || null != o3) if (n3.then) {
      for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o3[o3.indexOf(f4)] = null, u4.__e = f4;
    } else for (T3 = o3.length; T3--; ) g(o3[T3]);
    else u4.__e = t3.__e, u4.__k = t3.__k;
    l.__e(n3, u4, t3);
  }
  else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = V(t3.__e, u4, t3, i4, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++) q(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function N(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(N) : d({}, n2);
}
function V(u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, d3, _2, m3, b = i4.props, k3 = t3.props, x2 = t3.type;
  if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x2 && (x2 ? d3.localName == x2 : 3 == d3.nodeType)) {
      u4 = d3, e3[a3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x2) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x2) b === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b = i4.props || p, !c3 && null != e3) for (b = {}, a3 = 0; a3 < u4.attributes.length; a3++) b[(d3 = u4.attributes[a3]).name] = d3.value;
    for (a3 in b) if (d3 = b[a3], "children" == a3) ;
    else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
    else if (!(a3 in k3)) {
      if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
      j(u4, a3, null, d3, o3);
    }
    for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _2 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b[a3] === d3 || j(u4, a3, d3, b[a3], o3);
    if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), I("template" == t3.type ? u4.content : u4, w(y3) ? y3 : [y3], t3, i4, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && S(i4, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
    c3 || (a3 = "value", "progress" == x2 && null == _2 ? u4.removeAttribute("value") : null != _2 && (_2 !== u4[a3] || "progress" == x2 && !_2 || "option" == x2 && _2 != b[a3]) && j(u4, a3, _2, b[a3], o3), a3 = "checked", null != m3 && m3 != u4[a3] && j(u4, a3, m3, b[a3], o3));
  }
  return u4;
}
function q(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function B(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current != n2.__e || q(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n2.__k) for (r3 = 0; r3 < i4.length; r3++) i4[r3] && B(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function D(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function E(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], O(t3, u4 = (!r3 && i4 || t3).__k = _(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), z(e3, u4, f4);
}
n = v.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, r3, o3; l3 = l3.__; ) if ((i4 = l3.__c) && !i4.__) try {
    if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3) return i4.__E = i4;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u4), this.props)), n2 && d(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u4, i4) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H) return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      })) return !c3 || c3.call(this, n3, t3, r3);
      var i5 = o3.__c.props !== n3;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i5;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function y2(n2, u4) {
  var i4 = p2(t2++, 3);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.u = u4, r2.__H.__h.push(i4));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u4 = p2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
  } catch (t3) {
    n2.__H.__h = [], c2.__e(t3, n2.__v);
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// src/cedict.ts
async function downloadEntries(dataUri) {
  const rawText = await fetch(dataUri).then((res) => res.text());
  return rawText.split("\n").filter((l3) => !l3.startsWith("#")).map(parseLine);
}
function parseLine(line) {
  const match = /^(\S+)\s(\S+)\s\[([^\]]+)\]\s\/(.+)\/$/m.exec(line);
  if (!match) {
    console.error(`Failed to read: '${line}'`);
    throw new Error("Parsing failed");
  }
  return {
    trad: match[1],
    simp: match[2],
    pinyin: match[3],
    eng: match[4].split("/").flatMap((e3) => e3.split(";"))
  };
}
function orderEntries(engs) {
  function score(entry) {
    return ["variant of", "abbr. for", "CL:"].reduce(
      (p3, c3) => p3 + Number(entry.includes(c3)) * 100,
      entry.length
    );
  }
  return engs.sort((a3, b) => score(a3) - score(b));
}

// src/map.ts
function unionWith(m1, m22, combine) {
  const result = new Map(m1);
  for (const [k3, v22] of m22) {
    if (m1.has(k3)) {
      const v1 = m1.get(k3);
      result.set(k3, combine(k3, v1, v22));
    } else {
      result.set(k3, v22);
    }
  }
  return result;
}

// src/db/word-index.ts
var WORD_INDEX = "wordIndex";
var SIMPLIFIED_INDEX = "simplified";
var TRADITIONAL_INDEX = "traditional";
async function openDb() {
  return new Promise((res, rej) => {
    const req = indexedDB.open("writer", 1);
    req.onsuccess = (ev) => res(ev.target.result);
    req.onerror = rej;
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      const wordIndex = db.createObjectStore(WORD_INDEX, {
        autoIncrement: true
      });
      wordIndex.createIndex(SIMPLIFIED_INDEX, "simp");
      wordIndex.createIndex(TRADITIONAL_INDEX, "trad");
    };
  });
}
function writeEntries(db, entries) {
  const tx = db.transaction(WORD_INDEX, "readwrite");
  const wordIndex = tx.objectStore(WORD_INDEX);
  for (const entry of entries) {
    wordIndex.add(entry);
  }
  tx.commit();
}
async function searchWordIndex(index, currentKey) {
  let results = /* @__PURE__ */ new Set();
  while (currentKey.length > 0) {
    const cursor = await new Promise((res, rej) => {
      const req = index.openCursor(IDBKeyRange.upperBound(currentKey), "prev");
      req.onsuccess = (ev) => res(ev.target.result);
      req.onerror = rej;
    });
    if (cursor) {
      const subKey = cursor.key;
      if (currentKey.startsWith(subKey)) {
        results.add(subKey);
        currentKey = subKey.substring(0, subKey.length - 1);
      } else {
        currentKey = commonPrefix(currentKey, subKey);
      }
    } else {
      break;
    }
  }
  return results;
}
async function lookupWordIndex(wordIndex, index, search) {
  const keys = await new Promise((res, rej) => {
    const req = index.getAllKeys(search);
    req.onsuccess = (ev) => res(ev.target.result);
    req.onerror = rej;
  });
  let results = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const entry = await new Promise((res, rej) => {
      const req = wordIndex.get(key);
      req.onsuccess = (ev) => res(req.result);
      req.onerror = rej;
    });
    results.set(key, entry);
  }
  return results;
}
function commonPrefix(s1, s22) {
  let len = 0;
  while (len < Math.min(s1.length, s22.length)) {
    if (s1[len] === s22[len]) {
      len += 1;
    } else {
      break;
    }
  }
  return s1.substring(0, len);
}
async function searchPrefixes(db, search) {
  const tx = db.transaction(WORD_INDEX, "readonly");
  const wordIndex = tx.objectStore(WORD_INDEX);
  const simps = await searchWordIndex(
    wordIndex.index(SIMPLIFIED_INDEX),
    search
  );
  const trads = await searchWordIndex(
    wordIndex.index(TRADITIONAL_INDEX),
    search
  );
  return new Set(Array.from(simps).concat(Array.from(trads)));
}
async function lookupEntries(db, search) {
  const tx = db.transaction(WORD_INDEX, "readonly");
  const wordIndex = tx.objectStore(WORD_INDEX);
  const simps = await lookupWordIndex(
    wordIndex,
    wordIndex.index(SIMPLIFIED_INDEX),
    search
  );
  const trads = await lookupWordIndex(
    wordIndex,
    wordIndex.index(TRADITIONAL_INDEX),
    search
  );
  return unionWith(simps, trads, (_k, _v1, v22) => v22);
}

// src/db/writing-state.ts
var STATE_KEY = "writing-state";
var emptyState = {
  previousText: ""
};
function load() {
  const json = self.localStorage.getItem(STATE_KEY);
  return json === null ? emptyState : JSON.parse(json);
}
function save(state) {
  self.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// src/components/read-along.tsx
function ReadAlong({
  text,
  highlight
}) {
  return /* @__PURE__ */ u3("div", { class: "read-along", children: /* @__PURE__ */ u3("div", { class: "characters", children: renderBody(text, highlight) }) });
}
var SELECTION_LAG = 100;
var currentSelectionRange;
{
  let handle;
  document.addEventListener("selectionchange", () => {
    const newSelection = document.getSelection();
    const newSelectionRange = newSelection && newSelection.rangeCount > 0 ? newSelection.getRangeAt(0) : void 0;
    clearTimeout(handle);
    handle = setTimeout(() => {
      currentSelectionRange = newSelectionRange;
    }, SELECTION_LAG);
  });
}
function readAlongSelection(root) {
  const range = currentSelectionRange;
  if (root && range) {
    if (root.contains(range.startContainer) && root.contains(range.endContainer)) {
      let start = range.startOffset;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
      while (walker.nextNode()) {
        if (walker.currentNode === range.startContainer) break;
        if (walker.currentNode instanceof Text)
          start += walker.currentNode.data.length;
      }
      const length = range.toString().length;
      if (length > 0) return { start, length };
    }
  }
}
function renderBody(text, highlight) {
  if (highlight) {
    const leftText = text.substring(0, highlight.start);
    const midText = text.substring(
      highlight.start,
      highlight.start + highlight.length
    );
    const rightText = text.substring(highlight.start + highlight.length);
    return /* @__PURE__ */ u3(k, { children: [
      leftText,
      /* @__PURE__ */ u3("span", { class: "highlight", children: midText }),
      rightText
    ] });
  } else {
    return text;
  }
}

// src/components/writing.tsx
function Writing() {
  const readAlongRef = A2(null);
  const [highlighted, setHighlighted] = d2(void 0);
  const [ws, setWs] = useWritingState();
  const onBackSpace = () => setWs({
    ...ws,
    previousText: ws.previousText.slice(0, ws.previousText.length - 1)
  });
  const onClickSpeak = () => {
    const selected = readAlongRef.current?.base instanceof HTMLElement ? readAlongSelection(readAlongRef.current.base) : void 0;
    doSpeak(setHighlighted, selected, ws.previousText);
  };
  const entries = useDefinitions(ws.previousText);
  return /* @__PURE__ */ u3("div", { class: "writing", children: [
    /* @__PURE__ */ u3(
      ReadAlong,
      {
        text: ws.previousText,
        highlight: highlighted,
        ref: readAlongRef
      }
    ),
    /* @__PURE__ */ u3("div", { class: "text-input", children: [
      /* @__PURE__ */ u3("button", { name: "back-space", onClick: onBackSpace, children: "\u232B" }),
      /* @__PURE__ */ u3("input", { type: "text", onInput: doChangeText(ws, setWs) }),
      /* @__PURE__ */ u3("button", { name: "speak", onClick: onClickSpeak, children: "\u{1F5E3}\uFE0F" })
    ] }),
    /* @__PURE__ */ u3("div", { class: "stroke-orders" }),
    /* @__PURE__ */ u3("ul", { class: "definitions", children: entries.map((entry, _idx) => /* @__PURE__ */ u3(DefinitionItem, { definition: entry })) })
  ] });
}
function DefinitionItem({
  definition
}) {
  const otherReps = Array.from(
    new Set(
      definition.defs.values().flatMap((d3) => [d3.simp, d3.trad]).filter((r3) => r3 !== definition.text)
    )
  );
  const translations = orderEntries(
    Array.from(definition.defs.values().flatMap((d3) => d3.eng))
  );
  const pinyins = concisePinyins(
    Array.from(definition.defs.values().map((d3) => d3.pinyin))
  );
  return /* @__PURE__ */ u3("li", { className: definition.subWord ? "subword" : "", children: [
    /* @__PURE__ */ u3("div", { className: "characters", children: definition.text }),
    /* @__PURE__ */ u3("div", { className: "alternate", children: otherReps.join(" / ") }),
    /* @__PURE__ */ u3("div", { className: "pinyin", children: pinyins }),
    /* @__PURE__ */ u3("div", { className: "translations", children: translations.join("; ") })
  ] });
}
var MAX_PREVIOUS_LENGTH = 500;
function doChangeText(ws, setWs) {
  return function(ev) {
    if (!ev.isComposing || ev.inputType === "insertFromComposition") {
      const input = ev.currentTarget;
      const newText = ws.previousText + input.value;
      setWs({
        ...ws,
        previousText: newText.slice(
          Math.max(0, newText.length - MAX_PREVIOUS_LENGTH)
        )
      });
      input.value = "";
    }
  };
}
function doSpeak(setHighlight, userSelected, allText) {
  if (self.speechSynthesis.speaking) {
    self.speechSynthesis.cancel();
    return;
  }
  const selected = userSelected ? userSelected : defaultSpeechRange(allText);
  const text = allText.substring(
    selected.start,
    selected.start + selected.length
  );
  const utterance2 = utterance(text);
  utterance2.addEventListener(
    "boundary",
    (ev) => setHighlight({
      start: selected.start + ev.charIndex,
      length: ev.charLength
    })
  );
  utterance2.addEventListener("end", (_ev) => setHighlight(void 0));
  self.speechSynthesis.speak(utterance2);
}
function* speechRanges(allText) {
  const chars = Array.from(allText);
  let charCount = 0;
  let start = chars.length - 1;
  let readChar = false;
  while (start >= 0) {
    if (/\p{Script=Han}/u.test(chars[start])) {
      readChar = true;
      charCount += 1;
    } else if (!/\w/.test(chars[start])) {
      if (readChar) {
        yield { start: start + 1, charCount };
        readChar = false;
      }
    }
    start -= 1;
  }
  if (readChar) yield { start: start + 1, charCount };
}
function defaultSpeechRange(allText) {
  let best;
  for (const entry of speechRanges(allText)) {
    if (best === void 0 || entry.charCount <= 5) best = entry;
    else break;
  }
  return best ? { start: best.start, length: allText.length - best.start } : { start: 0, length: allText.length };
}
function useWritingState() {
  const [s3, ss] = d2(load());
  return [
    s3,
    (s22) => {
      save(s22);
      ss(s22);
    }
  ];
}
var MAX_DEFINITIONS = 20;
function useDefinitions(text) {
  const [db, setDb] = d2();
  y2(() => {
    openDb().then((db2) => setDb(db2));
  }, []);
  const [entries, setEntries] = d2([]);
  const uniqueCounter = A2(1);
  y2(() => {
    if (db) {
      const db_ = db;
      uniqueCounter.current += 1;
      const myId = uniqueCounter.current;
      async function work() {
        let prefixes = [];
        let used = /* @__PURE__ */ new Set();
        let length = 1;
        do {
          const search = text.slice(text.length - length);
          const thesePrefixes = Array.from(
            await searchPrefixes(db_, search)
          ).sort((a3, b) => a3.length - b.length);
          for (const prefix of thesePrefixes) {
            if (!used.has(prefix)) {
              prefixes.push(prefix);
              used.add(prefix);
            }
          }
          length += 1;
        } while (length <= text.length && prefixes.length < MAX_DEFINITIONS);
        let groups = [];
        for (const prefix of prefixes.slice().reverse()) {
          if (groups.length > 0) {
            const parent = groups[groups.length - 1][0];
            if (parent.includes(prefix)) groups[groups.length - 1].push(prefix);
            else groups.push([prefix]);
          } else {
            groups.push([prefix]);
          }
        }
        let defs = [];
        for (const group of groups.slice().reverse()) {
          const [parent, ...children] = await Promise.all(
            group.map(async (prefix) => ({
              text: prefix,
              defs: await lookupEntries(db_, prefix)
            }))
          );
          defs.push(
            { ...parent, subWord: false },
            ...children.map((child) => ({ ...child, subWord: true }))
          );
        }
        if (myId === uniqueCounter.current) setEntries(defs);
      }
      work();
    }
  }, [text, db]);
  return entries;
}
function concisePinyins(pinyins) {
  return pinyins.slice(0, 3).map((py, idx) => {
    if (idx === 0) return py;
    if (idx === 1) return "; " + py;
    return "\u2026";
  }).join("");
}

// src/components/app.tsx
function useHash() {
  const [hash, setHash] = d2(window.location.hash);
  y2(() => {
    const onChange = (_e) => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  });
  return hash;
}
function App() {
  const hash = useHash();
  if (/^#?$/.test(hash)) {
    return /* @__PURE__ */ u3(k, { children: [
      /* @__PURE__ */ u3("h1", { children: "Root" }),
      /* @__PURE__ */ u3("p", { children: /* @__PURE__ */ u3("a", { href: "#tts", children: "TTS Config" }) }),
      /* @__PURE__ */ u3("p", { children: /* @__PURE__ */ u3("a", { href: "#import-cedict", children: "Import CEdict" }) }),
      /* @__PURE__ */ u3("p", { children: /* @__PURE__ */ u3("a", { href: "#writing", children: "Writing" }) })
    ] });
  } else if (hash === "#import-cedict") {
    return /* @__PURE__ */ u3(ImportCEdict, {});
  } else if (hash === "#writing") {
    return /* @__PURE__ */ u3(Writing, {});
  } else if (hash === "#tts") {
    return _("writing-tts-settings", {});
  } else {
    throw new Error(`Unknown route: '${hash}'`);
  }
}
function ImportCEdict() {
  const [url, setUrl] = d2(
    "https://tomcumming.github.io/writer/data/cedict_1_0_ts_utf-8_mdbg.txt"
  );
  const [result, setResult] = d2("");
  const onClick = async () => {
    setResult("Downloading...");
    try {
      const entries = await downloadEntries(url);
      setResult("Importing...");
      await new Promise((res) => window.requestAnimationFrame(res));
      const db = await openDb();
      writeEntries(db, entries);
      setResult("Import successful");
    } catch (e3) {
      console.error(e3);
      setResult(`Failed to import dictionary`);
    }
  };
  return /* @__PURE__ */ u3(k, { children: [
    /* @__PURE__ */ u3("h1", { children: "Import cedict" }),
    /* @__PURE__ */ u3(
      "input",
      {
        type: "url",
        id: "cedict-url",
        value: url,
        onInput: (e3) => setUrl(e3.currentTarget.value)
      }
    ),
    /* @__PURE__ */ u3(
      "button",
      {
        id: "cedict-import-button",
        disabled: result !== "",
        onClick,
        children: "Import"
      }
    ),
    /* @__PURE__ */ u3("p", { id: "cedict-import-result", children: result }),
    /* @__PURE__ */ u3("a", { href: "#", children: "Go home" })
  ] });
}

// src/main.ts
self.speechSynthesis.getVoices();
E(_(App, {}), document.body);
