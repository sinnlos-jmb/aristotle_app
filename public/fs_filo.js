async function askPhilosophy() {
  const prompt = document.getElementById('prompt').value.trim();
  const responseElement = document.getElementById('responseBox');

  if (!prompt) {
    responseElement.innerText = "Realizar una pregunta.";
    return;
  }

  responseElement.innerHTML = "Pensando...";

      //const llm = document.getElementById("dd_llm").value;

      let primer_chunk=true;
      try {
        const response = await fetch("/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          responseElement.textContent = `Error: ${response.statusText}`;
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (primer_chunk) {
            responseElement.textContent="";
            primer_chunk=false;
          }
          responseElement.textContent += decoder.decode(value);// Append streamed content
        }
      } catch (error) {
        responseElement.textContent = `Error al generar el diagnóstico: ${error.message}`;
      }




}

