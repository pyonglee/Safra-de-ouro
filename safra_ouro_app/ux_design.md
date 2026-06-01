# Safra de Ouro — UX Specification

## Design Direction

### Theme
- **Light theme** — rural producers often work outdoors in bright sunlight; light backgrounds with warm earth tones ensure readability
- Background: warm off-white `#FAF6F1` with subtle grain texture
- Surface cards: `#FFFFFF` with warm shadow
- Secondary surface: `#F5EFE6`

### Color Palette
- **Primary (Coffee Brown):** `#6B4226`
- **Accent (Gold):** `#D4A017`
- **Success (Green):** `#2E7D32`
- **Error:** `#C62828`
- **Text Primary:** `#3E2723`
- **Text Secondary:** `#795548`
- **Gradient buttons:** linear-gradient(`#6B4226`, `#8D6E63`) with gold accent highlights

### Typography
- **Display/Heading:** "Bitter" (Google Fonts) — warm serif feel matching coffee theme
- **Body:** "Nunito" (Google Fonts) — rounded, friendly, easy to read
- Scale: Display 32px → H1 24px → H2 20px → Body 16px → Caption 13px

### Iconography
- Rounded, filled icons from MaterialCommunityIcons
- Coffee bean motif in logo and empty states

---

## File Structure

```
app/
  _layout.tsx              # Root layout: AuthProvider, theme, font loading
  auth/
    _layout.tsx            # If isAuthenticated → <Redirect href="/tabs" />; else <Stack>
    login.tsx              # Login screen
    signup.tsx             # Signup screen
  tabs/
    _layout.tsx            # If !isAuthenticated → <Redirect href="/auth/login" />; else <Tabs> with 5 tabs
    index.tsx              # Tab 1: Dashboard (Painel)
    trabalhadores.tsx      # Tab 2: Workers (Trabalhadores)
    despesas.tsx           # Tab 3: Expenses (Despesas)
    producao.tsx           # Tab 4: Production (Produção)
    mais.tsx               # Tab 5: More (Mais) — quotations, reports, settings, profile
  worker/
    [id]/
      index.tsx            # Worker detail + payment history
  add-worker.tsx           # Add/edit worker
  add-balaio.tsx           # Record daily balaios
  expense/
    [id]/
      index.tsx            # Expense detail
  add-expense.tsx          # Add expense form
  harvest/
    [id]/
      index.tsx            # Harvest detail + profit analysis
  add-harvest.tsx          # Add/edit harvest (safra)
  add-production.tsx       # Record sacks for a harvest
  cotacoes.tsx             # Coffee quotations panel
  add-cotacao.tsx          # Add/edit quotation
  relatorios.tsx           # Reports screen
  perfil.tsx               # Profile + settings + logout
  config-preco.tsx         # Configure price per balaio
```

---

## Screens

### 1. Login (`auth/login.tsx`)
- **Purpose:** Authenticate existing users
- **UI Elements:**
  - App logo (coffee bean + "Safra de Ouro" in Bitter font, gold color)
  - Email input (floating label, keyboard type email)
  - Password input (floating label, secure entry, toggle visibility)
  - "Entrar" gradient button (primary→lighter brown)
  - "Criar conta" text link below
- **Actions:** Submit credentials → AuthProvider updates state; layout switches to tabs. Tap "Criar conta" → push signup screen.

### 2. Signup (`auth/signup.tsx`)
- **Purpose:** Register new users
- **UI Elements:**
  - App logo (smaller)
  - Name input
  - Email input
  - Password input (min 6 chars, strength indicator)
  - "Criar conta" gradient button
  - "Já tenho conta" text link
- **Actions:** Submit → AuthProvider updates state; layout switches to tabs. Tap "Já tenho conta" → pop back to login.

