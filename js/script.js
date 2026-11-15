// Valida os campos e guarda rascunhos e mensagens neste navegador.
const formContato = document.getElementById('formContato');
const respostaFormulario = document.getElementById('respostaFormulario');
const camposContato = ['nome', 'email', 'mensagem'].map((id) =>
  document.getElementById(id)
);
const chaveRascunho = 'aromaCafeRascunhoContato';
const chaveMensagens = 'aromaCafeMensagensContato';
let formularioEnviado = false;

function mostrarResposta(mensagem, tipo = '') {
  respostaFormulario.textContent = mensagem;
  respostaFormulario.className = `resposta ${tipo}`.trim();
}

// INÍCIO: formatação da data local.
// Retorna a data de hoje no formato ISO exigido pelo atributo min do input date,
// sem deslocar o dia por causa do fuso horário UTC.
function obterDataAtualISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
// FIM: formatação da data local.

function mensagemDeErro(campo) {
  const valor = campo.value.trim();

  if (campo.validity.badInput) {
    return 'Informe um valor válido.';
  }

  if (campo.validity.rangeUnderflow) {
    if (campo.dataset.validacao === 'data-atual') {
      return 'Escolha a data de hoje ou uma data posterior.';
    }

    return `Informe um valor igual ou maior que ${campo.min}.`;
  }

  if (campo.validity.rangeOverflow) {
    return `Informe um valor igual ou menor que ${campo.max}.`;
  }

  if (campo.validity.stepMismatch) {
    return 'Informe uma quantidade inteira.';
  }

  if (!valor && campo.required) {
    return 'Este campo é obrigatório.';
  }

  if (!valor) {
    return '';
  }

  if ((campo.id === 'nome' || campo.dataset.validacao === 'nome') && valor.length < 2) {
    return 'Informe um nome com pelo menos 2 caracteres.';
  }

  if (campo.dataset.validacao === 'telefone') {
    const digitos = valor.replace(/\D/g, '');
    const caracteresPermitidos = /^\+?[\d\s().-]+$/.test(valor);
    if (!caracteresPermitidos || !/^(?:55)?\d{10,11}$/.test(digitos)) {
      return 'Informe o telefone com DDD e 10 ou 11 dígitos. O código +55 é opcional.';
    }
  }

  if (campo.type === 'email' && campo.validity.typeMismatch) {
    return 'Digite um endereço de e-mail válido.';
  }

  if (campo.id === 'mensagem' && valor.length < 10) {
    return 'A mensagem deve ter pelo menos 10 caracteres.';
  }

  return '';
}

function validarCampo(campo) {
  if (campo.dataset.validacao === 'data-atual') {
    campo.min = obterDataAtualISO();
  }

  const mensagem = mensagemDeErro(campo);
  const idErro = `erro-${campo.id}`;
  let elementoErro = document.getElementById(idErro);

  if (!elementoErro) {
    elementoErro = document.createElement('span');
    elementoErro.id = idErro;
    elementoErro.className = 'erro-campo';
    elementoErro.setAttribute('aria-live', 'polite');
    campo.insertAdjacentElement('afterend', elementoErro);
  }

  elementoErro.textContent = mensagem;
  campo.classList.toggle('campo-invalido', Boolean(mensagem));
  campo.setAttribute('aria-invalid', String(Boolean(mensagem)));

  if (mensagem) {
    campo.setAttribute('aria-describedby', idErro);
  } else {
    campo.removeAttribute('aria-describedby');
  }

  return !mensagem;
}

function obterDadosFormulario() {
  return Object.fromEntries(
    camposContato.map((campo) => [campo.name, campo.value.trim()])
  );
}

