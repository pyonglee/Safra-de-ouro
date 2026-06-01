# Safra de Ouro — API Specification

Base URL: `/api`

All authenticated endpoints require `Authorization: Bearer <token>` header. All responses use `Content-Type: application/json`.

---

## Auth

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/signup | {email: string (required), password: string (required), name: string (required)} | {token: string, user: {id: UUID, email: string, name: string}} | No |
| POST | /api/auth/login | {email: string (required), password: string (required)} | {token: string, user: {id: UUID, email: string, name: string}} | No |
| GET | /api/auth/me | — | {user: {id: UUID, email: string, name: string}} | Bearer |
| PATCH | /api/auth/me | {name: string (optional)} | {user: {id: UUID, email: string, name: string}} | Bearer |

Signup also creates a default Setting record with `pricePerBalaio = 40.00`.

---

## Settings

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/settings | — | {pricePerBalaio: number} | Bearer |
| PATCH | /api/settings | {pricePerBalaio: number (required)} | {pricePerBalaio: number} | Bearer |

---

## Workers

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/workers | query: ?harvestId=UUID (optional) | {items: Worker[]} | Bearer |
| POST | /api/workers | {name: string (required)} | {id: UUID, name: string, createdAt: ISO8601} | Bearer |
| GET | /api/workers/:id | query: ?harvestId=UUID (optional) | {id: UUID, name: string, totalBalaios: integer, totalEarned: number, avgBalaiosPerDay: number, createdAt: ISO8601} | Bearer |
| PATCH | /api/workers/:id | {name: string (required)} | {id: UUID, name: string} | Bearer |
| DELETE | /api/workers/:id | — | {success: boolean} | Bearer |

**Worker list item shape** (when harvestId provided, stats scoped to that harvest):
```
{
  id: UUID,
  name: string,
  totalBalaios: integer,
  totalEarned: number,
  lastRecordDate: ISO8601 | null,
  createdAt: ISO8601
}
```

---

## Balaio Records

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/balaio-records | query: ?workerId=UUID&harvestId=UUID&date=YYYY-MM-DD (all optional) | {items: BalaioRecord[]} | Bearer |
| POST | /api/balaio-records | {workerId: UUID (required), harvestId: UUID (required), date: ISO8601 (required), quantity: integer (required)} | {id: UUID, workerId: UUID, workerName: string, harvestId: UUID, date: ISO8601, quantity: integer, pricePerBalaio: number, totalValue: number, createdAt: ISO8601} | Bearer |
| DELETE | /api/balaio-records/:id | — | {success: boolean} | Bearer |

**BalaioRecord shape:**
```
{
  id: UUID,
  workerId: UUID,
  workerName: string,
  harvestId: UUID,
  date: ISO8601,
  quantity: integer,
  pricePerBalaio: number,
  totalValue: number,
  createdAt: ISO8601
}
```

Note: `pricePerBalaio` is captured at record creation time from the user's current setting. `totalValue = quantity × pricePerBalaio`.

---

## Harvests (Safras)

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/harvests | — | {items: Harvest[]} | Bearer |
| POST | /api/harvests | {name: string (required), salePricePerSack: number (required), startDate: ISO8601 (optional), endDate: ISO8601 (optional)} | {id: UUID, name: string, salePricePerSack: number, startDate: ISO8601 | null, endDate: ISO8601 | null, createdAt: ISO8601} | Bearer |
| GET | /api/harvests/:id | — | HarvestDetail | Bearer |
| PATCH | /api/harvests/:id | {name: string (optional), salePricePerSack: number (optional), startDate: ISO8601 (optional), endDate: ISO8601 (optional)} | {id: UUID, name: string, salePricePerSack: number, startDate: ISO8601 | null, endDate: ISO8601 | null} | Bearer |
| DELETE | /api/harvests/:id | — | {success: boolean} | Bearer |

**HarvestDetail shape:**
```
{
  id: UUID,
  name: string,
  salePricePerSack: number,
  startDate: ISO8601 | null,
  endDate: ISO8601 | null,
  totalSacks: integer,
  totalRevenue: number,
  totalExpenses: number,
  totalWorkerPayments: number,
  grandTotalCosts: number,
  netProfit: number,
  profitMargin: number,
  expenseBreakdown: {
    fertilizer: number,
    spraying: number,
    other: number
  },
  productionRecords: ProductionRecord[],
  createdAt: ISO8601
}
```

**Harvest list item shape:**
```
{
  id: UUID,
  name: string,
  salePricePerSack: number,
  totalSacks: integer,
  totalRevenue: number,
  netProfit: number,
  profitMargin: number,
  createdAt: ISO8601
}
```

---

