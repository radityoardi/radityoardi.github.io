"use strict";(self.webpackChunkrdz_tools=self.webpackChunkrdz_tools||[]).push([[634],{634:function(t,e,n){n.r(e),n.d(e,{Blogs:function(){return r}});var s=n(8152),o=n(2791),c=n(184),r=function(){var t=o.useState({items:[]}),e=(0,s.Z)(t,2),n=e[0],r=e[1],i=o.useState(null),l=(0,s.Z)(i,2);l[0],l[1];return o.useEffect((function(){fetch("https://www.googleapis.com/blogger/v3/blogs/".concat("6768234479975850056","/posts?key=").concat("AIzaSyAj5cOEfk_8uCGqYzcH3X8jyI6QcnKBBEI")).then((function(t){return t.json()})).then((function(t){r(t),console.log(t)}))}),[]),(0,c.jsxs)(o.Fragment,{children:[(0,c.jsx)("h1",{children:"Blogs"}),(0,c.jsx)("div",{children:n&&n.items&&n.items.map((function(t,e){return(0,c.jsxs)(o.Fragment,{children:[(0,c.jsx)("h2",{children:t.title},t.id),(0,c.jsxs)("div",{children:["Written by ",t.author.displayName," on ",new Date(t.published).toDateString()]}),(0,c.jsx)("div",{dangerouslySetInnerHTML:{__html:t.content}})]})}))})]})};e.default=r}}]);
//# sourceMappingURL=634.7dd42c73.chunk.js.map