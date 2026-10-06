/*
    Javascript do Projeto Café Senac
*/

// 1. Pegamos elementos do HTML pelo id ou classe
const cBotaoMenu = document.getElementById('botaoMenu');
const cMenu = document.getElementById('menu');
const cProduto = document.querySelectorAll('.produto');
const cFormulario = document.getElementById('formContato');
const cRespostaFormulario = document.getElementById('respostaFormulario');

// 2. Ao clicar no botão, abre e fecha o menu no celular
cBotaoMenu.addEventListener('click',
    function () {
        // toggle (alternar) adiciona a classe se ela não existir e remove se ela existir
        cMenu.classList.toggle('aberto');   
    }
);

// 3. Fecha o menu quando o usuário clica em algum link
cMenu.addEventListener('click', 
    function () { 
        cMenu.classList.remove('aberto'); 
    }
);

// 4. Para cada produto do cardápio, criamos um evento de clique 
cProduto.forEach(function (produto) {
    produto.addEventListener('click', function () {

        // Primeiro removemos o destaque de todos os produtos
        cProduto.forEach(function (item) {
            item.classList.remove('selecionado');
        });

        // Depois destacamos o produto clicado
        produto.classList.add('selecionado');

    });
});
cFormulario.addEventListener('submit', function (event) {

    event.preventDefault();

    const cNome = document.getElementById('nome').value.trim();
    const cEmail = document.getElementById('email').value.trim();
    const cMensagem = document.getElementById('mensagem').value.trim();

    if (cNome === '' || cEmail === '' || cMensagem === '') {

        cRespostaFormulario.textContent =
            'Por favor, preencha todos os campos.';
        cRespostaFormulario.style.color = 'red';

    } else {

        cRespostaFormulario.textContent =
            `Obrigado, ${cNome}! Sua mensagem foi recebida.`;
        cRespostaFormulario.style.color = 'green';

        cFormulario.reset();
    }
});

// =============================================================
// 5. BANNER COM VÍDEO DE FUNDO
// =============================================================
// Pegamos os elementos responsáveis pelo banner.
const cBanner = document.getElementById('inicio');
const cVideoBanner = document.getElementById('videoBanner');
const cFonteVideoBanner = document.getElementById('fonteVideoBanner');

// Esta função ativa a imagem de fallback do CSS.
function ativarFallbackDoBanner() {
    if (cBanner) {
        cBanner.classList.add('video-fallback');
    }
}

// Só executamos a rotina se o vídeo existir nesta página.
if (cVideoBanner) {

    // Quando o navegador consegue carregar dados do vídeo,
    // removemos o fallback, caso ele tenha sido ativado antes.
    cVideoBanner.addEventListener('loadeddata', function () {
        cBanner.classList.remove('video-fallback');
    });

    // Se o elemento <video> apresentar erro, usamos a imagem.
    cVideoBanner.addEventListener('error', ativarFallbackDoBanner);

    // Alguns navegadores informam o erro diretamente no <source>.
    if (cFonteVideoBanner) {
        cFonteVideoBanner.addEventListener('error', ativarFallbackDoBanner);
    }

    // Tentamos iniciar a reprodução.
    // Se o navegador bloquear autoplay, mantemos o poster/fallback.
    const tentativaDeReproducao = cVideoBanner.play();

    if (tentativaDeReproducao !== undefined) {
        tentativaDeReproducao.catch(function () {
            ativarFallbackDoBanner();
        });
    }
}
