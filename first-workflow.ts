import Hatchet, {Workflow} from "@hatchet-dev/typescript-sdk";
import dotenv from "dotenv";
import * as fs from "node:fs";
import {text} from "node:stream/consumers";

dotenv.config();

const hatchet = Hatchet.init();

// const workflow: Workflow = {
// 	id: "first-workflow",
// 	description: "This is my first workflow",
// 	on: {
// 		event: "tutorial:create",
// 	},
// 	steps: [
// 		{
// 			name: "first-step",
// 			run: async (ctx) => {
// 				console.log(
// 					"Congratulations! You've successfully triggered your first workflow run! 🎉",
// 				);
//
// 				return {
// 					result: "success",
// 				};
// 			},
// 		},
// 	],
// };

const workflow : Workflow = {
	description: "this is the tuto workflow",
	id: 'basic-rag-workflow',
	on: {
		event: 'question:create',
	},
	steps: [
		{
			name: 'start',
			run: async (ctx) => {
				return {
					"status": "starting...",
				}
			}
		},
		{
			name: 'load_docs',
			parents: ['start'],
			run: async (ctx) => {
				const text_content = fs.readFileSync('workflow-tuto.txt', 'utf-8')
				return {
					"status": "docs loaded",
					"docs": text_content,
				}
			}
		},
		{
			name: 'reason_docs',
			parents: ['load_docs'],
			run: (ctx) => {
				const docs = ctx.stepOutput("load_docs")['docs']
				const research = docs?.toString() ?? 'no reason';
				return {
					"status": "writing a response",
					"research": research
				}
			}
		},
		{
			name: 'generate_response',
			parents: ['reason_docs'],
			run: (ctx) => {
				const research = ctx.stepOutput("reason_docs")['research']
				const message = 'finally done';
				return {
					"status": "complete",
					"message": message
				}
			}
		}
	]
}

async function main() {
	const worker = await hatchet.worker("tutorial-worker");
	await worker.registerWorkflow(workflow);
	await worker.start();
}

main();