(async function() {
    const { signIn } = await import("auth-astro/client");
    signIn("keycloak");
})();