if (formContato) {
  // Restaura o rascunho salvo anteriormente neste navegador.
  try {
    const rascunhoSalvo = localStorage.getItem(chaveRascunho);

    if (rascunhoSalvo) {
      const rascunho = JSON.parse(rascunhoSalvo);
      camposContato.forEach((campo) => {
        campo.value = rascunho[campo.name] || '';
      });
      mostrarResposta('Rascunho anterior restaurado.');
    }
  } catch (erro) {
    mostrarResposta('Não foi possível recuperar o rascunho salvo.', 'erro');
  }

  // Valida os campos ao sair deles e atualiza o destaque enquanto o usuário digita.
  camposContato.forEach((campo) => {
    campo.addEventListener('blur', () => validarCampo(campo));

    campo.addEventListener('input', () => {
      if (formularioEnviado || campo.getAttribute('aria-invalid') === 'true') {
        validarCampo(campo);
      }

      try {
        localStorage.setItem(chaveRascunho, JSON.stringify(obterDadosFormulario()));
      } catch (erro) {
        mostrarResposta('Não foi possível salvar o rascunho neste navegador.', 'erro');
      }
    });
  });

  formContato.addEventListener('submit', (evento) => {
    evento.preventDefault();
    formularioEnviado = true;

    const camposValidos = camposContato.map(validarCampo).every(Boolean);
    if (!camposValidos) {
      mostrarResposta('Revise os campos destacados antes de enviar.', 'erro');
      camposContato.find((campo) => campo.getAttribute('aria-invalid') === 'true').focus();
      return;
    }

    try {
      const mensagensSalvas = JSON.parse(localStorage.getItem(chaveMensagens) || '[]');
      if (!Array.isArray(mensagensSalvas)) {
        throw new Error('O conteúdo salvo não está no formato esperado.');
      }

      mensagensSalvas.push({
        ...obterDadosFormulario(),
        data: new Date().toISOString()
      });
      localStorage.setItem(chaveMensagens, JSON.stringify(mensagensSalvas));
      localStorage.removeItem(chaveRascunho);
    } catch (erro) {
      mostrarResposta('Não foi possível salvar sua mensagem neste navegador.', 'erro');
      return;
    }

    formContato.reset();
    camposContato.forEach((campo) => {
      campo.classList.remove('campo-invalido');
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
      document.getElementById(`erro-${campo.id}`)?.remove();
    });
    formularioEnviado = false;
    mostrarResposta(
      'Mensagem salva neste navegador. Para enviá-la à equipe, é necessário conectá-la a um servidor.',
      'sucesso'
    );
  });
}

// INÍCIO: menu responsivo compartilhado.
// Abre e fecha o menu em telas menores e garante o fechamento ao voltar no celular (bfcache).
const botaoMenu = document.getElementById('botaoMenu');
const menu = document.getElementById('menu');

function fecharMenuMobile() {
  if (!menu || !botaoMenu) return;
  menu.classList.remove('aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

botaoMenu?.addEventListener('click', () => {
  const menuAberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(menuAberto));
  botaoMenu.setAttribute('aria-label', menuAberto ? 'Fechar menu' : 'Abrir menu');
});

window.addEventListener('pageshow', fecharMenuMobile);

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', fecharMenuMobile);
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && menu?.classList.contains('aberto')) {
    fecharMenuMobile();
    botaoMenu?.focus();
  }
});
// FIM: menu responsivo compartilhado.

// INÍCIO: controles de acessibilidade compartilhados.
// Ajusta a escala do conteúdo, alterna o alto contraste e salva as preferências entre páginas.
const botaoAumentarTexto = document.getElementById('aumentarTexto');
const botaoDiminuirTexto = document.getElementById('diminuirTexto');
const botaoContraste = document.getElementById('alternarContraste');
const statusAcessibilidade = document.getElementById('statusAcessibilidade');
const chaveAltoContraste = 'aromaCafeAltoContraste';
const chaveEscalaConteudo = 'aromaCafeEscalaConteudo';
let escalaConteudo = 1;

function aplicarPreferenciasAcessibilidade() {
  try {
    const escalaSalva = parseFloat(localStorage.getItem(chaveEscalaConteudo));
    if (!Number.isNaN(escalaSalva) && escalaSalva >= 0.8 && escalaSalva <= 1.3) {
      escalaConteudo = escalaSalva;
      document.documentElement.style.setProperty('--escala-conteudo', escalaConteudo.toFixed(1));
    }

    const contrasteSalvo = localStorage.getItem(chaveAltoContraste) === 'true';
    document.body.classList.toggle('alto-contraste', contrasteSalvo);
    if (botaoContraste) {
      botaoContraste.setAttribute('aria-pressed', String(contrasteSalvo));
    }
  } catch (erro) {
    // Ignora falhas de acesso ao localStorage em navegação restrita
  }
}

