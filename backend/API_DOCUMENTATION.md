# Documentation API STANE TECH Backend

Ce document décrit les endpoints de l'API RESTful pour le backend de STANE TECH.

## Authentification

L'authentification est gérée via des JSON Web Tokens (JWT). Un token doit être inclus dans l'en-tête `Authorization` sous la forme `Bearer <token>` pour les routes protégées.

### `POST /api/v1/auth/register`
Enregistre un nouvel utilisateur.

- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // ou "admin"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

### `POST /api/v1/auth/login`
Connecte un utilisateur et retourne un JWT.

- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

### `GET /api/v1/auth/me`
Obtient les informations de l'utilisateur connecté.

- **Headers:** `Authorization: Bearer <token>`
- **Réponse:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "..."
    }
  }
  ```

### `PUT /api/v1/auth/updatedetails`
Mets à jour les détails de l'utilisateur connecté.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { ...utilisateur mis à jour ... }
  }
  ```

### `PUT /api/v1/auth/updatepassword`
Mets à jour le mot de passe de l'utilisateur connecté.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni..." // Nouveau token
  }
  ```

### `POST /api/v1/auth/forgotpassword`
Demande de réinitialisation de mot de passe.

- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": "Email sent"
  }
  ```

### `PUT /api/v1/auth/resetpassword/:resettoken`
Réinitialise le mot de passe avec un token.

- **Params:** `resettoken` (token reçu par email)
- **Body:**
  ```json
  {
    "password": "newpassword456"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni..." // Nouveau token
  }
  ```

## Produits

### `GET /api/v1/products`
Obtient tous les produits.

- **Réponse:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      { "_id": "...", "name": "Produit Test", "price": 9.99, ... }
    ]
  }
  ```

### `GET /api/v1/products/:id`
Obtient un produit par ID.

- **Réponse:**
  ```json
  {
    "success": true,
    "data": { "_id": "...", "name": "Produit Test", "price": 9.99, ... }
  }
  ```

### `POST /api/v1/products`
Crée un nouveau produit (Admin seulement).

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Nouveau Produit",
    "description": "Description du nouveau produit digital.",
    "price": 19.99,
    "category": "software"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { ...nouveau produit... }
  }
  ```

### `PUT /api/v1/products/:id`
Mets à jour un produit par ID (Admin seulement).

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Produit Mis à Jour",
    "price": 24.99
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { ...produit mis à jour... }
  }
  ```

### `DELETE /api/v1/products/:id`
Supprime un produit par ID (Admin seulement).

- **Headers:** `Authorization: Bearer <token>`
- **Réponse:**
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Commandes

### `GET /api/v1/orders`
Obtient toutes les commandes de l'utilisateur connecté (ou toutes les commandes si Admin).

- **Headers:** `Authorization: Bearer <token>`
- **Réponse:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      { "_id": "...", "user": { ... }, "products": [ ... ], "totalAmount": 24.99, ... }
    ]
  }
  ```

### `GET /api/v1/orders/:id`
Obtient une commande par ID.

- **Headers:** `Authorization: Bearer <token>`
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { "_id": "...", "user": { ... }, "products": [ ... ], "totalAmount": 24.99, ... }
  }
  ```

### `POST /api/v1/orders`
Crée une nouvelle commande.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "products": [
      { "product": "<product_id_1>", "quantity": 1 },
      { "product": "<product_id_2>", "quantity": 2 }
    ]
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { ...nouvelle commande... }
  }
  ```

### `PUT /api/v1/orders/:id`
Mets à jour le statut d'une commande (Admin seulement).

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "data": { ...commande mise à jour... }
  }
  ```

### `DELETE /api/v1/orders/:id`
Supprime une commande par ID (Admin seulement).

- **Headers:** `Authorization: Bearer <token>`
- **Réponse:**
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### `POST /api/v1/orders/payment/:orderId`
Traite le paiement pour une commande.

- **Headers:** `Authorization: Bearer <token>`
- **Params:** `orderId`
- **Body:**
  ```json
  {
    "paymentMethod": "moneyflow" // ou "fallback"
  }
  ```
- **Réponse:**
  ```json
  {
    "success": true,
    "message": "Payment successful",
    "order": { ...commande mise à jour... }
  }
  ```

### `POST /api/v1/orders/webhook`
Endpoint pour les webhooks de paiement. **Note:** Dans une application réelle, cet endpoint devrait être sécurisé par la vérification de la signature du fournisseur de paiement.

- **Body:** (Dépend du fournisseur de paiement)
  ```json
  {
    "orderId": "...",
    "status": "completed",
    "transactionId": "...",
    "provider": "moneyflow"
  }
  ```
- **Réponse:**
  ```json
  {
    "received": true
  }
  ```
