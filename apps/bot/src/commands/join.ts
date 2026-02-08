import { Context, Telegraf } from 'telegraf';
import { ApiClient, JoinCompanyResponse } from '../api/client';

export const registerJoinCommand = (bot: Telegraf<Context>, api: ApiClient) => {
  bot.command('join', async (ctx) => {
    const inviteCode = ctx.message?.text?.split(' ')[1];
    if (!inviteCode) {
      await ctx.reply('Usage: /join <inviteCode>');
      return;
    }

    try {
      const response = await api.post<JoinCompanyResponse>('/company/join', { inviteCode });
      const teamName = response.company.team?.name ?? '-';
      const departmentName = response.company.department?.name ?? '-';
      await ctx.reply(
        `Joined ${response.company.name}. Team: ${teamName}. Department: ${departmentName}.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to join company.';
      await ctx.reply(message);
    }
  });
};
