# 🎓 VIVA PREPARATION GUIDE
# Repository, Request & Response Components

**Student Part**: Repository Layer, Request DTOs, Response DTOs  
**Project**: E-Commerce Beauty Fashion Application  
**Backend**: Spring Boot + MongoDB

---

## 📚 TABLE OF CONTENTS

1. [Overview of Your Components](#1-overview-of-your-components)
2. [Repository Layer - Deep Dive](#2-repository-layer---deep-dive)
3. [Request Objects - Deep Dive](#3-request-objects---deep-dive)
4. [Response Objects - Deep Dive](#4-response-objects---deep-dive)
5. [How They Work Together](#5-how-they-work-together)
6. [Common Viva Questions & Answers](#6-common-viva-questions--answers)
7. [Technical Concepts You Must Know](#7-technical-concepts-you-must-know)
8. [Code Walkthrough Examples](#8-code-walkthrough-examples)
9. [Best Practices Implemented](#9-best-practices-implemented)
10. [Troubleshooting & Debugging](#10-troubleshooting--debugging)

---

## 1. OVERVIEW OF YOUR COMPONENTS

### 🎯 What You're Responsible For

You handle the **Data Access Layer** and **Data Transfer** in the application:

```
Frontend Request 
    ↓
Controller (receives Request DTO)
    ↓
Service Layer (processes business logic)
    ↓
Repository Layer (YOUR PART - database operations)
    ↓
MongoDB Database
    ↓
Repository returns Entity
    ↓
Service processes
    ↓
Controller returns Response DTO (YOUR PART)
    ↓
Frontend receives Response
```

### Your 3 Main Components:

1. **Repository Layer** (11 repositories)
   - Interface for database operations
   - Extends MongoRepository
   - Custom query methods

2. **Request Objects** (10 request DTOs)
   - Data coming FROM frontend/client
   - Validation and structure
   - Input for operations

3. **Response Objects** (5 response DTOs)
   - Data going TO frontend/client
   - Formatted output
   - Standard response structure

---

## 2. REPOSITORY LAYER - DEEP DIVE

### 📖 What is a Repository?

A **Repository** is a design pattern that:
- Abstracts database operations
- Provides CRUD operations (Create, Read, Update, Delete)
- Separates business logic from data access logic
- Makes code cleaner and testable

### Why Spring Data MongoDB?

Instead of writing manual MongoDB queries, Spring Data provides:
- **Automatic CRUD** methods (save, findById, findAll, delete, etc.)
- **Custom query methods** by method naming convention
- **@Query annotation** for complex queries
- **Type safety** with generics

---

### 🗂️ YOUR REPOSITORIES (11 Total)

#### 1. **UserRepository**
```java
public interface UserRepository extends MongoRepository<User, String> {
    public User findByEmail(String email);
    public List<User> findAllByOrderByCreatedAtDesc();
}
```

**Purpose**: Manage user accounts  
**Custom Methods**:
- `findByEmail()` - Login authentication, find user by email address
- `findAllByOrderByCreatedAtDesc()` - Get all users sorted by newest first (admin panel)

**Viva Points**:
- Used for user authentication in login
- Checks if email exists during registration
- Retrieves user details for profile management

---

#### 2. **ProductRepository**
```java
public interface ProductRepository extends MongoRepository<Product, String> {
    public List<Product> findByCategory(Category category);
    List<Product> findAllByOrderByCreatedAtDesc();
    public List<Product> findTop10ByOrderByCreatedAtDesc();
}
```

**Purpose**: Manage product catalog  
**Custom Methods**:
- `findByCategory()` - Filter products by category (e.g., all dresses)
- `findAllByOrderByCreatedAtDesc()` - All products newest first (admin management)
- `findTop10ByOrderByCreatedAtDesc()` - Latest 10 products (homepage display)

**Viva Points**:
- Category uses @DBRef (reference to another collection)
- Search functionality handled in service layer (filtering in memory)
- Supports product listing with various sorting

---

#### 3. **OrderRepository**
```java
public interface OrderRepository extends MongoRepository<Order, String> {
    public List<Order> findByUser(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
}
```

**Purpose**: Manage customer orders  
**Custom Methods**:
- `findByUser()` - Get all orders for a specific user (user's order history)
- `findAllByOrderByCreatedAtDesc()` - All orders for admin (order management)

**Viva Points**:
- Links orders to users via User object reference
- Critical for order tracking and history
- Used in both user and admin dashboards

---

#### 4. **CartRepository**
```java
public interface CartRepository extends MongoRepository<Cart, String> {
    public Cart findByUser(User user);
}
```

**Purpose**: Manage shopping carts  
**Custom Method**:
- `findByUser()` - Get cart for logged-in user (returns single cart per user)

**Viva Points**:
- Each user has ONE cart
- Cart persists across sessions
- Contains CartItems (separate entity)

---

#### 5. **CartItemRepository**
```java
public interface CartItemRepository extends MongoRepository<CartItem, String> {
    public CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
```

**Purpose**: Manage individual items in cart  
**Custom Method**:
- `findByCartAndProductAndSize()` - Check if item already exists in cart with same size

**Viva Points**:
- Prevents duplicate entries (same product + size in cart)
- Updates quantity if item exists
- Links cart, product, and size together

---

#### 6. **OrderItemRepository**
```java
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {
    // Uses default CRUD methods
}
```

**Purpose**: Store individual items in each order  
**Methods**: Uses inherited CRUD methods from MongoRepository

**Viva Points**:
- Stores snapshot of product at order time (price, quantity, size)
- Order contains multiple OrderItems
- Maintains order history even if product changes/deleted

---

#### 7. **CategoryRepository**
```java
public interface CategoryRepository extends MongoRepository<Category, String> {
    public Category findByName(String name);
}
```

**Purpose**: Manage product categories  
**Custom Method**:
- `findByName()` - Find category by exact name (e.g., "Women", "Dresses")

**Viva Points**:
- Hierarchical structure (topLevel → secondLevel → thirdLevel)
- Used for filtering products
- Referenced by Product entity

---

#### 8. **AddressRepository**
```java
public interface AddressRepository extends MongoRepository<Address, String> {
    // Uses default CRUD methods
}
```

**Purpose**: Store delivery addresses  
**Methods**: Inherited CRUD

**Viva Points**:
- Stores shipping/billing addresses
- Linked to users (one user can have multiple addresses)
- Used during checkout

---

#### 9. **WishlistRepository**
```java
public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    public Wishlist findByUser(User user);
}
```

**Purpose**: Manage user wishlists  
**Custom Method**:
- `findByUser()` - Get wishlist for specific user

**Viva Points**:
- One wishlist per user
- Contains list of products user wants to buy later
- Helps with marketing and user preferences

---

#### 10. **RatingRepository**
```java
public interface RatingRepository extends MongoRepository<Rating, String> {
    public List<Rating> findByProductId(String productId);
}
```

**Purpose**: Store product ratings  
**Custom Method**:
- `findByProductId()` - Get all ratings for a product

**Viva Points**:
- Used to calculate average rating
- User can rate each product once
- Stored as decimal value (e.g., 4.5 stars)

---

#### 11. **ReviewRepository**
```java
public interface ReviewRepository extends MongoRepository<Review, String> {
    public List<Review> findAllByProductId(String productId);
}
```

**Purpose**: Store product reviews/comments  
**Custom Method**:
- `findAllByProductId()` - Get all reviews for a product

**Viva Points**:
- Different from Rating (text feedback vs number)
- Displayed on product detail page
- Helps other customers make decisions

---

### 🔍 Repository Method Naming Conventions

Spring Data automatically implements methods based on naming:

| Method Name Pattern | Query Generated | Example |
|---------------------|----------------|---------|
| `findBy{Field}` | WHERE field = ? | `findByEmail(String email)` |
| `findBy{Field}And{Field2}` | WHERE field1 = ? AND field2 = ? | `findByCartAndProduct(...)` |
| `findAllByOrderBy{Field}Desc` | ORDER BY field DESC | `findAllByOrderByCreatedAtDesc()` |
| `findTop{N}By...` | LIMIT N | `findTop10ByOrderByCreatedAtDesc()` |

---

## 3. REQUEST OBJECTS - DEEP DIVE

### 📥 What are Request Objects?

**Request DTOs** (Data Transfer Objects):
- POJOs (Plain Old Java Objects) used to receive data from client
- Contain only necessary fields for specific operation
- Often include validation annotations
- Decouple API from internal entity structure

### Why Use Request Objects Instead of Entities?

1. **Security**: Don't expose database structure
2. **Validation**: Can add @NotNull, @Valid, etc.
3. **Flexibility**: API can change without changing database
4. **Clean Code**: Only send what's needed

---

### 🗂️ YOUR REQUEST OBJECTS (10 Total)

#### 1. **LoginRequest**
```java
public class LoginRequest {
    private String email;
    private String password;
    // getters, setters, constructors
}
```

**Purpose**: User login  
**Fields**:
- `email` - User's email address
- `password` - Plain text password (hashed in service)

**Flow**:
```
Frontend → LoginRequest → AuthController → UserService 
→ UserRepository.findByEmail() → Password validation → AuthResponse
```

**Viva Points**:
- Password NOT stored in plain text (hashed with BCrypt)
- JWT token generated after successful login
- Email must exist in database

---

#### 2. **CreateProductRequest**
```java
public class CreateProductRequest {
    private String title;
    private String description;
    private int price;
    private int discountedPrice;
    private int discountPersent;
    private int quantity;
    private String brand;
    private String color;
    private List<String> colors;
    private Set<size> size;
    private String imageUrl;
    private List<String> images;
    private String sizeChart;
    private String topLavelCategory;     // e.g., "Women"
    private String secondLavelCategory;   // e.g., "Clothing"
    private String thirdLavelCategory;    // e.g., "Dresses"
    // getters, setters
}
```

**Purpose**: Admin creates new product  
**Complex Fields**:
- `colors` - List of available colors (e.g., ["Red", "Blue", "Black"])
- `size` - Set of Size objects (S, M, L, XL) with quantities
- `images` - Multiple product images
- Categories in 3 levels for detailed filtering

**Viva Points**:
- Only admins can create products (role-based security)
- Categories created if don't exist (handled in service)
- Size is Set to avoid duplicates
- Images stored as URL strings (actual images in cloud/storage)

---

#### 3. **AddItemRequest**
```java
public class AddItemRequest {
    private String productId;
    private String size;
    private int quantity;
    private Integer price;
    // getters, setters
}
```

**Purpose**: Add product to cart  
**Fields**:
- `productId` - Which product to add
- `size` - Selected size
- `quantity` - How many units
- `price` - Current price (optional)

**Viva Points**:
- Checks if item already in cart (update quantity instead)
- Validates size availability
- User must be authenticated

---

#### 4. **RatingRequest**
```java
public class RatingRequest {
    private String productId;
    private double rating;  // 1.0 to 5.0
    // getters, setters
}
```

**Purpose**: User rates a product  
**Validation**:
- Rating between 1.0 and 5.0
- User can rate each product only once (update if already rated)

**Viva Points**:
- Updates product's average rating
- Links rating to user (one rating per user per product)

---

#### 5. **ReviewRequest**
```java
public class ReviewRequest {
    private String productId;
    private String review;  // Text comment
    // getters, setters
}
```

**Purpose**: User writes product review  

**Viva Points**:
- Different from rating (text vs number)
- Can include detailed feedback
- Displayed on product page

---

#### 6. **ForgotPasswordRequest**
```java
public class ForgotPasswordRequest {
    private String email;
    // getters, setters
}
```

**Purpose**: Initiate password reset  

**Flow**:
1. User provides email
2. System generates OTP
3. Sends OTP via email
4. OTP stored temporarily

---

#### 7. **VerifyOtpRequest**
```java
public class VerifyOtpRequest {
    private String email;
    private String otp;
    // getters, setters
}
```

**Purpose**: Verify OTP for password reset  

**Viva Points**:
- OTP expires after some time
- Validates OTP matches sent one
- Returns token for password reset

---

#### 8. **ResetPasswordRequest**
```java
public class ResetPasswordRequest {
    private String otp;
    private String newPassword;
    // getters, setters
}
```

**Purpose**: Set new password after OTP verification  

**Viva Points**:
- Hashes new password before storing
- Invalidates OTP after use
- Updates user password in database

---

#### 9. **GoogleLoginRequest**
```java
public class GoogleLoginRequest {
    private String jwt;  // Google OAuth token
    // getters, setters
}
```

**Purpose**: Login with Google account  

**Viva Points**:
- Integrates Google OAuth
- Validates Google JWT token
- Creates user if first time login

---

#### 10. **DeleteProductRequest**
```java
public class DeleteProductRequest {
    private String productId;
    // getters, setters
}
```

**Purpose**: Admin deletes product  

**Viva Points**:
- Only admin can delete
- May need to handle orders with this product
- Soft delete vs hard delete consideration

---

## 4. RESPONSE OBJECTS - DEEP DIVE

### 📤 What are Response Objects?

**Response DTOs**:
- Data sent back to client
- Standardized format for API responses
- Can aggregate data from multiple sources
- Hide sensitive information

### Why Use Response Objects?

1. **Consistency**: All responses have same structure
2. **Security**: Don't expose entity internals
3. **Flexibility**: Can combine data from multiple entities
4. **Documentation**: Clear API contract

---

### 🗂️ YOUR RESPONSE OBJECTS (5 Total)

#### 1. **ApiResponse**
```java
public class ApiResponse {
    private String message;
    private boolean status;
    // constructor, getters, setters
}
```

**Purpose**: General success/error response  
**Usage**: Non-data operations (delete, update confirmations)

**Example Responses**:
```json
{
    "message": "Product added to cart successfully",
    "status": true
}

{
    "message": "Product not found",
    "status": false
}
```

**Viva Points**:
- Most common response type
- `status: true` = success, `status: false` = error
- Message explains what happened

---

#### 2. **AuthResponse**
```java
public class AuthResponse {
    private String jwt;
    private boolean status;
    private String message;
    // constructors, getters, setters
}
```

**Purpose**: Authentication responses (login, signup)  

**Fields**:
- `jwt` - JSON Web Token for subsequent requests
- `status` - Success/failure
- `message` - Additional info

**Example Response**:
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "status": true,
    "message": "Login successful"
}
```

**Viva Points**:
- JWT contains encoded user info (id, email, role)
- Frontend stores JWT in localStorage
- JWT sent in Authorization header for protected routes
- Expires after set time (e.g., 24 hours)

---

#### 3. **PaymentLinkResponse**
```java
public class PaymentLinkResponse {
    private String payment_url;
    // getters, setters
}
```

**Purpose**: Return payment gateway URL  

**Viva Points**:
- Redirect URL for PayHere payment
- User redirected to this URL for payment
- Contains order details and amount

---

#### 4. **CreatePaymentLinkResponse**
```java
public class CreatePaymentLinkResponse {
    // Payment creation response structure
    // Fields for payment initiation
}
```

**Purpose**: Response when payment link created  

**Viva Points**:
- Contains payment session details
- Links to order
- Used in checkout flow

---

#### 5. **PayHereResponse**
```java
public class PayHereResponse {
    // PayHere payment gateway response
    // Contains payment status, transaction details
}
```

**Purpose**: Handle response from PayHere gateway  

**Viva Points**:
- Receives payment success/failure
- Updates order payment status
- Webhook callback handling

---

## 5. HOW THEY WORK TOGETHER

### 🔄 Complete Flow Example: User Login

```
1. Frontend sends LoginRequest
   POST /auth/signin
   {
       "email": "user@example.com",
       "password": "password123"
   }

2. Controller receives LoginRequest
   @PostMapping("/signin")
   public AuthResponse login(@RequestBody LoginRequest req)

3. Service processes
   - Calls UserRepository.findByEmail(req.getEmail())
   - Repository queries MongoDB
   - Returns User entity

4. Service validates
   - Compares hashed password
   - Generates JWT token

5. Controller returns AuthResponse
   {
       "jwt": "token_here",
       "status": true,
       "message": "Login successful"
   }

6. Frontend stores JWT
   - Saved in localStorage
   - Used for subsequent requests
```

---

### 🔄 Complete Flow Example: Add to Cart

```
1. Frontend sends AddItemRequest
   POST /api/cart/add
   Headers: { Authorization: "Bearer <JWT>" }
   {
       "productId": "prod123",
       "size": "M",
       "quantity": 2
   }

2. Controller authenticates user from JWT

3. Service processes
   - Calls CartRepository.findByUser(user)
   - Gets/creates cart
   
   - Calls ProductRepository.findById(productId)
   - Verifies product exists
   
   - Calls CartItemRepository.findByCartAndProductAndSize(...)
   - Checks if item already in cart
   
   - If exists: Update quantity
   - If new: Create CartItem and save

4. Controller returns ApiResponse
   {
       "message": "Item added to cart",
       "status": true
   }
```

---

### 🔄 Complete Flow Example: Create Product (Admin)

```
1. Frontend sends CreateProductRequest
   POST /api/admin/products/
   Headers: { Authorization: "Bearer <ADMIN_JWT>" }
   {
       "title": "Elegant Evening Dress",
       "description": "Beautiful red dress...",
       "price": 5000,
       "discountedPrice": 4000,
       "discountPersent": 20,
       "quantity": 50,
       "brand": "Fashion Brand",
       "colors": ["Red", "Blue"],
       "size": [{"name": "S", "quantity": 10}, {"name": "M", "quantity": 20}],
       "images": ["url1", "url2"],
       "topLavelCategory": "Women",
       "secondLavelCategory": "Clothing",
       "thirdLavelCategory": "Dresses"
   }

2. Controller verifies admin role from JWT

3. Service processes
   - Calls CategoryRepository.findByName() for each category
   - Creates categories if don't exist
   - Creates Category hierarchy
   
   - Creates Product entity from request
   - Calls ProductRepository.save(product)

4. Controller returns saved Product or ApiResponse
   {
       "message": "Product created successfully",
       "status": true
   }
```

---

## 6. COMMON VIVA QUESTIONS & ANSWERS

### General Questions

**Q1: What is the Repository pattern?**  
**A**: The Repository pattern is a design pattern that mediates between the domain layer and data mapping layers using a collection-like interface. In our project, it provides abstraction over MongoDB operations, allowing us to perform database operations without writing raw queries. It helps separate business logic from data access logic.

**Q2: Why do we use DTOs (Request/Response objects)?**  
**A**: We use DTOs for several reasons:
1. **Security**: Hide internal entity structure from clients
2. **Validation**: Apply input validation rules
3. **Flexibility**: API can evolve independently of database schema
4. **Performance**: Transfer only necessary data
5. **Clarity**: Clear contract between client and server

**Q3: What is MongoRepository and why do we extend it?**  
**A**: MongoRepository is a Spring Data interface that provides:
- Ready-made CRUD operations (save, findById, findAll, delete)
- Pagination and sorting support
- Custom query methods through naming conventions
- Type-safe database operations

We extend it to get all these features without writing implementation code.

---

### Repository Questions

**Q4: Explain your UserRepository and its methods**  
**A**: UserRepository manages user data in MongoDB:
```java
public interface UserRepository extends MongoRepository<User, String> {
    public User findByEmail(String email);
    public List<User> findAllByOrderByCreatedAtDesc();
}
```
- `findByEmail()`: Used for login authentication and checking if user exists
- `findAllByOrderByCreatedAtDesc()`: Retrieves all users sorted by creation date (newest first) for admin panel
- The generic type `<User, String>` means it deals with User entities with String IDs

**Q5: How does findByEmail work internally?**  
**A**: Spring Data MongoDB uses method name parsing:
1. Sees "findBy" prefix → knows it's a query method
2. Sees "Email" → knows to match the `email` field in User entity
3. Automatically generates MongoDB query: `db.users.findOne({email: "provided_email"})`
4. Returns the matching User object or null

**Q6: What is the difference between findByUser and findAllByUser in repositories?**  
**A**:
- `findByUser(User user)` - Returns a SINGLE entity (e.g., CartRepository - one cart per user)
- `findAllByUser(User user)` - Returns a LIST of entities (would be used if multiple entities possible)

In OrderRepository, we use `findByUser()` but it returns List<Order> because one user can have multiple orders.

**Q7: Explain the findByCartAndProductAndSize method in CartItemRepository**  
**A**: This method finds a cart item matching THREE conditions:
```java
public CartItem findByCartAndProductAndSize(Cart cart, Product product, String size)
```
It's used when adding items to cart to check if the EXACT same product with the same size already exists in the user's cart. If it exists, we update the quantity instead of creating a duplicate entry.

MongoDB query generated:
```javascript
db.cartItems.findOne({
    cart: cart_id,
    product: product_id,
    size: "M"
})
```

**Q8: What does @DBRef mean in MongoDB relationships?**  
**A**: @DBRef is used in MongoDB to create references between documents (similar to foreign keys in SQL). For example:
```java
@DBRef
private Category category;
```
Instead of embedding the entire Category document in Product, we store only the reference (Category ID). This:
- Saves space (no duplication)
- Maintains data consistency (category updates reflect everywhere)
- But requires additional query to fetch the referenced document

---

### Request Object Questions

**Q9: Walk me through the CreateProductRequest**  
**A**: CreateProductRequest contains all data needed to create a product:
```java
- title: Product name
- description: Detailed description
- price: Original price in currency
- discountedPrice: Price after discount
- discountPersent: Discount percentage
- quantity: Total stock available
- brand: Product brand name
- colors: List of available colors
- size: Set of Size objects (each has name and quantity)
- images: List of image URLs
- sizeChart: URL to size chart image
- Categories: Three-level hierarchy for organization
```

The request goes to admin controller, validated, and service creates actual Product entity from this data.

**Q10: Why is size a Set instead of a List in CreateProductRequest?**  
**A**: Set is used to prevent duplicate sizes. You can't add "M" size twice. Set automatically ensures uniqueness, whereas List allows duplicates. For a product, having "M" twice doesn't make sense - each size should appear once with its quantity.

**Q11: Explain the authentication flow with LoginRequest and AuthResponse**  
**A**:
```
1. User sends LoginRequest {email, password}
2. Service calls UserRepository.findByEmail(email)
3. If user not found → error response
4. If found → compare password using BCrypt.matches(rawPassword, hashedPassword)
5. If match → generate JWT token with user details
6. Return AuthResponse {jwt, status:true, message}
7. Frontend stores JWT
8. Future requests include: Authorization: Bearer <JWT>
9. Backend validates JWT and extracts user info
```

**Q12: What validation would you add to LoginRequest?**  
**A**: Common validations:
```java
@NotBlank(message = "Email is required")
@Email(message = "Email should be valid")
private String email;

@NotBlank(message = "Password is required")
@Size(min = 6, message = "Password must be at least 6 characters")
private String password;
```

---

### Response Object Questions

**Q13: Why do we have separate AuthResponse instead of using ApiResponse?**  
**A**: AuthResponse is specialized for authentication because it needs to return:
- JWT token (for session management)
- Status (success/failure)
- Message (additional info)

ApiResponse only has message and status, not suitable for carrying authentication token.

**Q14: What information is encoded in the JWT token?**  
**A**: JWT typically contains:
```json
{
    "userId": "user123",
    "email": "user@example.com",
    "role": "USER" or "ADMIN",
    "iat": issued_at_timestamp,
    "exp": expiry_timestamp
}
```
This is encoded, signed, but NOT encrypted. Don't put sensitive data in JWT.

**Q15: How does ApiResponse help with error handling?**  
**A**: ApiResponse provides standardized format:
```java
// Success
return new ApiResponse("Product deleted", true);

// Error
return new ApiResponse("Product not found", false);
```
Frontend can always expect same structure and check `status` field to know if operation succeeded.

---

### Architecture Questions

**Q16: Explain the flow from Request to Response in your architecture**  
**A**:
```
1. CLIENT sends HTTP Request with Request DTO (JSON)
2. CONTROLLER receives, deserializes JSON to Request object
3. CONTROLLER validates JWT token (authentication)
4. CONTROLLER calls SERVICE layer method
5. SERVICE validates business logic
6. SERVICE calls REPOSITORY for database operations
7. REPOSITORY performs MongoDB query
8. REPOSITORY returns Entity object(s)
9. SERVICE processes data, applies business rules
10. SERVICE returns processed data
11. CONTROLLER wraps in Response DTO
12. CONTROLLER returns HTTP Response (JSON)
13. CLIENT receives Response DTO
```

**Q17: Why separate Service layer if Repository has queries?**  
**A**: 
- **Repository**: Only data access (simple queries)
- **Service**: Business logic, validation, transaction management, coordination

Example: Adding to cart
- Repository: Just save CartItem
- Service: Check stock, validate size, check duplicates, calculate price, update quantities

**Q18: What are the advantages of your layered architecture?**  
**A**:
1. **Separation of Concerns**: Each layer has specific responsibility
2. **Testability**: Can test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Reusability**: Service methods can be reused by multiple controllers
5. **Security**: Layers can enforce different access controls

---

## 7. TECHNICAL CONCEPTS YOU MUST KNOW

### 🔹 Spring Data MongoDB

**Key Annotations**:
```java
@Document(collection = "users")  // Maps to MongoDB collection
@Id                              // Primary key (auto-generated if String)
@DBRef                           // Reference to another document
@Query                           // Custom MongoDB query
```

**Repository Method Keywords**:
- `findBy` - Basic query
- `And`, `Or` - Combine conditions
- `OrderBy...Desc/Asc` - Sorting
- `Top{N}` - Limit results
- `Between`, `Before`, `After` - Date/number ranges

---

### 🔹 MongoDB vs SQL

| Feature | MongoDB | MySQL |
|---------|---------|-------|
| Structure | Document (JSON-like) | Tables with rows |
| Schema | Flexible | Fixed |
| Relationships | Embedded or referenced | Foreign keys |
| Queries | MongoDB queries | SQL queries |
| Scaling | Horizontal (sharding) | Vertical |

**Why MongoDB for E-commerce?**:
- Flexible schema (products have different attributes)
- Fast read operations (product catalog)
- Easy to scale
- Good for hierarchical data (categories)

---

### 🔹 DTOs vs Entities

**Entity (Product.java)**:
```java
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String title;
    private int price;
    @DBRef
    private Category category;
    private List<Rating> ratings;
    private LocalDateTime createdAt;
    // ... many more fields
}
```

**Request DTO (CreateProductRequest.java)**:
```java
public class CreateProductRequest {
    private String title;
    private int price;
    private String topLavelCategory;  // Just category name
    // Only fields needed to CREATE
    // No id, no ratings, no createdAt
}
```

**Key Differences**:
- Entity has all fields, DTO has only necessary ones
- Entity has database annotations, DTO is plain POJO
- Entity represents database structure, DTO represents API contract

---

### 🔹 JWT (JSON Web Token)

**Structure**:
```
header.payload.signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Parts**:
1. Header: Algorithm and token type
2. Payload: User data (claims)
3. Signature: Verification

**How it works**:
1. User logs in
2. Server creates JWT with user info
3. Server signs JWT with secret key
4. Client stores JWT
5. Client sends JWT with each request
6. Server verifies signature and extracts user info

**Advantages**:
- Stateless (no session storage needed)
- Can't be tampered (signature verification)
- Self-contained (has user info)
- Works across domains

---

### 🔹 RESTful API Principles

Your API follows REST principles:

**HTTP Methods**:
- `GET` - Retrieve data (safe, idempotent)
- `POST` - Create new resource
- `PUT` - Update existing resource (full update)
- `PATCH` - Partial update
- `DELETE` - Remove resource

**Status Codes**:
- `200` OK - Success
- `201` Created - Resource created
- `400` Bad Request - Invalid input
- `401` Unauthorized - Not authenticated
- `403` Forbidden - Not authorized
- `404` Not Found - Resource doesn't exist
- `500` Internal Server Error - Server problem

---

## 8. CODE WALKTHROUGH EXAMPLES

### Example 1: Explain UserRepository Step-by-Step

```java
package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.modal.User;
import java.util.List;

// This is an INTERFACE, not a class - Spring implements it automatically
public interface UserRepository extends MongoRepository<User, String> {
    
    // Spring Data reads this method name and creates the query
    // "findBy" + "Email" → db.users.findOne({email: ?})
    public User findByEmail(String email);
    
    // "findAllBy" + "OrderBy" + "CreatedAt" + "Desc"
    // → db.users.find().sort({createdAt: -1})
    public List<User> findAllByOrderByCreatedAtDesc();
}
```

**When asked to explain**:
1. "This is the UserRepository interface extending MongoRepository"
2. "It's parameterized with User entity and String ID type"
3. "Spring Data MongoDB automatically implements this interface"
4. "We get basic CRUD methods like save, findById, findAll, delete for free"
5. "We added two custom methods using method naming convention"
6. "findByEmail finds a user by email - used for login"
7. "findAllByOrderByCreatedAtDesc gets all users sorted by creation date descending"

---

### Example 2: Explain LoginRequest Flow

```java
// 1. LoginRequest class - receives data from frontend
package com.example.backend.request;

public class LoginRequest {
    private String email;      // User's email
    private String password;   // Plain text password
    
    // Spring automatically deserializes JSON to this object
    public LoginRequest() {} // Default constructor needed for JSON
    
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters and setters needed for JSON serialization
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

**When asked to explain**:
1. "LoginRequest is a DTO that receives login credentials from frontend"
2. "It contains only email and password - minimum data needed"
3. "Frontend sends JSON like {email: '...', password: '...'}"
4. "Spring Boot automatically deserializes JSON to LoginRequest object"
5. "Controller receives this object and passes to service"
6. "Service uses email to find user via UserRepository.findByEmail()"
7. "Service validates password using BCrypt"
8. "If valid, generates JWT and returns AuthResponse"

---

### Example 3: Explain CreateProductRequest

```java
package com.example.backend.request;

import java.util.List;
import java.util.Set;
import com.example.backend.modal.size;

public class CreateProductRequest {
    // Basic product info
    private String title;
    private String description;
    private int price;
    private int discountedPrice;
    private String brand;
    
    // Multiple values
    private List<String> colors;     // ["Red", "Blue", "Black"]
    private Set<size> size;          // Set prevents duplicates
    private List<String> images;     // Multiple product images
    
    // Category hierarchy
    private String topLavelCategory;      // "Women"
    private String secondLavelCategory;   // "Clothing"  
    private String thirdLavelCategory;    // "Dresses"
    
    // ... getters and setters
}
```

**Explanation Points**:
1. "This request contains all data needed to create a new product"
2. "Only admins can use this - checked via JWT role"
3. "Colors is a List - multiple color options allowed"
4. "Size is a Set - prevents duplicate sizes like 'M', 'M'"
5. "Images is a List - we store multiple product images"
6. "Categories in 3 levels help organize products hierarchically"
7. "Service layer will find or create these categories"
8. "Then create Product entity from this request data"

---

## 9. BEST PRACTICES IMPLEMENTED

### ✅ Repository Best Practices

1. **Naming Convention**: Follow Spring Data naming rules
2. **Specific Methods**: Create focused, specific query methods
3. **Avoid @Query When Possible**: Use method names (self-documenting)
4. **Return Types**: Use Optional<T> for single results that might not exist

### ✅ Request DTO Best Practices

1. **Immutability**: Could make DTOs immutable with final fields
2. **Validation**: Add @NotNull, @Valid, @Size annotations
3. **Only Necessary Fields**: Don't include what API doesn't need
4. **Clear Naming**: Use descriptive names (CreateProductRequest, not ProductDTO)

### ✅ Response DTO Best Practices

1. **Consistent Structure**: All responses follow similar pattern
2. **Meaningful Messages**: Clear success/error messages
3. **Status Field**: Easy to check if operation succeeded
4. **Don't Expose Internals**: Hide database IDs, sensitive data

### ✅ General Best Practices

1. **Layer Separation**: Repository → Service → Controller
2. **Single Responsibility**: Each class does one thing well
3. **Dependency Injection**: Use @Autowired for repositories/services
4. **Error Handling**: Proper exception handling in service layer
5. **Security**: JWT authentication, role-based access control

---

## 10. TROUBLESHOOTING & DEBUGGING

### Common Issues You Might Face

**Issue 1: "Query method returns null"**
```java
User user = userRepository.findByEmail(email);
// user is null even though email exists
```
**Solution**:
- Check spelling of field name in method (Email vs email)
- Verify email field exists in User entity
- Check if email in database matches exactly (case-sensitive)
- Use Optional<User> for safer null handling

---

**Issue 2: "Method name not recognized"**
```java
List<Product> findByColorAndSize(String color, String size);
// Spring can't parse this
```
**Solution**:
- Ensure field names match entity exactly
- Use And, Or in camelCase
- Check if relationship fields handled correctly
- Use @Query annotation for complex queries

---

**Issue 3: "Request DTO fields are null"**
```java
@PostMapping("/create")
public ResponseEntity<ApiResponse> create(@RequestBody CreateProductRequest req) {
    // req.getTitle() is null
}
```
**Solution**:
- Ensure @RequestBody annotation present
- Check JSON field names match DTO fields exactly
- Verify getters/setters exist
- Check content-type header is application/json

---

**Issue 4: "JWT token invalid"**
```java
// Getting 401 Unauthorized
```
**Solution**:
- Check Authorization header format: "Bearer <token>"
- Verify JWT secret key matches
- Check token expiration
- Ensure token signature is valid

---

### Debugging Tips

1. **Use Logging**:
```java
System.out.println("Email: " + loginRequest.getEmail());
logger.info("User found: " + user);
```

2. **Check MongoDB**:
```javascript
// MongoDB shell
db.users.find({email: "test@example.com"})
```

3. **Test Endpoints with Postman**:
- Test each Request/Response independently
- Verify JSON structure
- Check headers (Authorization, Content-Type)

4. **Validate Data**:
- Add @Valid annotation to request parameters
- Check validation errors in controller

---

## 🎯 FINAL VIVA TIPS

### What to Emphasize

1. **Why you chose this architecture**: Separation of concerns, maintainability
2. **MongoDB advantages**: Flexibility, scalability for e-commerce
3. **DTOs importance**: Security, validation, API evolution
4. **Spring Data power**: Auto-implementation, convention over configuration

### Be Ready to Explain

- Any repository method in detail
- How JWT authentication works
- The complete flow from frontend to database and back
- Why certain design decisions were made
- Differences between your entities and DTOs

### If You Don't Know

- "That's a good question, let me think about the best implementation for that"
- "Based on what I know about [related concept], I would approach it by..."
- "I would need to research that specific detail, but the general approach would be..."

### Confidence Boosters

- You have 11 repositories - know them all!
- You have 10 requests - understand each purpose!
- You have 5 responses - explain when each is used!
- Your code works - the project runs successfully!

---

## 📚 QUICK REFERENCE CHEAT SHEET

### Your Repositories (11)
1. UserRepository - User management
2. ProductRepository - Product catalog
3. OrderRepository - Order management
4. CartRepository - Shopping carts
5. CartItemRepository - Cart items
6. OrderItemRepository - Order items
7. CategoryRepository - Product categories
8. AddressRepository - Delivery addresses
9. WishlistRepository - User wishlists
10. RatingRepository - Product ratings
11. ReviewRepository - Product reviews

### Your Requests (10)
1. LoginRequest - User login
2. CreateProductRequest - Create product (admin)
3. AddItemRequest - Add to cart
4. RatingRequest - Rate product
5. ReviewRequest - Review product
6. ForgotPasswordRequest - Password reset initiate
7. VerifyOtpRequest - OTP verification
8. ResetPasswordRequest - Set new password
9. GoogleLoginRequest - Google OAuth login
10. DeleteProductRequest - Delete product (admin)

### Your Responses (5)
1. ApiResponse - General operations
2. AuthResponse - Authentication results
3. PaymentLinkResponse - Payment URL
4. CreatePaymentLinkResponse - Payment creation
5. PayHereResponse - Payment gateway callback

---

## 🎓 GOOD LUCK WITH YOUR VIVA!

**Remember**:
- Speak clearly and confidently
- Use diagrams if helpful (draw flow on board)
- Give examples from YOUR actual code
- Connect concepts to YOUR project
- Show enthusiasm about what you built!

**You built a working e-commerce platform with proper architecture. Be proud and show it!**

---

**Last Updated**: 2026-02-16  
**Project**: E-Commerce Beauty Fashion Application  
**Your Parts**: Repository, Request, Response Components
