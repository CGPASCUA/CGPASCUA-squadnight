export default function PollOption({ label, votes, totalVotes, onVote }) {
  const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0
  return (
    <div className="poll-option">
      <div className="poll-option-top">
        <span>{label}</span>
        <span>
          {votes} votes{' '}
          <button className="btn btn-accent" style={{ marginLeft: 8 }} onClick={onVote}>
            Vote
          </button>
        </span>
      </div>
      <div className="poll-bar-track">
        <div className="poll-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