function atualizarEscalaConteudo(diferenca) {
  escalaConteudo = Math.min(1.3, Math.max(0.8, escalaConteudo + diferenca));
  const valorFormatado = escalaConteudo.toFixed(1);
  document.documentElement.style.setProperty('--escala-conteudo', valorFormatado);
  try {
    localStorage.setItem(chaveEscalaConteudo, valorFormatado);
  } catch (erro) {}
  if (statusAcessibilidade) {
    statusAcessibilidade.textContent = `Tamanho do conteúdo: ${Math.round(escalaConteudo * 100)}%.`;
  }
}

botaoAumentarTexto?.addEventListener('click', () => atualizarEscalaConteudo(0.1));
botaoDiminuirTexto?.addEventListener('click', () => atualizarEscalaConteudo(-0.1));

botaoContraste?.addEventListener('click', () => {
  const contrasteAtivado = document.body.classList.toggle('alto-contraste');
  botaoContraste.setAttribute('aria-pressed', String(contrasteAtivado));
  try {
    localStorage.setItem(chaveAltoContraste, String(contrasteAtivado));
  } catch (erro) {}
  if (statusAcessibilidade) {
    statusAcessibilidade.textContent = contrasteAtivado
      ? 'Alto contraste ativado.'
      : 'Alto contraste desativado.';
  }
});

aplicarPreferenciasAcessibilidade();
window.addEventListener('pageshow', aplicarPreferenciasAcessibilidade);
// FIM: controles de acessibilidade compartilhados.



// INÍCIO: leitura em voz alta com a Web Speech API
// Lê o conteúdo principal e permite iniciar/parar a leitura por meio dos controles da página.
const botaoOuvirPagina = document.getElementById('ouvirPagina');
const botaoPararLeitura = document.getElementById('pararLeitura');
const falaDisponivel =
  'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let idLeitura = 0;

function falarTexto(texto) {
  if (!falaDisponivel || !texto.trim()) {
    return;
  }

  idLeitura += 1;
  const leituraAtual = idLeitura;
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 1;
  fala.onstart = () => {
    if (leituraAtual === idLeitura) {
      botaoPararLeitura.disabled = false;
    }
  };
  fala.onend = () => {
    if (leituraAtual === idLeitura) {
      botaoPararLeitura.disabled = true;
    }
  };
  fala.onerror = (evento) => {
    if (leituraAtual !== idLeitura) {
      return;
    }

    botaoPararLeitura.disabled = true;
    if (evento.error === 'canceled' || evento.error === 'interrupted') {
      return;
    }

    statusAcessibilidade.textContent = 'Não foi possível reproduzir a leitura em voz alta.';
  };

  botaoPararLeitura.disabled = false;
  window.speechSynthesis.speak(fala);
}

function obterTextoDaPagina() {
  const elementos = document.querySelectorAll(
    '.topo h1, .topo nav a, #conteudo-principal h1, #conteudo-principal h2, #conteudo-principal h3, ' +
      '#conteudo-principal h4, #conteudo-principal p, #conteudo-principal a, ' +
      '#conteudo-principal button, #conteudo-principal input, #conteudo-principal textarea, ' +
      '#conteudo-principal img[alt], .rodape p'
  );

  return Array.from(elementos)
    .map((elemento) => {
      if (elemento.matches('input, textarea')) {
        const rotulo = Array.from(document.querySelectorAll('label')).find(
          (label) => label.htmlFor === elemento.id
        );
        const obrigatorio = elemento.required ? 'Campo obrigatório.' : '';
        const valor = elemento.value.trim();
        return [rotulo?.textContent.trim(), obrigatorio, valor].filter(Boolean).join('. ');
      }

      if (elemento.matches('a') && !elemento.textContent.trim()) {
        return elemento.querySelector('img[alt]')?.alt || elemento.title;
      }

      return elemento.alt || elemento.innerText || elemento.textContent;
    })
    .map((texto) => texto.trim().replace(/[.?!]+$/, ''))
    .filter(Boolean)
    .join('. ');
}

