import { useMutation } from "@tanstack/react-query";
import { aiAsk } from "./aiApi";

export useAskAi = () => {
	return useMutation ({
		mutationFn: async ({ input }:  { input: string }) => {
			return aiAsk({ input });
		};
		
	});
};
