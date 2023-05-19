import { Configuration, OpenAIApi } from "openai";
import solutions from '../../solutions.json';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const diagnostic = req.body.diagnostic || '';
    const solution = req.body.solution || '';
    if (solution) {
        solutions.push(solution)
    }
    if (diagnostic) {
        console.log('diagnostic', diagnostic)
        try {
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: generatePrompt(diagnostic),
                max_tokens: 100,
                temperature: .7,
            });
            res.status(200).json({ result: completion.data.choices[0].text });
        } catch (error) {
            // Consider adjusting the error handling logic for your use case
            if (error.response) {
                console.error(error.response.status, error.response.data);
                res.status(error.response.status).json(error.response.data);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                res.status(500).json({
                    error: {
                        message: 'An error occurred during your request.',
                    }
                });
            }
        }
    }
}

function generatePrompt(diagnostic) {
    const promtString = JSON.stringify(solutions)
    return (
        `
    utilizando as informações a seguir:
    ${promtString}
    retorne todas as solutions que o diagnostic sejam semelhantes a: ${diagnostic}
    sem respostas duplicadas
    retorne respostas separadas por |
    `
    )

}
