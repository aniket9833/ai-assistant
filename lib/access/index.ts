// No DB calls here - just pure logic on data already fetched by services
export function canAccessProject(
  user: { projectId: string },
  projectId: string,
) {
  return user.projectId === projectId;
}

export function isAdminOfProject(user: { role: string }) {
  return user.role === 'admin';
}

export function canSendMessage(user: { projectId: string }, projectId: string) {
  return canAccessProject(user, projectId);
}
