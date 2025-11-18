# Guia de UI/UX - CRM Agendamentos

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Design System](#design-system)
3. [Componentes](#componentes)
4. [Animações](#animações)
5. [Acessibilidade](#acessibilidade)
6. [Padrões de Uso](#padrões-de-uso)

---

## 🎨 Visão Geral

Este documento descreve as melhorias de UI/UX implementadas no CRM de Agendamentos, seguindo as melhores práticas modernas de design e experiência do usuário.

### Princípios de Design

1. **Clareza**: Interface limpa e intuitiva
2. **Consistência**: Padrões visuais uniformes
3. **Feedback**: Resposta visual imediata às ações
4. **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
5. **Performance**: Animações suaves e carregamento otimizado

---

## 🎨 Design System

### Cores

#### Cores Primárias
- **Primary**: Roxo (#9333ea) - Ações principais, elementos ativos
- **Success**: Verde (#10b981) - Confirmações, status positivo
- **Warning**: Amarelo (#f59e0b) - Alertas, pendências
- **Danger**: Vermelho (#ef4444) - Erros, exclusões
- **Info**: Azul (#3b82f6) - Informações adicionais

#### Cores de Interface
- **Background**: #f9fafb
- **Card Background**: #ffffff
- **Border**: #e5e7eb
- **Text Primary**: #111827
- **Text Secondary**: #6b7280

### Tipografia

```css
Font Family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif
Line Height: 1.5
Font Weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700
```

### Espaçamento

- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)

### Bordas

- **Radius SM**: 0.5rem (8px)
- **Radius MD**: 0.75rem (12px)
- **Radius LG**: 1rem (16px)
- **Radius XL**: 1.5rem (24px)
- **Radius Full**: 9999px

---

## 🧩 Componentes

### Button

Componente de botão altamente customizável com múltiplas variantes e tamanhos.

#### Variantes
- `primary`: Botão principal (roxo)
- `secondary`: Botão secundário (cinza)
- `danger`: Ações destrutivas (vermelho)
- `success`: Confirmações (verde)
- `ghost`: Botão transparente
- `outline`: Botão com borda

#### Tamanhos
- `xs`: Extra pequeno
- `sm`: Pequeno
- `md`: Médio (padrão)
- `lg`: Grande
- `xl`: Extra grande

#### Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

#### Exemplo de Uso
```tsx
import { Button } from '@/components/common';

<Button variant="primary" size="md" leftIcon={<PlusIcon />}>
  Novo Agendamento
</Button>

<Button variant="outline" isLoading>
  Salvando...
</Button>
```

---

### Input

Campo de entrada aprimorado com suporte a ícones, validação e estados.

#### Features
- Suporte a ícones à esquerda e direita
- Estados de foco visuais
- Validação com mensagens de erro
- Texto de ajuda
- Indicador de campo obrigatório
- Hover states

#### Props
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}
```

#### Exemplo de Uso
```tsx
import { Input } from '@/components/common';

<Input
  label="Nome do Cliente"
  placeholder="Digite o nome"
  required
  leftIcon={<UserIcon />}
  helperText="Nome completo do cliente"
  error={errors.nome?.message}
/>
```

---

### Select

Dropdown customizado com aparência moderna.

#### Features
- Seta dropdown customizada
- Estados de foco
- Suporte a ícone
- Placeholder configurável
- Opções desabilitadas

#### Props
```typescript
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
}
```

#### Exemplo de Uso
```tsx
import { Select } from '@/components/common';

<Select
  label="Status"
  placeholder="Selecione o status"
  options={[
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
  ]}
  required
/>
```

---

### Modal

Modal moderno com animações suaves e acessibilidade.

#### Features
- Animações de entrada/saída
- Fechamento por ESC
- Fechamento por overlay (configurável)
- Footer customizável
- Múltiplos tamanhos
- Focus trap

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}
```

#### Exemplo de Uso
```tsx
import { Modal, Button } from '@/components/common';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmar Exclusão"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Excluir
      </Button>
    </>
  }
>
  <p>Tem certeza que deseja excluir este agendamento?</p>
</Modal>
```

---

### Badge

Componente para exibir status, contadores e tags.

#### Variantes
- `primary`: Roxo
- `success`: Verde
- `warning`: Amarelo
- `danger`: Vermelho
- `info`: Azul
- `default`: Cinza

#### Features
- Dot indicator opcional
- Ícone customizável
- Clicável (opcional)
- Tamanhos variados

#### Exemplo de Uso
```tsx
import { Badge, StatusBadge, CountBadge } from '@/components/common';

<Badge variant="success" dot>Confirmado</Badge>
<StatusBadge status="pendente" />
<CountBadge count={5} />
```

---

### Loading

Componente de carregamento com múltiplas variantes.

#### Variantes
- `spinner`: Spinner circular (padrão)
- `dots`: Três pontos animados
- `pulse`: Círculo pulsante
- `bars`: Barras animadas

#### Modos
- Normal: Inline
- `fullScreen`: Tela cheia
- `overlay`: Sobreposição com backdrop

#### Exemplo de Uso
```tsx
import { Loading, InlineLoading } from '@/components/common';

<Loading variant="spinner" size="lg" message="Carregando..." />
<Loading variant="dots" overlay />
<InlineLoading text="Processando..." />
```

---

### Skeleton

Estados de carregamento com skeleton screens.

#### Variantes
- `text`: Linha de texto
- `title`: Título
- `avatar`: Avatar circular
- `rectangular`: Retangular
- `circular`: Circular

#### Componentes Compostos
```tsx
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonDashboard
} from '@/components/common';

// Skeleton básico
<Skeleton variant="text" count={3} />

// Componentes pré-configurados
<SkeletonCard />
<SkeletonTable rows={5} />
<SkeletonList items={3} />
<SkeletonDashboard />
```

---

## ✨ Animações

### Animações Disponíveis

#### Fade In
```css
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

#### Slide Up
```css
.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
```

#### Slide Down
```css
.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}
```

#### Scale In
```css
.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}
```

#### Shimmer (Skeleton)
```css
.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
```

### Transições

Todos os componentes interativos incluem transições suaves:
- **Duration**: 200ms
- **Timing**: ease-out
- **Properties**: colors, transform, shadow

---

## ♿ Acessibilidade

### Implementações

1. **ARIA Labels**: Todos os ícones e botões incluem labels apropriados
2. **Focus States**: Estados de foco visíveis em todos os elementos interativos
3. **Keyboard Navigation**: Suporte completo para navegação por teclado
4. **Screen Readers**: Atributos ARIA para leitores de tela
5. **Color Contrast**: Todas as combinações de cores atendem WCAG 2.1 AA

### Exemplo de Focus Ring
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Botão Acessível
</button>
```

---

## 📐 Padrões de Uso

### Layout Responsivo

#### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

#### Grid System
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

### Cards Interativos

Use a classe `card-interactive` para cards clicáveis:

```tsx
<div className="card-interactive" onClick={handleClick}>
  {/* Conteúdo */}
</div>
```

---

### Estados Vazios

Use a estrutura empty-state para páginas/seções vazias:

```tsx
<div className="empty-state">
  <svg className="empty-state-icon">...</svg>
  <h3 className="empty-state-title">Nenhum resultado encontrado</h3>
  <p className="empty-state-description">
    Tente ajustar os filtros ou criar um novo registro
  </p>
</div>
```

---

### Feedback Visual

#### Hover States
Todos os elementos interativos possuem estados de hover:
- Botões: Escurecem e aumentam shadow
- Cards: Aumentam shadow e escala
- Links: Mudam de cor

#### Active States
Elementos clicáveis incluem `active:scale-95` para feedback tátil

#### Loading States
Sempre mostre indicadores durante operações assíncronas:
```tsx
<Button isLoading={isSubmitting}>Salvar</Button>
```

---

## 🎯 Melhores Práticas

### 1. Consistência Visual
- Use sempre os componentes do design system
- Mantenha espaçamento consistente
- Siga a hierarquia visual estabelecida

### 2. Performance
- Use Skeleton ao invés de spinners quando possível
- Lazy load de componentes pesados
- Otimize imagens e assets

### 3. Acessibilidade
- Sempre inclua labels em campos de formulário
- Use cores com contraste adequado
- Teste com leitor de tela

### 4. Responsividade
- Design mobile-first
- Teste em múltiplos dispositivos
- Use classes responsivas do Tailwind

### 5. Feedback ao Usuário
- Confirme ações importantes
- Mostre estados de loading
- Exiba mensagens de erro claras

---

## 🚀 Próximos Passos

### Melhorias Futuras
- [ ] Tema escuro (dark mode)
- [ ] Mais variantes de componentes
- [ ] Biblioteca de ícones customizados
- [ ] Componente de Toast customizado
- [ ] Sistema de grid drag-and-drop
- [ ] Animações mais complexas (framer-motion)

---

## 📚 Recursos

### Referências
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io)

### Ferramentas
- Figma para design
- Storybook para documentação de componentes
- Lighthouse para auditoria de acessibilidade

---

**Versão**: 1.0
**Última Atualização**: Novembro 2025
**Autor**: Equipe de Desenvolvimento
