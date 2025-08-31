import React, { useState } from 'react'

const POST = async (action, payload) => {
  const res = await fetch('/.netlify/functions/assist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return res.json()
}

export default function App() {
  const [mode, setMode] = useState('summarize')
  const [rfp, setRfp] = useState('')
  const [question, setQuestion] = useState('')
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  const run = async () => {
    try {
      setRunning(true); setOutput('')
      if (!rfp.trim()) throw new Error('Please paste RFP text first.')

      if (mode === 'summarize') {
        const { text } = await POST('summarize', { rfp })
        setOutput(text)
      } else if (mode === 'qa') {
        if (!question.trim()) throw new Error('Please enter a question.')
        const { text } = await POST('qa', { rfp, question })
        setOutput(text)
      } else {
        const { text } = await POST('recommend', { rfp })
        setOutput(text)
      }
    } catch (err) {
      setOutput(`❌ ${err.message}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{padding: '16px'}}>
      <h1>AI Assist for Sales (HF)</h1>
      <textarea placeholder="Paste RFP text..." value={rfp} onChange={e=>setRfp(e.target.value)} />
      {mode==='qa' && (
        <input placeholder="Your question..." value={question} onChange={e=>setQuestion(e.target.value)} />
      )}
      <div style={{marginTop:'8px'}}>
        <button onClick={()=>setMode('summarize')}>Summarize</button>
        <button onClick={()=>setMode('qa')}>Ask</button>
        <button onClick={()=>setMode('recommend')}>Recommend</button>
      </div>
      <button onClick={run} disabled={running} style={{marginTop:'8px'}}>
        {running? 'Working...' : 'Run'}
      </button>
      <div className="result">{output || 'Results will appear here.'}</div>
    </div>
  )
}
