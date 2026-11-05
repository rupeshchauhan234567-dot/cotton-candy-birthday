import { useEffect } from "react";
import { gsap } from "gsap";
export default function Confetti() {
  useEffect(() => {
    const layer=document.querySelector(".confetti-layer");
    if(!layer) return;
    layer.innerHTML="";
    for(let i=0;i<42;i++){
      const piece=document.createElement("i");
      piece.className="confetti-piece";
      piece.style.left=`${Math.random()*100}%`;
      piece.style.background=["#F5AFCB","#BCA5ED","#9CCFF0","#F5D58F","#A9D8BC"][i%5];
      layer.appendChild(piece);
      gsap.fromTo(piece,{y:-25,rotation:0,opacity:1},{y:window.innerHeight+70,rotation:Math.random()*600-300,x:Math.random()*150-75,duration:3+Math.random()*2,delay:Math.random(),ease:"power1.in",onComplete:()=>piece.remove()});
    }
  },[]);
  return <div className="confetti-layer" aria-hidden="true"/>;
}
