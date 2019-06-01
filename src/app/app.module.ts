import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule,Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';


const httpLink = new HttpLink({
  uri: 'http://localhost:8001/graphql',
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8001/graphql`,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const link = ApolloLink.from([terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DashboardComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { 
  constructor(
    apollo: Apollo
  ) { 
    apollo.create({
      link: link,
      cache: cache
    });

  }
}
