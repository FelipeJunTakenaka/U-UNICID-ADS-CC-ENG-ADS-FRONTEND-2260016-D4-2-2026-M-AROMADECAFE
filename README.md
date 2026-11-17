# ☕ Cafeteria Aroma de Café — Projeto Front-End 2026

> *Instituição:* UNICID — Curso Superior de Informática (Desenvolvimento Front-End)  
> *Turma:* U-UNICID-ADS-CC-ENG-ADS-FRONTEND-2260016-D4-2-2026-M-AROMADECAFE  
> *Professores:* Prof. Paulo Fratta e Profª. Tatiana  
> *Entrega:* 2ª Entrega Final (AV A1 / A2) — Novembro de 2026

Aplicação web institucional e educativa dedicada à venda de cafés especiais sustentáveis, ao fortalecimento da agricultura familiar local e à conscientização ambiental.

🌐 *Site Publicado (HTTPS):* https://aroma-de-cafe-production-8220c41b.up.railway.app/  
📂 *Repositório Oficial:* https://github.com/FelipeJunTakenaka/U-UNICID-ADS-CC-ENG-ADS-FRONTEND-2260016-D4-2-2026-M-AROMADECAFE

---

## 🎯 Objetivos e Relação com os ODS (ONU)

O projeto promove o consumo consciente e a inclusão social por meio de uma cafeteria fictícia com práticas responsáveis:
- *ODS 8 (Trabalho Decente e Crescimento Econômico):* Valorização de pequenos produtores rurais (comércio justo / Fairtrade) e geração de emprego para moradores da comunidade local.
- *ODS 12 (Consumo e Produção Responsáveis):* Redução de descartáveis, uso de embalagens biodegradáveis e reaproveitamento integral da borra de café em compostagem orgânica.
- *ODS 13 (Ação Contra a Mudança Global do Clima):* Educação ambiental sobre o impacto dos resíduos plásticos e incentivo a hábitos sustentáveis.
- *ODS 10 (Redução das Desigualdades):* Acessibilidade digital prioritária para pessoas com deficiência (WCAG AA).

---

## ✨ Funcionalidades Implementadas

- *Acessibilidade Digital (WCAG):* Barra de acessibilidade em todas as páginas com ajuste de escala de texto (A- / A+), modo de *Alto Contraste, leitura em voz alta (Web Speech API), navegação completa por teclado com foco visível, atalho *"Pular para o conteúdo", atributos ARIA e suporte ao *VLibras*.
- *JavaScript Interativo & localStorage:* Validação personalizada em tempo real nos formulários de Contato e Orçamento (preventDefault, mensagens de erro acessíveis e destaque visual), salvamento automático de rascunhos no navegador (localStorage), filtros dinâmicos e modal lightbox.
- *Recursos Multimídia:* Vídeo em destaque na página inicial, player HTML5 com controles personalizados, vídeos educativos incorporados (<iframe>) e galeria fotográfica documental estilo exposição de museu.
- *Design Responsivo:* Layout adaptável para dispositivos móveis, tablets e desktops utilizando CSS Grid, Flexbox e variáveis CSS.

---

## 🚀 Como Rodar o Projeto Localmente

1. *Clone o repositório:*
   bash
   git clone https://://github.com.git
   
2. *Acesse a pasta do projeto:*
   bash
   cd U-UNICID-ADS-CC-ENG-ADS-FRONTEND-2260016-D4-2-2026-M-AROMADECAFE
   
3. *Execute no navegador:*
   - Abra o arquivo index.html diretamente em qualquer navegador moderno, *ou*
   - Utilize a extensão *Live Server* no Visual Studio Code clicando em "Go Live" para simular o servidor HTTP local.

---

## 🗺️ Mapa do Site e Estrutura de Pastas

*Fluxo de Navegação:*  
Início → Sobre → Cardápio → Sustentabilidade → Projetos Sociais → Galeria → Notícias → Mídias → Orçamento → Contato

