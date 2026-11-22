const $=s=>document.querySelector(s);
const DRINKS=["COCA","FANTA","MALTINA","VITALO","SPRITE","ENERGY MALT","XXL","NKOYI","CASTEL","BEAUFORT","TEMBO","AUTRES"];
const MAX=2;let sel=[];

// Invité personnalisé via ?invite=Kabanga&table=Samuel
const p=new URLSearchParams(location.search);
const guest=p.get("invite")||"",table=p.get("table")||"—";
let inviteRecord=null;
function showInvite(i){if(!i||!i.nom)return;inviteRecord=i;const label=(i.civilite?i.civilite+" ":"")+i.nom;$("#gName").textContent=label;$("#gInit").textContent=(i.nom||"I")[0].toUpperCase();$("#fName").value=label;const tag=document.querySelector(".guest .tag");if(tag)tag.textContent="♥ "+(i.civilite||"INVITÉ").toUpperCase()}
if(guest){const local=JSON.parse(localStorage.getItem("invites")||"[]").find(i=>i.id===guest);const fromLink={id:guest,nom:p.get("nom")||"",civilite:p.get("civilite")||""};if(local)showInvite(local);else if(fromLink.nom)showInvite(fromLink);else{$("#gName").textContent=guest;$("#gInit").textContent=guest[0].toUpperCase();$("#fName").value=guest}}
if(guest&&CONFIG.ENDPOINT)fetch(CONFIG.ENDPOINT+"?action=invite&id="+encodeURIComponent(guest)).then(r=>r.json()).then(showInvite).catch(()=>{});
$("#gTable").textContent=table;

// Rappels
$("#later").onclick=()=>$("#reminder").classList.remove("show");
$("#allow").onclick=async()=>{try{if("Notification"in window)await Notification.requestPermission()}catch(e){}$("#reminder").classList.remove("show")};

// Texte écrit à la plume
const html=`La joie est immense, Nous nous disons <b>OUI</b> pour la vie !

Nous avons l'honneur de vous convier à célébrer notre union.
Venez partager avec nous ce moment inoubliable d'amour et de bonheur, autour d'une soirée dansante et festive à la <a>Salle polyvalente MK</a> dont les détails sont repris plus bas en scrollant.

Votre présence sera un immense honneur et contribuera à rendre cette soirée encore plus magique.

Avec tout l'amour,
<b>David KABALA</b> &amp; <b>Laurene ASEMBA</b> ❤️`;
(function type(){const el=$("#typed");let i=0,out="";
  el.innerHTML=`<div class="ghost">${html}</div><div class="live"></div>`;const live=el.querySelector(".live");
  const tick=()=>{if(i>=html.length){live.innerHTML=html;return}
    if(html[i]==="<"){const j=html.indexOf(">",i);out+=html.slice(i,j+1);i=j+1}else if(html[i]==="&"){const j=html.indexOf(";",i);out+=html.slice(i,j+1);i=j+1}else out+=html[i++];
    live.innerHTML=out+'<span class="pen"></span>';setTimeout(tick,22)};
  new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){o.disconnect();tick()}}).observe(el)})();
const io=new IntersectionObserver(es=>es.forEach(e=>e.isTarget||e.isIntersecting&&e.target.classList.add("in")),{threshold:.4});
document.querySelectorAll(".prog li").forEach((li,i)=>{li.style.transitionDelay=i*.25+"s";io.observe(li)});


/* Galerie
const photos = [
    "photo.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg"
];

$("#grid").innerHTML = photos.map((photo, i) => `
  <img
    src="${photo}"
    alt="Souvenir ${i + 1}"
    style="
      object-position:${[10, 50, 90, 30, 70, 20, 60, 80][i]}% 40%;
      margin-top:${i % 2 ? 18 : 0}px;
    "
  >
`).join("");*/

// Galerie 3D : grille inclinée, colonnes qui bougent avec le curseur, tuile survolée éclairée avec son numéro


// GALERIE 3D ORIGINALE - VERSION 18 PHOTOS


