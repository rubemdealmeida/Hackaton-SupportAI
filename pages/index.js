import React, { useState } from 'react';
import styles from "./index.module.css";



export default function Home() {

  const [result, setResult] = useState([]);
  const [solution, setSolution] = useState([]);
  const [requestedSolution, setRequestedSolution] = useState('');

  const onSubmit = async () => {
    const input = document.getElementById("messageWritten").value
    setResult([])
    setSolution([])
    const issue = document.getElementById("issue").value
    const diagnostic = document.getElementById("diagnostic").value
    document.getElementById("diagnostic").value = ''
    document.getElementById("issue").value = ''
    const newDiagnostic = {
      issue,
      diagnostic
    }
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue: input, issueDiagnostics: newDiagnostic }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const results = data.result.split("|")
      setResult(results);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const requestSolution = async (diagnostic) => {
    setResult([])
    setSolution([])
    const newDiagnostic = document.getElementById("solutionDiagnostic").value
    const solution = document.getElementById("solution").value
    document.getElementById("solutionDiagnostic").value = ''
    document.getElementById("solution").value = ''
    const newSolution = {
      solution,
      diagnostic: newDiagnostic
    }
    try {
      const response = await fetch("/api/solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diagnostic: diagnostic, solution: newSolution }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      const results = data.result.split("|")
      setRequestedSolution(diagnostic)
      setSolution(results);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }


  const Chat = () => {
    return (
      <div>
        <input
          id="messageWritten"
          type="text"
          style={{ padding: 10 }}
          placeholder="Type a message"
        />
      </div>
    );
  };

  return (
    <main className={styles.main} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h1>SupportAI</h1>
        <h1>Type your issue</h1>
        <Chat />
        <input onClick={onSubmit} style={{ padding: 10 }} type="submit" value="Send Message" />
        <div style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', textAlign: 'center', verticalAlign: 'center' }}>
          {
            result?.length?
            <div style={{ verticalAlign: 'middle', flexDirection: 'row' }}>
              Result:
              {result.map((result, index) => {
                return (
                  <input style={{ verticalAlign: 'middle', marginLeft: 5, height: 50, padding: 10, }} id={`${index + result}`} value={result.replace(/(\r\n|\n|\r)/gm, "")} onClick={() => { requestSolution(result) }} type="submit" />
                )
              })}
            </div>: <></>
          }
        </div>
        {solution?.length ?
          <div style={{ marginTop: 10, borderWidth: 3, border: '1px solid black', borderRadius: 6 }}>
            Possible solutions to "{requestedSolution}":
            {solution.map((value) => {
              return (
                <div>
                  {value}
                </div>
              )

            })}
          </div> : <></>
        }
      </div>
      <div style={{ width: 1000, height: 47, borderBottom: '1px solid black', }}></div>
      <div>
        <div>
          <h1>Insert a new possible diagnosis</h1>
          <input
            id="issue"
            type="text"
            style={{ padding: 10, marginRight: 5 }}
            placeholder="Type a issue"

          />
          <input
            id="diagnostic"
            type="text"
            style={{ padding: 10, marginLeft: 5 }}
            placeholder="Type a diagnosis"
          />
        </div>
        <input onClick={onSubmit} style={{ padding: 10 }} type="submit" value="Add diagnostic" />
      </div>
      <div style={{ width: 1000, height: 47, borderBottom: '1px solid black', }}></div>
      <div >
        <div>
          <h1>Insert a new possible solution</h1>
          <input
            id="solutionDiagnostic"
            type="text"
            style={{ padding: 10, marginRight: 5 }}
            placeholder="Type a diagnosis"
          />
          <input
            id="solution"
            type="text"
            style={{ padding: 10, marginLeft: 5 }}
            placeholder="Type a solution"
          />
        </div>
        <input style={{ padding: 10 }} onClick={() => { requestSolution('') }} type="submit" value="Add solution" />
      </div>
    </main >
  );
}
