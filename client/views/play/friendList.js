Template.friendList.helpers({
  friend: function() {
    return FacebookCollections.getFriends("me",["id","name"],100).find({});
  }
});

Template.friendList.events = {
  "click .challenge-friend": function() {
    var questions = [];
    var questions_db = shuffle(Questions.find({}).fetch());
    for(var i = 0; i < NumTurns * QuestionsPerTurn; i++) {
      questions.push(questions_db[i]._id);
    }
    Games.insert({ sourceId: fbId(), targetId: this.id, ongoing: true,
                   sourceScore: 0, targetScore: 0, turn: 1, accepted: false,
                   questions: questions, timestamp: Date.now()
    });
  }
};