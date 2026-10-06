/**
 * Elastic
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
      const progresso=(t===0||t===1)?t:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(2*Math.PI/3))+1;
      window.scrollTo(0,inicio+distancia*progresso);
      if(t<1) requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  });
});
