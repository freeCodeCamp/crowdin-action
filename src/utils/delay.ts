/**
 * Utility function to sleep for a given amount of time.
 *
 * @param {number} ms The amount of time to sleep, in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the given amount of time.
 */
export const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));
