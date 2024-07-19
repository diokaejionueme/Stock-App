/* OPENAI WORKER  */

import OpenAI from "openai";


const corsHeaders = {
	'Access-Control-Allow-Origin': '*', 
	'Access-Control-Allow-Methods': 'POST, OPTIONS', 
	'Access-Control-Allow-Headers': 'Content-Type'
};


export default {
	async fetch(request, env, ctx) {
		if(request.method === 'OPTIONS'){//When does request.Method === OPTIONS happen?
			return new Response(null, {headers: corsHeaders});
		}

		//Only Process POST requests
		if(request.method !== 'POST' ){
			return new Response(
				JSON.stringify({error: `${request.method} method not allow. `}), 
				{status: 405, headers: corsHeaders})
		}


		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/c7af162a0e1c690f74e06c078fc5acfc/stock-predictions/openai'
			
		})
		try {
			const messages = await request.json()
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				temperature: 1.1, 
				presence_penalty: 0,
				frequency_penalty: 0
			})

			const response = chatCompletion.choices[0].message
			return new Response(JSON.stringify(response), {headers: corsHeaders});

		}catch(e){
			return new Response(JSON.stringify({error: e.messag}), {status: 500, headers: corsHeaders})

		}
	},
};
