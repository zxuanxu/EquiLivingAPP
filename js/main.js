var hma;
var hmaLayer;
var ahtf;
var ahtfLayer;

/*Functions*/
//set up the colors for stations with different annual trip counts
function getColor(d) {
    return d > 8 ? "#2D3F50" :
           d > 6  ? "#266E75" :
           d > 4  ? "#3AA083" :
           d > 2  ? "#83CE7B" :
                    "#EAF46E" ;
}

function stylePotential(feature) {
    return {
        fillColor: getColor(feature.properties.potentialIndex),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function styleInitial(feature) {
    return {
        fillColor: getColor(feature.properties.initialPriceIndex),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function styleChange(feature) {
    return {
        fillColor: getColor(feature.properties.priceChangeIndex),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//set up the toggle menu button function
$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});

/*Data URLs*/
var affordableHousingPoints = "https://gist.githubusercontent.com/zxuanxu/b6efa02d50c8ec4005a3c253ae7c0413/raw/ef8568963847ce9220513a648900e51375a4c5be/AHTFpoints.geojson";
var hmaPolygons = "https://gist.githubusercontent.com/zxuanxu/cf8a781bf088ed1b3bcf75deb86bba3d/raw/cc61cd219f7a0b383406f05108fe277318435a6e/hmaPred.geojson";

/*STEP-1 MAP POLYGONS*/
//get all the housing market areas and map them
var hmaData = [];


 $.ajax({
   url: hmaPolygons,
   dataType: 'json',
   success:function(data){
     hma = data;
     hmaLayer = L.geoJson(hma,{
       style: stylePotential,
       onEachFeature: function(feature, layer){
         hmaData.push(feature.properties);
         layer.bindTooltip(feature.properties.H_Mkt_A)}
     }).addTo(map);
      hmaLayer.on('click', function(e){
          map.setView(e.latlng, 13);
          $('#myModal').modal('show');
          $('#hma').text(e.layer.feature.properties.H_Mkt_A);
          $('#initial-price-ind').text(e.layer.feature.properties.initialPriceIndex);
          $('#price-change-ind').text(e.layer.feature.properties.priceChangeIndex);
          $('#potential').text(e.layer.feature.properties.potentialIndex);
          $('#initial-price').text("$" + e.layer.feature.properties["2018"].toLocaleString(undefined, {maximumFractionDigits:0}));
          $('#pred-price').text("$" + e.layer.feature.properties["2023"].toLocaleString(undefined, {maximumFractionDigits:0}));
          $('#price-change').text(e.layer.feature.properties.Price_Change.toLocaleString(undefined, {maximumFractionDigits:2}) + "%");

      });
     }});

//set the current slide
var currentSlide;

//set up the function to remove layer to prepare for a new slide
var removeHMA = () => {
  map.removeLayer(hmaLayer)
}

//map the housing markets based on potentialIndex
hmaLayer = L.geoJson(hma,{
  style: stylePotential
})

var addDataHMA = () => {
  hmaLayer.addTo(map);
  hmaLayer.on('click', function(e){
     map.setView(e.latlng, 13);
     $('#myModal').modal('show');
     $('#hma').text(e.layer.feature.properties.H_Mkt_A);
     $('#price-change-ind').text(e.layer.feature.properties.priceChangeIndex);
     $('#potential').text(e.layer.feature.properties.potentialIndex);
     $('#initial-price').text("$" + e.layer.feature.properties["2018"].toLocaleString(undefined, {maximumFractionDigits:0}));
     $('#pred-price').text("$" + e.layer.feature.properties["2023"].toLocaleString(undefined, {maximumFractionDigits:0}));
     $('#price-change').text(e.layer.feature.properties.Price_Change.toLocaleString(undefined, {maximumFractionDigits:2}) + "%");
   });
 };

/*STEP2: MAP POINTS*/
//set up icon
var smallIcon = new L.Icon({
     iconSize: [27, 27],
     iconAnchor: [13, 27],
     popupAnchor:  [1, -24],
     iconUrl: 'icon/house.png'
 });

//get all the AHTF projects and map them
var pointSelected;
function readPointsAjax() {
  $.ajax({
    url: affordableHousingPoints,
    dataType: 'json',
    success:function(data){
      ahtf = data;
      ahtfLayer = L.geoJson(ahtf,{
        pointToLayer: function(feature, latlng){
          return L.marker(latlng, {icon: smallIcon})
        }
      }).addTo(map);
       ahtfLayer.on('click', function(e){
         pointSelected = e.layer.feature.properties.H_Mkt_A;
         getDataSelected();
         map.setView(e.latlng, 13);
         $('#myModal1').modal('show');
         $('#units').text(e.layer.feature.properties.Amount);
         $('#year').text(e.layer.feature.properties.Year);
         $('#address').text(e.layer.feature.properties.Address);
         createChart();
       })
     }
   });
};


 //set up the function to remove layer to prepare for a new slide
 var removeAHTF = () => {
   map.removeLayer(ahtfLayer)
 }


ahtfLayer = L.geoJson(ahtf,{
  pointToLayer: function(feature, latlng){
    return L.marker(latlng, {icon: smallIcon})
  }
});

var addDataAHTF = () => {
  ahtfLayer.addTo(map);
  ahtfLayer.on('click', function(e){
    pointSelected = e.layer.feature.properties.H_Mkt_A;
    map.setView(e.latlng, 13);
    getDataSelected();
    $('#myModal1').modal('show');
    $('#units').text(e.layer.feature.properties.Amount);
    $('#year').text(e.layer.feature.properties.Year);
    $('#address').text(e.layer.feature.properties.Address);
    createChart();
  });
};

/*STEP3: SET UP PAGES*/
//set up the functions of each button in the sidebar
var showAbout = () => {
  var x = document.getElementById("content-1");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  $('#content-2').hide();
  $('#content-3').hide();
  $('#list-1').toggleClass('active');
  $('#list-2').removeClass('active');
  $('#list-3').removeClass('active');
  currentSlide = 0;
  removeAHTF();
  removeHMA();
  addDataHMA();
};

var showIndex = () => {
  var x = document.getElementById("content-2");
  if (x.style.display === "none") {
    x.style.display = "block";
  }

  $('#content-1').hide();
  $('#content-3').hide();
  $('#list-2').toggleClass('active');
  $('#list-1').removeClass('active');
  $('#list-3').removeClass('active');
  currentSlide = 1;
  removeAHTF();
  removeHMA();
  addDataHMA();
};

var showDetainedInfo = () => {
  var x = document.getElementById("content-3");
  if (x.style.display === "none") {
    x.style.display = "block";
  }

  readPointsAjax();
  $('#content-1').hide();
  $('#content-2').hide();
  $('#list-3').toggleClass('active');
  $('#list-1').removeClass('active');
  $('#list-2').removeClass('active');
  currentSlide = 2;
  removeHMA();
  addDataHMA();
};

/*Radio Button Setting*/
// Radio buttons to let the user choose the index to map
assignClickListener("radio1", onRadioClick);
assignClickListener("radio2", onRadioClick);
assignClickListener("radio3", onRadioClick);

function assignClickListener(id, listener) {
  document.getElementById(id).addEventListener("click", listener);
}

function onRadioClick(event) {
  var target = event.currentTarget,
    selectedIndex = target.id;

  switch (selectedIndex) {
    case "radio1":
      hmaLayer.setStyle(stylePotential);
      legendTitle.innerHTML = "Potential Index"
      break;
    case "radio2":
      hmaLayer.setStyle(styleInitial);
      legendTitle.innerHTML = "Initial Price Index"
      break;
    case "radio3":
      hmaLayer.setStyle(styleChange);
      legendTitle.innerHTML = "Price Change Index"
      break;
  };
}

//show legend title based on selection
var legendTitle = document.getElementById("legend-title-show");

/*STEP4: SET UP CHARTS*/
//get data for point selected
var chartTitle = document.getElementById("housing-market-show");

var dataSelected;

function getDataSelected(){
  dataSelected = [];
  for (var i = 0; i < hmaData.length; i++) {
    if(hmaData[i].H_Mkt_A == pointSelected) {
      for (var j = 2000; j < 2024; j++) {
        var year = "X" + j.toString();
        dataSelected.push(hmaData[i][year]);
      }
      chartTitle.innerHTML = pointSelected;
      break;
    }
  }
}


var labels = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
'2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019','2020', '2021', '2022', '2023'];

var chart = document.getElementById('myChart').getContext('2d');

function createChart(){
  var myChart = new Chart(chart, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Home Sale Price',
              data: dataSelected,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1.5,
              pointRadius: 3,
              pointHoverRadius: 6
          }]
      },
      options: {
        elements: {
          point: {
            pointStyle: 'circle'
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
                    var label = tooltipItem.yLabel;
                    label = data.datasets[tooltipItem.datasetIndex].label + ": $" + label.toLocaleString(undefined, {maximumFractionDigits:0});
                    return label;
                  }
                }
              },
        scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      callback: function(value, index, values) {
                        return "$" + value.toLocaleString(undefined, {maximumFractionDigits:0});
                  }
              }}]
          }
      }
  });
}

