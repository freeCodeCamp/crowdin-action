/**
 * Utility to confirm that the required environment variables are present.
 *
 * @returns {Promise<boolean>} Whether the environment variables are valid.
 */
export const validateEnvironment = () => {
  if (!process.env.CROWDIN_PERSONAL_TOKEN || !process.env.CROWDIN_API_URL) {
    console.error("Missing Crowdin credentials.");
    return false;
  }
  return true;
};
