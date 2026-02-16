# 📋 VIVA QUICK REFERENCE CARD
# Repository, Request & Response Components

---

## YOUR 11 REPOSITORIES

| Repository | Key Method | Purpose |
|------------|------------|---------|
| **UserRepository** | `findByEmail(String)` | Login, user lookup |
| **ProductRepository** | `findByCategory(Category)` | Filter products |
| **OrderRepository** | `findByUser(User)` | User order history |
| **CartRepository** | `findByUser(User)` | Get user's cart |
| **CartItemRepository** | `findByCartAndProductAndSize(...)` | Check duplicates |
| **OrderItemRepository** | (CRUD only) | Order line items |
| **CategoryRepository** | `findByName(String)` | Find category |
| **AddressRepository** | (CRUD only) | Shipping addresses |
| **WishlistRepository** | `findByUser(User)` | User wishlist |
| **RatingRepository** | `findByProductId(String)` | Product ratings |
| **ReviewRepository** | `findAllByProductId(String)` | Product reviews |

---

## YOUR 10 REQUEST OBJECTS

| Request | Fields | Used In |
|---------|--------|---------|
| **LoginRequest** | email, password | User authentication |
| **CreateProductRequest** | title, price, sizes, categories, etc. | Admin product creation |
| **AddItemRequest** | productId, size, quantity | Cart operations |
| **RatingRequest** | productId, rating (1-5) | Rate products |
| **ReviewRequest** | productId, review text | Review products |
| **ForgotPasswordRequest** | email | Initiate password reset |
| **VerifyOtpRequest** | email, otp | Verify OTP |
| **ResetPasswordRequest** | otp, newPassword | Reset password |
| **GoogleLoginRequest** | jwt (Google token) | Google OAuth |
| **DeleteProductRequest** | productId | Admin delete product |

---

## YOUR 5 RESPONSE OBJECTS

| Response | Fields | Used For |
|----------|--------|----------|
| **ApiResponse** | message, status | General operations |
| **AuthResponse** | jwt, status, message | Login/Signup results |
| **PaymentLinkResponse** | payment_url | Payment redirect |
| **CreatePaymentLinkResponse** | (payment details) | Payment creation |
| **PayHereResponse** | (payment status) | Payment callback |

---

## KEY CONCEPTS TO EXPLAIN

### 1. Repository Pattern
- **What**: Abstraction layer between business logic and data access
- **Why**: Cleaner code, testable, separates concerns
- **How**: Interface extends MongoRepository, Spring implements

### 2. MongoRepository
- **Provides**: CRUD methods (save, findById, findAll, delete)
- **Auto-queries**: Method name → MongoDB query
- **Example**: `findByEmail` → `db.users.findOne({email: ?})`

### 3. DTOs (Data Transfer Objects)
- **Request**: Data FROM client → server
- **Response**: Data FROM server → client
- **Why**: Security, validation, API flexibility

### 4. Why MongoDB?
- Flexible schema (products vary)
- Fast reads (product catalog)
- Horizontal scaling
- Good for hierarchical data

### 5. JWT Authentication
- **Structure**: header.payload.signature
- **Contains**: userId, email, role, expiry
- **Flow**: Login → Generate JWT → Store → Send with requests → Verify

---

## QUICK FLOW EXAMPLES

### Login Flow
```
LoginRequest → Controller → Service → UserRepository.findByEmail() 
→ Validate password → Generate JWT → AuthResponse
```

### Add to Cart Flow
```
AddItemRequest → Verify JWT → CartRepository.findByUser() 
→ CartItemRepository.findByCartAndProductAndSize() 
→ Update/Create CartItem → ApiResponse
```

### Create Product Flow (Admin)
```
CreateProductRequest → Verify Admin JWT → CategoryRepository.findByName() 
→ Create/Find Categories → ProductRepository.save() → ApiResponse
```

---

## COMMON VIVA QUESTIONS - QUICK ANSWERS

**Q: What is a Repository?**
A: Design pattern that abstracts database operations, provides collection-like interface for data access.

**Q: Why extend MongoRepository?**
A: Get free CRUD methods, auto-implementation of query methods, type-safe operations.

**Q: Explain findByEmail**
A: Spring Data reads method name, generates MongoDB query `db.users.findOne({email: ?})`, returns User or null.

**Q: Why use Request DTOs?**
A: Security (hide DB structure), validation (input rules), flexibility (API evolution), clarity (API contract).

