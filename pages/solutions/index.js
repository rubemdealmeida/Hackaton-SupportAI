import React, { useState } from 'react';
import styles from "./index.module.css";



export default function Home() {

  const [result, setResult] = useState(""); // Estado das mensagens

  const onSubmit = async () => {
    const input = document.getElementById("messageWritten").value
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

      setResult(data.result);
      const teste = data.result.split("|")
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
          placeholder="Digite uma mensagem"
        />
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <div>
        <h1>SupportAI</h1>
        <h1>Insira o seu Problema</h1>
        <Chat />
        <input onClick={onSubmit} type="submit" value="Send Message" />
        <h1>resultado: {result}</h1>
      </div>

      <div>
        <h1>Insira um novo diagnostico possivél</h1>
        <input
          id="issue"
          type="text"
          placeholder="Digite um problema"
        />
        <input
          id="diagnostic"
          type="text"
          placeholder="Digite um diagnostico"
        />
        <input onClick={onSubmit} type="submit" value="Add diagnostic" />
      </div>
    </main>
  );
}
