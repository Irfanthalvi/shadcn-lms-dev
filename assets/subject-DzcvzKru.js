import{c as w,j as e,f as S,I as y,J as C,b as o,B as b}from"./index-DWvjdWe0.js";import{s as h}from"./subject-data-BGf0ThM5.js";import{S as k,a as L,b as T,c as E,d as f}from"./select-DhAkwixC.js";import"./index-CfGZPuvP.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],I=w("arrow-right",F);function n({className:l,...t}){return e.jsx("div",{"data-slot":"skeleton",className:S("bg-accent animate-pulse rounded-md",l),...t})}const M=({search:l,setSearch:t,filter:d,setFilter:c,subjects:m})=>e.jsxs("div",{className:"w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6",children:[e.jsx("div",{className:"w-full sm:w-56",children:e.jsx(y,{type:"text",placeholder:"Search subjects...",value:l,onChange:s=>t(s.target.value),className:`\r
            w-full h-10 rounded-md\r
            border border-border \r
            bg-background\r
            hover:border-border \r
            active:border-border \r
            focus-visible:ring-0 \r
            focus-visible:border-ring\r
            transition-none\r
          `})}),e.jsx("div",{className:"w-full sm:w-56",children:e.jsxs(k,{value:d,onValueChange:c,children:[e.jsx(L,{className:`\r
              w-full h-10 rounded-md \r
              border border-border \r
              bg-background \r
              hover:border-border \r
              active:border-border \r
              focus:ring-0 \r
              focus:border-ring\r
              transition-none \r
              cursor-pointer\r
            `,children:e.jsx(T,{placeholder:"Filter by subject"})}),e.jsxs(E,{children:[e.jsx(f,{value:"all",className:"cursor-pointer",children:"All Subjects"}),m.map(s=>e.jsx(f,{value:s.label.toLowerCase(),className:"cursor-pointer",children:s.label},s.id))]})]})})]}),B=()=>{const l=C(),[t,d]=o.useState(!0),[c,m]=o.useState(8),[s,g]=o.useState(""),[u,j]=o.useState("all");o.useEffect(()=>{const r=setTimeout(()=>d(!1),800);return()=>clearTimeout(r)},[]);const p=()=>m(r=>r+8),x=h.filter(r=>{const a=r.title.toLowerCase().includes(s.toLowerCase()),i=u==="all"||r.label.toLowerCase()===u;return a&&i}),v=x.slice(0,c),N=c<x.length;return e.jsxs("div",{className:"min-h-screen w-full bg-background text-foreground px-4 sm:px-6 md:px-8 py-10 max-w-[1440px] mx-auto",children:[e.jsx(M,{search:s,setSearch:g,filter:u,setFilter:j,subjects:h}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",children:t?Array.from({length:8}).map((r,a)=>e.jsxs("div",{className:"bg-card border border-border rounded-xl h-72 flex flex-col",children:[e.jsx(n,{className:"h-32 w-full rounded-t-md"}),e.jsxs("div",{className:"p-4 flex flex-col flex-1",children:[e.jsx(n,{className:"h-4 w-3/4 mb-2"}),e.jsx(n,{className:"h-3 w-full mb-2"}),e.jsx(n,{className:"h-3 w-5/6 mb-4"}),e.jsx(n,{className:"h-9 w-28 mt-auto"})]})]},a)):v.map((r,a)=>e.jsxs("div",{onClick:()=>l(r.id),className:"bg-card text-card-foreground border border-border rounded-md flex flex-col transition overflow-hidden cursor-pointer",children:[e.jsx("div",{className:"aspect-[320/200] w-full",children:e.jsx("img",{src:r.img,alt:r.title,className:"w-full h-full object-cover",onError:i=>{i.currentTarget.onerror=null,i.currentTarget.src="/fallback-image.png"}})}),e.jsxs("div",{className:"p-4 flex flex-col flex-1",children:[e.jsx("h2",{className:"text-base font-semibold",children:r.title}),e.jsx("p",{className:"text-primary mb-3",children:r.description}),e.jsxs(b,{className:"mt-auto inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition w-fit",children:["Continue Study ",e.jsx(I,{size:16})]})]})]},a))}),!t&&N&&e.jsx("div",{className:"flex justify-center mt-8",children:e.jsx(b,{onClick:p,className:"bg-muted text-muted-foreground hover:bg-muted/80 transition",children:"Load More"})})]})};export{B as default};
