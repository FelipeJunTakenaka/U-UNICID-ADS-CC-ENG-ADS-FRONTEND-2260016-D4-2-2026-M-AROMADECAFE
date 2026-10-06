/**
 * Ease In Out
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
      const progresso=t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
      window.scrollTo(0,inicio+distancia*progresso);
      if(t<1) requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  });
});
