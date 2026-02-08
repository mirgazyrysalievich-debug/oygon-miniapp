type Role = 'Owner' | 'HR' | 'Leader' | 'Employee';

type SetRoleContext = {
  args: string[];
  reply: (message: string) => Promise<void> | void;
  setRole: (userId: string, role: Role) => void;
};

export async function handleSetRoleCommand(context: SetRoleContext) {
  const [userId, roleInput] = context.args;
  if (!userId || !roleInput) {
    await context.reply('Usage: /setrole <userId> <Owner|HR|Leader|Employee>');
    return;
  }

  const role = roleInput as Role;
  const allowedRoles: Role[] = ['Owner', 'HR', 'Leader', 'Employee'];
  if (!allowedRoles.includes(role)) {
    await context.reply('Role must be one of Owner, HR, Leader, Employee');
    return;
  }

  context.setRole(userId, role);
  await context.reply(`Set role for ${userId} to ${role}`);
}
