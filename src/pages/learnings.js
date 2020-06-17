import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const LearningsPage = () => {
  const [learnings, setLearnings] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const formatLearnings = learningsArray => {
    const formattedLearnings = {}

    for (let i = 0; i < learningsArray.length; i++) {
      let category = learningsArray[i].category
      let learning = learningsArray[i].text
      if (!formattedLearnings[category]) {
        formattedLearnings[category] = [learning]
      } else {
        formattedLearnings[category].push(learning)
      }
    }
    return formattedLearnings
  }

  useEffect(() => {
    const getLearnings = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://wikiluke.herokuapp.com/learnings")

        if (!response.ok) {
          setError(
            `Something went wrong: Expected 200 response, got ${response.status}`
          )
          return
        }
        const learnings = await response.json()
        const formattedLearnings = formatLearnings(learnings)
        setLearnings(formattedLearnings)
      } catch (e) {
        setError(`Error fetching data: ${e}`)
      } finally {
        setLoading(false)
      }
    }
    getLearnings()
  }, [])

  let content = []
  for (const category in learnings) {
    const block = (
      <>
        <h2>{category}</h2>
        <ul>
          {learnings[category].map((learning, idx) => (
            <li key={idx}>{learning}</li>
          ))}
        </ul>
      </>
    )
    content.push(block)
  }

  return (
    <Layout>
      <SEO title="Learnings" />
      <h1>Learnings</h1>
      {content.map((block, idx) => (
        <div key={`block-${idx}`}>{block}</div>
      ))}
      {loading && <p>Loading. . .</p>}
      {error && <p>{error}</p>}
    </Layout>
  )
}

export default LearningsPage
