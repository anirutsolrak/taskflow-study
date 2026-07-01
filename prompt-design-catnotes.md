# Prompt para Claude Design — Rebranding e Redesign do CATNotes

## Contexto do projeto

Tenho um repositório de código já existente (acesso configurado) com um app full-stack de gerenciamento de tarefas, construído como projeto de estudo e portfólio. Stack: Next.js + React + TypeScript no frontend, FastAPI + Supabase no backend.

O app hoje se chama "Taskflow" e está com aparência genérica (visual padrão sem estilização, só Tailwind básico). Quero fazer um rebranding completo e redesenhar a interface.

## Novo nome e conceito de marca

**Nome: CATNotes**

Origem: as iniciais do meu nome formam a palavra "CAT" em inglês (gato). Quero abraçar esse conceito e construir a identidade visual em torno do tema gatos, de forma sutil e elegante, não infantil ou caricata.

A ideia é um app de produtividade com personalidade: sério o suficiente pra ser levado a sério como ferramenta de produtividade, mas com toques de humor e identidade através do tema gato (ícones, nome de funcionalidades, microinterações, mascote opcional).

## Direção visual

- Estilo: moderno e tech, mas com **cores neutras e gradientes sutis** (não quero neon ou cores muito saturadas)
- Paleta sugerida para explorar: tons neutros (cinza, off-white, preto suave) com um gradiente de destaque (pode ser explorado em tons como roxo-azulado, ou um tom terroso/quente que remeta a "gato" sem ser literal)
- Tipografia: moderna, legível, com personalidade mas não exagerada
- Evitar: ilustrações infantis de gato, clichês visuais óbvios (patinhas em todo canto, etc.) — o tema gato deve aparecer com sutileza e bom gosto

## Funcionalidades existentes que a interface precisa suportar

- Tela de login e registro (formulários simples, email e senha)
- Listagem de tarefas
- Criação de nova tarefa (input + botão)
- Marcar tarefa como concluída/pendente (toggle)
- Deletar tarefa
- Estado vazio (quando não há tarefas)
- Estado de carregamento

## O que preciso como entrega

1. Conceito de identidade visual: paleta de cores, tipografia, logo ou wordmark simples para "CATNotes"
2. Redesign das telas principais: login, registro, listagem de tarefas (com os estados vazio/carregando/com itens)
3. Componentes estilizados: card de tarefa, botões, inputs, formulários
4. Aplicação usando Tailwind CSS (mesma tecnologia já usada no projeto) para que eu consiga portar o resultado para o código real depois

## Observação importante

Esse projeto começou como portfólio/showcase, mas pode evoluir para uma ferramenta real de uso pessoal no futuro. O design não precisa ser "enxuto demais" pensando só em portfólio — pode ter um pouco mais de ambição visual, contanto que continue implementável com Tailwind sem complexidade excessiva.
