interface convertSecondsResponse {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const convertSeconds = (seconds: number): convertSecondsResponse => {
  const total_minutes = Math.floor(seconds / 60);
  const total_hours = Math.floor(total_minutes / 60);
  const days = Math.floor(total_hours / 24);

  return { days, hours: total_hours % 24, minutes: total_minutes % 60, seconds };
};
