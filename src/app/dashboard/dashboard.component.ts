import { Component, OnInit } from '@angular/core';
import { Apollo,QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import gql from 'graphql-tag';
import { Patient,Query} from '../types';
import { array } from '@amcharts/amcharts4/core';
import { } from '@types/googlemaps';
import { ChangeDetectorRef } from '@angular/core';
import { AgmMap } from '@agm/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const PATIENTS_SUBSCRIPTION = gql`
    subscription{
      patientAdded{
        profilepic
        name
        location
        bloodGroup
        status
        severity
        lat
        lon
      }
    }
`;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  patientsQuery: QueryRef<any>;
  //patientsArrayJson: Observable<any>;

patientsJsonArray:Observable<Patient[]>=new Observable<Patient[]>();
  constructor(private apollo: Apollo) { 
    this.patientsQuery = this.apollo.watchQuery<Query>({
      query: gql`
        query patients{
          patients {
            profilepic
            name
            severity
            status
            bloodGroup
            location
            lat
            lon
          }
        }
      `
    })
      

      this.patientsJsonArray=this.patientsQuery.valueChanges
      .pipe(
        map(result => result.data.patients)
      );
      
      this.patientsJsonArray.subscribe(data=>{
        console.log(data);
      })
  }
  subscribeToNewComments() {
    this.patientsQuery.subscribeToMore({
      document: PATIENTS_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        return {
          patients:[
            ...prev.patients,
            subscriptionData.data.patientAdded,
          ],
        };
      }
    });
  }
  ngOnInit() {
    var result=this.subscribeToNewComments();
    console.log(result);

    
  }

}
