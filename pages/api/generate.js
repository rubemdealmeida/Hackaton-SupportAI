import { Configuration, OpenAIApi } from "openai";
import initialIssueDiagnostics from '../../issueDiagnostics.json';

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

  const issue = req.body.issue || '';
  const issueDiagnostics = req.body.issueDiagnostics || '';
  if (issueDiagnostics) {
    initialIssueDiagnostics.push(issueDiagnostics)
  }
  if (issue) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(issue),
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

function generatePrompt(issue) {
  const promtString = JSON.stringify(initialIssueDiagnostics)
  return (
    `
    utilizando as informações a seguir:
    ${promtString}
    retorne todos os diagnostics compativeis com a issue: ${issue}
    sem respostas duplicadas
    retorne respostas separadas por |
    
    `

  )

}
