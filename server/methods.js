Meteor.methods({
    mapLocation: function() {
	    quiz_api.map_location();
    },
    populationQuestion: function(statType) {
      var statType = "population";
      // Folkmängd efter ålder, år, kön
      quiz_api.createStatQuestion(statType);
    }
});

getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};