if (falaDisponivel && botaoOuvirPagina && botaoPararLeitura && statusAcessibilidade) {
  botaoOuvirPagina.addEventListener('click', () => {
    falarTexto(obterTextoDaPagina());
  });

  botaoPararLeitura.addEventListener('click', () => {
    idLeitura += 1;
    window.speechSynthesis.cancel();
    botaoPararLeitura.disabled = true;
  });

  if (formContato) {
    formContato.addEventListener('focusin', (evento) => {
      if (!evento.target.matches('input, textarea')) {
        return;
      }

      const rotulo = Array.from(formContato.querySelectorAll('label')).find(
        (label) => label.htmlFor === evento.target.id
      );
      const erro = document.getElementById(`erro-${evento.target.id}`)?.textContent;
      const partes = [
        rotulo?.textContent.trim(),
        evento.target.required ? 'Campo obrigatório.' : '',
        evento.target.placeholder,
        evento.target.value.trim(),
        erro
      ]
        .filter(Boolean)
        .map((parte) => parte.replace(/[.?!]+$/, ''));

      falarTexto(partes.join('. '));
    });
  }
} else {
  if (botaoOuvirPagina) {
    botaoOuvirPagina.disabled = true;
  }
  if (botaoPararLeitura) {
    botaoPararLeitura.disabled = true;
  }
  if (statusAcessibilidade) {
    statusAcessibilidade.textContent =
      'A leitura em voz alta não está disponível neste navegador.';
  }
}
// FIM: leitura em voz alta com a Web Speech API

// INÍCIO: controles multimídia da página Mídias.
// Sincroniza o botão personalizado com o player HTML5 e permite avançar para 1:30
// somente quando a duração do vídeo torna esse ponto válido.
const videoAula = document.getElementById('videoAula');
const botaoPlayPauseVideo = document.getElementById('btnPlayPause');
const botaoPularVideo = document.getElementById('btnPular90');
const estadoVideoAula = document.getElementById('estadoVideoAula');

if (videoAula && botaoPlayPauseVideo && botaoPularVideo && estadoVideoAula) {
  function atualizarBotaoPlayPauseVideo() {
    const videoEmReproducao = !videoAula.paused && !videoAula.ended;
    botaoPlayPauseVideo.textContent = videoEmReproducao
      ? '⏸ Pausar vídeo'
      : '▶ Reproduzir vídeo';
    botaoPlayPauseVideo.setAttribute('aria-pressed', String(videoEmReproducao));
  }

  function atualizarBotaoPularVideo() {
    const podePularPara90Segundos =
      Number.isFinite(videoAula.duration) && videoAula.duration >= 90;
    botaoPularVideo.disabled = !podePularPara90Segundos;

    if (
      videoAula.readyState >= videoAula.HAVE_METADATA &&
      Number.isFinite(videoAula.duration) &&
      videoAula.duration < 90
    ) {
      estadoVideoAula.textContent =
        'O salto para 1 minuto e 30 segundos não está disponível porque este vídeo é mais curto.';
    }
  }

  function informarFalhaVideo() {
    botaoPlayPauseVideo.disabled = true;
    botaoPularVideo.disabled = true;
    estadoVideoAula.textContent =
      'Não foi possível carregar o vídeo local. Verifique se o arquivo está disponível e em formato compatível.';
  }

  botaoPlayPauseVideo.addEventListener('click', async () => {
    if (videoAula.paused || videoAula.ended) {
      try {
        await videoAula.play();
      } catch (erro) {
        estadoVideoAula.textContent =
          'Não foi possível iniciar a reprodução do vídeo neste navegador.';
      }
    } else {
      videoAula.pause();
    }
  });

  botaoPularVideo.addEventListener('click', () => {
    if (!Number.isFinite(videoAula.duration) || videoAula.duration < 90) {
      atualizarBotaoPularVideo();
      return;
    }

    try {
      videoAula.currentTime = 90;
      estadoVideoAula.textContent = 'O vídeo avançou para 1 minuto e 30 segundos.';
    } catch (erro) {
      estadoVideoAula.textContent = 'Não foi possível avançar o vídeo para esse ponto.';
    }
  });

  videoAula.addEventListener('play', atualizarBotaoPlayPauseVideo);
  videoAula.addEventListener('pause', atualizarBotaoPlayPauseVideo);
  videoAula.addEventListener('ended', atualizarBotaoPlayPauseVideo);
  videoAula.addEventListener('loadedmetadata', atualizarBotaoPularVideo);
  videoAula.addEventListener('durationchange', atualizarBotaoPularVideo);
  videoAula.addEventListener('error', informarFalhaVideo);

  atualizarBotaoPlayPauseVideo();
  atualizarBotaoPularVideo();

  if (videoAula.error) {
    informarFalhaVideo();
  }
}
// FIM: controles multimídia da página Mídias.

