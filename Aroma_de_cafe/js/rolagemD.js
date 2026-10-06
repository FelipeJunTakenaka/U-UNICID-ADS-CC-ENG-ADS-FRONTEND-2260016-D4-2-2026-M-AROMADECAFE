/**
 * Bounce
 * Exemplo didático - Jeito Senac
 */
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',function(e){
    e.preventDefault();
    const destino=document.querySelector(this.getAttribute('href'));
    if(!destino) return;
    const inicio=window.pageYOffset;
    const fim=destino.offsetTop;
    const distancia=fim-inicio;
    const duracao=2000;
    let inicioTempo=null;
    function animar(tempo){
      if(!inicioTempo) inicioTempo=tempo;
      const t=Math.min((tempo-inicioTempo)/duracao,1);
      const progresso=(()=>{
if(t<1/2.75)return 7.5625*t*t;
if(t<2/2.75){let x=t-1.5/2.75;return 7.5625*x*x+0.75;}
if(t<2.5/2.75){let x=t-2.25/2.75;return 7.5625*x*x+0.9375;}
let x=t-2.625/2.75;return 7.5625*x*x+0.984375;
})();
      window.scrollTo(0,inicio+distancia*progresso);
      if(t<1) requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  });
});
