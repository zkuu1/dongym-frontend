# 📡 API Documentation

> **Base URL:** `http://localhost:3000/`  
> **Env Variable:** `NEXT_PUBLIC_BASE_API`  
> **File:** `src/data/api/userApi.ts`

---

## 🔐 Authentication

Token disimpan di `localStorage` dengan key `"token"`.  
Untuk endpoint yang **protected**, sertakan header berikut:

```http
Authorization: Bearer <token>
```

---

## 👤 User

### GET /api/user

Mengambil semua data user.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `getAllUser()`

**Request:**
```http
GET /api/user
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get all users",
  "data": [
    { "id": 1, "name": "...", "email": "...", "role": "USER" }
  ]
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 500 Internal Server Error
{ "message": "Internal server error" }
```

---

### GET /api/user/:id

Mengambil data user berdasarkan ID.

- **Auth Required:** ❌ Tidak
- **Function:** `searchUserById(id)`

**Request:**
```http
GET /api/user/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get user by ID",
  "data": { "id": 1, "name": "...", "email": "..." }
}
```

**Error Responses:**
```json
// 404 Not Found
{ "message": "User not found" }
```

---

### GET /api/user/search/:keyword

Mencari user berdasarkan keyword (nama / email).

- **Auth Required:** ❌ Tidak
- **Function:** `searchUser(keyword)`

**Request:**
```http
GET /api/user/search/:keyword
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success search user",
  "data": [ ... ]
}
```

**Error Responses:**
```json
// 400 Bad Request
{ "message": "Keyword is required" }
```

---

### POST /api/user/register

Membuat user baru (Register). Hanya bisa dilakukan oleh admin.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `createUser(payload)`

**Request:**
```http
POST /api/user
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "Jl. Contoh No. 1"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created",
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

**Error Responses:**
```json
// 400 Bad Request (email sudah terpakai)
{ "message": "Email already exists" }

// 401 Unauthorized (token tidak dikirim)
{ "message": "Unauthorized" }

// 422 Unprocessable Entity (validasi gagal)
{ "message": "Validation error", "errors": { "email": "Invalid email format" } }
```

---

### POST /api/user/login

Login user dan mendapatkan token.

- **Auth Required:** ❌ Tidak
- **Function:** `loginUser(payload)`

**Request:**
```http
POST /api/user/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "token": "<jwt_token>",
    "user": { "id": 1, "name": "John Doe", "role": "USER" }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized (email atau password salah)
{ "message": "Invalid email or password" }

// 400 Bad Request (validasi gagal dari middleware)
{ "message": "Validation error" }
```

---

### PATCH /api/user/:id

Mengupdate data user berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `updateUserById(id, payload)`

**Request:**
```http
PATCH /api/user/:id
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated",
  "data": { ... }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 404 Not Found
{ "message": "User not found" }

// 400 Bad Request
{ "message": "Validation error" }
```

---

### DELETE /api/user/:id

Menghapus user berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `deleteUserById(id)`

**Request:**
```http
DELETE /api/user/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted",
  "data": null
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 404 Not Found
{ "message": "User not found" }
```

---

## 📋 Ringkasan Endpoint — User

| Method   | Endpoint                     | Deskripsi              | Auth  | Function               |
|----------|------------------------------|------------------------|-------|------------------------|
| `GET`    | `/api/user`                  | Get semua user         | ✅ Ya | `getAllUser()`         |
| `GET`    | `/api/user/:id`              | Get user by ID         | ❌    | `searchUserById(id)`  |
| `GET`    | `/api/user/search/:keyword`  | Search user by keyword | ❌    | `searchUser(keyword)` |
| `POST`   | `/api/user/register`         | Register user baru     | ❌    | `createUser(payload)` |
| `POST`   | `/api/user/login`            | Login user             | ❌    | `loginUser(payload)`  |
| `PATCH`  | `/api/user/update/:id`       | Update user by ID      | ❌    | `updateUserById(id, payload)` |
| `DELETE` | `/api/user/delete/:id`       | Delete user by ID      | ❌    | `deleteUserById(id)`  |

---

## 🛍️ Product

> **File:** `src/data/api/productApi.ts`

### GET /api/product

Mengambil semua data produk.

- **Auth Required:** ❌ Tidak
- **Function:** `getAllProduct()`

**Request:**
```http
GET /api/product
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get all products",
  "data": [
    { "id": 1, "name": "...", "price": 25000, "stock": 100, "category_id": 1 }
  ]
}
```

**Error Responses:**
```json
// 500 Internal Server Error
{ "message": "Internal server error" }
```

---

### GET /api/product/:id

Mengambil produk berdasarkan ID.

- **Auth Required:** ❌ Tidak
- **Function:** `searchProductById(id)`

**Request:**
```http
GET /api/product/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get product by ID",
  "data": { "id": 1, "name": "...", "price": 25000 }
}
```

**Error Responses:**
```json
// 404 Not Found
{ "message": "Product not found" }
```

---

### POST /api/product

Membuat produk baru.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `createProduct(payload)`

**Request:**
```http
POST /api/product
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
            "id": 2,
            "idCategory": 1,
            "name": "Mouse Wireless",
            "description": null,
            "image": null,
            "price": 250000,
            "stock": 20
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Get All Products success",
    "data": [
        {
            "id": 2,
            "idCategory": 1,
            "name": "Mouse Wireless",
            "description": null,
            "image": null,
            "price": 250000,
            "stock": 20
        },
        {
            "id": 3,
            "idCategory": 2,
            "name": "Headset",
            "description": null,
            "image": null,
            "price": 500000,
            "stock": 10
        }
    ],
    "meta": {
        "page": 1,
        "limit": 2,
        "total": 2,
        "totalPages": 1
    }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 400 Bad Request
{ "message": "Validation error" }
```

---

### PATCH /api/product/:id

Mengupdate produk berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `updateProductById(id, payload)`

**Request:**
```http
PATCH /api/product/:id
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
            "id": 3,
            "idCategory": 2,
            "name": "Headset",
            "description": null,
            "image": null,
            "price": 500000,
            "stock": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated",
  "data": { ... }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 404 Not Found
{ "message": "Product not found" }

