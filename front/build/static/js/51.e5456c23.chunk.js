(self.webpackChunkweb_scada=self.webpackChunkweb_scada||[]).push([[51],{82944:function(e,t,n){"use strict";var r=n(87462),o=n(63366),i=n(72791),a=n(28182),s=n(94419),c=n(66934),u=n(31402),d=n(61669),l=n(80184),f=["className"],p=(0,c.ZP)("div",{name:"MuiAccordionDetails",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(e){return{padding:e.theme.spacing(1,2,2)}})),v=i.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiAccordionDetails"}),i=n.className,c=(0,o.Z)(n,f),v=n,b=function(e){var t=e.classes;return(0,s.Z)({root:["root"]},d.s,t)}(v);return(0,l.jsx)(p,(0,r.Z)({className:(0,a.Z)(b.root,i),ref:t,ownerState:v},c))}));t.Z=v},61669:function(e,t,n){"use strict";n.d(t,{s:function(){return i}});var r=n(75878),o=n(21217);function i(e){return(0,o.Z)("MuiAccordionDetails",e)}var a=(0,r.Z)("MuiAccordionDetails",["root"]);t.Z=a},89008:function(e,t,n){"use strict";var r=n(4942),o=n(63366),i=n(87462),a=n(72791),s=n(28182),c=n(94419),u=n(66934),d=n(31402),l=n(53915),f=n(27318),p=n(27520),v=n(80184),b=["children","className","expandIcon","focusVisibleClassName","onClick"],m=(0,u.ZP)(l.Z,{name:"MuiAccordionSummary",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(e){var t,n=e.theme,o=e.ownerState,a={duration:n.transitions.duration.shortest};return(0,i.Z)((t={display:"flex",minHeight:48,padding:n.spacing(0,2),transition:n.transitions.create(["min-height","background-color"],a)},(0,r.Z)(t,"&.".concat(p.Z.focusVisible),{backgroundColor:(n.vars||n).palette.action.focus}),(0,r.Z)(t,"&.".concat(p.Z.disabled),{opacity:(n.vars||n).palette.action.disabledOpacity}),(0,r.Z)(t,"&:hover:not(.".concat(p.Z.disabled,")"),{cursor:"pointer"}),t),!o.disableGutters&&(0,r.Z)({},"&.".concat(p.Z.expanded),{minHeight:64}))})),x=(0,u.ZP)("div",{name:"MuiAccordionSummary",slot:"Content",overridesResolver:function(e,t){return t.content}})((function(e){var t=e.theme,n=e.ownerState;return(0,i.Z)({display:"flex",flexGrow:1,margin:"12px 0"},!n.disableGutters&&(0,r.Z)({transition:t.transitions.create(["margin"],{duration:t.transitions.duration.shortest})},"&.".concat(p.Z.expanded),{margin:"20px 0"}))})),Z=(0,u.ZP)("div",{name:"MuiAccordionSummary",slot:"ExpandIconWrapper",overridesResolver:function(e,t){return t.expandIconWrapper}})((function(e){var t=e.theme;return(0,r.Z)({display:"flex",color:(t.vars||t).palette.action.active,transform:"rotate(0deg)",transition:t.transitions.create("transform",{duration:t.transitions.duration.shortest})},"&.".concat(p.Z.expanded),{transform:"rotate(180deg)"})})),g=a.forwardRef((function(e,t){var n=(0,d.Z)({props:e,name:"MuiAccordionSummary"}),r=n.children,u=n.className,l=n.expandIcon,g=n.focusVisibleClassName,h=n.onClick,y=(0,o.Z)(n,b),R=a.useContext(f.Z),w=R.disabled,j=void 0!==w&&w,S=R.disableGutters,C=R.expanded,A=R.toggle,N=(0,i.Z)({},n,{expanded:C,disabled:j,disableGutters:S}),M=function(e){var t=e.classes,n=e.expanded,r=e.disabled,o=e.disableGutters,i={root:["root",n&&"expanded",r&&"disabled",!o&&"gutters"],focusVisible:["focusVisible"],content:["content",n&&"expanded",!o&&"contentGutters"],expandIconWrapper:["expandIconWrapper",n&&"expanded"]};return(0,c.Z)(i,p.i,t)}(N);return(0,v.jsxs)(m,(0,i.Z)({focusRipple:!1,disableRipple:!0,disabled:j,component:"div","aria-expanded":C,className:(0,s.Z)(M.root,u),focusVisibleClassName:(0,s.Z)(M.focusVisible,g),onClick:function(e){A&&A(e),h&&h(e)},ref:t,ownerState:N},y,{children:[(0,v.jsx)(x,{className:M.content,ownerState:N,children:r}),l&&(0,v.jsx)(Z,{className:M.expandIconWrapper,ownerState:N,children:l})]}))}));t.Z=g},27520:function(e,t,n){"use strict";n.d(t,{i:function(){return i}});var r=n(75878),o=n(21217);function i(e){return(0,o.Z)("MuiAccordionSummary",e)}var a=(0,r.Z)("MuiAccordionSummary",["root","expanded","focusVisible","disabled","gutters","contentGutters","content","expandIconWrapper"]);t.Z=a},8806:function(e,t,n){"use strict";var r=n(84506),o=n(29439),i=n(4942),a=n(63366),s=n(87462),c=n(72791),u=(n(78457),n(28182)),d=n(94419),l=n(66934),f=n(31402),p=n(76090),v=n(4841),b=n(27318),m=n(98278),x=n(45970),Z=n(80184),g=["children","className","defaultExpanded","disabled","disableGutters","expanded","onChange","square","TransitionComponent","TransitionProps"],h=(0,l.ZP)(v.Z,{name:"MuiAccordion",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[(0,i.Z)({},"& .".concat(x.Z.region),t.region),t.root,!n.square&&t.rounded,!n.disableGutters&&t.gutters]}})((function(e){var t,n=e.theme,r={duration:n.transitions.duration.shortest};return t={position:"relative",transition:n.transitions.create(["margin"],r),overflowAnchor:"none","&:before":{position:"absolute",left:0,top:-1,right:0,height:1,content:'""',opacity:1,backgroundColor:(n.vars||n).palette.divider,transition:n.transitions.create(["opacity","background-color"],r)},"&:first-of-type":{"&:before":{display:"none"}}},(0,i.Z)(t,"&.".concat(x.Z.expanded),{"&:before":{opacity:0},"&:first-of-type":{marginTop:0},"&:last-of-type":{marginBottom:0},"& + &":{"&:before":{display:"none"}}}),(0,i.Z)(t,"&.".concat(x.Z.disabled),{backgroundColor:(n.vars||n).palette.action.disabledBackground}),t}),(function(e){var t=e.theme,n=e.ownerState;return(0,s.Z)({},!n.square&&{borderRadius:0,"&:first-of-type":{borderTopLeftRadius:(t.vars||t).shape.borderRadius,borderTopRightRadius:(t.vars||t).shape.borderRadius},"&:last-of-type":{borderBottomLeftRadius:(t.vars||t).shape.borderRadius,borderBottomRightRadius:(t.vars||t).shape.borderRadius,"@supports (-ms-ime-align: auto)":{borderBottomLeftRadius:0,borderBottomRightRadius:0}}},!n.disableGutters&&(0,i.Z)({},"&.".concat(x.Z.expanded),{margin:"16px 0"}))})),y=c.forwardRef((function(e,t){var n=(0,f.Z)({props:e,name:"MuiAccordion"}),i=n.children,l=n.className,v=n.defaultExpanded,y=void 0!==v&&v,R=n.disabled,w=void 0!==R&&R,j=n.disableGutters,S=void 0!==j&&j,C=n.expanded,A=n.onChange,N=n.square,M=void 0!==N&&N,T=n.TransitionComponent,k=void 0===T?p.Z:T,G=n.TransitionProps,O=(0,a.Z)(n,g),I=(0,m.Z)({controlled:C,default:y,name:"Accordion",state:"expanded"}),P=(0,o.Z)(I,2),W=P[0],V=P[1],q=c.useCallback((function(e){V(!W),A&&A(e,!W)}),[W,A,V]),E=c.Children.toArray(i),B=(0,r.Z)(E),D=B[0],L=B.slice(1),$=c.useMemo((function(){return{expanded:W,disabled:w,disableGutters:S,toggle:q}}),[W,w,S,q]),H=(0,s.Z)({},n,{square:M,disabled:w,disableGutters:S,expanded:W}),_=function(e){var t=e.classes,n={root:["root",!e.square&&"rounded",e.expanded&&"expanded",e.disabled&&"disabled",!e.disableGutters&&"gutters"],region:["region"]};return(0,d.Z)(n,x.k,t)}(H);return(0,Z.jsxs)(h,(0,s.Z)({className:(0,u.Z)(_.root,l),ref:t,ownerState:H,square:M},O,{children:[(0,Z.jsx)(b.Z.Provider,{value:$,children:D}),(0,Z.jsx)(k,(0,s.Z)({in:W,timeout:"auto"},G,{children:(0,Z.jsx)("div",{"aria-labelledby":D.props.id,id:D.props["aria-controls"],role:"region",className:_.region,children:L})}))]}))}));t.Z=y},27318:function(e,t,n){"use strict";var r=n(72791).createContext({});t.Z=r},45970:function(e,t,n){"use strict";n.d(t,{k:function(){return i}});var r=n(75878),o=n(21217);function i(e){return(0,o.Z)("MuiAccordion",e)}var a=(0,r.Z)("MuiAccordion",["root","rounded","expanded","disabled","gutters","region"]);t.Z=a},87197:function(e,t,n){var r=n(97009).Symbol;e.exports=r},39066:function(e,t,n){var r=n(87197),o=n(81587),i=n(43581),a="[object Null]",s="[object Undefined]",c=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?s:a:c&&c in Object(e)?o(e):i(e)}},20821:function(e,t,n){var r=n(26050),o=/^\s+/;e.exports=function(e){return e?e.slice(0,r(e)+1).replace(o,""):e}},31032:function(e,t,n){var r="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g;e.exports=r},81587:function(e,t,n){var r=n(87197),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,s=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,s),n=e[s];try{e[s]=void 0;var r=!0}catch(c){}var o=a.call(e);return r&&(t?e[s]=n:delete e[s]),o}},43581:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},97009:function(e,t,n){var r=n(31032),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},26050:function(e){var t=/\s/;e.exports=function(e){for(var n=e.length;n--&&t.test(e.charAt(n)););return n}},48573:function(e,t,n){var r=n(8092),o=n(50072),i=n(42582),a="Expected a function",s=Math.max,c=Math.min;e.exports=function(e,t,n){var u,d,l,f,p,v,b=0,m=!1,x=!1,Z=!0;if("function"!=typeof e)throw new TypeError(a);function g(t){var n=u,r=d;return u=d=void 0,b=t,f=e.apply(r,n)}function h(e){var n=e-v;return void 0===v||n>=t||n<0||x&&e-b>=l}function y(){var e=o();if(h(e))return R(e);p=setTimeout(y,function(e){var n=t-(e-v);return x?c(n,l-(e-b)):n}(e))}function R(e){return p=void 0,Z&&u?g(e):(u=d=void 0,f)}function w(){var e=o(),n=h(e);if(u=arguments,d=this,v=e,n){if(void 0===p)return function(e){return b=e,p=setTimeout(y,t),m?g(e):f}(v);if(x)return clearTimeout(p),p=setTimeout(y,t),g(v)}return void 0===p&&(p=setTimeout(y,t)),f}return t=i(t)||0,r(n)&&(m=!!n.leading,l=(x="maxWait"in n)?s(i(n.maxWait)||0,t):l,Z="trailing"in n?!!n.trailing:Z),w.cancel=function(){void 0!==p&&clearTimeout(p),b=0,u=v=d=p=void 0},w.flush=function(){return void 0===p?f:R(o())},w}},8092:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},43141:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},70152:function(e,t,n){var r=n(39066),o=n(43141),i="[object Symbol]";e.exports=function(e){return"symbol"==typeof e||o(e)&&r(e)==i}},50072:function(e,t,n){var r=n(97009);e.exports=function(){return r.Date.now()}},33038:function(e,t,n){var r=n(48573),o=n(8092),i="Expected a function";e.exports=function(e,t,n){var a=!0,s=!0;if("function"!=typeof e)throw new TypeError(i);return o(n)&&(a="leading"in n?!!n.leading:a,s="trailing"in n?!!n.trailing:s),r(e,t,{leading:a,maxWait:t,trailing:s})}},42582:function(e,t,n){var r=n(20821),o=n(8092),i=n(70152),a=NaN,s=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,d=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(i(e))return a;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=r(e);var n=c.test(e);return n||u.test(e)?d(e.slice(2),n?2:8):s.test(e)?a:+e}}}]);
//# sourceMappingURL=51.e5456c23.chunk.js.map