### 3. Dashboard (`tabs/index.tsx`)
- **Purpose:** Overview of key farm indicators
- **Tab label:** "Painel" with icon `view-dashboard`
- **UI Elements:**
  - Header: "Safra de Ouro" title + profile avatar button (top right, navigates to perfil.tsx)
  - Current harvest selector (dropdown showing harvest years e.g. "Safra 2024")
  - **Summary cards row (horizontal scroll):**
    - "Produção" — total sacks for selected harvest, green icon `package-variant`
    - "Receita" — total revenue (sacks × sale price), gold icon `cash`
    - "Despesas" — total expenses + worker payments, brown icon `cash-minus`
    - "Lucro" — net profit with margin %, green/red based on positive/negative
  - **Recent Activity list** (last 5 items across all types: balaio records, expenses, production entries) — each item shows icon, description, date, value
  - **Quick Actions row:** 4 icon buttons — "Registrar Balaios", "Nova Despesa", "Registrar Produção", "Cotações"
- **Actions:** Tap summary card → navigate to respective detail. Tap quick action → navigate to respective add screen. Tap profile → push perfil.tsx.
- **Data needed:** GET /api/dashboard?harvestId=UUID

### 4. Workers List (`tabs/trabalhadores.tsx`)
- **Purpose:** Manage workers and daily balaio records
- **Tab label:** "Trabalhadores" with icon `account-group`
- **UI Elements:**
  - Header with title + "Preço/Balaio: R$ 40,00" chip (tappable → push config-preco.tsx)
  - FAB button "+" to add worker
  - "Registrar Balaios" prominent button at top
  - Worker list (FlashList): each card shows worker name, total balaios (current harvest), total earned (R$), last record date
  - Empty state: coffee bean illustration + "Nenhum trabalhador cadastrado"
- **Actions:** Tap worker → push worker/[id]/index.tsx. Tap FAB → push add-worker.tsx. Tap "Registrar Balaios" → push add-balaio.tsx. Tap price chip → push config-preco.tsx.

### 5. Add Worker (`add-worker.tsx`)
- **Purpose:** Register a new worker
- **UI Elements:**
  - Header "Novo Trabalhador" with back arrow
  - Name input (required)
  - "Salvar" gradient button
- **Actions:** Save → POST /api/workers → pop back.

### 6. Record Balaios (`add-balaio.tsx`)
- **Purpose:** Record daily baskets harvested per worker
- **UI Elements:**
  - Header "Registrar Balaios" with back arrow
  - Date picker (defaults to today)
  - Harvest selector (defaults to current/latest harvest)
  - Worker selector (dropdown or searchable list)
  - Balaios count input (numeric, large font for easy input)
  - Current price display: "Preço: R$ 40,00/balaio"
  - Auto-calculated total: "Total: R$ 160,00" (updates live)
  - "Salvar" gradient button
  - Below: quick-entry list showing today's records with worker name, balaios, total — swipe to delete
- **Actions:** Save → POST /api/balaio-records. Can record multiple workers in sequence without leaving screen.

### 7. Worker Detail (`worker/[id]/index.tsx`)
- **Purpose:** View worker details and payment history
- **UI Elements:**
  - Header with worker name + edit icon
  - Summary card: total balaios, total earned, average balaios/day
  - Harvest filter (dropdown)
  - Payment history list: date, balaios count, price per balaio, total — grouped by month
  - Bottom total bar
- **Data needed:** GET /api/workers/:id, GET /api/balaio-records?workerId=UUID&harvestId=UUID

### 8. Configure Price (`config-preco.tsx`)
- **Purpose:** Set price per balaio
- **UI Elements:**
  - Header "Preço por Balaio"
  - Current price display (large)
  - New price input (currency formatted R$)
  - "Salvar" button
  - Note: "O novo preço será aplicado apenas aos registros futuros"
- **Actions:** Save → POST /api/settings (key: pricePerBalaio)

