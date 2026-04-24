import { HttpClient } from "@/core/http-client";
import type { ProwexOptions } from "@/core/types";
import { Agents } from "@/resources/agents";
import { Conversations } from "@/resources/conversations";
import { Tools } from "@/resources/tools";
import { Schedules } from "@/resources/schedules";
import { Channels } from "@/resources/channels";
import { Knowledge } from "@/resources/knowledge";
import { Analytics } from "@/resources/analytics";
import { Mcp } from "@/resources/mcp";
import { Skills } from "@/resources/skills";

export class Prowex {
  readonly agents: Agents;
  readonly conversations: Conversations;
  readonly tools: Tools;
  readonly schedules: Schedules;
  readonly channels: Channels;
  readonly knowledge: Knowledge;
  readonly analytics: Analytics;
  readonly mcp: Mcp;
  readonly skills: Skills;

  constructor(options: ProwexOptions) {
    const client = new HttpClient(options);
    this.agents = new Agents(client);
    this.conversations = new Conversations(client);
    this.tools = new Tools(client);
    this.schedules = new Schedules(client);
    this.channels = new Channels(client);
    this.knowledge = new Knowledge(client);
    this.analytics = new Analytics(client);
    this.mcp = new Mcp(client);
    this.skills = new Skills(client);
  }
}
