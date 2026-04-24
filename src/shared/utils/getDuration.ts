// duration calculator
export const getDuration = (distanceKm: number) => {
  const min = 800;
  const max = 4000;

  const duration = distanceKm * 300;

  return Math.min(max, Math.max(min, duration));
}
