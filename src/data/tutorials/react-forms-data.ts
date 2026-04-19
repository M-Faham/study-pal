/**
 * React Forms Crash Course - Lesson Data
 *
 * WHAT YOU'LL LEARN:
 * - Controlled vs uncontrolled inputs
 * - Managing form state with useState and useReducer
 * - Validation patterns (manual + Zod)
 * - React Hook Form — the production standard
 * - Async submission, loading & error states
 */

import { ILesson } from '../../types/tutorial'

export const reactFormsLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'Controlled vs Uncontrolled Inputs',
    content: `
      <h2 class="text-2xl font-bold mb-4">Controlled vs Uncontrolled Inputs</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold mb-2">🔵 Controlled Input</p>
          <p class="text-gray-700 text-sm mb-2">
            React state is the <em>single source of truth</em>. The input's value is always
            driven by state — it can't hold a value React doesn't know about.
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>const [name, setName] = useState('')

&lt;input
  value={name}
  onChange={e => setName(e.target.value)}
/&gt;</code></pre>
          <p class="text-green-700 text-xs mt-2 font-bold">✅ Use this most of the time</p>
        </div>
        <div class="bg-gray-50 border-l-4 border-gray-400 p-4">
          <p class="font-bold mb-2">⚪ Uncontrolled Input</p>
          <p class="text-gray-700 text-sm mb-2">
            The DOM owns the value. You read it with a ref when you need it —
            usually only on submit.
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>const nameRef = useRef&lt;HTMLInputElement&gt;(null)

&lt;input ref={nameRef} /&gt;

// Read on submit:
nameRef.current?.value</code></pre>
          <p class="text-gray-600 text-xs mt-2">Use for file inputs or when integrating with non-React code.</p>
        </div>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
        <p class="font-bold mb-2">Why controlled is preferred</p>
        <ul class="list-disc ml-5 space-y-1 text-gray-700 text-sm">
          <li>You can react to every keystroke (live validation, character counters)</li>
          <li>Easy to reset the form — just clear state</li>
          <li>State is always in sync — no hidden values in the DOM</li>
          <li>Works with conditional disabling, formatting, masking</li>
        </ul>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
        <p class="font-bold mb-2">⚠️ Never mix controlled and uncontrolled</p>
        <pre class="bg-gray-800 text-red-400 p-3 rounded text-sm"><code>// ❌ Starts uncontrolled (no value prop), then becomes controlled
const [val, setVal] = useState&lt;string | undefined&gt;(undefined)
&lt;input value={val} onChange={e => setVal(e.target.value)} /&gt;
// React will warn: "A component is changing an uncontrolled input to be controlled"

// ✅ Always initialise with a string (even empty)
const [val, setVal] = useState('')</code></pre>
      </div>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Managing Form State',
    content: `
      <h2 class="text-2xl font-bold mb-4">Managing Form State</h2>

      <div class="mb-4">
        <p class="font-bold mb-2">Approach 1 — one useState per field (simple forms)</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>export default function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()  // prevent browser page reload
    console.log({ email, password })
  }

  return (
    &lt;form onSubmit={handleSubmit} className="space-y-4"&gt;
      &lt;div&gt;
        &lt;label htmlFor="email"&gt;Email&lt;/label&gt;
        &lt;input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /&gt;
      &lt;/div&gt;

      &lt;div&gt;
        &lt;label htmlFor="password"&gt;Password&lt;/label&gt;
        &lt;input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /&gt;
      &lt;/div&gt;

      &lt;button type="submit"&gt;Login&lt;/button&gt;
    &lt;/form&gt;
  )
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Approach 2 — single state object (medium forms)</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>interface RegisterForm {
  name: string
  email: string
  password: string
}

export default function RegisterForm() {
  const [form, setForm] = useState&lt;RegisterForm&gt;({
    name: '', email: '', password: ''
  })

  /**
   * BEST PRACTICE: Generic change handler.
   * The name attribute on each input matches the key in state,
   * so one function handles all fields.
   */
  const handleChange = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    &lt;form&gt;
      &lt;input name="name"     value={form.name}     onChange={handleChange} /&gt;
      &lt;input name="email"    value={form.email}    onChange={handleChange} /&gt;
      &lt;input name="password" value={form.password} onChange={handleChange} /&gt;
    &lt;/form&gt;
  )
}</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="font-bold mb-2">Approach 3 — useReducer (complex forms with many interactions)</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'RESET' }

