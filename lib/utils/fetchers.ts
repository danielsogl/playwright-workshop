/**
 * Generic fetcher function for use with SWR.
 * Handles basic error checking and JSON parsing.
 * Throws an error if the network response is not ok.
 *
 * @param url - The URL to fetch.
 * @returns The JSON response data.
 * @throws {Error} If the fetch request fails or the response status is not ok.
 */
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, 0)); // 10 second delay
  const res = await fetch(url);

  if (!res.ok) {
    let errorMessage = `Fetch error (${res.status})`;

    try {
      // Attempt to get a more specific message from the API response body
      const errorData = await res.json();

      errorMessage = errorData.message
        ? `${errorMessage}: ${errorData.message}`
        : errorMessage;
    } catch {
      // Ignore JSON parsing errors if the body isn't valid JSON
    }

    // Throw a standard error with a descriptive message
    throw new Error(errorMessage);
  }

  // Parse and return the JSON response
  return res.json() as Promise<T>;
};
