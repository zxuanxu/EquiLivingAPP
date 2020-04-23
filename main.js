var blockGroups;
var bgLayer;

//set up the colors for stations with different annual trip counts
function getColor(x) {
  if (x <= 10275){
    return '#fef0d9';}
    else if(x <= 90026){
    return '#fdcc8a';}
    else if(x <= 150494){
      return '#fc8d59';}
      else if(x <= 237311){
        return '#e34a33';}
    else return '#b30000';
};

/*STEP-1 MAP ALL THE POLYGONS*/
//get all the bike-share stations and their corresponding trips in 2018 and map the trip dataset
 $.ajax({
   url: "https://gist.githubusercontent.com/zxuanxu/3386399bd090f4cfdac6bb31b437047e/raw/6235a56828f49ce3ee4aa006385be3cbbc8d599a/data.geojson",
   dataType: 'json',
   success:function(data){
     blockGroups = data;
     bgLayer = L.geoJson(blockGroups,{
       onEachFeature: function (feature, latlng) {
         return L.polygon(latlng,{
           color: "#f5f5f5",
           weight:0.1,
           fillColor: getColor(feature.properties.Price),
           fillOpacity:0.7
           });
      }}).addTo(map);
      bgLayer.on('click', function(e){
          $('#myModal').modal('show');
          $('#geoid').text(e.layer.feature.properties.GEOID);
          $('#market').text(e.layer.feature.properties.H_Mkt_Area);
          $('#medinc').text(e.layer.feature.properties.medInc);
          $('#pctwhite').text(e.layer.feature.properties.pct_white);
          $('#price').text(e.layer.feature.properties.Price);
      });
     }});

//set the current slide
var currentSlide;

//set up the function to remove layer to prepare for a new slide
 var remove = () => {
   map.removeLayer(bgLayer)
 }

//set up the function to add data for the new slide
var bgLayer = L.geoJson(blockGroups,{
  filter: function(feature) {
    switch (currentSlide) {
      //return all stations with trip counts
      case 0: return feature.properties.GEOID;
      //return top 20 stations with the greatest annual trip ccounts
      case 1: return feature.properties.GEOID;
      //return bottom 20 stations with the lowest annual trip counts
      case 2: return feature.properties.GEOID;
  }},
     pointToLayer: function (feature, latlng) {
      return L.polygon(latlng,{
            color: "#f5f5f5",
            weight:0.1,
            fillColor: getColor(feature.properties.Price),
            fillOpacity:0.7
            });
         }
     });

 var addData = () => {
   bgLayer = L.geoJson(blockGroups,{
     filter: function(feature) {
       switch (currentSlide) {
       //return all stations with trip counts
       case 0: return feature.properties.GEOID;
       //return top 20 stations with the greatest annual trip ccounts
       case 1: return feature.properties.GEOID;
       //return bottom 20 stations with the lowest annual trip counts
       case 2: return feature.properties.GEOID;
     }},
          pointToLayer: function (feature, latlng) {
           return L.polygon(latlng,{
                 color: "#f5f5f5",
                 weight:0.1,
                 fillColor: getColor(feature.properties.Price),
                 fillOpacity:0.7
                 });
              }
        }).addTo(map);
        bgLayer.on('click', function(e){
            $('#myModal').modal('show');
            $('#geoid').text(e.layer.feature.properties.GEOID);
            $('#market').text(e.layer.feature.properties.H_Mkt_Area);
            $('#medinc').text(e.layer.feature.properties.medInc);
            $('#pctwhite').text(e.layer.feature.properties.pct_white);
            $('#price').text(e.layer.feature.properties.Price);
        });
 };


//set up the toggle menu button function
$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});


//set up the functions of each button in the sidebar
var showAbout = () => {
  var x = document.getElementById("content-1");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  $('#content-2').hide();
  $('#content-3').hide();
  $('#list-1').toggleClass('active');
  $('#list-2').removeClass('active');
  $('#list-3').removeClass('active');
  currentSlide = 0;
  remove();
  addData();
};

var showScenario = () => {
  var x = document.getElementById("content-2");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  $('#content-1').hide();
  $('#content-3').hide();
  $('#list-2').toggleClass('active');
  $('#list-1').removeClass('active');
  $('#list-3').removeClass('active');
  currentSlide = 1;
  remove();
  addData();
};

var showDetainedInfo = () => {
  var x = document.getElementById("content-3");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  $('#content-1').hide();
  $('#content-2').hide();
  $('#list-3').toggleClass('active');
  $('#list-1').removeClass('active');
  $('#list-2').removeClass('active');
  currentSlide = 2;
  remove();
  addData();
};

/*SLIDER SETTINGS*/
//set up the function of the 1st slider
var slider1 = document.getElementById("myRange-1");
var output1 = document.getElementById("range-1");

output1.innerHTML = slider1.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider1.oninput = function() {
  output1.innerHTML = this.value;
}

//set up the function of the 2nd slider
var slider2 = document.getElementById("myRange-2");
var output2 = document.getElementById("range-2");

output2.innerHTML = slider2.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider2.oninput = function() {
  output2.innerHTML = this.value;
}

//set up the function of the 3rd slider
var slider3 = document.getElementById("myRange-3");
var output3 = document.getElementById("range-3");

output3.innerHTML = slider3.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider3.oninput = function() {
  output3.innerHTML = this.value;
}

//set the slider filter
var filter = function(feature,layer) {
  if(feature.properties.year == slider1.value)
    return true;
};

var filterPlot = function() {
       bgLayer =  L.geoJSON(blockGroups,{
           filter : filter,
           pointToLayer: function (feature, latlng) {
            return L.polygon(latlng,{
                  color: "#f5f5f5",
                  weight:0.1,
                  fillColor: getColor(feature.properties.Price),
                  fillOpacity:0.7
                  });
               }
             }).addTo(map);
               bgLayer.on('click', function(e){
                   $('#myModal').modal('show');
                   $('#geoid').text(e.layer.feature.properties.GEOID);
                   $('#market').text(e.layer.feature.properties.H_Mkt_Area);
                   $('#medinc').text(e.layer.feature.properties.medInc);
                   $('#pctwhite').text(e.layer.feature.properties.pct_white);
                   $('#price').text(e.layer.feature.properties.Price);

               });
     };

//Get the range number of slider 1
var range1 = document.getElementById("range-4");

var getRange1 = function(){
  return range1.innerHTML = output1.innerHTML;
}
//Get the range number of slider 2
var range2 = document.getElementById("range-5");

var getRange2 = function(){
  return range2.innerHTML = output2.innerHTML;
}
//Get the range number of slider 3
var range3 = document.getElementById("range-6");

var getRange3 = function(){
  return range3.innerHTML = output3.innerHTML;
}

//Get the average home sale price based on the defined typology
var avgHomePrice = function(array){
  function plus(a, b) {return a + b; }
  return array.reduce(plus) / array.length;
}



var number = document.getElementById("number");
var getNumber = function() {
    if (typeof bgLayer !== 'undefined'){
      number.innerHTML = `${bgLayer.getLayers().length}`
    };
  };

var showResult = function(){
  getNumber();
}

slider1.addEventListener('input', function () {
       remove();
       filterPlot();
       getRange1();
     });

slider2.addEventListener('input', function () {
        remove();
        filterPlot();
        getRange2();
      });

slider3.addEventListener('input', function () {
        remove();
        filterPlot();
        getRange3();
      });

/*FILTER FUNCTIONS*/
