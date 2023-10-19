export const timeData = {
  periods: [ 'Once', 'Daily', 'Weekly', 'BiWeekly', 'Monthly' ] as const,
  weekdays: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' 
  ] as const,
  months: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ] as const,
  daysPerMonth: [
    31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ] as const,
  years: [...[...Array(40).keys()].map(y => y+2020)] as const,
  dates: [...Array(32).keys()] as const,
  times: [...[...Array(23).keys()].reduce<string[]>((a,h)=> [
    ...a, 
    `${h.toString().padStart(2,'0')}:00`,
    `${h.toString().padStart(2,'0')}:15`,
    `${h.toString().padStart(2,'0')}:30`,
    `${h.toString().padStart(2,'0')}:45`,
  ], [])] as const
};

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export type User = {
  id: number,
  username: string, 
  privilege: string,
  avatar: string,
}

export type Contact = {
  id: number,
  email: string,
  subject: string,
  message: string,
  timestamp: number,
  search: string
}

export type EventPerformance = {
  id: number,
  day: typeof dates[number];
  month: typeof months[number];
  year: typeof years[number];
  time: typeof times[number];
  timestamp: number,
  period: typeof periods[number];
  location: string,
  thumbnail: string,
  description: string,
  website: string,
  media: string[]
}

export type Review = {
  id: number,
  event: number,
  timestamp: number,
  approved: boolean,
  name: string,
  stars: number,
  text: string,
}