// INÍCIO: cálculo e envio do orçamento.
// Atualiza o total conforme as quantidades e prepara uma mensagem com os dados do
// formulário para abrir no WhatsApp; sem produtos, informa o erro e foca a primeira quantidade.
const formOrcamento = document.getElementById('formOrcamento');
const camposQuantidadeOrcamento = Array.from(
  document.querySelectorAll('#formOrcamento [data-preco]')
);
const valorTotalOrcamento = document.getElementById('valorTotal');
const statusOrcamento = document.getElementById('statusOrcamento');
const campoDataOrcamento = document.getElementById('dataOrcamento');
const camposFormularioOrcamento = formOrcamento
  ? Array.from(formOrcamento.querySelectorAll('input, select, textarea'))
  : [];
const chaveRascunhoOrcamento = 'aromaCafeRascunhoOrcamento';
const chaveSolicitacoesOrcamento = 'aromaCafeSolicitacoesOrcamento';
let formularioOrcamentoEnviado = false;

// INÍCIO: armazenamento local do orçamento.
// Salva e restaura o rascunho do formulário neste navegador e mantém os pedidos
// registrados localmente, seguindo o padrão utilizado no formulário de contato.
function obterDadosOrcamento() {
  return Object.fromEntries(new FormData(formOrcamento).entries());
}

function restaurarRascunhoOrcamento() {
  try {
    const rascunhoSalvo = localStorage.getItem(chaveRascunhoOrcamento);
    if (!rascunhoSalvo) {
      return;
    }

    const rascunho = JSON.parse(rascunhoSalvo);
    if (!rascunho || typeof rascunho !== 'object' || Array.isArray(rascunho)) {
      throw new Error('O rascunho salvo não está no formato esperado.');
    }

    camposFormularioOrcamento.forEach((campo) => {
      if (Object.prototype.hasOwnProperty.call(rascunho, campo.name)) {
        campo.value = String(rascunho[campo.name]);
      }
    });

    calcularTotalOrcamento();
    statusOrcamento.textContent = 'Rascunho anterior restaurado neste navegador.';
  } catch (erro) {
    statusOrcamento.textContent = 'Não foi possível recuperar o rascunho salvo neste navegador.';
  }
}

function salvarRascunhoOrcamento() {
  try {
    localStorage.setItem(
      chaveRascunhoOrcamento,
      JSON.stringify(obterDadosOrcamento())
    );
  } catch (erro) {
    statusOrcamento.textContent = 'Não foi possível salvar o rascunho neste navegador.';
  }
}
// FIM: armazenamento local do orçamento.

// INÍCIO: limite da data desejada.
// Bloqueia datas anteriores no seletor e atualiza o mínimo ao focar ou validar o campo,
// inclusive ao enviar o formulário se a página permanecer aberta durante a virada do dia.
if (campoDataOrcamento) {
  campoDataOrcamento.min = obterDataAtualISO();
  campoDataOrcamento.addEventListener('focus', () => {
    campoDataOrcamento.min = obterDataAtualISO();
  });
}
// FIM: limite da data desejada.