// var radios = document.getElementsByName('radio');
//
// var showIndex = function() {
//   for (var i = 0; i < radios.length; i++){
//     if(radios[i].checked){
//       return i;
//     }
//   }
// };

// var indexToShow = showIndex();
//
// for (var i = 0; i < radios.length; i++){
//   radios[i].addEventListener('change', function(){
//     remove();
//     indexToShow = showIndex();
//     addDataHMA();
//     console.log(indexToShow);
//   })
// };



/*SLIDER SETTINGS*/
// //set up the function of the 1st slider
// var slider1 = document.getElementById("myRange-1");
// var output1 = document.getElementById("range-1");
//
// output1.innerHTML = slider1.value; // Display the default slider value
//
// // Update the current slider value (each time you drag the slider handle)
// slider1.oninput = function() {
//   output1.innerHTML = this.value;
// }
//
// //set up the function of the 2nd slider
// var slider2 = document.getElementById("myRange-2");
// var output2 = document.getElementById("range-2");
//
// output2.innerHTML = slider2.value; // Display the default slider value
//
// // Update the current slider value (each time you drag the slider handle)
// slider2.oninput = function() {
//   output2.innerHTML = this.value;
// }
//
// //set up the function of the 3rd slider
// var slider3 = document.getElementById("myRange-3");
// var output3 = document.getElementById("range-3");
//
// output3.innerHTML = slider3.value; // Display the default slider value
//
// // Update the current slider value (each time you drag the slider handle)
// slider3.oninput = function() {
//   output3.innerHTML = this.value;
// }
//
// //set the slider filter
// var filter = function(feature,layer) {
//   if(feature.properties.year == slider1.value)
//     return true;
// };
//
// var filterPlot = function() {
//        hmaLayer.addTo(map);
//        hmaLayer.on('click', function(e){
//                  map.setView(e.latlng, 13);
//                  $('#myModal').modal('show');
//                  $('#hma').text(e.layer.feature.properties.H_Mkt_A);
//                  $('#initial-price').text(e.layer.feature.properties.initialPriceIndex);
//                  $('#price-change').text(e.layer.feature.properties.priceChangeIndex);
//                  $('#potential').text(e.layer.feature.properties.potentialIndex);
//              });
//      };
//
// //Get the range number of slider 1
// var range1 = document.getElementById("range-4");
//
// var getRange1 = function(){
//   return range1.innerHTML = output1.innerHTML;
// }
// //Get the range number of slider 2
// var range2 = document.getElementById("range-5");
//
// var getRange2 = function(){
//   return range2.innerHTML = output2.innerHTML;
// }
// //Get the range number of slider 3
// var range3 = document.getElementById("range-6");
//
// var getRange3 = function(){
//   return range3.innerHTML = output3.innerHTML;
// }
//
// //Get the average home sale price based on the defined typology
// var avgHomePrice = function(array){
//   function plus(a, b) {return a + b; }
//   return array.reduce(plus) / array.length;
// }
//
//
//
// var number = document.getElementById("number");
// var getNumber = function() {
//     if (typeof bgLayer !== 'undefined'){
//       number.innerHTML = `${bgLayer.getLayers().length}`
//     };
//   };
//
// var showResult = function(){
//   getNumber();
// }
//
// slider1.addEventListener('input', function () {
//        remove();
//        filterPlot();
//        getRange1();
//      });
//
// slider2.addEventListener('input', function () {
//         remove();
//         filterPlot();
//         getRange2();
//       });
//
// slider3.addEventListener('input', function () {
//         remove();
//         filterPlot();
//         getRange3();
//       });
//
// /*FILTER FUNCTIONS*/
