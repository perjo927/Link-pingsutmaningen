Router.configure({
  layoutTemplate: "layout",
  onBeforeAction: function(pause) {
    if(!Meteor.user()) {
      this.render("login");
      pause();
    }
  },
  waitOn: function () {
    return [Meteor.subscribe("games"), Meteor.subscribe("questions"),
            Meteor.subscribe("users")];
  },
  loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');

Router.map(function () {
  this.route('index', {template: 'start', path: '/'});
  this.route('play', {template: 'friendList'});
  this.route('quiz/:quizId', {template: 'quiz',
                              data: function(){
                                Session.set("questionNumber", 0);
                                Session.set("points", 0);
                                var game = Games.findOne({_id: this.params.quizId}, NonReactive);
                                if(game === undefined) return;
                                var questions = [];
                                var realTurn = game.turn;
                                if(game.turn % 2 === 1) {
                                  realTurn++;
                                }
                                realTurn /= 2;
                                var start = (realTurn - 1) * QuestionsPerTurn;
                                var end = realTurn * QuestionsPerTurn;
                                for(var i = start; i < end; i++) {
                                  questions.push(Questions.findOne({_id: game.questions[i]}, NonReactive));
                                }
                                game.questions = questions;
                                return game;
                              }});
  this.route('admin');
});