### 9. Expenses List (`tabs/despesas.tsx`)
- **Purpose:** View and manage all expenses
- **Tab label:** "Despesas" with icon `cash-minus`
- **UI Elements:**
  - Header with title
  - Harvest filter dropdown
  - Category filter chips: "Todos", "Adubo", "Pulverização", "Outros"
  - Total expenses banner for current filter
  - Expense list (FlashList): each card shows category icon, type/description, date, area, cost (R$)
  - FAB "+" to add expense
  - Empty state with illustration
- **Actions:** Tap expense → push expense/[id]/index.tsx. Tap FAB → push add-expense.tsx.

### 10. Add Expense (`add-expense.tsx`)
- **Purpose:** Record a new expense
- **UI Elements:**
  - Header "Nova Despesa" with back arrow
  - Category selector: "Adubo" (fertilizer), "Pulverização" (spraying), "Outro" (other)
  - Harvest selector
  - Type/product name input (text, e.g. "NPK 20-05-20")
  - Date picker
  - Quantity input + unit selector (kg, L, unidade)
  - Applied area input (hectares) — optional
  - Cost input (R$ currency formatted, required)
  - Notes input (optional, multiline)
  - "Salvar" gradient button
- **Actions:** Save → POST /api/expenses → pop back.

### 11. Expense Detail (`expense/[id]/index.tsx`)
- **Purpose:** View expense details
- **UI Elements:**
  - All fields displayed in read-only card format
  - Edit button (top right) — navigates to add-expense.tsx with pre-filled data (pass expenseId as query param)
  - Delete button (bottom, red outline) with confirmation dialog
- **Actions:** Edit → push add-expense.tsx?expenseId=UUID. Delete → DELETE /api/expenses/:id → pop back.

### 12. Production (`tabs/producao.tsx`)
- **Purpose:** Track sacks harvested per harvest year
- **Tab label:** "Produção" with icon `sprout`
- **UI Elements:**
  - Header with title
  - "Nova Safra" button (top right) → push add-harvest.tsx
  - Harvest list: each card shows year/name, total sacks, sale price per sack, total revenue, profit indicator (green/red chip)
  - Bar chart comparing production across harvests (last 5)
  - FAB "+" → push add-production.tsx
  - Empty state
- **Actions:** Tap harvest card → push harvest/[id]/index.tsx. Tap "+" → push add-production.tsx.

### 13. Add Harvest (`add-harvest.tsx`)
- **Purpose:** Create a new harvest (safra)
- **UI Elements:**
  - Header "Nova Safra"
  - Name/year input (e.g. "Safra 2024" or "2024/2025")
  - Sale price per sack input (R$)
  - Start date picker (optional)
  - End date picker (optional)
  - "Salvar" button
- **Actions:** Save → POST /api/harvests → pop back.

### 14. Add Production (`add-production.tsx`)
- **Purpose:** Record sacks produced
- **UI Elements:**
  - Header "Registrar Produção"
  - Harvest selector (required)
  - Date picker
  - Number of sacks input (numeric)
  - Notes input (optional)
  - "Salvar" button
- **Actions:** Save → POST /api/production-records → pop back.

### 15. Harvest Detail (`harvest/[id]/index.tsx`)
- **Purpose:** Detailed view of a harvest with profit analysis
- **UI Elements:**
  - Header with harvest name + edit icon
  - **Production section:** total sacks, list of production records (date, sacks)
  - **Revenue card:** total sacks × sale price = total revenue
  - **Expenses card:** fertilizer total, spraying total, other total, worker payments total → grand total expenses
  - **Profit card (prominent):** Revenue − Expenses = Net Profit, profit margin %, colored green/red
  - Edit harvest button, delete harvest button (with confirmation)
- **Data needed:** GET /api/harvests/:id (includes aggregated financials)

### 16. More Tab (`tabs/mais.tsx`)
- **Purpose:** Access to quotations, reports, profile/settings
- **Tab label:** "Mais" with icon `dots-horizontal`
- **UI Elements:**
  - Menu list with icons:
    - "Cotações de Café" → push cotacoes.tsx
    - "Relatórios" → push relatorios.tsx
    - "Perfil e Configurações" → push perfil.tsx
  - App version at bottom

