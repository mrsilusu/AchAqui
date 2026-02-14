# Guia de Contribuição - AchAqui

Obrigado por querer contribuir para o AchAqui! Este documento descreve como começar.

## 🤝 Tipos de Contribuição

- **Bug Fixes**: Corrigir erros identificados
- **Features**: Novas funcionalidades
- **Docs**: Melhorias na documentação
- **Tests**: Testes unitários e integração
- **Performance**: Otimizações
- **Translation**: Localização

## 📋 Antes de Começar

1. Ler este guia completamente
2. Ler [ARCHITECTURE.md](ARCHITECTURE.md) para entender a estrutura
3. Clonar o repositório
4. Instalar conforme [SETUP.md](SETUP.md)
5. Criar uma branch para sua contribuição

## 🔀 Workflow

### 1. Criar Issue (Recomendado)

Antes de fazer código, abra uma issue descrevendo:
- O que você quer fazer
- Por quê
- Possível implementação

```markdown
# Título Claro

## Descrição
[Descrição do problema ou feature]

## Por que?
[Contexto]

## Solução Proposta
[Como você resolveria]
```

### 2. Fork & Clone

```bash
# Fazer fork no GitHub
# https://github.com/mrsilusu/AchAqui

# Clonar seu fork
git clone https://github.com/SEU_USERNAME/AchAqui.git
cd AchAqui

# Adicionar upstream (seu fork é origin)
git remote add upstream https://github.com/mrsilusu/AchAqui.git
```

### 3. Criar Branch

```bash
# Atualizar main
git fetch upstream
git checkout main
git merge upstream/main

# Criar branch para sua feature
git checkout -b feature/sua-feature

# Ou para bug fix
git checkout -b fix/seu-bugfix
```

**Naming Convention:**
- `feature/nome-da-feature` para novas features
- `fix/nome-do-bug` para correções
- `docs/nome-da-doc` para documentação
- `test/nome-do-teste` para testes

### 4. Fazer Mudanças

```bash
# Backend (Node.js)
cd backend
npm run dev

# Mobile (React Native)
cd mobile
expo start
```

**Estrutura de Commits:**
```
type: descrição breve

descrição mais detalhada se necessário

Closes #123 (número da issue)
```

**Tipos:**
- `feat:` Nova feature
- `fix:` Bug fix
- `docs:` Documentação
- `style:` Formatação (sem lógica)
- `refactor:` Refatoração
- `perf:` Performance
- `test:` Testes

**Exemplo:**
```
feat: adicionar autenticação com phone

Implementa login e registro usando número de telefone
validado via OTP do WhatsApp.

Closes #42
```

### 5. Testar

```bash
# Backend
cd backend
npm run test
npm run lint

# Mobile
cd mobile
npm run lint
# Testar no emulador/device físico
```

### 6. Enviar PR

```bash
# Push para seu fork
git push origin sua-branch

# Abrir PR no GitHub
# https://github.com/mrsilusu/AchAqui/compare/main...

# Preencher template de PR
```

**Template de PR:**
```markdown
## Descrição
[Descrição clara do que você fez]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar?
[Passos para testar]

## Checklist
- [ ] Código segue style guide
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Sem warnings no console
```

---

## 🧪 Testando

### Backend

```bash
cd backend

# Todos os testes
npm test

# Teste específico
npm test -- auth.test.js

# Com coverage
npm test -- --coverage

# Linting
npm run lint
npm run lint:fix
```

### Mobile

```bash
cd mobile

# Linting
npm run lint:fix

# Testes (quando implementados)
npm test
```

---

## 📝 Coding Standards

### JavaScript/Node.js

```javascript
// ✅ BOM
const userName = 'João';
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ RUIM
const userName = 'João';
function CalculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i]['price'];
  }
  return sum;
}
```

### Convenções

- **Variáveis:** camelCase
- **Constantes:** UPPER_SNAKE_CASE (se globais)
- **Classes:** PascalCase
- **Arquivos:** lowercase com hífen ou camelCase
- **Funções:** verbos (getName, setUser, handleClick)
- **Booleans:** isActive, hasError, canEdit

### Comments

```javascript
// ✅ BOM
// Calcula desconto baseado em categoria
const applyDiscount = (price, category) => {
  return category === 'premium' ? price * 0.9 : price;
};

// ❌ RUIM
// desconto
const d = (p, c) => c === 'p' ? p * 0.9 : p;
```

### Tratamento de Erro

```javascript
// ✅ BOM
try {
  const data = await fetchServices();
  return data;
} catch (error) {
  logger.error('Erro ao buscar serviços:', error);
  throw new Error('Não foi possível buscar serviços');
}

// ❌ RUIM
try {
  const data = await fetchServices();
  return data;
} catch (error) {
  console.log('error'); // Não fazer isso!
}
```

---

## 📚 Estrutura do Projeto

### Backend `/backend/src`

```
├── config/          # DB, logger, etc
├── models/          # Mongoose schemas
├── controllers/     # Lógica de rotas
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── middlewares/     # Auth, validação
├── utils/           # Helpers reutilizáveis
└── index.js         # Entry point
```

### Mobile `/mobile/src`

```
├── screens/         # Telas do app
├── components/      # Componentes reutilizáveis
├── services/        # API client
├── stores/          # Redux (se usado)
├── navigation/      # Navegação
├── styles/          # Temas e constantes
└── utils/           # Helpers
```

---

## 🚨 Checklist Antes de PR

- [ ] Branch atualizada com `main`
- [ ] Código segue style guide
- [ ] Testes passam: `npm test`
- [ ] Sem warnings: `npm run lint`
- [ ] Documentação atualizada
- [ ] Nenhum console.log de debug
- [ ] Arquivo .env não foi commitado
- [ ] Commits com mensagens claras
- [ ] PR descreve bem as mudanças

---

## 🔄 Processo de Review

1. Mantenedor revisa PR
2. Pode pedir mudanças (approve with changes)
3. Você faz ajustes
4. Push na mesma branch
5. Ao ser aprovado, merge é feito

**Ser Receptivo:**
- Críticas são sobre o código, não você
- Aprenda com feedback
- Discuta se discorda

---

## 🌍 Localizações (i18n)

Quando adicionar strings new:

1. Não hard-code texto no código
2. Adicionar em arquivo de translations
3. Usar key: `t('welcome.title')`

```javascript
// ✅ BOM
const title = i18n.t('services.title');

// ❌ RUIM
const title = 'Serviços';
```

---

## 🚀 Deployment

Mudanças em `main` são deploy automaticamente.

Branches não são deployadas.

---

## 📞 Dúvidas?

- Comentar na Issue
- Abrir Discussion no GitHub
- Discord: (quando houver)

---

## 🙏 Agradecimentos

Toda contribuição, grande ou pequena, é valorizada!

Obrigado por ajudar o AchAqui crescer! 💚

---

**Última atualização**: Fevereiro 2026

---

## Exemplos de Boas PRs

- Pequenas e focadas (1 feature por PR)
- Bem testadas
- Bem documentadas
- Commits claros
- Descrição clara

## Exemplos de PRs Problemáticas

- Mudanças gigantes
- Sem testes
- Commits com "fix", "updates", etc
- Mixing de features
- Sem descrição
