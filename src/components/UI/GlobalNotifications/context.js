import React, {useState, useCallback} from 'react';

const GlobalNotificationContext = React.createContext(
  undefined,
);

const GlobalNotificationProvider: FC = ({children}) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((toAdd) => {
    setNotifications((prevState) => {
      return [
        ...prevState.filter((prevItem) => !toAdd.some((item) => item.id !== prevItem.id)),
        ...toAdd
      ];
    });
  }, []);

  const removeNotification = useCallback((toRemove) => {
    setNotifications((prevState) => {
      return prevState.map((item) => {
        if ( item.id === toRemove ) {
          return {
            ...item,
            isRemoved: true
          };
        }
        return item;
      });
    });
    setTimeout(() => {
      setNotifications((prevState) => prevState.filter((item) => item.id !== toRemove));
    }, 100);
  }, []);

  return (
    <GlobalNotificationContext.Provider value={{notifications, addNotification, removeNotification}}>
      {children}
    </GlobalNotificationContext.Provider>
  );
};

const useGlobalNotificationContext = () => {
  const context = React.useContext(GlobalNotificationContext);

  if (!context) {
    throw new Error(
      'useGlobalNotificationContext must be used within a GlobalNotificationProvider',
    );
  }

  return context;
};

export {GlobalNotificationProvider, useGlobalNotificationContext};
