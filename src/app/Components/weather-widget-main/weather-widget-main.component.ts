import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';   // importare questo modulo
import { Servizio01Service } from '../../servizio01.service';
import { environment } from '../../../environments/environment';
  
// per usare HttpClient è necessario modificara anche il file app.module.ts 
// https://angular.io/guide/http
import { HttpClient }  from'@angular/common/http';


@Component({
  selector: 'app-weather-widget-main',
  templateUrl: './weather-widget-main.component.html',
  styleUrls: ['./weather-widget-main.component.css']
})

export class WeatherWidgetMainComponent implements OnInit , OnDestroy {

  WeatherData:any;
  subscription:Subscription;


  // la apikey e l'endpoint sono memeorizzati nel file  src/environments/environment.ts  
  // apiKey= ...
  // apiEndpoint='https://api.openweathermap.org/data/2.5/weather 
  apiEndpoint=environment.apiEndpoint + '?q=milan&appid=' + environment.apiKey;
 

  constructor(  private serv01:Servizio01Service  ) { }   // viene "iniettata" la classe-servizio  serv01 di tipo Servizio01Service 

  ngOnInit() { 

    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData2();
  }



  // utilizza la promise e la chiamata fetch
  getWeatherData2(){
    let observable=this.serv01.httpGet(this.apiEndpoint)
    this.subscription=observable.subscribe( httpResponse => { console.log(httpResponse); this.setWeatherData(httpResponse) })
  }



  setWeatherData(data:any){
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    //this.WeatherData.isDay=false
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);   // toFixed() elimina i decimali 
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
  }


  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe() 
      console.log("oggetto WeatherWidgetMainComponent distrutto ")
    }
  }

}

