export default function Card({ title, meta, children }) {
  return (
    <div className="card">
      {title && <div className="title">{title}</div>}
      {meta && <div className="meta">{meta}</div>}
      {children}
    </div>
  )
}
