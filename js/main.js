var hma;
var hmaLayer;
var ahtf;
var ahtfLayer;

/*Functions*/
//set up the colors
function getColorPotential(d) {
    return d > 8 ? "#2D3F50" :
           d > 6  ? "#266E75" :
           d > 4  ? "#3AA083" :
           d > 2  ? "#83CE7B" :
                    "#EAF46E" ;
}

function getColorInitial(d) {
    return d > 320000 ? "#2D3F50" :
           d > 290000  ? "#266E75" :
           d > 220000  ? "#3AA083" :
           d > 140000  ? "#83CE7B" :
                    "#EAF46E" ;
}

function getColorChange(d) {
    return d > 26 ? "#2D3F50" :
           d > 24  ? "#266E75" :
           d > 22  ? "#3AA083" :
           d > 18  ? "#83CE7B" :
                    "#EAF46E" ;
}

function stylePotential(feature) {
    return {
        fillColor: getColorPotential(feature.properties.potentialIndex),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function styleInitial(feature) {
    return {
        fillColor: getColorInitial(feature.properties['2018']),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function styleChange(feature) {
    return {
        fillColor: getColorChange(feature.properties.Price_Change),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//set up the toggle menu button function
function openNav() {

  map.invalidateSize();
  var x = document.getElementById("content");
  //if sidebar is open
  if (x.style.marginLeft == "300px") {
    //change left margin of content
    x.style.marginLeft= "0";
  } else {
    //change left margin of content
    x.style.marginLeft= "300px";
  }
}


/*Data URLs*/
var affordableHousingPoints = "https://gist.githubusercontent.com/zxuanxu/b6efa02d50c8ec4005a3c253ae7c0413/raw/ef8568963847ce9220513a648900e51375a4c5be/AHTFpoints.geojson";
var hmaPolygons = "https://gist.githubusercontent.com/zxuanxu/cf8a781bf088ed1b3bcf75deb86bba3d/raw/cc61cd219f7a0b383406f05108fe277318435a6e/hmaPred.geojson";

/*Open Modal on Load*/
$(window).on('load',function(){
    $('#myModalHome').modal('show');
});

/*STEP-1 MAP POLYGONS*/
//get all the housing market areas and map them
var hmaData = [];
var pointSelected;


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
        pointSelected = e.layer.feature.properties.H_Mkt_A;
        getDataSelected();
          map.setView(e.latlng, 13);
          $('#myModal').modal('show');
          $('#hma').text(e.layer.feature.properties.H_Mkt_A);
          $('#potential').text(e.layer.feature.properties.potentialIndex);
          $('#initial-price').text("$" + e.layer.feature.properties["2018"].toLocaleString(undefined, {maximumFractionDigits:0}));
          $('#pred-price').text("$" + e.layer.feature.properties["2023"].toLocaleString(undefined, {maximumFractionDigits:0}));
          $('#price-change').text(e.layer.feature.properties.Price_Change.toLocaleString(undefined, {maximumFractionDigits:2}) + "%");
          createChart();
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
    pointSelected = e.layer.feature.properties.H_Mkt_A;
    getDataSelected();
     map.setView(e.latlng, 13);
     $('#myModal').modal('show');
     $('#hma').text(e.layer.feature.properties.H_Mkt_A);
     $('#potential').text(e.layer.feature.properties.potentialIndex);
     $('#initial-price').text("$" + e.layer.feature.properties["2018"].toLocaleString(undefined, {maximumFractionDigits:0}));
     $('#pred-price').text("$" + e.layer.feature.properties["2023"].toLocaleString(undefined, {maximumFractionDigits:0}));
     $('#price-change').text(e.layer.feature.properties.Price_Change.toLocaleString(undefined, {maximumFractionDigits:2}) + "%");
     createChart();
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
    map.setView(e.latlng, 13);
    $('#myModal1').modal('show');
    $('#units').text(e.layer.feature.properties.Amount);
    $('#year').text(e.layer.feature.properties.Year);
    $('#address').text(e.layer.feature.properties.Address);
  });
};

//add legend control


/*STEP3: SET UP PAGES*/
//set up the functions of each button in the sidebar
var showIndex = () => {

  $('#myModalExplore1').modal('show');
  $('#radioButtons').show();
  $('#legendIcon').hide();
  $('#list-2').toggleClass('active');
  $('#list-3').removeClass('active');
  currentSlide = 1;
  removeAHTF();
  removeHMA();
  addDataHMA();
};

var showDetainedInfo = () => {

  $('#myModalExplore2').modal('show');

  readPointsAjax();
  $('#radioButtons').hide();
  $('#legendIcon').show();
  $('#list-3').toggleClass('active');
  $('#list-2').removeClass('active');
  currentSlide = 2;
  removeAHTF();
  removeHMA();
  addDataHMA();
};

/*Radio Button Setting*/
//Radio buttons to let the user choose the index to map
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
      $('#potential-legend').show();
      $('#initial-legend').hide();
      $('#change-legend').hide();
      break;
    case "radio2":
      hmaLayer.setStyle(styleInitial);
      $('#potential-legend').hide();
      $('#initial-legend').show();
      $('#change-legend').hide();
      break;
    case "radio3":
      hmaLayer.setStyle(styleChange);
      $('#potential-legend').hide();
      $('#initial-legend').hide();
      $('#change-legend').show();
      break;
  };
}

//show legend title based on selection
var legendTitle = document.getElementById("legend-title-show");

/*STEP4: SET UP CHARTS*/
//get data for area selected
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
var myChart = new Chart(chart);

function createChart(){
  //clear canvas
  myChart.destroy();
  myChart = new Chart(chart, {
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
