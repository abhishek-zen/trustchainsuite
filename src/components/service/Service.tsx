// Simulated user apps API
export const getUserApplications = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const apps: string[] = ["App1"]; // Change this to simulate apps, e.g., ["MyApp1"]
      resolve(apps);
    }, 1000);
  });
};
