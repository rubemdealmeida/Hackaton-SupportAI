import React, { useState } from 'react';
import styles from "./index.module.css";

const Issue = () => {

    const issueDataSource = [
        { id: 1, issue: 'Não consigo logar', },
    ];
    // Fonte de dados (exemplo simples usando um array)
    const [messages, setMessages] = useState(issueDataSource); // Estado das mensagens
    const [result, setResult] = useState(""); // Estado das mensagens

    const onSubmit = async () => {
        const input = document.getElementById("messageWritten").value
        handleUserInput(input)
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ issue: input }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }



    }

    const handleUserInput = (input) => {
        // Lógica para atualizar a fonte de dados com a nova mensagem
        const newMessage = { id: Date.now(), message: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

    };
    // Componente do chat
    const Chat = () => {
        // Função para lidar com a entrada do usuário

        return (
            <div>
                {/* Renderiza as mensagens */}
                {messages.map((msg) => (
                    <div key={msg.id}>{msg.issue}</div>
                ))}

                {/* Exemplo de entrada do usuário */}
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
                <h1>ChatGPT em React</h1>
                <Chat />
                <input onClick={onSubmit} type="submit" value="Send Message" />
                <h1>resultado: {result}</h1>
            </div>
        </main>
    );
}

export default Issue