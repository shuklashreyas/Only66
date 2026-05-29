type DailyQuote = {
  text: string;
  author: string;
};

const DAILY_QUOTES: DailyQuote[] = [
  {
    text: "We must all suffer one of two things: the pain of discipline or the pain of regret or disappointment.",
    author: "Jim Rohn",
  },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "With self-discipline most anything is possible.", author: "Theodore Roosevelt" },
  {
    text: "It was high counsel that I once heard given to a young person, 'Always do what you are afraid to do.'",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "Self-discipline is the magical power that makes you virtually unstoppable.",
    author: "Dan Kennedy",
  },
  {
    text: "The successful person has the habit of doing the things failures don't like to do.",
    author: "Thomas Edison",
  },
  {
    text: "Discipline is the soul of an army. It makes small numbers formidable; procures success to the weak, and esteem to all.",
    author: "George Washington",
  },
  {
    text: "He who cannot obey himself will be commanded. That is the nature of living creatures.",
    author: "Friedrich Nietzsche",
  },
  {
    text: "Freedom is not achieved by satisfying desire, but by the elimination of desire.",
    author: "Epictetus",
  },
  {
    text: "Great leaders always have self-discipline-without exception.",
    author: "John C. Maxwell",
  },

  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  {
    text: "The only person you should try to be better than is the person you were yesterday.",
    author: "Anonymous",
  },
  {
    text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.",
    author: "Ernest Hemingway",
  },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Always be a first-rate version of yourself, instead of a second-rate version of somebody else.",
    author: "Judy Garland",
  },
  { text: "Become who you are.", author: "Friedrich Nietzsche" },
  {
    text: "The best version of you is the one that has decided to stop looking for validation from people who aren't even looking at themselves.",
    author: "Anonymous",
  },
  {
    text: "You are always a valuable person. As long as you believe it, no one else's opinion can alter that.",
    author: "Wayne Dyer",
  },
  {
    text: "Make the most of yourself....for that is all there is of you.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Do the best you can until you know better. Then when you know better, do better.",
    author: "Maya Angelou",
  },

  { text: "Whether you think you can, or you think you can't-you're right.", author: "Henry Ford" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  {
    text: "If you hear a voice within you say 'you cannot paint,' then by all means paint and that voice will be silenced.",
    author: "Vincent van Gogh",
  },
  {
    text: "Trust thyself: every heart vibrates to that iron string.",
    author: "Ralph Waldo Emerson",
  },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  {
    text: "To build true self-esteem, you must focus on your successes and forget about the failures and the negatives in your life.",
    author: "Denis Waitley",
  },
  { text: "The man who wins is the man who thinks he can.", author: "Walter D. Wintle" },
  {
    text: "If you don't have that self-belief, then you're never going to achieve what you're capable of.",
    author: "Anonymous",
  },
  {
    text: "Don't waste your energy trying to change opinions... Do your thing, and don't care if they like it.",
    author: "Tina Fey",
  },
  {
    text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
    author: "Dr. Seuss",
  },
  {
    text: "Magic is believing in yourself, if you can do that, you can make anything happen.",
    author: "Johann Wolfgang von Goethe",
  },

  { text: "Character is doing the right thing when nobody's looking.", author: "J.C. Watts" },
  { text: "Be the person your dog thinks you are.", author: "J.W. Stephens" },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
  },
  {
    text: "I would rather be a superb meteor, every atom of me in magnificent glow, than a sleepy and permanent planet.",
    author: "Jack London",
  },
  { text: "Be kind, for everyone you meet is fighting a harder battle.", author: "Plato" },
  {
    text: "The true measure of a man is how he treats someone who can do him absolutely no good.",
    author: "Samuel Johnson",
  },
  {
    text: "In the end, it's not the years in your life that count. It's the life in your years.",
    author: "Abraham Lincoln",
  },
  {
    text: "Your life is your message to the world. Make sure it's inspiring.",
    author: "Anonymous",
  },
  { text: "I want to be in the arena. I want to be brave with my life.", author: "Brené Brown" },
  {
    text: "Be a lonely rhinoceros in the world, having no desires and doing no harm.",
    author: "The Dhammapada",
  },
  {
    text: "Live your life in such a way that you would not be ashamed to sell your talking parrot to the town gossip.",
    author: "Will Rogers",
  },

  {
    text: "Confidence comes not from always being right but from not fearing to be wrong.",
    author: "Peter T. McIntyre",
  },
  { text: "With confidence, you have won before you have started.", author: "Marcus Garvey" },
  {
    text: "Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.",
    author: "Lao Tzu",
  },
  { text: "The eyes of others our prisons; their thoughts our cages.", author: "Virginia Woolf" },
  { text: "Confidence is contagious. So is a lack of confidence.", author: "Vince Lombardi" },
  {
    text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Calm mind brings inner strength and self-confidence, so that's very important for good health.",
    author: "Dalai Lama",
  },
  {
    text: "As soon as you trust yourself, you will know how to live.",
    author: "Johann Wolfgang von Goethe",
  },
  { text: "Humor comes from self-confidence.", author: "Rita Mae Brown" },
  {
    text: "True confidence is the ability to be useful in any situation without having to be the center of attention.",
    author: "Anonymous",
  },
  { text: "Confidence is silent. Insecurities are loud.", author: "Anonymous" },
];

export function pickDailyQuote(day: number) {
  const index = (((day - 1) % DAILY_QUOTES.length) + DAILY_QUOTES.length) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