(function () {
    function initGallery() {
        const stage = document.getElementById("gStage");
        const scene = document.getElementById("gScene");
        const plane = document.getElementById("gPlane");
        const sec = document.getElementById("gallery");

        if (!stage || !scene || !plane || !sec) {
            console.error("Galerie 3D : élément HTML manquant.");
            return;
        }

        const VW = 1362, VH = 571;

        const CAM = {
            P: 2353.9,
            ax: 28,
            ay: -15,
            az: 5,
            tx: 123.3,
            ty: -812.0
        };

        const X1 = -578.75;
        const CW = 285;
        const GAP = 17.1;
        const TH = 210;
        const PITCH = TH + GAP;

        const OFF = [588.2, 630.1, 614.0, 619.0];

        // Répartition verticale originale des 18 photos
        const PHOTOS_BY_COL = [
            [1, 5, 9, 13, 17],
            [2, 6, 10, 14, 18],
            [3, 7, 11, 15],
            [4, 8, 12, 16]
        ];

        const SRC = n => `photo/p${n}.jpg`;

        plane.innerHTML = "";

        // Inclinaison 3D originale
        plane.style.transform =
            `perspective(${CAM.P}px) rotateX(${CAM.ax}deg) rotateY(${CAM.ay}deg) rotateZ(${CAM.az}deg)`;

        // Recentrage horizontal conservé
        plane.style.left = (CAM.tx + 600) + "px";
        plane.style.top = CAM.ty + "px";

        const cols = [];

        for (let c = 0; c < 4; c++) {
            const col = document.createElement("div");
            col.className = "gcol";

            col.style.left = (X1 + c * (CW + GAP)) + "px";
            col.style.top = (OFF[c] - PITCH) + "px";

            PHOTOS_BY_COL[c].forEach((photoNumber, k) => {
                const tile = document.createElement("div");
                tile.className = "gtile";
                tile.style.top = (k * PITCH) + "px";

                const img = document.createElement("img");
                img.src = SRC(photoNumber);
                img.alt = `Souvenir ${photoNumber}`;
                img.draggable = false;

                img.onerror = () => {
                    console.error("Photo introuvable :", img.src);
                };

                tile.appendChild(img);

                const number = document.createElement("span");
                number.className = "gn";
                number.textContent = String(photoNumber).padStart(2, "0");

                tile.appendChild(number);
                col.appendChild(tile);
            });

            plane.appendChild(col);
            cols.push(col);
        }

        function fit() {
            const sx = stage.clientWidth / VW;
            const sy = stage.clientHeight / VH;

            scene.style.width = `${VW}px`;
            scene.style.height = `${VH}px`;
            scene.style.left = "50%";
            scene.style.top = "50%";
            scene.style.transform =
                `translate(-50%, -50%) scale(${Math.max(sx, sy)})`;
        }

        fit();
        window.addEventListener("resize", fit);

        // Réaction au curseur
        

        // ======================================
        // DOUBLE ANIMATION : GALERIE + COLONNES
        // ======================================

        // Mouvement global de la galerie
        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };

        // Intensité de rotation globale
        const MAX_X = 6;
        const MAX_Y = 5;

        // Mouvement individuel des colonnes (valeurs originales)
        const REF = {
            x: 554 / VW,
            y: 84 / VH
        };

        const A = [.142, -.19, -.0175, -.0065];
        const B = [0, 0, .08, -.07];
        const U1 = -.043;

        const tgt = { dx: 0, dy: 0 };
        const cur = { dx: 0, dy: 0 };

        // Suivi de la souris
        function move(e) {
            const r = stage.getBoundingClientRect();

            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;

            // Mouvement de toute la galerie
            target.x = (x - 0.5) * 2;
            target.y = (y - 0.5) * 2;

            // Mouvement individuel des colonnes
            tgt.dx = (x - REF.x) * VW;
            tgt.dy = (y - REF.y) * VH;
        }

        // Retour progressif au centre
        function resetGallery() {
            target.x = 0;
            target.y = 0;
            tgt.dx = 0;
            tgt.dy = 0;
        }

        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", resetGallery);

        // Animation combinée
        let last = performance.now();

        function loop(now) {
            const elapsed = now - last;
            last = now;

            const globalSpeed = 1 - Math.exp(-elapsed / 350);
            const columnSpeed = 1 - Math.exp(-elapsed / 200);

            // Lissage du mouvement global
            current.x += (target.x - current.x) * globalSpeed;
            current.y += (target.y - current.y) * globalSpeed;

            // Lissage des mouvements des colonnes
            cur.dx += (tgt.dx - cur.dx) * columnSpeed;
            cur.dy += (tgt.dy - cur.dy) * columnSpeed;

            // Rotation globale de la galerie
            const rotateY = CAM.ay + current.x * MAX_X;
            const rotateX = CAM.ax - current.y * MAX_Y;

            plane.style.transform =
                `perspective(${CAM.P}px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         rotateZ(${CAM.az}deg)`;

            // Animation individuelle originale des colonnes
            for (let c = 0; c < 4; c++) {
                const v = A[c] * cur.dy + B[c] * cur.dx;
                const u = c === 0 ? U1 * cur.dx : 0;

                cols[c].style.transform =
                    `translate(${u.toFixed(2)}px, ${v.toFixed(2)}px)`;
            }

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);



        console.log("Galerie 3D initialisée avec 18 photos et 4 colonnes.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initGallery);
    } else {
        initGallery();
    }
})();


