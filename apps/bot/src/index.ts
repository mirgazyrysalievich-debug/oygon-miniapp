import { handleSetRoleCommand } from './commands/setrole';

type Role = 'Owner' | 'HR' | 'Leader' | 'Employee';

type BotContext = {
  messageText: string;
  reply: (message: string) => Promise<void> | void;
};

const roleStore = new Map<string, Role>();

function setRole(userId: string, role: Role) {
  roleStore.set(userId, role);
}

export async function handleMessage(context: BotContext) {
  if (!context.messageText.startsWith('/setrole')) {
    return;
  }

  const args = context.messageText.split(' ').slice(1);
  await handleSetRoleCommand({
    args,
    reply: context.reply,
    setRole,
  });
}
