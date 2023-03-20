import { useState } from "react"

// Button component
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

// Statistics component
const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = all > 0 ? roundToTwo((good - bad) / all) : 0
  const positive = all > 0 ? roundToTwo((good / all) * 100) : 0

  // If no feedback has been given, show a message
  if (all === 0) {
    return <div>No feedback given</div>
  }

  // Otherwise, show the statistics table
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  )
}

// StatisticLine component
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

// Round to two decimal places
const roundToTwo = (num) => Math.round(num * 100 + Number.EPSILON) / 100

// App component
const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Render the app
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App