// Boissons
$("#dgrid").innerHTML=DRINKS.map(d=>`<button data-d="${d}"><span>🥤</span>${d}</button>`).join("");
function refresh(){document.querySelectorAll("#dgrid button").forEach(b=>b.classList.toggle("on",sel.includes(b.dataset.d)));
  $("#count").textContent=`${sel.length}/${MAX} boisson${sel.length>1?"s":""} sélectionnée${sel.length>1?"s":""}`}
$("#dgrid").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset.d;$("#err").textContent="";
  if(sel.includes(d))sel=sel.filter(x=>x!==d);else{if(sel.length>=MAX){$("#err").textContent="Maximum 2 boissons.";return}sel.push(d)}refresh()};

// Confirmation
async function save(rec){
  if(CONFIG.ENDPOINT){await fetch(CONFIG.ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(rec)});return}
  const L=JSON.parse(localStorage.getItem("rsvp")||"[]");L.push(rec);localStorage.setItem("rsvp",JSON.stringify(L));
}
let busy=false;
$("#cta").onclick=async()=>{
  const name=$("#fName").value.trim();
  if(!name){$("#err").textContent="Veuillez saisir votre nom.";$("#fName").focus();return}
  if(!sel.length){$("#err").textContent="Choisissez au moins une boisson.";return}
  if(busy)return;busy=true;$("#cta").textContent="Envoi…";
  try{await save({date:new Date().toISOString(),nom:name,telephone:$("#fPhone").value.trim(),table,boissons:sel.join(" + ")});
    $("#thanks").classList.add("show");sel=[];refresh();
  }catch(e){$("#err").textContent="Échec de l'envoi, réessayez."}
  busy=false;$("#cta").textContent="👥 CONFIRMER MA PRÉSENCE";
};
$("#closeT").onclick=()=>$("#thanks").classList.remove("show");

// QR code d'invitation
try{new QRCode($("#qrbox"),{text:location.href.split("#")[0],width:256,height:256,colorDark:"#0b1a2b"})}catch(e){$("#qrbox").textContent="QR indisponible (connexion)"}
$("#dlQr").onclick=()=>{const c=$("#qrbox canvas");if(!c)return;const a=document.createElement("a");a.download="invitation-qr.png";a.href=c.toDataURL();a.click()};

// Pétales / particules
(function(){const c=$("#petals"),x=c.getContext("2d");let W,H;const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();onresize=rs;
  const P=Array.from({length:38},()=>({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,v:.3+Math.random()*.8,s:Math.random()*2,red:Math.random()<.4}));
  (function f(){x.clearRect(0,0,W,H);P.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.y/40+p.s)*.5;if(p.y>H){p.y=-10;p.x=Math.random()*W}
    x.beginPath();x.fillStyle=p.red?"rgba(255,255,255,.85)":"rgba(125,211,252,.75)";x.arc(p.x,p.y,p.r,0,7);x.fill()});requestAnimationFrame(f)})()})();

