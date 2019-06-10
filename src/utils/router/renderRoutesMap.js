import React from 'react';
import { Route } from 'react-router-dom';
import RouterGuard from './routerGuard';

const renderRoutesMap = routes => (
  routes.map(route => (
    <Route
      key={route.key}
      path={route.path}
      // onEnter={() => { console.log(route.title); }}
      render={props => (
        <RouterGuard {...route} {...props} />
      )}
    />
  ))
);

export default renderRoutesMap;
