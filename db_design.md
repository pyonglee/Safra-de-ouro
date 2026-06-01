# Safra de Ouro — Database Schema

Using Prisma ORM with PostgreSQL. All IDs are UUIDs, auto-generated.

---

## Entities

### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| email | String | Unique, required |
| password | String | bcrypt hashed, required |
| name | String | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

### Setting
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, unique, required, ON DELETE CASCADE |
| pricePerBalaio | Decimal | Required, default 40.00 |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

One-to-one with User. Created at signup with default values.

### Worker
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| name | String | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: `(userId)`

### Harvest
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| name | String | Required (e.g. "Safra 2024") |
| salePricePerSack | Decimal | Required |
| startDate | DateTime | Nullable |
| endDate | DateTime | Nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: `(userId)`, `(userId, createdAt DESC)`

### ProductionRecord
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| harvestId | UUID | FK to Harvest, required, ON DELETE CASCADE |
| date | DateTime | Required |
| sacks | Integer | Required |
| notes | String | Nullable |
| createdAt | DateTime | Auto |

Index: `(harvestId)`, `(userId, harvestId)`

### BalaioRecord
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| workerId | UUID | FK to Worker, required, ON DELETE CASCADE |
| harvestId | UUID | FK to Harvest, required, ON DELETE CASCADE |
| date | DateTime | Required |
| quantity | Integer | Required |
| pricePerBalaio | Decimal | Required (snapshot at creation time) |
| totalValue | Decimal | Required (quantity × pricePerBalaio, computed at creation) |
| createdAt | DateTime | Auto |

Index: `(userId, harvestId)`, `(workerId, harvestId)`, `(userId, date DESC)`

### Expense
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| harvestId | UUID | FK to Harvest, required, ON DELETE CASCADE |
| category | String | Required, enum-like: "FERTILIZER", "SPRAYING", "OTHER" |
| productName | String | Required |
| date | DateTime | Required |
| quantity | Decimal | Nullable |
| unit | String | Nullable ("kg", "L", "unidade") |
| appliedArea | Decimal | Nullable (hectares) |
| cost | Decimal | Required |
| notes | String | Nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: `(userId, harvestId)`, `(userId, category)`, `(harvestId, category)`

### Quotation
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| coffeeType | String | Required (e.g. "Arábica", "Robusta/Conilon", "Cereja", "Bica Corrida") |
| pricePerSack | Decimal | Required |
| date | DateTime | Required |
| source | String | Nullable |
| createdAt | DateTime | Auto |

Index: `(userId, coffeeType, date DESC)`, `(userId, date DESC)`

---

## Relationships

```
User 1──1 Setting
User 1──* Worker
User 1──* Harvest
User 1──* Expense
User 1──* Quotation
User 1──* ProductionRecord
User 1──* BalaioRecord

Harvest 1──* ProductionRecord
Harvest 1──* BalaioRecord
Harvest 1──* Expense

Worker 1──* BalaioRecord
```

All foreign keys use ON DELETE CASCADE to ensure data cleanup when parent entities are removed.

---

## Notes

- All monetary fields use `Decimal` type for precision (Prisma `Decimal` maps to PostgreSQL `DECIMAL(12,2)`).
- `BalaioRecord.pricePerBalaio` and `BalaioRecord.totalValue` are snapshots — they capture the price at the time of recording so historical records remain accurate even if the user changes the price later.
- The `userId` field on every entity enables data isolation — all queries must filter by the authenticated user's ID.
- Dashboard and report endpoints compute aggregations via SQL queries (SUM, GROUP BY) rather than storing denormalized totals.
- The `category` field on Expense uses string values rather than a Prisma enum to allow future extensibility for custom categories.