// 400 Bad Request
{ "message": "Validation error" }
```

---

### DELETE /api/product/:id

Menghapus produk berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `deleteProductById(id)`

**Request:**
```http
DELETE /api/product/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted",
  "data": null
}
```

**Error Responses:**
```json
// 401 Unauthorized
{ "message": "Unauthorized" }

// 404 Not Found
{ "message": "Product not found" }
```

---

## 📋 Ringkasan Endpoint — Product

| Method   | Endpoint                   | Deskripsi            | Auth  | Function                       |
|----------|----------------------------|----------------------|-------|--------------------------------|
| `GET`    | `/api/product`             | Get semua produk     | ❌    | `getAllProduct()`              |
| `GET`    | `/api/product/:id`         | Get produk by ID     | ❌    | `searchProductById(id)`       |
| `POST`   | `/api/product`             | Buat produk baru     | ✅ Ya | `createProduct(payload)`      |
| `PATCH`  | `/api/product/update/:id`  | Update produk by ID  | ✅ Ya | `updateProductById(id, payload)` |
| `DELETE` | `/api/product/delete/:id`  | Hapus produk by ID   | ✅ Ya | `deleteProductById(id)`       |

---

## 🗂️ Category

> **File:** `src/data/api/categoryApi.ts`

### GET /api/category

Mengambil semua kategori.

- **Auth Required:** ❌ Tidak
- **Function:** `getAllCategory()`

**Request:**
```http
GET /api/category
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get all categories",
  "data": [
    {
      "id": "...",
      "name": "Supplement"
    }
  ]
}
```

---

### GET /api/category/:id

Mengambil kategori berdasarkan ID.

- **Auth Required:** ❌ Tidak
- **Function:** `getCategoryById(id)`

**Request:**
```http
GET /api/category/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success get category by ID",
  "data": { "id": "...", "name": "Supplement" }
}
```

---

### POST /api/category

Membuat kategori baru.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `createCategory(payload)`

**Request:**
```http
POST /api/category
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Equipment"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created",
  "data": { "id": "...", "name": "Equipment" }
}
```

---

### PATCH /api/category/update/:id

Mengupdate kategori berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `updateCategoryById(id, payload)`

**Request:**
```http
PATCH /api/category/update/:id
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Fitness Equipment"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated",
  "data": { ... }
}
```

---

### DELETE /api/category/delete/:id

Menghapus kategori berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `deleteCategoryById(id)`

**Request:**
```http
DELETE /api/category/delete/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted",
  "data": null
}
```

---

## 📋 Ringkasan Endpoint — Category

| Method   | Endpoint                    | Deskripsi              | Auth  | Function                          |
|----------|-----------------------------|------------------------|-------|-----------------------------------|
| `GET`    | `/api/category`             | Get semua kategori     | ❌    | `getAllCategory()`                |
| `GET`    | `/api/category/:id`         | Get kategori by ID     | ❌    | `getCategoryById(id)`            |
| `POST`   | `/api/category`             | Buat kategori baru     | ✅ Ya | `createCategory(payload)`        |
| `PATCH`  | `/api/category/update/:id`  | Update kategori by ID  | ✅ Ya | `updateCategoryById(id, payload)` |
| `DELETE` | `/api/category/delete/:id`  | Hapus kategori by ID   | ✅ Ya | `deleteCategoryById(id)`         |

---

## 💳 Membership

> **File:** `src/data/api/membershipApi.ts`

### GET /api/membership

Mengambil semua data membership.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `getAllMembership()`

**Request:**
```http
GET /api/membership
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "success": true,
    "message": "Get All Memberships success",
    "data": [
        {
            "idUser": 1,
            "id": 1,
            "name": "Gold Member",
            "description": "Premium membership",
            "noMember": "GM001",
            "expiredAt": "2027-01-01T00:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 1,
        "total": 1,
        "totalPages": 1
    }
}
```

---

### GET /api/membership/:id

Mengambil data membership berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `getMembershipById(id)`

**Request:**
```http
GET /api/membership/:id
Authorization: Bearer <token>
```

---

### POST /api/membership

Membuat membership baru.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `createMembership(payload)`

**Request:**
```http
POST /api/membership
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "idUser": 1,
  "name": "Gold Member",
  "description": "Premium membership"
}
```

---

### PATCH /api/membership/:id

Mengupdate data membership berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `updateMembershipById(id, payload)`

**Request:**
```http
PATCH /api/membership/:id
Content-Type: application/json
Authorization: Bearer <token>
```

---

### DELETE /api/membership/:id

Menghapus membership berdasarkan ID.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `deleteMembershipById(id)`

---

## 📋 Ringkasan Endpoint — Membership

| Method   | Endpoint                | Deskripsi                  | Auth  | Function                      |
|----------|-------------------------|----------------------------|-------|-------------------------------|
| `GET`    | `/api/membership`       | Get semua membership       | ✅ Ya | `getAllMembership()`          |
| `GET`    | `/api/membership/:id`   | Get membership by ID       | ✅ Ya | `getMembershipById(id)`       |
| `POST`   | `/api/membership`       | Buat membership baru       | ✅ Ya | `createMembership(payload)`   |
| `PATCH`  | `/api/membership/:id`   | Update membership by ID    | ✅ Ya | `updateMembershipById(id, payload)` |
| `DELETE` | `/api/membership/:id`   | Hapus membership by ID     | ✅ Ya | `deleteMembershipById(id)`    |

---

## 💬 Comments

> **File:** `src/data/api/commentApi.ts`

### GET /api/comments

Mengambil semua data komentar.

- **Auth Required:** ❌ Tidak
- **Function:** `getAllComments()`

**Response (200):**
```json
{
    "success": true,
    "message": "All comments fetched successfully",
    "data": [
        {
            "id": 1,
            "idUser": 2,
            "idProduct": 2,
            "comment": "yapping",
            "createdAt": "2026-03-13T12:12:23.287Z"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 4,
        "totalPages": 1
    }
}
```

---

### GET /api/comments/user/:idUser

Mengambil semua komentar yang dibuat oleh user tertentu.

- **Auth Required:** ❌ Tidak
- **Function:** `getUserComments(idUser)`

---

### GET /api/comments/me

Mengambil riwayat komentar user yang sedang login.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `getMyComments()`

**Response (200):**
```json
{
    "success": true,
    "message": "User comments fetched successfully",
    "data": [ ... ]
}
```

---

### POST /api/comments/:idProduct

Membuat komentar baru untuk produk tertentu.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `createComment(idProduct, payload)`

**Body:**
```json
{
    "comment": "WOWOK MBG"
}
```

---

### PATCH /api/comments/:id

Mengupdate isi komentar.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `updateComment(id, payload)`

**Body:**
```json
{
    "comment": "maaf bang ga lagi"
}
```

---

### DELETE /api/comments/:id

Menghapus komentar.

- **Auth Required:** ✅ Ya (Bearer Token)
- **Function:** `deleteComment(id)`

---

## 📋 Ringkasan Endpoint — Comments

| Method   | Endpoint                  | Deskripsi                     | Auth  | Function                          |
|----------|---------------------------|-------------------------------|-------|-----------------------------------|
| `GET`    | `/api/comments`           | Get semua komentar            | ❌    | `getAllComments()`                |
| `GET`    | `/api/comments/user/:id`  | Get komentar user tertentu     | ❌    | `getUserComments(id)`             |
| `GET`    | `/api/comments/me`        | Get riwayat komentar sendiri  | ✅ Ya | `getMyComments()`                 |
| `POST`   | `/api/comments/:idProduct`| Buat komentar di produk       | ✅ Ya | `createComment(idProduct, data)`  |
| `PATCH`  | `/api/comments/:id`       | Update komentar               | ✅ Ya | `updateComment(id, data)`         |
| `DELETE` | `/api/comments/:id`       | Hapus komentar                | ✅ Ya | `deleteComment(id)`               |
| `DELETE` | `/api/membership/:id`   | Hapus membership by ID     | ✅ Ya | `deleteMembershipById(id)`    |

---

> 📝 **Catatan:** Tambahkan endpoint baru di file ini setiap kali ada API baru yang dibuat.