function calcularTotalOrcamento() {
  const total = camposQuantidadeOrcamento.reduce((soma, campo) => {
    const quantidade = Math.max(0, Math.floor(Number(campo.value) || 0));
    const preco = Number(campo.dataset.preco);
    return soma + quantidade * preco;
  }, 0);

  if (valorTotalOrcamento) {
    valorTotalOrcamento.textContent = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  return total;
}

if (formOrcamento && valorTotalOrcamento && statusOrcamento) {
  restaurarRascunhoOrcamento();

  // INÍCIO: validação dos campos do orçamento.
  // Reutiliza as mensagens e associações ARIA da página Contato; mostra erros ao sair
  // do campo e os atualiza enquanto se corrige o formulário.
  camposFormularioOrcamento.forEach((campo) => {
    campo.addEventListener('blur', () => validarCampo(campo));

    campo.addEventListener(campo.matches('select') ? 'change' : 'input', () => {
      if (formularioOrcamentoEnviado || campo.getAttribute('aria-invalid') === 'true') {
        validarCampo(campo);
      }
      salvarRascunhoOrcamento();
    });
  });
  // FIM: validação dos campos do orçamento.

  camposQuantidadeOrcamento.forEach((campo) => {
    campo.addEventListener('input', calcularTotalOrcamento);
  });

  formOrcamento.addEventListener('submit', (evento) => {
    evento.preventDefault();
    formularioOrcamentoEnviado = true;

    const camposValidos = camposFormularioOrcamento.map(validarCampo).every(Boolean);
    if (!camposValidos) {
      statusOrcamento.textContent = 'Revise os campos destacados antes de solicitar o orçamento.';
      camposFormularioOrcamento
        .find((campo) => campo.getAttribute('aria-invalid') === 'true')
        ?.focus();
      return;
    }

    const total = calcularTotalOrcamento();

    if (total <= 0) {
      statusOrcamento.textContent = 'Selecione pelo menos um produto para solicitar o orçamento.';
      camposQuantidadeOrcamento[0]?.focus();
      return;
    }

    const dados = new FormData(formOrcamento);
    const dadosParaArmazenar = Object.fromEntries(dados.entries());
    const produtos = camposQuantidadeOrcamento
      .map((campo) => {
        const quantidade = Math.max(0, Math.floor(Number(campo.value) || 0));
        if (quantidade === 0) {
          return '';
        }

        const nomeProduto = campo.closest('.orcamento-produto').querySelector('label').textContent.trim();
        return `${nomeProduto} - Quantidade: ${quantidade}`;
      })
      .filter(Boolean)
      .join('\n');

    // INÍCIO: registro local do pedido.
    // Guarda os dados do orçamento e remove o rascunho após o registro; se o
    // armazenamento falhar, informa o usuário sem impedir a abertura do WhatsApp.
    let pedidoRegistrado = false;
    try {
      const solicitacoesSalvas = JSON.parse(
        localStorage.getItem(chaveSolicitacoesOrcamento) || '[]'
      );
      if (!Array.isArray(solicitacoesSalvas)) {
        throw new Error('Os pedidos salvos não estão no formato esperado.');
      }

      solicitacoesSalvas.push({
        ...dadosParaArmazenar,
        produtos: camposQuantidadeOrcamento
          .map((campo) => {
            const quantidade = Math.max(0, Math.floor(Number(campo.value) || 0));
            if (quantidade === 0) {
              return null;
            }

            return {
              nome: campo.closest('.orcamento-produto').querySelector('label').textContent.trim(),
              quantidade,
              precoUnitario: Number(campo.dataset.preco)
            };
          })
          .filter(Boolean),
        valorTotal: total,
        registradoEm: new Date().toISOString()
      });
      localStorage.setItem(
        chaveSolicitacoesOrcamento,
        JSON.stringify(solicitacoesSalvas)
      );
      localStorage.removeItem(chaveRascunhoOrcamento);
      pedidoRegistrado = true;
    } catch (erro) {
      statusOrcamento.textContent =
        'Não foi possível registrar o orçamento neste navegador. O WhatsApp será aberto mesmo assim.';
    }
    // FIM: registro local do pedido.

    const mensagem = `Olá! Gostaria de solicitar um orçamento na Aroma de Café.

Nome: ${dados.get('nome')}
Telefone: ${dados.get('telefone')}
E-mail: ${dados.get('email')}
Tipo de pedido: ${dados.get('tipo')}
Data desejada: ${dados.get('data') || 'Não informada'}

PRODUTOS:
${produtos}

Valor estimado: ${total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}

Observações: ${dados.get('observacoes') || 'Nenhuma'}

Aguardo o retorno. Obrigado!`;

    // Substitua '5500000000000' pelo número real de teste da equipe, com código
    // do país e DDD, usando somente dígitos.
    const numeroWhatsApp = '5500000000000';
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    if (pedidoRegistrado) {
      statusOrcamento.textContent =
        'Orçamento registrado neste navegador. Abrindo o WhatsApp para enviá-lo.';
    }
    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
  });
}
// FIM: cálculo e envio do orçamento.

// INÍCIO: navegação por teclado nos diálogos.
// Mantém o foco dentro do diálogo aberto e devolve o foco ao botão que o abriu ao fechar.
const botoesQueAbremDialogo = '.botao-detalhes, .botao-ler';
const dialogos = document.querySelectorAll('.modal-fundo');
let ultimoAcionadorDialogo = null;

if (dialogos.length > 0) {
  document.addEventListener(
    'click',
    (evento) => {
      if (!(evento.target instanceof Element)) {
        return;
      }

      const acionador = evento.target.closest(botoesQueAbremDialogo);
      if (acionador) {
        ultimoAcionadorDialogo = acionador;
      }
    },
    true
  );

  dialogos.forEach((dialogo) => {
    const observadorDialogo = new MutationObserver(() => {
      if (!dialogo.hidden && dialogo.contains(document.activeElement)) {
        return;
      }

      if (dialogo.hidden && ultimoAcionadorDialogo) {
        if (ultimoAcionadorDialogo.isConnected && !ultimoAcionadorDialogo.hidden) {
          ultimoAcionadorDialogo.focus();
        }
        ultimoAcionadorDialogo = null;
      }
    });

    observadorDialogo.observe(dialogo, { attributes: true, attributeFilter: ['hidden'] });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab') {
      return;
    }

    const dialogoAberto = Array.from(dialogos).find((dialogo) => !dialogo.hidden);
    if (!dialogoAberto) {
      return;
    }

    const itensFocaveis = Array.from(
      dialogoAberto.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((item) => item.getClientRects().length > 0);
    const primeiroItem = itensFocaveis[0];
    const ultimoItem = itensFocaveis[itensFocaveis.length - 1];

    if (!primeiroItem) {
      evento.preventDefault();
      dialogoAberto.focus();
      return;
    }

    if (!dialogoAberto.contains(document.activeElement)) {
      evento.preventDefault();
      (evento.shiftKey ? ultimoItem : primeiroItem).focus();
    } else if (evento.shiftKey && document.activeElement === primeiroItem) {
      evento.preventDefault();
      ultimoItem.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimoItem) {
      evento.preventDefault();
      primeiroItem.focus();
    }
  });
}
// FIM: navegação por teclado nos diálogos.

// INÍCIO: interações acessíveis da página Galeria.
// Os blocos abaixo controlam o carrossel, os filtros e o modal de ampliação.
(() => {
  // INÍCIO: carrossel de destaques.
  // Atualiza o slide visível, o estado dos indicadores e anuncia mudanças.
  const slidesGaleria = Array.from(document.querySelectorAll('.carrossel-slide'));
  const indicadoresGaleria = Array.from(document.querySelectorAll('.carrossel-indicadores .indicador'));
  const botaoAnteriorGaleria = document.getElementById('btnAnterior');
  const botaoProximoGaleria = document.getElementById('btnProximo');
  const statusCarrosselGaleria = document.getElementById('statusCarrosselGaleria');

  if (slidesGaleria.length && botaoAnteriorGaleria && botaoProximoGaleria) {
    let slideAtualGaleria = Math.max(
      0,
      slidesGaleria.findIndex((slide) => slide.classList.contains('ativo'))
    );

    function mostrarSlideGaleria(indice, anunciar = true) {
      slideAtualGaleria = (indice + slidesGaleria.length) % slidesGaleria.length;

      slidesGaleria.forEach((slide, posicao) => {
        const ativo = posicao === slideAtualGaleria;
        slide.classList.toggle('ativo', ativo);
        slide.setAttribute('aria-hidden', String(!ativo));
        slide.setAttribute('aria-label', `Destaque ${posicao + 1} de ${slidesGaleria.length}`);
      });

      indicadoresGaleria.forEach((indicador, posicao) => {
        const ativo = posicao === slideAtualGaleria;
        indicador.classList.toggle('ativo', ativo);
        indicador.setAttribute('aria-pressed', String(ativo));
      });

      if (anunciar && statusCarrosselGaleria) {
        const titulo = slidesGaleria[slideAtualGaleria].querySelector('h3')?.textContent.trim();
        statusCarrosselGaleria.textContent =
          `Destaque ${slideAtualGaleria + 1} de ${slidesGaleria.length}: ${titulo}.`;
      }
    }

    botaoAnteriorGaleria.addEventListener('click', () => {
      mostrarSlideGaleria(slideAtualGaleria - 1);
    });

    botaoProximoGaleria.addEventListener('click', () => {
      mostrarSlideGaleria(slideAtualGaleria + 1);
    });

    indicadoresGaleria.forEach((indicador) => {
      indicador.addEventListener('click', () => {
        const indice = Number(indicador.dataset.slide);
        if (Number.isInteger(indice) && indice >= 0 && indice < slidesGaleria.length) {
          mostrarSlideGaleria(indice);
        }
      });
    });

    mostrarSlideGaleria(slideAtualGaleria, false);
  }
  // FIM: carrossel de destaques.

  // INÍCIO: filtros das salas temáticas.
  // Esconde as obras de outras salas e atualiza os estados e o anúncio de resultados.
  const botoesFiltroGaleria = Array.from(
    document.querySelectorAll('.salao-cabecalho .filtro')
  );
  const obrasGaleria = Array.from(document.querySelectorAll('.obra-museu'));
  const statusFiltroGaleria = document.getElementById('statusFiltroGaleria');

  if (botoesFiltroGaleria.length && obrasGaleria.length) {
    botoesFiltroGaleria.forEach((botao) => {
      botao.addEventListener('click', () => {
        const salaSelecionada = botao.dataset.sala;
        let totalVisivel = 0;

        botoesFiltroGaleria.forEach((outroBotao) => {
          const selecionado = outroBotao === botao;
          outroBotao.classList.toggle('ativo', selecionado);
          outroBotao.setAttribute('aria-pressed', String(selecionado));
        });

        obrasGaleria.forEach((obra) => {
          const pertence = salaSelecionada === 'todas' || obra.dataset.sala === salaSelecionada;
          obra.hidden = !pertence;
          if (pertence) {
            totalVisivel += 1;
          }
        });

        if (statusFiltroGaleria) {
          statusFiltroGaleria.textContent = salaSelecionada === 'todas'
            ? `Exibindo as ${totalVisivel} obras da exposição.`
            : `${totalVisivel} ${totalVisivel === 1 ? 'obra' : 'obras'} exibidas: ${botao.textContent.trim()}.`;
        }
      });
    });
  }
  // FIM: filtros das salas temáticas.

  // INÍCIO: lightbox de ampliação das obras.
  // Abre apenas pelo botão nomeado de cada ficha, preenche a descrição da obra e
  // coloca o foco no fechamento; o controle compartilhado mantém e devolve o foco.
  const lightboxGaleria = document.getElementById('lightboxMuseu');
  const imagemLightboxGaleria = document.getElementById('lightboxImg');
  const salaLightboxGaleria = document.getElementById('lightboxSala');
  const tituloLightboxGaleria = document.getElementById('lightboxTitulo');
  const descricaoLightboxGaleria = document.getElementById('lightboxDescricao');
  const fecharLightboxGaleria = document.getElementById('fecharLightbox');

  if (
    lightboxGaleria &&
    imagemLightboxGaleria &&
    salaLightboxGaleria &&
    tituloLightboxGaleria &&
    descricaoLightboxGaleria &&
    fecharLightboxGaleria
  ) {
    obrasGaleria.forEach((obra) => {
      const botaoAbrir = obra.querySelector('.abrir-lightbox');
      const imagemObra = obra.querySelector('.passe-partout img');
      const salaObra = obra.querySelector('.obra-numero');
      const tituloObra = obra.querySelector('h3');
      const descricaoObra = obra.querySelector('.plaqueta-obra p');

      if (!botaoAbrir || !imagemObra || !salaObra || !tituloObra || !descricaoObra) {
        return;
      }

      botaoAbrir.addEventListener('click', () => {
        imagemLightboxGaleria.src = imagemObra.src;
        imagemLightboxGaleria.alt = imagemObra.alt;
        salaLightboxGaleria.textContent = salaObra.textContent.trim();
        tituloLightboxGaleria.textContent = tituloObra.textContent.trim();
        descricaoLightboxGaleria.textContent = descricaoObra.textContent.trim();
        lightboxGaleria.hidden = false;
        fecharLightboxGaleria.focus();
      });
    });

    function fecharLightbox() {
      lightboxGaleria.hidden = true;
    }

    fecharLightboxGaleria.addEventListener('click', fecharLightbox);

    lightboxGaleria.addEventListener('click', (evento) => {
      if (evento.target === lightboxGaleria) {
        fecharLightbox();
      }
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && !lightboxGaleria.hidden) {
        fecharLightbox();
      }
    });
  }
  // FIM: lightbox de ampliação das obras.
})();
// FIM: interações acessíveis da página Galeria.
