export default {
  scenarios: {
    maker: 'Maker starts a game',
    breaker: 'Breaker joins a game'
  },
  steps: {
    starts: 'the Maker starts a game',
    waits: 'the Maker waits for a Breaker to join',
    started: 'the Maker has started a game with the word "silky"',
    joins: 'the Breaker joins the Maker\'s game',
    guess: 'the Breaker must guess a word with 5 characters'
  }
};