// Compte à rebours
(function(){const T=new Date(CONFIG.EVENT_DATE).getTime(),C=131.9;
  const set=(k,v,max)=>{document.getElementById("c_"+k).textContent=String(v).padStart(2,"0");document.getElementById("r_"+k).style.strokeDashoffset=C*(1-Math.min(v/max,1))};
  (function t(){let d=Math.max(0,T-Date.now());set("d",Math.floor(d/864e5),30);set("h",Math.floor(d%864e5/36e5),24);set("m",Math.floor(d%36e5/6e4),60);set("s",Math.floor(d%6e4/1e3),60);setTimeout(t,1000)})()})();

// Notification : rouvre la fenêtre de rappel
$("#bBell").onclick=()=>$("#reminder").classList.add("show");

// Musique (musique.mp3, sinon ambiance synthétisée)
let synth=null;
function startSynth(){const A=new (window.AudioContext||window.webkitAudioContext)(),g=A.createGain();g.gain.value=.05;g.connect(A.destination);
  const ch=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]];let i=0;
  const play=()=>{ch[i++%4].forEach(f=>{const o=A.createOscillator(),e=A.createGain();o.type="sine";o.frequency.value=f;e.gain.setValueAtTime(0,A.currentTime);e.gain.linearRampToValueAtTime(1,A.currentTime+1);e.gain.linearRampToValueAtTime(0,A.currentTime+3.4);o.connect(e);e.connect(g);o.start();o.stop(A.currentTime+3.5)})};
  play();const id=setInterval(play,3000);return{stop(){clearInterval(id);A.close()}}}
let playing=false;
$("#bMusic").onclick=async()=>{const a=$("#bgm");
  if(playing){a.pause();if(synth){synth.stop();synth=null}playing=false}
  else{try{await a.play()}catch(e){synth=startSynth()}playing=true}
  $("#bMusic").classList.toggle("on",playing)};

// Livre d'or
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let msgs=[];
const drawMsgs=()=>{$("#gbN").textContent=msgs.length;$("#msgs").innerHTML=msgs.slice().reverse().map(m=>`<div><b>${esc(m.nom)}</b>${esc(m.message)}<br><i>${new Date(m.date).toLocaleDateString("fr-FR")}</i></div>`).join("")||'<p style="font-size:12px;color:#999;text-align:center">Soyez le premier à écrire un message 💌</p>'};
async function loadMsgs(){if(CONFIG.ENDPOINT){try{const r=await fetch(CONFIG.ENDPOINT+"?action=messages");msgs=await r.json()}catch(e){msgs=[]}}else msgs=JSON.parse(localStorage.getItem("gb")||"[]");if(!Array.isArray(msgs))msgs=[];drawMsgs()}
loadMsgs();
$("#bBook").onclick=()=>{$("#gb").classList.add("show");if(guest&&!$("#gbName").value)$("#gbName").value=guest;loadMsgs()};
$("#closeG").onclick=()=>$("#gb").classList.remove("show");
$("#gSend").onclick=async()=>{const nom=$("#gbName").value.trim(),message=$("#gMsg").value.trim();
  if(!nom||!message){$("#gErr").textContent="Nom et message requis.";return}
  const rec={type:"message",date:new Date().toISOString(),nom,message};
  try{if(CONFIG.ENDPOINT)await fetch(CONFIG.ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(rec)});
    else localStorage.setItem("gb",JSON.stringify([...msgs,rec]));
    msgs.push(rec);drawMsgs();$("#gMsg").value="";$("#gErr").textContent=""}catch(e){$("#gErr").textContent="Échec de l'envoi, réessayez."}};