**Q: What's in JWT token?**
A: userId, email, role, issued time, expiry time - encoded and signed, not encrypted.

**Q: Why ApiResponse AND AuthResponse?**
A: ApiResponse for general operations. AuthResponse specialized for authentication (needs JWT token field).

**Q: Difference between Rating and Review?**
A: Rating = numeric (1-5 stars). Review = text feedback. Separate collections.

**Q: Why Set<size> not List<size>?**
A: Set prevents duplicate sizes. Can't have "M" twice. Set ensures uniqueness automatically.

**Q: How does method naming work?**
A: Spring parses: "findBy" + "FieldName" + "And" + "Field2" → Generates matching MongoDB query.

**Q: What is @DBRef?**
A: MongoDB reference to another document (like foreign key in SQL). Stores only ID, not full embedded document.

---

## ARCHITECTURE LAYERS

```
Frontend (React)
    ↓ (HTTP Request with Request DTO)
Controller Layer
    ↓ (validates, extracts JWT)
Service Layer
    ↓ (business logic)
Repository Layer ← YOUR MAIN PART
    ↓ (MongoDB queries)
Database (MongoDB)
    ↓
Repository returns Entity
    ↓
Service processes
    ↓
Controller returns Response DTO ← YOUR PART
    ↓ (HTTP Response)
Frontend
```

---

## MONGODB BASICS

| MongoDB | SQL Equivalent |
|---------|---------------|
| Database | Database |
| Collection | Table |
| Document | Row |
| Field | Column |
| Embedded Document | JOIN-like |
| @DBRef | Foreign Key |

---

## REQUEST VALIDATION ANNOTATIONS

```java
@NotNull - Field cannot be null
@NotBlank - String cannot be empty/whitespace
@Email - Must be valid email format
@Size(min, max) - String/Collection size limits
@Min(value) - Number minimum
@Max(value) - Number maximum
@Valid - Validate nested objects
```

---

## HTTP STATUS CODES

- **200 OK** - Success
- **201 Created** - Resource created
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Not authenticated
- **403 Forbidden** - Not authorized (wrong role)
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server problem

---

## DEBUGGING CHECKLIST

**Repository Issues:**
- [ ] Method name spelling matches entity field
- [ ] Return type appropriate (User vs Optional<User>)
- [ ] Field exists in entity
- [ ] @DBRef handled correctly

**Request DTO Issues:**
- [ ] @RequestBody annotation present
- [ ] JSON field names match DTO fields
- [ ] Getters/setters exist
- [ ] Content-Type: application/json header

**Response Issues:**
- [ ] Response matches expected format
- [ ] Status field included
- [ ] Message is descriptive
- [ ] Sensitive data not exposed

**JWT Issues:**
- [ ] Authorization header: "Bearer <token>"
- [ ] Token not expired
- [ ] Secret key matches
- [ ] User has correct role

---

## CONFIDENCE POINTS

✅ You have 11 working repositories  
✅ You have 10 request types handling user input  
✅ You have 5 response types for different scenarios  
✅ Your code follows industry best practices  
✅ Your project is fully functional  
✅ You understand the architecture  

**You built this! You can explain it!**

---

## PRESENTATION TIPS

1. **Start with Big Picture**: "I handle data access and transfer"
2. **Use Examples**: Reference YOUR actual code
3. **Draw Diagrams**: Show flow on board/paper
4. **Connect Concepts**: Link repository → request → response
5. **Be Specific**: "In UserRepository, findByEmail..."
6. **Show Understanding**: Explain WHY, not just WHAT

---

## IF STUCK

- "Let me walk through an example from our code..."
- "Based on Spring Data principles..."
- "The flow would be: request → controller → service → repository..."
- "That's similar to [concept you know], where..."

---

## LAST-MINUTE REVIEW

**5 Minutes Before Viva:**
1. Review your 11 repositories - know each purpose
2. Know 3-4 request objects well (Login, CreateProduct, AddItem)
3. Understand AuthResponse vs ApiResponse
4. Can explain one complete flow (login or add to cart)
5. Know why MongoDB, why DTOs, why layered architecture

**YOU'VE GOT THIS! 🚀**

---

**Print this card and keep it handy!**  
**Review the full guide: VIVA_GUIDE_REPOSITORY_REQUEST_RESPONSE.md**
