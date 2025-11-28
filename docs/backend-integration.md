# Integración Frontend ↔ Backend

## Resumen
- **Base URL**: `VITE_API_BASE_URL` (por defecto `http://localhost:8080/api`).
- **Auth requerido**: JWT en `Authorization: Bearer <token>` para `/users/me`, `/checkout`, `/orders/**`.
- **Tokens**: almacenar `accessToken` y `refreshToken` en `localStorage`; refrescar con `POST /auth/refresh`.
- **Timeout recomendado** (`VITE_API_TIMEOUT`): 20000 ms para cubrir latencias locales + XAMPP.

## Mapeo de endpoints y vistas/contexts

| Endpoint | Método | Consumo en frontend | Datos clave |
| --- | --- | --- | --- |
| `/auth/register` | POST | `AuthContext` → flujo de registro (Modal) | `RegisterRequest` (email, password, firstName, lastName, phone, run, street, region, comuna, birthDate). Devuelve `AuthResponse` con tokens y userId. |
| `/auth/login` | POST | `AuthContext` → login | `AuthRequest` (email, password). Retorna tokens + roles. |
| `/auth/refresh` | POST | `AuthContext` (renovar sesión) | `RefreshRequest` con `refreshToken`. |
| `/users/me` | GET | `AuthContext` inicializa perfil, `CheckoutForm`, `ProfilePage` | `UserProfileResponse` (mantiene campos actuales: run, nombres, address, etc.). |
| `/users/me` | PUT | `AuthContext` → actualizar perfil | `UserProfileUpdateRequest` (mismos campos del formulario). |
| `/products` | GET | `ProductosPage`, carrusel de populares, recomendaciones | Lista `ProductResponse` (codigo, categoria, nombre, precio, descripcion, popular, historia, imagenUrl). |
| `/products/{codigo}` | GET | `ProductModal` para detalles puntuales | Producto individual. |
| `/products/categories` | GET | Filtros (`ProductFilters`) | Array de strings. |
| `/cart/validate` | POST | `CartContext` / resumen de checkout | `CartItemRequest[]` (codigo, cantidad). Verifica stock/precios. |
| `/checkout` | POST | `CheckoutForm` → confirma orden | `CheckoutRequest` con datos del formulario + items carrito. Devuelve `OrderResponse` usado por `CheckoutSummary` y `OrderConfirmation`. |
| `/orders/me` | GET | `AuthContext` / historial (`OrdersPage`) | Lista de órdenes del usuario. |
| `/orders/{orderId}` | GET | `OrderDetails` | Orden completa según ID. |
| `/coupons/validate` | POST | `CheckoutSummary` / descuentos | { couponCode } → resultado boolean/porcentaje (solo `50MILSABORES`). |

## Checklist de verificación manual
1. **Backend**: `mvn spring-boot:run` (requiere MySQL corriendo y tabla `products` poblada).
2. **Swagger/Postman**: validar `/api/auth/login`, `/api/auth/register`, `/api/products`, `/api/checkout`.
3. **Frontend** (`npm run dev`):
   - Login/registro exitoso → tokens guardados y refresco automático.
   - Catálogo carga desde `/api/products` (sin leer `data/products.js`).
   - Carrito + checkout: aplica cupón `50MILSABORES`, confirma pedido y ve `OrderConfirmation`.
   - Historial de pedidos (`/orders/me`) se refresca tras checkout.
4. **Persistencia**: revisar en MySQL `orders`, `order_items`, `users` para asegurar escritura; confirmar `coupon_discount`, `senior_discount` y totales calculados por backend.
5. **Errores**: probar tokens expirados y ausencia de auth para confirmar redirecciones/modales.

## Configuración y despliegue front/back
- `.env.local` en frontend debe definir `VITE_API_BASE_URL` del entorno (dev, QA, prod) y opcionalmente `VITE_API_TIMEOUT`.
- Backend: usa `application.properties` + variables del sistema para separar credenciales por ambiente.
- Orden recomendado al desplegar:
  1. Migrar BD (`products`, `users`, etc.).
  2. Lanzar backend (`java -jar ...`).
  3. Actualizar `VITE_API_BASE_URL` y reconstruir frontend (`npm run build`).
  4. Verificar endpoints críticos y flujos UI.

## Dependencias entre módulos de frontend
- `AuthContext` centraliza login/registro/refresh y expone `user`, `tokens`, `orders` (via `/orders/me`).
- `CartContext` mantiene ítems localmente; usa `/cart/validate` antes de checkout.
- `CheckoutForm` y `CheckoutSummary` consumen `CheckoutService` para calcular totales y crear la orden.
- `ProductosPage`, `PopularProducts`, `RecommendedProducts` dejan de leer de `data/products.js` y pasan a `ProductService`.
- `OrderConfirmation` espera `OrderResponse` del backend (mantener campos `number`, `items`, `total`, `deliveryOption`, etc.).

## Próximos entregables
1. Cliente HTTP (`src/services/apiClient.js`) basado en `fetch` con timeout y manejo de errores JSON.
2. Servicios de dominio (`authService`, `productService`, `checkoutService`, `orderService`, `couponService`, `userService`).
3. Refactor de `AuthContext` y `CartContext` para usar servicios y tokens persistentes.
4. Migrar páginas/componentes para consumir datos reales + estados de carga/errores.
5. Checklist de pruebas manuales (login, refresh, catálogo, checkout, órdenes).