// Navigation entre pages : départ rapide puis ralentissement à l'arrivée
(function(){
  document.documentElement.classList.add("js");
  const intro=document.querySelector(".intro"),pgs=[...document.querySelectorAll(".pg")];
  const vh=()=>window.innerHeight,maxY=()=>document.documentElement.scrollHeight-vh();
  const last=()=>Math.max(0,intro.offsetHeight-vh());
  const topOf=e=>{let y=0;for(;e;e=e.offsetParent)y+=e.offsetTop;return y};
  const stops=()=>[{y:last(),el:intro},...pgs.map(p=>({y:Math.min(topOf(p),maxY()),el:p}))];
  const nearest=(s,y)=>s.reduce((a,b)=>Math.abs(b.y-y)<Math.abs(a.y-y)?b:a);
  let busy=false;
  // Deux temps : la section actuelle sort vite, puis la suivante entre en ralentissant (jamais 2 sections à l'écran)
  function jump(from,to,dir){busy=true;const H=innerHeight;
    const out=from.el.animate([{transform:"translateY(0)"},{transform:`translateY(${-dir*H}px)`}],{duration:260,easing:"cubic-bezier(.55,0,1,.45)",fill:"forwards"});
    out.onfinish=()=>{scrollTo(0,to.y);out.cancel();
      const inn=to.el.animate([{transform:`translateY(${dir*H}px)`},{transform:"translateY(0)"}],{duration:1000,easing:"cubic-bezier(.12,.9,.2,1)"});
      inn.onfinish=()=>setTimeout(()=>busy=false,120)}}
  function step(dir){const y=scrollY,s=stops();
    const to=dir>0?s.find(v=>v.y>y+2):[...s].reverse().find(v=>v.y<y-2);
    if(to)jump(nearest(s,y),to,dir)}
  function smooth(to){busy=true;scrollTo({top:to,behavior:"smooth"});setTimeout(()=>busy=false,600)}
  const paged=d=>d>0?scrollY>=last()-2:scrollY>last()+2;
  const modal=()=>document.querySelector(".modal.show");
  addEventListener("wheel",e=>{if(modal()||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    const d=Math.sign(e.deltaY);if(!d)return;
    if(busy){e.preventDefault();return}
    if(paged(d)){e.preventDefault();if(Math.abs(e.deltaY)>3)step(d)}
    else if(d>0&&scrollY+e.deltaY>last()){e.preventDefault();smooth(last())}},{passive:false});
  let y0=0;
  addEventListener("touchstart",e=>{y0=e.touches[0].clientY},{passive:true});
  addEventListener("touchmove",e=>{if(modal())return;if(busy){e.preventDefault();return}
    const dy=y0-e.touches[0].clientY;if(Math.abs(dy)>6&&paged(Math.sign(dy)))e.preventDefault()},{passive:false});
  addEventListener("touchend",e=>{if(modal()||busy)return;const dy=y0-e.changedTouches[0].clientY;
    if(Math.abs(dy)>45&&paged(Math.sign(dy)))step(Math.sign(dy))},{passive:true});
  addEventListener("keydown",e=>{if(modal()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    const k=e.key;let d=0;
    if(k==="ArrowDown"||k==="PageDown"||(k===" "&&!e.shiftKey))d=1;else if(k==="ArrowUp"||k==="PageUp"||(k===" "&&e.shiftKey))d=-1;
    else if(k==="Home"){e.preventDefault();if(!busy){const s=stops(),f=nearest(s,scrollY);if(scrollY>last()+2)jump(f,{y:0,el:intro},-1);else smooth(0)}return}else if(k==="End"){e.preventDefault();if(!busy){const s=stops(),f=nearest(s,scrollY),l=s[s.length-1];if(f!==l)jump(f,l,1)}return}
    if(d&&paged(d)){e.preventDefault();if(!busy)step(d)}});
  const vis=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("vis",e.intersectionRatio>=.5)),{threshold:[0,.5]});
  pgs.forEach(p=>vis.observe(p));
})();

// Taille des formes centrales : on agrandit chaque forme autant que l'écran le permet
(function(){
  const cfg=[
    {sec:".intro",els:[".card"],max:1.6,fitH:false},
    {sec:".cdpage",els:[".card3"],max:1.55,fitH:true},
    {sec:".rsvp",els:[".cta",".drinks"],max:1.45,fitH:true},
    {sec:".qrpg",els:[".qr"],max:1.8,fitH:true}];
  function fit(){const vw=innerWidth,vh=innerHeight;
    cfg.forEach(c=>{const s=document.querySelector(c.sec);if(!s)return;s.style.setProperty("--z",1);
      const els=c.els.map(q=>s.querySelector(q)).filter(Boolean);
      const w=Math.max(...els.map(e=>e.offsetWidth)),h=els.reduce((t,e)=>t+e.offsetHeight,0)+(els.length>1?26:0);
      let z=Math.min(c.max,(vw*.94)/w);if(c.fitH)z=Math.min(z,(vh-70)/h);
      s.style.setProperty("--z",Math.max(.7,z).toFixed(3))})}
  fit();addEventListener("resize",fit);if(document.fonts)document.fonts.ready.then(fit);
})();


