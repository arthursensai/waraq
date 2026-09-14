import ai from "@/lib/ai/index";

export const askAi = ({ input }: { input: String } ) => {
	const response = await ai.interactions.create({
		model: AI_MODEL,
		input
	})

	return response.output_text;
}
