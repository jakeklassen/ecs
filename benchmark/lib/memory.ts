export const memoryUsage = (): void => {
  const used = process.memoryUsage();

  for (const [key, value] of Object.entries(used)) {
    console.log(`${key} ${Math.round((value / 1024 / 1024) * 100) / 100} MB`);
  }
};