function formReducer(state: RegisterForm, action: Action): RegisterForm {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return { name: '', email: '', password: '' }
  }
}

const [state, dispatch] = useReducer(formReducer, initialState)

// Usage:
dispatch({ type: 'SET_FIELD', field: 'email', value: 'a@b.com' })
dispatch({ type: 'RESET' })</code></pre>
      </div>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Validation — Manual & with Zod',
    content: `
      <h2 class="text-2xl font-bold mb-4">Validation — Manual & with Zod</h2>

      <div class="mb-4">
        <p class="font-bold mb-2">Manual validation</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>interface FormErrors {
  email?: string
  password?: string
}

/**
 * BEST PRACTICE: Return an errors object, not a boolean.
 * Each field gets its own error message — better UX.
 */
function validate(form: { email: string; password: string }): FormErrors {
  const errors: FormErrors = {}

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length &lt; 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}

// In the component:
const [errors, setErrors] = useState&lt;FormErrors&gt;({})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const errs = validate(form)
  if (Object.keys(errs).length &gt; 0) {
    setErrors(errs)   // show errors, don't submit
    return
  }
  // no errors → submit
}

// Render error inline:
{errors.email &amp;&amp; &lt;p className="text-red-600 text-sm"&gt;{errors.email}&lt;/p&gt;}</code></pre>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-2">Schema validation with Zod (recommended)</p>
        <p class="text-gray-700 text-sm mb-2">Zod lets you declare validation rules once and derive TypeScript types from them automatically.</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>npm install zod</code></pre>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm mt-2"><code>import { z } from 'zod'

// Define schema — rules + TypeScript type in one place
const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

// Infer the TypeScript type automatically
type LoginData = z.infer&lt;typeof LoginSchema&gt;

// Validate on submit
const result = LoginSchema.safeParse(form)

if (!result.success) {
  // result.error.flatten() gives { fieldErrors: { email: [...], password: [...] } }
  const errs = result.error.flatten().fieldErrors
  setErrors({ email: errs.email?.[0], password: errs.password?.[0] })
  return
}

// result.data is typed as LoginData — safe to use
submitToAPI(result.data)</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">BEST PRACTICE: Validate on blur, not on every keystroke</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// Validate a single field when the user leaves it (onBlur)
const handleBlur = (field: keyof FormErrors) => {
  const result = LoginSchema.shape[field].safeParse(form[field])
  if (!result.success) {
    setErrors(prev => ({ ...prev, [field]: result.error.issues[0].message }))
  } else {
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }
}

&lt;input onBlur={() => handleBlur('email')} /&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'React Hook Form — Production Standard',
    content: `
      <h2 class="text-2xl font-bold mb-4">React Hook Form — Production Standard</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">Why React Hook Form?</p>
        <ul class="list-disc ml-5 space-y-1 text-gray-700 text-sm">
          <li>Minimal re-renders — form state lives outside React state</li>
          <li>Built-in validation, touched/dirty tracking, error messages</li>
          <li>Works with Zod, Yup, Joi via resolvers</li>
          <li>Tiny bundle (~9 KB gzipped)</li>
        </ul>
        <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>npm install react-hook-form @hookform/resolvers zod</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Complete example — RHF + Zod</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer&lt;typeof schema&gt;

