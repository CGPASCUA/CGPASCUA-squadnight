import { USING_MOCK_API } from '../api/index.js'

export default function DemoNotice() {
  if (!USING_MOCK_API) return null

  return (
    <p className="demo-notice">
      Demo mode: everything here is saved only in your own browser. Nothing is
      shared between devices yet — that happens once the real backend and
      database are connected.
    </p>
  )
}
