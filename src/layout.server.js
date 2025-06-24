export async function load({ locals }) {
  return {
    user: locals.user || null,
    isAuthenticated: locals.isAuthenticated || false
  };
}
