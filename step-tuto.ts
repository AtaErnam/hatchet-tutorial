import {Context} from "@hatchet-dev/typescript-sdk";

export const myStep = async (ctx: Context<any>) : Promise<object> => {
	const data = ctx.workflowInput();
	return data + 1;
}