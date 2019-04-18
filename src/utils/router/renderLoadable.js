import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../../common/loading/index';
import routes from './routerConfig';


const loadable = route => (
  Loadable({
    loader: () => import(`../../${route.component}`),
    loading: () => (
      <Loading />
    ),
  })
);

const routersMap = routes.map(route => (
  {
    path: route.path,
    key: route.key,
    common: route.common,
    component: loadable(route),
  }
));

export default routersMap;