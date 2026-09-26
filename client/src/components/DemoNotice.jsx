import { USING_MOCK_API } from '../api/index.js'

// Tells whoever's looking at the deployed site that this is running on fake,
// browser-only data — same idea as the template's original DemoNotice.
export default function DemoNotice() {
  if (!USING_MOCK_API) return null

  return (
    <p className="small" style={{ background: '#1e293b', padding: 12, borderRadius: 6 }}>
      Demo mode: everything here is saved only in your own browser. Nothing is
      shared between devices yet — that happens once the real backend and
      database are connected.
    </p>
  )
}
