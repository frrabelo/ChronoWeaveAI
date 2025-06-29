import React, { useState, useEffect, createContext, useContext } from 'react';

interface RouterContextType {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const useSimpleNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useSimpleNavigate must be used within a SimpleHashRouter');
  }
  return context.navigate;
};

interface SimpleRouteProps {
  path: string;
  element: React.ReactNode;
}

export const SimpleRoute: React.FC<SimpleRouteProps> = () => null;

interface SimpleNavigateProps {
  to: string;
}

export const SimpleNavigate: React.FC<SimpleNavigateProps> = ({ to }) => {
    const navigate = useSimpleNavigate();
    useEffect(() => {
        navigate(to);
    }, [to, navigate]);
    return null;
}

interface SimpleRoutesProps {
  children: React.ReactElement<SimpleRouteProps | SimpleNavigateProps>[] | React.ReactElement<SimpleRouteProps | SimpleNavigateProps>;
}

export const SimpleRoutes: React.FC<SimpleRoutesProps> = ({ children }) => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('SimpleRoutes must be used within a SimpleHashRouter');
  }
  const { path } = context;

  let matchedRoute: React.ReactElement<SimpleRouteProps> | undefined;
  let catchAllRoute: React.ReactElement<SimpleRouteProps> | undefined;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ((child.type as React.FC).name === 'SimpleRoute') {
        const routeProps = child.props as SimpleRouteProps;
        if (routeProps.path === path) {
          matchedRoute = child as React.ReactElement<SimpleRouteProps>;
        }
        if (routeProps.path === '*') {
          catchAllRoute = child as React.ReactElement<SimpleRouteProps>;
        }
      }
    }
  });

  if (matchedRoute) {
    return <>{matchedRoute.props.element}</>;
  }

  if (catchAllRoute) {
    return <>{catchAllRoute.props.element}</>;
  }
  
  return null;
};

export const SimpleHashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.hash.substring(1) || '/');

  useEffect(() => {
    const onHashChange = () => {
      setPath(window.location.hash.substring(1) || '/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (newPath: string) => {
    if((window.location.hash.substring(1) || '/') !== newPath) {
        window.location.hash = newPath;
    }
  };

  const contextValue = { path, navigate };

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};