### 17. Coffee Quotations (`cotacoes.tsx`)
- **Purpose:** View and manage coffee price quotations
- **UI Elements:**
  - Header "Cotações de Café"
  - Current quotations cards: each shows coffee type (Arábica, Robusta/Conilon, etc.), current price per sack (R$), date of last update, trend arrow (up/down vs previous)
  - FAB "+" to add quotation
  - Price history section: simple line chart for selected coffee type
  - History list below chart
- **Actions:** Tap FAB → push add-cotacao.tsx. Tap history item to view details.

### 18. Add Quotation (`add-cotacao.tsx`)
- **Purpose:** Manually enter a coffee quotation
- **UI Elements:**
  - Header "Nova Cotação"
  - Coffee type selector: "Arábica", "Robusta/Conilon", "Cereja", "Bica Corrida" (or custom text input)
  - Price per sack input (R$)
  - Date picker (defaults to today)
  - Source/notes input (optional)
  - "Salvar" button
- **Actions:** Save → POST /api/quotations → pop back.

### 19. Reports (`relatorios.tsx`)
- **Purpose:** Generate and view reports
- **UI Elements:**
  - Header "Relatórios"
  - Harvest selector (filter)
  - Date range picker (optional)
  - Report type cards:
    - "Despesas por Produto" — grouped expense breakdown
    - "Pagamentos de Trabalhadores" — worker payment summary
    - "Produção por Safra" — production summary
    - "Lucro Detalhado" — full profit breakdown
  - Tapping a card expands it inline showing the report data in a table/list format
  - "Exportar" button per report (generates shareable text/CSV via Share sheet)
- **Data needed:** GET /api/reports/:type?harvestId=UUID&startDate=ISO8601&endDate=ISO8601

### 20. Profile & Settings (`perfil.tsx`)
- **Purpose:** User profile, settings, logout
- **UI Elements:**
  - User name and email display
  - "Editar Nome" option
  - "Preço por Balaio" option → push config-preco.tsx
  - "Sair" (Logout) button — red outline, with confirmation dialog
- **Actions:** Logout → AuthProvider clears state; layout switches to auth screens.

---

## Navigation

### Unauthenticated Flow
- Stack navigator in `auth/_layout.tsx`
- Screens: login (initial), signup
- Guard: if `isAuthenticated` → `<Redirect href="/tabs" />`

### Authenticated Flow
- Tab navigator in `tabs/_layout.tsx` with 5 tabs:
  1. Painel (index) — `view-dashboard`
  2. Trabalhadores — `account-group`
  3. Despesas — `cash-minus`
  4. Produção — `sprout`
  5. Mais — `dots-horizontal`
- Guard: if `!isAuthenticated` → `<Redirect href="/auth/login" />`
- All detail/add screens are outside tabs/ as stack screens pushed from tab screens

### Transitions
- Tab switches: cross-fade
- Stack pushes: slide from right
- Modals (confirmations): bottom sheet with backdrop blur

---

## Animation & Motion
- Dashboard cards: staggered fade-in on load
- List items: staggered entry animation
- Summary numbers: count-up animation on dashboard
- Button press: scale 0.97 spring + light haptic
- Skeleton shimmer for all loading states
- Pull-to-refresh on all list screens
- Chart animations: bars/lines animate in on mount
- Respect reduced motion preferences

## Component Standards
- All monetary values formatted as Brazilian Real: R$ 1.234,56 (dot for thousands, comma for decimals)
- Date format: DD/MM/YYYY
- All labels, placeholders, buttons, and messages in pt-BR
- Touch targets minimum 48pt for rural users with larger fingers
- High contrast text on all surfaces (≥ 4.5:1)
- Cards: rounded 16px, warm shadow, press animation
- Inputs: floating labels, focus border animation in gold, error shake
- Empty states: friendly illustrations with coffee theme + action button
