import { Context, Telegraf } from 'telegraf';
import { ApiClient } from '../api/client';

export const registerInviteCommand = (bot: Telegraf<Context>, api: ApiClient) => {
  bot.command('invite', async (ctx) => {
    try {
      const response = await api.get<{ inviteCode: string }>('/company/invite');
      await ctx.reply(
        `Invite code: ${response.inviteCode}\nShare this code with employees to join your company.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch invite code.';
      await ctx.reply(message);
    }
  });
};
