var map;

Template.singleMapTarget.rendered = function () {
  var place = new google.maps.LatLng(this.data.coords[0], this.data.coords[1]);
  var mapOptions = {
    center: place,
    disableDefaultUI: true,
    zoom: 12,
    minZoom: 12,
    maxZoom: 15,
    zoomControl: true,
    styles: [{featureType: "all", elementType: "labels", stylers: [{visibility: "off"}]}],
    draggable: false,
    scrollwheel: false
  };

  map = new google.maps.Map(document.getElementById("singleMapTargetCanvas"), mapOptions);

  var marker = new google.maps.Marker({
    position: place,
    map: map
  });
};

Template.singleMapTarget.events = {
  "click .singleMapTarget-answer": function(event) {
    if(Session.get("answersLocked")) return;
    Session.set("answersLocked", true);
    if(this.correct) {
      $(event.target).addClass("btn-success");
      Session.set("points", Session.get("points") + PointsPerQuestion);
    } else {
      $(".correct-answer").addClass("btn-success");
      $(event.target).addClass("btn-danger");
    }
    Meteor.setTimeout(function () {
      $(".correct-answer").removeClass("btn-success");
      $(event.target).removeClass("btn-success btn-danger").addClass("btn-primary");
      Session.set("whiteScreen", true);
    }, 2500);
  }
};