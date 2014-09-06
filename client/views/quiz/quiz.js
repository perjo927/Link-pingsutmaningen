Template.quiz.helpers({
  chooseQuestionTemplate: function() {
    console.log(this);
    var num = Session.get("questionNumber");
    Session.set("answersLocked", false);
    var ret = {};
    if(num >= QuestionsPerTurn) {
      ret.type = "finishedTurn";
      ret.data = this;
    } else {
      ret.type = this.questions[num].template;
      ret.data = this.questions[num];
    }
    return ret;
  }
});