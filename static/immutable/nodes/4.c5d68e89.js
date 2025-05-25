import{d as c}from"../chunks/environment.9aa685ef.js";import{s as h,n as r}from"../chunks/scheduler.e108d1fd.js";import{S as u,i as p,s as m,g as d,z as g,f as o,c as f,h as b,x as y,k as x,a as n}from"../chunks/index.bad58c3a.js";const v=c,w=!0,S=Object.freeze(Object.defineProperty({__proto__:null,csr:v,prerender:w},Symbol.toStringTag,{value:"Module"})),_=""+new URL("../assets/github-logo.7a0dd11e.svg",import.meta.url).href,j=""+new URL("../assets/leetcode-logo.7f79a850.svg",import.meta.url).href,T=""+new URL("../assets/codeforces-logo.ea7f6f0b.svg",import.meta.url).href,k=""+new URL("../assets/mathse-logo.6f416689.svg",import.meta.url).href;function M(l){let s,e,i=`<h1 class="text-center text-3xl font-bold">My (programming) projects are listed below</h1> <div class="mx-auto justify-center flex flex-row gap-5 py-4 w-56"><a href="https://github.com/jorisperrenet" target="_blank"><img class="opacity-80 hover:opacity-100 h-10 w-10" src="${_}" alt="GitHub"/></a> <a href="https://leetcode.com/JorisPerrenet/" target="_blank"><img class="opacity-80 hover:opacity-100 h-10 w-10" src="${j}" alt="LeetCode"/></a> <a href="https://codeforces.com/profile/Joris_Perrenet" target="_blank"><img class="opacity-80 hover:opacity-100 h-10 w-10" src="${T}" alt="CodeForces"/></a> <a href="https://math.stackexchange.com/users/1049661/jorisperrenet" target="_blank"><img class="opacity-80 hover:opacity-100 h-10 w-10" src="${k}" alt="MathSE"/></a></div> <a href="https://projecteuler.net/about" target="_blank"><img class="opacity-80 hover:opacity-100 mx-auto justify-center" src="https://projecteuler.net/profile/Joris_Perrenet.png" alt="Project Euler"/></a> <ul class="list-disc m-auto px-8 py-8 space-y-4"><li><a class="text-blue-600 underline" href="https://github.com/jorisperrenet/durak">durak</a>
            —
            This repository is for playing the game of durak against or with the computer.
            It can even help you beat your friends in a real life game.
            I have implemented the game in both
            <a class="text-blue-600 underline" href="https://python.org">Python</a>
            and
            <a class="text-blue-600 underline" href="https://www.rust-lang.org/">Rust</a>
            using
            <a class="text-blue-600 underline" href="https://en.wikipedia.org/wiki/Monte_Carlo_tree_search">Monte Carlo Tree Search</a>
            to determine the best play.
            The Rust version even allows for multi-threading making it extremely fast and intelligent.
            I have also put up an
            <a class="text-blue-600 underline" href="https://github.com/jorisperrenet/durak#elo-rating-of-players">ELO rating scheme</a>
            to determine the strength of the artificial players.</li> <li><a class="text-blue-600 underline" href="https://github.com/jorisperrenet/VectorMation">VectorMation</a>
            —
            This is an entirely vector-based math-oriented animation engine.
            It provides an alternative for
            <a class="text-blue-600 underline" href="https://github.com/3b1b/manim">manim</a>
            and it allows for animating scenes using SVGs.
            Although it is not very complete at the moment I have made the logo on my
            <a class="text-blue-600 underline" href="/">home page</a>
            with it (as well as
            <a class="text-blue-600 underline" href="https://github.com/jorisperrenet/VectorMation/tree/main/examples">some other examples</a>).
            The code uses a function-based approach
            <a class="text-blue-600 underline" href="https://github.com/jorisperrenet/VectorMation/tree/main#explanationgeneral-structuring-of-the-code">explained here</a>.</li> <li><a class="text-blue-600 underline" href="https://github.com/jorisperrenet/iscripts">iscripts</a>
            —
            These are installation scripts for my Arch Linux setup, allowing me to quickly install and set up my system on any computer. It also
            <a class="text-blue-600 underline" href="https://github.com/jorisperrenet/iscripts/blob/master/INSTALL.md">contains</a>
            a detailed instruction on how to install and configure Arch Linux.</li> <li><a class="text-blue-600 underline" href="https://github.com/jorisperrenet/MasterThesis">Master Thesis</a>
            —
            This repository contains the uncompiled version of my Master thesis conducted at Leiden University: <quote class="italic mx-auto">&quot;Decoding CSIDH: A guide to isogeny-based cryptography&quot;.</quote>
            It explains details of Finite Fields, Number Fields, and Elliptic Curves before we describe the CSIDH paper.</li> <li><a class="text-blue-600 underline" href="https://github.com/jorisperrenet/BachelorThesis">Bachelor Thesis</a>
            —
            This repository contains the uncompiled version of my thesis conducted at the TUDelft: <quote class="italic mx-auto">&quot;Methods for reducing error in approximations of the Rayleigh integral&quot;.</quote>
            It also
            <a class="text-blue-600 underline" href="https://github.com/jorisperrenet/BachelorThesis/blob/main/report/TUD-report2020.cls">includes</a>
            all the styling I used.</li></ul>`;return{c(){s=m(),e=d("div"),e.innerHTML=i,this.h()},l(t){g("svelte-15mlo1m",document.head).forEach(o),s=f(t),e=b(t,"DIV",{class:!0,"data-svelte-h":!0}),y(e)!=="svelte-1634zf"&&(e.innerHTML=i),this.h()},h(){document.title="Joris' projects",x(e,"class","text-justify w-full max-w-4xl mx-auto px-10 my-10 text-lg")},m(t,a){n(t,s,a),n(t,e,a)},p:r,i:r,o:r,d(t){t&&(o(s),o(e))}}}class C extends u{constructor(s){super(),p(this,s,null,M,h,{})}}export{C as component,S as universal};
