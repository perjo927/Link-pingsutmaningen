NumTurns = 1;
QuestionsPerTurn = 3;
PointsPerQuestion = 5;
NonReactive = {reactive: false};

Accounts.ui.config({
  requestPermissions: {
    facebook: ["public_profile", "user_friends", "email"]
  }
});