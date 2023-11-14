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
  password: string,
  salt: string,
  privilege: string,
  avatar: string,
}

export type Update = {
  id: number,
  userID: number,
  timestamp: number,
  body: string,
  search: string
}

export type Contact = {
  id: number,
  timestamp: number,
  email: string,
  subject: string,
  message: string,
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
  media: string[],
  search?: string
}

export type Review = {
  id: number,
  event: number,
  timestamp: number,
  approved: boolean,
  name: string,
  stars: number,
  text: string,
  search?: string
}

const models = {
  user: { 
    id: `SERIAL`,
    username: 'TEXT', 
    password: 'TEXT',
    salt: 'TEXT',
    privilege: `TEXT`,
    avatar: `TEXT`,
    PRIMARY: 'KEY (username)' 
  },
  update: {
    id: `SERIAL`,
    userID: `NUMERIC`,
    timestamp: `NUMERIC`,
    body: `TEXT`,
    search: `TEXT`
  },
  contact: {
    id: `SERIAL`,
    timestamp: `NUMERIC`,
    email: `TEXT`,
    subject: `TEXT`,
    message: `TEXT`,
    search: `TEXT`,
    PRIMARY: `KEY (id)`
  },
  event: {
    id:`SERIAL`,
    day: 'TEXT',
    month: 'TEXT', 
    year: `NUMERIC`,
    time: 'TEXT',
    timestamp: 'NUMERIC',
    period: 'TEXT',
    location: 'TEXT',
    thumbnail: 'TEXT',
    description: 'TEXT',
    website: 'TEXT',
    media: 'TEXT',
    search: 'TEXT',
    PRIMARY: 'KEY (id)' 
  },
  review: {
    id: `SERIAL`,
    event: 'NUMERIC',
    timestamp: 'NUMERIC',
    approved: 'TEXT',
    name: 'TEXT',
    stars: `NUMERIC`,
    text: `TEXT`,
    search: 'TEXT',
    PRIMARY: `KEY (id)`
  }

};

export default models;