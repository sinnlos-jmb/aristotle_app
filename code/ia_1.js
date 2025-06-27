process.removeAllListeners('warning');
const OpenAI = require ("openai");
const express = require('express');
require('dotenv').config()
const router = express.Router();


/**
 * Generate rta de un llm model.
 * @returns {Promise<string>}
 */
const generateRta = async (llm, p_system, p_prompt, p_max_tokens, onChunk) => {
  try {
     const mensaje = [
            { role: "system", content: p_system },
            { role: "user", content: p_prompt }
        ];
    let completion=null;
	const openai = new OpenAI({
			apiKey: process.env.apiKey_full,

			baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
		});

    completion = await openai.chat.completions.create({
        model: "qwen-plus", //llm 
        messages: mensaje,
        stream: true,
        stream_options: {
                include_usage: true
                },
        temperature:0.2,
        enable_thinking:false, //si verdadero: agregar limit_thinking_length:xx max_tokens del thinking
        max_tokens:p_max_tokens
        });

    console.log("streaming output...")

	return new Promise(async (resolve, reject) => {
        try {
            let fullContent = "";

            for await (const chunk of completion) {
                if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
                    const content = chunk.choices[0].delta?.content || "";
                    fullContent += content;
                    onChunk(content); 
                    }
                }
            resolve(fullContent); // final accumulado
            } 
        catch (error) {
            reject(new Error(`Stream error: ${error.message}`));
            }
    });
	
  } catch (error) {
    console.error("Error consulting LLM:", error.response?.data || error.message);
    throw new Error("Failed to generate response.");
  }
}



router.post("/", async (req, res) => {

  const params={prompt: req.body.prompt||"¿por que es azul el cielo?", context: req.body.context||"", llm: req.body.llm||"qwen-turbo-latest"};

  try {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		
		const system="eres un filosofo griego.",
            prompt=params.prompt;
        let llm_rta = ""; // Variable to store the full response

		await generateRta(params.llm, system, prompt, 700, (chunk) => {
    	 	llm_rta += chunk;
        	res.write(chunk); // Write each chunk as SSE
      	});
      	
    	if (llm_rta.length==0) {
      		return res.status(500).json({error: "LLM failed to generate a diagnosis."});
    		}
    	
    	res.end(); // Signal the end of the stream
    	}
  	catch (error) {
    	console.error("Error processing diagnosis:", error);
    	res.status(500).json({ error: "Failed to generate diagnosis." });
  		}
});




module.exports = router;