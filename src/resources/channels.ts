import { BaseResource } from "@/resources/base";
import type { RequestOptions } from "@/core/types";
import type { Channel, TelegramLink } from "@/types/channel";

export class Channels extends BaseResource {
  async list(options?: RequestOptions): Promise<Channel[]> {
    return this.client.get<Channel[]>("/channels", options);
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Channel> {
    return this.client.get<Channel>(`/channels/${id}`, options);
  }

  async delete(id: string, options?: RequestOptions): Promise<void> {
    return this.client.delete(`/channels/${id}`, options);
  }

  readonly telegram = {
    generateLink: async (options?: RequestOptions): Promise<TelegramLink> => {
      return this.client.post<TelegramLink>("/channels/link/telegram", undefined, options);
    },
  };
}