text
├── index.html                  # Página inicial com vídeo de fundo e apresentação
├── css/
│   ├── style.css               # Estilos globais, cabeçalho, acessibilidade e responsividade
│   ├── paginas.css             # Estilos das páginas internas (Sobre, Cardápio, Galeria, Mídias, Notícias)
│   └── orcamento.css           # Estilos específicos da página de Orçamento
├── js/
│   └── script.js               # Acessibilidade, Web Speech API, validações, localStorage e eventos DOM
├── paginas/
│   ├── sobre.html              # História, missão, visão, valores e equipe
│   ├── cardapio.html           # Catálogo de produtos sustentáveis com filtros e modal
│   ├── sustentabilidade.html   # Práticas ambientais e reaproveitamento de resíduos
│   ├── projetos.html           # Ações sociais e apoio a pequenos produtores
│   ├── galeria.html            # Exposição fotográfica documental com carrossel e lightbox
│   ├── noticias.html           # Artigos e novidades com busca e filtros
│   ├── midias.html             # Vídeos educativos, player HTML5 e Shorts
│   ├── orcamento.html          # Simulador de orçamento e comparativo de hospedagem
│   └── contato.html            # Formulário validado, canais de atendimento e redes sociais
├── img/                        # Imagens otimizadas do site e da exposição
├── video/                      # Arquivos de vídeo locais
├── docs/                       # Documentação acadêmica (escopo, diário de bordo, testes e IA)
├── LICENSE                     # Licença MIT
└── README.md                   # Documentação principal do repositório


---

## 📂 Documentação do Projeto (/docs)

Toda a documentação exigida na rubrica de avaliação está organizada na pasta /docs:
- *Escopo do Projeto:* Identificação, objetivos, público-alvo, requisitos funcionais e não funcionais.
- *Diário de Bordo:* Registro datado das decisões técnicas, dificuldades, aprendizados e histórico de uso de IA (prompts aceitos e revisados).
- *Melhorias desde o MVP:* Comparativo de antes e depois das correções aplicadas após a 1ª entrega.
- *Orçamento de Hospedagem e Domínio:* Análise comparativa de 3 provedores de hospedagem e 3 registros de domínio, com justificativa técnica pela escolha do *Railway*.
- *Evidências de Testes:* Relatórios e capturas de tela da validação W3C, testes de acessibilidade (WCAG / teclado) e responsividade.

---

## 👥 Integrantes da Equipe e Divisão de Papéis

| Integrante | Responsabilidades Principais |
| :--- | :--- |
| *Ednalvo Jose da Silva* | Desenvolvimento das páginas Sobre, Mídias e Galeria, curadoria visual e integração de IA |
| *Felipe Jun Takenaka* | Gestão do repositório GitHub, versionamento, deploy no Railway e integração geral |
| *Gabriel Camilo* | Estruturação HTML5 semântica e estilização CSS das páginas institucionais |
| *Geovane Santos* | Desenvolvimento de conteúdo educativo sobre sustentabilidade e projetos sociais |
| *Lucas Santos Silva* | Implementação de JavaScript interativo, validações e armazenamento com localStorage |
| *Priscila da Silva Souza* | Recursos de acessibilidade (WCAG), revisão de textos alternativos e documentação /docs |
| *Renan Lopes* | Layout responsivo (Grid/Flexbox), estilização CSS e testes multi-dispositivo |
| *Rhian Khelv* | Desenvolvimento da página de Contato, formulários e evidências de testes / W3C |

## Print da Validação W3C HTML
<img width="1333" height="565" alt="Validação W3C HTML" src="https://github.com/user-attachments/assets/d8fe186b-2872-43ff-b18f-7ae82079b1a7" />

## Print Validação CSS
<img width="1331" height="523" alt="Validação W3C CSS" src="https://github.com/user-attachments/assets/04c0e92d-598e-4689-85bf-8f7c00f007de" />
