import { HttpClient } from "@/core/http-client";
import type { ProwexOptions } from "@/core/types";
import { Agents } from "@/resources/agents";
import { Conversations } from "@/resources/conversations";
import { Tools } from "@/resources/tools";
import { Knowledge } from "@/resources/knowledge";
import { Analytics } from "@/resources/analytics";
import { Skills } from "@/resources/skills";

export class Prowex {
  readonly agents: Agents;
  readonly conversations: Conversations;
  readonly tools: Tools;
  readonly knowledge: Knowledge;
  readonly analytics: Analytics;
  readonly skills: Skills;

  constructor(options: ProwexOptions) {
    const client = new HttpClient(options);
    this.agents = new Agents(client);
    this.conversations = new Conversations(client);
    this.tools = new Tools(client);
    this.knowledge = new Knowledge(client);
    this.analytics = new Analytics(client);
    this.skills = new Skills(client);
  }
}
