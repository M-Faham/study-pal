import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "security",
  title: "Security",
  icon: "🛡️",
  difficulty: "Tricky",
  targets: ['General'],
  keyPoints: [
    'XSS: sanitize user input, use textContent not innerHTML, strict CSP',
    'CSRF: SameSite cookie attribute + CSRF tokens for state-changing requests',
    'SQL injection: parameterised queries only — never string concatenation',
    'HTTPS everywhere — HSTS header to enforce it',
    'Least privilege: tokens/keys should have minimum required permissions',
  ],
  cheatSheet: [
    {
      concept: "XSS — Cross-Site Scripting",
      explanation:
        "Attacker injects malicious script into your page. Prevent by never inserting raw user content as HTML. Angular's template engine and React's JSX both escape by default.",
      code: `// ❌ XSS vulnerability — executing user content as HTML
element.innerHTML = userInput  // if userInput = '<script>steal()</script>'
dangerouslySetInnerHTML={{ __html: userInput }}  // same risk in React

// ✅ Angular auto-escapes in templates
<p>{{ userInput }}</p>  // safe — Angular HTML-encodes the value

// ✅ If you MUST render HTML, sanitize first
import { DomSanitizer } from '@angular/platform-browser'
sanitizer.sanitize(SecurityContext.HTML, trustedHtml)`,
    },
    {
      concept: "CSRF — Cross-Site Request Forgery",
      explanation:
        "Malicious site tricks authenticated browser into making a credentialed request to your API. Mitigation: SameSite cookies, CSRF tokens, check Origin/Referer header.",
      code: `// Server sets cookie with SameSite to prevent cross-site sends
Set-Cookie: session=abc; SameSite=Strict; Secure; HttpOnly

// Double-submit CSRF token pattern
// Server sets XSRF-TOKEN cookie (readable by JS)
// Client reads it and sends it in a header
headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN')
// Server compares header value to cookie value — cross-site request can't read the cookie`,
    },
    {
      concept: "Content Security Policy (CSP)",
      explanation:
        "HTTP header that tells the browser which sources of content are allowed. Prevents XSS by blocking inline scripts and scripts from untrusted origins.",
      code: `// HTTP response header
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.trusted.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.myapp.com

// No inline scripts allowed — attacker's injected <script> is blocked`,
    },
    {
      concept: "Input Validation — Client Is Not the Last Line of Defence",
      explanation:
        "Client-side validation improves UX but is trivially bypassed. All validation and sanitization must happen on the server. Never trust data from the client.",
      code: `// Client — validation for UX only, easily bypassed
if (!email.includes('@')) showError('Invalid email')

// Server — the real gate (e.g. Node.js with Zod)
const schema = z.object({ email: z.string().email() })
const result = schema.safeParse(req.body)
if (!result.success) return res.status(400).json(result.error)`,
    },
  ],
  spokenAnswer: {
    question: "How do you prevent XSS in a frontend application?",
    answer: `XSS happens when user-controlled content is executed as code in the browser. The primary defence is to never insert raw user input as HTML — and both React's JSX and Angular's template syntax escape values by default, so you're protected when you use the framework's normal data binding. The dangerous paths are dangerouslySetInnerHTML in React and innerHTML in Angular — these bypass the escaping. If I genuinely need to render HTML from a trusted source, I sanitize it with Angular's DomSanitizer or a library like DOMPurify before inserting. Beyond that, I implement a Content Security Policy header that restricts which script sources the browser will execute — even if an attacker injects a script tag, CSP blocks it if the source isn't whitelisted. I also make sure the auth token is in an httpOnly cookie so that even a successful XSS attack can't steal it. Defence in depth — no single measure is sufficient on its own.`,
  },
  traps: [
    {
      trap: "Relying only on client-side validation for security",
      correction:
        "Anyone can open DevTools, modify the request, or call your API directly bypassing the UI entirely. Client validation is for UX. Server validation is for security. They are not alternatives.",
    },
    {
      trap: "Marking all external HTML as trusted to avoid DomSanitizer warnings in Angular",
      correction:
        "DomSanitizer warnings exist for a reason. Bypassing sanitization with bypassSecurityTrustHtml allows XSS. Sanitize with sanitizer.sanitize() instead, or use DOMPurify on the content before passing it to Angular.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "Angular's template syntax ({{ value }}) automatically protects against XSS. How?",
      options: [
        "It blocks HTTP requests to external domains",
        "It HTML-encodes the value — special characters like < and > are rendered as text, not executed as markup",
        "It validates that value is a string before rendering",
        "It runs the value through a CSRF check",
      ],
      correct: 1,
      explanation:
        "Angular's interpolation ({{ }}) and property binding escape values — < becomes &lt;, > becomes &gt;, etc. The browser renders them as text, not as HTML or script. This is why innerHTML bypasses Angular's protection.",
    },
    {
      id: 2,
      question: "What does SameSite=Strict on a cookie do?",
      options: [
        "Prevents the cookie from being read by JavaScript",
        "Encrypts the cookie value",
        "Prevents the browser from sending the cookie on cross-site requests — mitigates CSRF",
        "Restricts the cookie to HTTPS connections",
      ],
      correct: 2,
      explanation:
        "SameSite=Strict tells the browser to only send the cookie with same-site requests. A CSRF attack originates from a different site — the cookie is not sent, so the request is not authenticated. Secure prevents sending over HTTP; HttpOnly prevents JS access.",
    },
  ],
}
