import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "authentication",
  title: "Authentication Flows",
  icon: "🔐",
  difficulty: "Tricky",
  targets: ['Angular', 'React', 'General'],
  keyPoints: [
    'JWT: header.payload.signature — verify signature, check expiry',
    'httpOnly cookies for tokens: invisible to JS, safe from XSS',
    'localStorage tokens: vulnerable to XSS — avoid for sensitive auth',
    'OAuth 2.0: delegate auth to provider; PKCE for SPAs (no client secret)',
    'Refresh token rotation: short-lived access token + long-lived refresh token',
  ],
  cheatSheet: [
    {
      concept: "JWT Structure and Verification",
      explanation:
        "A JWT is three Base64Url-encoded parts: Header (algorithm), Payload (claims), Signature. The signature is verified on the server — never trust claims on the client without server validation.",
      code: `// JWT: header.payload.signature
// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123

// Decode payload on client (for display only — NOT for auth decisions)
const payload = JSON.parse(atob(token.split('.')[1]))
// { userId: 1, exp: 1700000000, iat: 1699996400 }

// ⚠️ Client-side decode is NOT verification
// The server must verify the signature on every protected request`,
    },
    {
      concept: "Token Storage — localStorage vs httpOnly Cookie",
      explanation:
        "localStorage tokens are accessible to JavaScript — XSS can steal them. httpOnly cookies are invisible to JavaScript — XSS cannot read them, but CSRF is a risk (mitigate with SameSite=Strict/Lax or CSRF tokens).",
      code: `// localStorage — convenient but XSS risk
localStorage.setItem('token', jwt)
Authorization: Bearer \${token}

// httpOnly Cookie — XSS safe, set by server
Set-Cookie: token=jwt; HttpOnly; Secure; SameSite=Strict
// JS cannot read this cookie — browser sends it automatically`,
    },
    {
      concept: "Access Token + Refresh Token Pattern",
      explanation:
        "Short-lived access token (15min) sent with every request. Long-lived refresh token (7–30 days) stored securely, used only to get new access tokens. Limits exposure window if access token is leaked.",
      code: `// Access token — short-lived, sent as Bearer
Authorization: Bearer <access_token>   // expires in 15 min

// Refresh token — long-lived, stored in httpOnly cookie
// When access token expires, client calls:
POST /auth/refresh
// Server validates refresh token, returns new access token`,
    },
    {
      concept: "Route Guards",
      explanation:
        "Protect routes that require authentication or specific roles. In Angular: CanActivate / CanActivateFn. In React Router: a wrapper component that redirects if not authenticated.",
      code: `// Angular functional guard (v15+)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (auth.isLoggedIn()) return true
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
}

// React
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}`,
    },
  ],
  spokenAnswer: {
    question: "Where should you store a JWT token in a browser and why?",
    answer: `The safest place is an httpOnly cookie set by the server. httpOnly means JavaScript cannot access it at all — even if there's an XSS vulnerability on the page, the attacker's script cannot read the token. The browser sends the cookie automatically with every same-origin request. The tradeoff is CSRF — a malicious site could trick the browser into making a credentialed request — so you mitigate that with SameSite=Strict or SameSite=Lax, plus a CSRF token for state-changing requests. The alternative most SPAs use is localStorage, which is simpler to implement but exposed to XSS — any injected script on your page can steal the token. The rule I follow is: for anything sensitive, use httpOnly cookies and let the server manage the token lifecycle. localStorage is acceptable for non-sensitive data but not for auth tokens in a security-conscious application.`,
  },
  traps: [
    {
      trap: "Trusting JWT claims on the client for access control decisions",
      correction:
        "Decoding a JWT on the client gives you the payload claims but does NOT verify the signature. A user can modify a JWT's payload and re-encode it. All authorization decisions must be made on the server, which verifies the signature.",
    },
    {
      trap: "Long-lived access tokens with no refresh mechanism",
      correction:
        "A long-lived access token (e.g. 30 days) that gets leaked gives an attacker a 30-day window. Use short-lived access tokens (15 minutes) and a refresh token stored in an httpOnly cookie to silently renew them.",
    },
    {
      trap: "Redirecting to login without saving the intended URL",
      correction:
        "If the user is redirected to login from /dashboard/reports, after successful login they should be returned to /dashboard/reports — not the home page. Save the intended URL as a query param or in sessionStorage and redirect after auth.",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "Why is storing a JWT in localStorage a security risk?",
      options: [
        "localStorage is cleared when the browser closes",
        "localStorage has a 5MB size limit",
        "localStorage is accessible to any JavaScript on the page — XSS can steal the token",
        "localStorage does not work in private browsing mode",
      ],
      correct: 2,
      explanation:
        "Any JavaScript running on your page — including injected malicious scripts from XSS — can read localStorage. An httpOnly cookie is invisible to JavaScript and is the safer storage for auth tokens.",
    },
    {
      id: 2,
      question: "What is the purpose of a refresh token?",
      options: [
        "To make the access token last longer",
        "To refresh the page after login",
        "To obtain a new short-lived access token without requiring the user to log in again",
        "To validate the user's identity on every request",
      ],
      correct: 2,
      explanation:
        "Access tokens are short-lived to limit exposure if leaked. The refresh token (stored securely) is used to silently obtain a new access token when the current one expires, keeping the user logged in without re-authentication.",
    },
    {
      id: 3,
      question:
        "An Angular route guard returns router.createUrlTree(['/login']). What happens?",
      options: [
        "The guard blocks navigation and throws an error",
        "The guard redirects the user to /login instead of allowing access to the protected route",
        "The guard logs a warning and continues to the route",
        "The guard creates a new login component dynamically",
      ],
      correct: 1,
      explanation:
        "Returning a UrlTree from a CanActivateFn redirects the user to that URL. Returning true allows navigation; returning false blocks it. UrlTree is the preferred way to redirect from a guard.",
    },
  ],
}
