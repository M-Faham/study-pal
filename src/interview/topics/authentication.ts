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
      explanation: `<p class="font-semibold text-gray-800 mb-1">Structure</p><p class="mb-3 text-gray-600">A JWT is three <strong>Base64Url-encoded</strong> parts separated by dots: <strong>Header</strong> (algorithm), <strong>Payload</strong> (claims like userId, exp), <strong>Signature</strong> (HMAC of header + payload using the server's secret).</p><p class="font-semibold text-gray-800 mb-1">Client vs Server</p><p class="text-gray-600">You can decode the payload on the client to read claims for display — but this is <strong>not verification</strong>. Any authorization decision must be made on the server, which verifies the signature. A user can tamper with the payload; the server catches it because the signature won't match.</p>`,
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
      explanation: `<p class="font-semibold text-gray-800 mb-1">localStorage — Convenient, XSS Risk</p><p class="mb-3 text-gray-600">Accessible to any JavaScript on the page. An <strong>XSS attack</strong> can read and exfiltrate the token trivially. Never store sensitive auth tokens in localStorage.</p><p class="font-semibold text-gray-800 mb-1">httpOnly Cookie — XSS Safe, CSRF Risk</p><p class="text-gray-600">The <code>HttpOnly</code> flag makes the cookie <strong>invisible to JavaScript</strong> — XSS scripts cannot read it. The browser sends it automatically. Mitigate CSRF with <code>SameSite=Strict</code> or <code>SameSite=Lax</code> plus CSRF tokens for state-changing requests.</p>`,
      code: `// localStorage — convenient but XSS risk
localStorage.setItem('token', jwt)
Authorization: Bearer \${token}

// httpOnly Cookie — XSS safe, set by server
Set-Cookie: token=jwt; HttpOnly; Secure; SameSite=Strict
// JS cannot read this cookie — browser sends it automatically`,
    },
    {
      concept: "Access Token + Refresh Token Pattern",
      explanation: `<p class="font-semibold text-gray-800 mb-1">Access Token — Short-Lived</p><p class="mb-3 text-gray-600">Expires in <strong>15 minutes</strong>. Sent as a <code>Bearer</code> header with every API request. Short TTL limits the exposure window if the token is leaked.</p><p class="font-semibold text-gray-800 mb-1">Refresh Token — Long-Lived</p><p class="text-gray-600">Expires in <strong>7–30 days</strong>. Stored in an <code>httpOnly</code> cookie — invisible to JavaScript. Used <em>only</em> to silently obtain a new access token when the current one expires. Never sent to the API directly.</p>`,
      code: `// Access token — short-lived, sent as Bearer
Authorization: Bearer <access_token>   // expires in 15 min

// Refresh token — long-lived, stored in httpOnly cookie
// When access token expires, client calls:
POST /auth/refresh
// Server validates refresh token, returns new access token`,
    },
    {
      concept: "Route Guards",
      explanation: `<p class="font-semibold text-gray-800 mb-1">Angular — CanActivateFn</p><p class="mb-3 text-gray-600">A functional guard that runs before navigating to a route. Return <code>true</code> to allow, <code>false</code> to block, or a <code>UrlTree</code> to redirect. Save the intended URL as a query param so the user lands there after login.</p><p class="font-semibold text-gray-800 mb-1">React Router — Wrapper Component</p><p class="text-gray-600">A <code>PrivateRoute</code> wrapper that checks auth state and renders either the protected children or a <code>&lt;Navigate to="/login"&gt;</code>. Role-based guards add an additional role check before rendering.</p>`,
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