export default function LoginForm() {
  /**
   * useForm returns helpers:
   * - register: connects an input to RHF (tracks value + validation)
   * - handleSubmit: wraps your submit fn, validates before calling it
   * - formState: { errors, isSubmitting, isDirty, isValid, … }
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm&lt;FormData&gt;({
    resolver: zodResolver(schema),  // ← validation via Zod
  })

  const onSubmit = async (data: FormData) => {
    // Only called if validation passes — data is fully typed
    await api.login(data)
  }

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)} className="space-y-4"&gt;
      &lt;div&gt;
        &lt;label htmlFor="email"&gt;Email&lt;/label&gt;
        &lt;input id="email" {...register('email')} /&gt;
        {errors.email &amp;&amp; (
          &lt;p className="text-red-600 text-sm"&gt;{errors.email.message}&lt;/p&gt;
        )}
      &lt;/div&gt;

      &lt;div&gt;
        &lt;label htmlFor="password"&gt;Password&lt;/label&gt;
        &lt;input id="password" type="password" {...register('password')} /&gt;
        {errors.password &amp;&amp; (
          &lt;p className="text-red-600 text-sm"&gt;{errors.password.message}&lt;/p&gt;
        )}
      &lt;/div&gt;

      &lt;button type="submit" disabled={isSubmitting}&gt;
        {isSubmitting ? 'Logging in…' : 'Login'}
      &lt;/button&gt;
    &lt;/form&gt;
  )
}</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Key formState flags</p>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="bg-white p-2 rounded border"><code>isSubmitting</code><br/><span class="text-gray-600 text-xs">true while async submit runs</span></div>
          <div class="bg-white p-2 rounded border"><code>isValid</code><br/><span class="text-gray-600 text-xs">all fields pass validation</span></div>
          <div class="bg-white p-2 rounded border"><code>isDirty</code><br/><span class="text-gray-600 text-xs">user changed at least one field</span></div>
          <div class="bg-white p-2 rounded border"><code>errors</code><br/><span class="text-gray-600 text-xs">per-field validation messages</span></div>
        </div>
      </div>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Async Submission — Loading, Errors & Reset',
    content: `
      <h2 class="text-2xl font-bold mb-4">Async Submission — Loading, Errors & Reset</h2>

      <div class="mb-4">
        <p class="font-bold mb-2">Complete async submit pattern</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState&lt;SubmitStatus&gt;('idle')
  const [serverError, setServerError] = useState('')

  const {
    register, handleSubmit, reset,
    formState: { errors }
  } = useForm&lt;FormData&gt;({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setServerError('')

    try {
      await api.sendMessage(data)
      setStatus('success')
      reset()  // clear all fields after success
    } catch (err) {
      setStatus('error')
      setServerError('Something went wrong. Please try again.')
    }
  }

  // Show success message instead of form
  if (status === 'success') {
    return (
      &lt;div className="bg-green-50 p-6 rounded"&gt;
        &lt;p className="text-green-700 font-bold"&gt;
          ✅ Message sent!
        &lt;/p&gt;
        &lt;button onClick={() => setStatus('idle')}&gt;Send another&lt;/button&gt;
      &lt;/div&gt;
    )
  }

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      {/* fields … */}

      {/* Server-level error (not field-level) */}
      {serverError &amp;&amp; (
        &lt;p className="text-red-600 bg-red-50 p-3 rounded"&gt;{serverError}&lt;/p&gt;
      )}

      &lt;button
        type="submit"
        disabled={status === 'loading'}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      &gt;
        {status === 'loading' ? 'Sending…' : 'Send'}
      &lt;/button&gt;
    &lt;/form&gt;
  )
}</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">BEST PRACTICE: Disable submit while loading</p>
        <p class="text-gray-700 text-sm">
          Always disable the submit button during async operations.
          Without this, fast users can double-submit, causing duplicate API calls.
        </p>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Accessibility checklist for forms</p>
        <ul class="list-disc ml-5 space-y-1 text-gray-700 text-sm">
          <li>Every input has a <code class="bg-gray-200 px-1">&lt;label&gt;</code> connected via <code class="bg-gray-200 px-1">htmlFor</code></li>
          <li>Errors are linked to their input with <code class="bg-gray-200 px-1">aria-describedby</code></li>
          <li>Required fields have <code class="bg-gray-200 px-1">required</code> or <code class="bg-gray-200 px-1">aria-required</code></li>
          <li>Invalid inputs have <code class="bg-gray-200 px-1">aria-invalid="true"</code></li>
          <li>Submit button has a clear, descriptive label</li>
          <li>Form can be completed with keyboard only (Tab, Enter, Space)</li>
        </ul>
      </div>
    `,
  },
]
