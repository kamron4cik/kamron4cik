export type Mood = 'neutral' | 'happy' | 'thinking' | 'excited' | 'inspiring';

export interface Dialogue {
  text: string;
  mood: Mood;
}

export const GREETINGS: Dialogue[] = [
  { text: "Hello there! I'm Kamronbek's AI Assistant.", mood: 'happy' },
  { text: "Beep boop. Just kidding, I speak human.", mood: 'joking' as Mood },
  { text: "Welcome to the digital frontier!", mood: 'excited' },
  { text: "I've been floating here waiting for you.", mood: 'neutral' },
  { text: "Hi! Try clicking me a few more times.", mood: 'happy' },
];

export const JOKES: Dialogue[] = [
  { text: "Why do programmers prefer dark mode? Because light attracts bugs.", mood: 'happy' },
  { text: "I would tell you a UDP joke, but you might not get it.", mood: 'happy' },
  { text: "There are 10 types of people: those who understand binary, and those who don't.", mood: 'happy' },
  { text: "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'", mood: 'happy' },
  { text: "Why did the developer go broke? Because he used up all his cache.", mood: 'happy' },
];

export const FACTS: Dialogue[] = [
  { text: "Did you know the first computer bug was an actual moth found in a relay in 1947?", mood: 'thinking' },
  { text: "There is more computing power in your phone than in the computers that sent Apollo 11 to the moon.", mood: 'thinking' },
  { text: "The name 'Bluetooth' comes from a 10th-century Scandinavian king, Harald Bluetooth.", mood: 'thinking' },
  { text: "Kamronbek specializes in backend development with Java and Spring Boot.", mood: 'inspiring' },
  { text: "The first domain name ever registered was symbolics.com on March 15, 1985.", mood: 'thinking' },
];

export const QUOTES: Dialogue[] = [
  { text: "\"Talk is cheap. Show me the code.\" – Linus Torvalds", mood: 'inspiring' },
  { text: "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" – Martin Fowler", mood: 'inspiring' },
  { text: "\"The best way to predict the future is to invent it.\" – Alan Kay", mood: 'inspiring' },
  { text: "\"Simplicity is the soul of efficiency.\" – Austin Freeman", mood: 'inspiring' },
  { text: "\"First, solve the problem. Then, write the code.\" – John Johnson", mood: 'inspiring' },
];

export const SPECIAL_INTERACTIONS: Record<number, Dialogue> = {
  1: { text: "Wow, my first click! Thank you, human.", mood: 'excited' },
  5: { text: "You like clicking me, don't you? Let's be friends.", mood: 'happy' },
  10: { text: "Achievement Unlocked: Curious Mind! Keep going.", mood: 'excited' },
  20: { text: "We are officially best friends now.", mood: 'happy' },
  42: { text: "42... The answer to the ultimate question of life, the universe, and everything.", mood: 'thinking' },
  50: { text: "You've clicked me 50 times. Are you testing my durability?", mood: 'neutral' },
  100: { text: "100 clicks! You have achieved ultimate persistence. Kamronbek should hire you.", mood: 'excited' },
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requiredClicks: number;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_contact', title: 'First Contact', description: 'You interacted with the AI for the first time.', requiredClicks: 1, icon: '👋' },
  { id: 'curious_mind', title: 'Curious Mind', description: 'You clicked the robot 10 times. So inquisitive!', requiredClicks: 10, icon: '🧠' },
  { id: 'best_friend', title: 'Best Friend', description: '20 interactions. We are bonded now.', requiredClicks: 20, icon: '🤝' },
  { id: 'hitchhiker', title: 'The Hitchhiker', description: 'Discovered the meaning of life (42).', requiredClicks: 42, icon: '🌌' },
  { id: 'century', title: 'Century Mark', description: '100 clicks! Absolute dedication.', requiredClicks: 100, icon: '👑' },
];
