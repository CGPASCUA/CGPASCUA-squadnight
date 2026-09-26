export default function MemberBadge({ initials, color = '#4f46e5', online = true }) {
  return (
    <div className="avatar" style={{ background: color }}>
      {initials}
      {online && <span className="status-dot" />}
    </div>
  )
}