## Production Records

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/production-records | query: ?harvestId=UUID (optional) | {items: ProductionRecord[]} | Bearer |
| POST | /api/production-records | {harvestId: UUID (required), date: ISO8601 (required), sacks: integer (required), notes: string (optional)} | {id: UUID, harvestId: UUID, date: ISO8601, sacks: integer, notes: string | null, createdAt: ISO8601} | Bearer |
| DELETE | /api/production-records/:id | — | {success: boolean} | Bearer |

**ProductionRecord shape:**
```
{
  id: UUID,
  harvestId: UUID,
  date: ISO8601,
  sacks: integer,
  notes: string | null,
  createdAt: ISO8601
}
```

---

## Expenses

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/expenses | query: ?harvestId=UUID&category=string (optional) | {items: Expense[], totalCost: number} | Bearer |
| POST | /api/expenses | {harvestId: UUID (required), category: string (required, one of: "FERTILIZER", "SPRAYING", "OTHER"), productName: string (required), date: ISO8601 (required), quantity: number (optional), unit: string (optional), appliedArea: number (optional), cost: number (required), notes: string (optional)} | Expense | Bearer |
| GET | /api/expenses/:id | — | Expense | Bearer |
| PATCH | /api/expenses/:id | {category: string (optional), productName: string (optional), date: ISO8601 (optional), quantity: number (optional), unit: string (optional), appliedArea: number (optional), cost: number (optional), notes: string (optional)} | Expense | Bearer |
| DELETE | /api/expenses/:id | — | {success: boolean} | Bearer |

**Expense shape:**
```
{
  id: UUID,
  harvestId: UUID,
  category: string,
  productName: string,
  date: ISO8601,
  quantity: number | null,
  unit: string | null,
  appliedArea: number | null,
  cost: number,
  notes: string | null,
  createdAt: ISO8601
}
```

---

## Quotations

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/quotations | query: ?coffeeType=string (optional) | {items: Quotation[]} | Bearer |
| POST | /api/quotations | {coffeeType: string (required), pricePerSack: number (required), date: ISO8601 (required), source: string (optional)} | Quotation | Bearer |
| DELETE | /api/quotations/:id | — | {success: boolean} | Bearer |

**Quotation shape:**
```
{
  id: UUID,
  coffeeType: string,
  pricePerSack: number,
  date: ISO8601,
  source: string | null,
  createdAt: ISO8601
}
```

GET response also includes `latestByType` for the quotations panel:
```
{
  items: Quotation[],
  latestByType: {
    [coffeeType: string]: {
      current: {pricePerSack: number, date: ISO8601},
      previous: {pricePerSack: number, date: ISO8601} | null,
      trend: "up" | "down" | "stable"
    }
  }
}
```

---

## Dashboard

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/dashboard | query: ?harvestId=UUID (optional, defaults to latest harvest) | DashboardData | Bearer |

**DashboardData shape:**
```
{
  currentHarvest: {id: UUID, name: string} | null,
  harvests: {id: UUID, name: string}[],
  totalSacks: integer,
  totalRevenue: number,
  totalExpenses: number,
  totalWorkerPayments: number,
  grandTotalCosts: number,
  netProfit: number,
  profitMargin: number,
  recentActivity: {
    type: string,
    description: string,
    date: ISO8601,
    value: number
  }[]
}
```

---

## Reports

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/reports/expenses | query: ?harvestId=UUID&startDate=ISO8601&endDate=ISO8601 (all optional) | ExpenseReport | Bearer |
| GET | /api/reports/workers | query: ?harvestId=UUID (optional) | WorkerReport | Bearer |
| GET | /api/reports/production | query: ?harvestId=UUID (optional) | ProductionReport | Bearer |
| GET | /api/reports/profit | query: ?harvestId=UUID (optional) | ProfitReport | Bearer |

**ExpenseReport shape:**
```
{
  byCategory: {category: string, total: number, items: {productName: string, totalCost: number, totalQuantity: number | null, unit: string | null}[]}[],
  grandTotal: number,
  harvestName: string | null
}
```

**WorkerReport shape:**
```
{
  workers: {id: UUID, name: string, totalBalaios: integer, totalEarned: number, records: {date: ISO8601, quantity: integer, pricePerBalaio: number, totalValue: number}[]}[],
  grandTotalBalaios: integer,
  grandTotalPaid: number,
  harvestName: string | null
}
```

**ProductionReport shape:**
```
{
  harvests: {id: UUID, name: string, totalSacks: integer, salePricePerSack: number, totalRevenue: number}[],
  grandTotalSacks: integer,
  grandTotalRevenue: number
}
```

**ProfitReport shape:**
```
{
  harvestName: string | null,
  totalRevenue: number,
  expenseBreakdown: {category: string, total: number}[],
  totalExpenses: number,
  totalWorkerPayments: number,
  grandTotalCosts: number,
  netProfit: number,
  profitMargin: number
}
```

---

## Error Responses

All errors follow:
```
{
  statusCode: integer,
  message: string,
  error: string
}
```

Common codes: 400 (validation), 401 (unauthorized), 404 (not found), 500 (server error).
