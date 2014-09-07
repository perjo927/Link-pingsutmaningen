Template.whiteScreen.rendered = function () {
  var nextQuestion = Session.get("questionNumber") + 1;
  Session.set("questionNumber", nextQuestion);
  Session.set("whiteScreen", false);
};