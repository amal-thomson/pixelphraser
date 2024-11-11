// src/routes.tsx
import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Descriptions from './components/descriptions';

type ApplicationRoutesProps = {
  children?: ReactNode;
};

const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route>
          <Descriptions />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};

ApplicationRoutes.displayName = 'ApplicationRoutes';
export default ApplicationRoutes;