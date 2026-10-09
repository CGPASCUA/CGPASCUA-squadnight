export default function MemberBadge({ initials, color = '#f59e0b', online = true }) {
  return (
    <div className="avatar" style={{ background: color }}>
      {initials}
      {online && <span className="status-dot" />}
    </div>
  )
}
