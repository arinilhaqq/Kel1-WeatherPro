// function GetInfo(){
//     const city= document.getElementsByClassName("weather__searchform"); 
// }

//     const API_KEY = 'd2c621e47181ff427c2d3fe67c0b877a';
//     // fetch(`https://api.openweathermap.org/data/2.5/forecast?q=city.value&appid=${API_KEY}`)
//     fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${city ID}&appid=${API key}`)
//         .then(res => res.json())
//         .then(data => {
//             for(i=0;i<5;i++){
//                 document.getElementsById("day"+(i+1)+"Min").innerHTML = "Min:"+ Number(data.list[i].main.temp_min -299.6).toFixed(1)+"°";
//             }
//             for(i=0;i<5;i++){
//                 document.getElementsById("day"+(i+1)+"Max").innerHTML = "Max:"+ Number(data.list[i].main.temp_max -299.6).toFixed(1)+"°";
//             }
//             for(i=0;i<5;i++){
//                 document.getElementsById("img" +(i+1)).src ="http://openweathermap.org/img/wn/"+ data.list[i].weathe[0].icon+".png";
//             }
//         })
//         .catch(error => {
//             console.error("Something went wrong", error);
//         });

// function DefaultScreen(){
//     document.getElementById("weather__searchform").defaultValue="London";
//     GetInfo();
// }
// const d = new date();
// const weekday =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// function CheckDay(day) {
//  if(day+d.getday() > 6){
//     return day+getDay()-7;
//  } else {
//     return day+getDay();
//  }
// }

// for(i=0;i<5;i++){
//     document.getElementsById("day"+(i+1)).innerHTML = weekday[CheckDay(i)];
// }


document.querySelector(".weather__search_forecast").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform__forecast");
    // Prevent default action
    e.preventDefault();
    // Change current city
    // currCity = search.value;
    // Get weather forecast by city name
    GetInfo();
    // Clear form
    search.value = "";
})

function GetInfo() {

    var newName = document.getElementById("cityInput");
    var cityName = document.getElementById("cityName");
    cityName.innerHTML = "--"+newName.value+"--";

fetch('https://api.openweathermap.org/data/2.5/forecast?q='+newName.value+'&appid=d2c621e47181ff427c2d3fe67c0b877a')
.then(response => response.json())
.then(data => {

    //Getting the min and max values for each day
    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1) + "Min").innerHTML = "Min: " + Number(data.list[i].main.temp_min - 273.15).toFixed(1)+ "°";
        //Number(1.3450001).toFixed(2); // 1.35
    }

    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1) + "Max").innerHTML = "Max: " + Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
    }
    //------------------------------------------------------------

    //Getting Weather Icons
     for(i = 0; i<5; i++){
        document.getElementById("img" + (i+1)).src = "http://openweathermap.org/img/wn/"+
        data.list[i].weather[0].icon
        +".png";
    }
    //------------------------------------------------------------
    console.log(data)


})

.catch(err => alert("Something Went Wrong: Try Checking Your Internet Coneciton"))
}

function DefaultScreen(){
    document.getElementById("cityInput").defaultValue = "London";
    GetInfo();
}


//Getting and displaying the text for the upcoming five days of the week
var d = new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

//Function to get the correct integer for the index of the days array
function CheckDay(day){
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

for(i = 0; i<5; i++){
    document.getElementById("day" + (i+1)).innerHTML = weekday[CheckDay(i)];
}
//------------------------------------------------------------


/*
document.getElementById("day1Min").innerHTML = Math.round(data.list[0].main.temp_min - 273.15, -2);
document.getElementById("day2Min").innerHTML = Math.round(data.list[1].main.temp_min - 273.15, -2);
document.getElementById("day3Min").innerHTML = Math.round(data.list[2].main.temp_min - 273.15, -2);
document.getElementById("day4Min").innerHTML = Math.round(data.list[3].main.temp_min - 273.15, -2);
document.getElementById("day5Min").innerHTML = Math.round(data.list[4].main.temp_min - 273.15, -2);*/

/*document.getElementById("day1Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
document.getElementById("day2Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
document.getElementById("day3Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
document.getElementById("day4Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);
document.getElementById("day5Max").innerHTML = Math.round(data.list[0].main.temp_max - 273.15, -2);*/

/*document.getElementById("img1").src = "http://openweathermap.org/img/w/"+
data.list[0].weather[0].icon
+".png";
document.getElementById("img2").src = "http://openweathermap.org/img/w/"+
data.list[1].weather[0].icon
+".png";
document.getElementById("img3").src = "http://openweathermap.org/img/w/"+
data.list[2].weather[0].icon
+".png";
document.getElementById("img4").src = "http://openweathermap.org/img/w/"+
data.list[3].weather[0].icon
+".png";
document.getElementById("img5").src = "http://openweathermap.org/img/w/"+
data.list[4].weather[0].icon
+".png";*/

/*
document.getElementById("day1").innerHTML = weekday[CheckDay(0)];
document.getElementById("day2").innerHTML = weekday[CheckDay(1)];
document.getElementById("day3").innerHTML = weekday[CheckDay(2)];
document.getElementById("day4").innerHTML = weekday[CheckDay(3)];
document.getElementById("day5").innerHTML = weekday[CheckDay(4)];*/

/*weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";*/
