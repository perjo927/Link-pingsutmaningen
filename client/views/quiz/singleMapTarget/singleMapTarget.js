Template.singleMapTarget.rendered = function () {
  var mapOptions = {
    center: new google.maps.LatLng(this.data.coords[0], this.data.coords[1]),
    zoom: 12,
    styles: [{featureType: "all", elementType: "labels", stylers: [{visibility: "off"}]}],
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false
  };
  var map = new google.maps.Map(document.getElementById("singleMapTargetCanvas"),
      mapOptions);
};