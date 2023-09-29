import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/UserTypes';
import { RATING_ROUTE, SUBSCRIBE_TO_RECEIPT_ROUTE, SUBSCRIPTION_RECEIPTS_ROUTE, UNSUBSCRIBE_TO_RECEIPT_ROUTE, USER_INFO_ROUTE, USER_LOGOUT_ROUTE, USER_SUBSCRIBE_ROUTE, USER_SUBSCRIPTIONS_ROUTE, USER_UNSUBSCRIBE_ROUTE } from '../routes/routes';
import useArray from '../CustomHooks/useArray';
import { Rating, UserAuthor } from '../types/Receipt';
import { useUpdateToast } from './useToast';
import { severityColors } from '../types/Toast';
import { UserSubscription } from '../types/Subscribe';

type AuthContextProps = {
  user: User|null;
  isLoading: boolean;
  logout: () => void;
  subscribedReceiptsIds: number[]
  subscribeToReceipt: (isUserSubscribed: boolean, id: number) => Promise<void>
  subscriptionUsers: UserSubscription[]
  subscribeToUser: (isUserSubscribed: boolean, userSubscribedTo: UserAuthor) => Promise<void>
  ratings: Rating[]
  rateReceipt: (rate: number, id: number) => Promise<void>
}

const AuthContext = createContext({} as AuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const toastUpdate = useUpdateToast()
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const subscribedReceiptsIds = useArray<number>([])
  const subscriptionUsers = useArray<UserSubscription>([])
  const ratingOfReceipts = useArray<Rating>([])
  const controller = new AbortController()

  useEffect(() => {
    const { signal } = controller
    // Fetch user data here, e.g., using Axios or fetch()
    fetch(USER_INFO_ROUTE,{
        method: "GET",
        signal,
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
          },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.user){
          setUser(data.user);
          fetchSubscribedReceiptsIds()
          fetchAllRatings()
          fetchSubscribedUsers()
        }
        
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      });
  }, []);

  const fetchSubscribedReceiptsIds = () => {
    const { signal } = controller

    fetch(SUBSCRIPTION_RECEIPTS_ROUTE,{
        method: "GET",
        credentials: 'include',
        signal,
        headers: {
            'Content-Type': 'application/json',
    }},)
    .then((response) => {
        return response.json()
    })
    .then((data)=> {
      if(!data.error && !data.errors){
        subscribedReceiptsIds.set(data.receiptIds)
      }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    });
  }

  const fetchSubscribedUsers = () => {
    const { signal } = controller

    fetch(USER_SUBSCRIPTIONS_ROUTE,{
        method: "GET",
        credentials: 'include',
        signal,
        headers: {
            'Content-Type': 'application/json',
    }},)
    .then((response) => {
        return response.json()
    })
    .then((data)=> {
      if(!data.error && !data.errors){
        subscriptionUsers.set(data.subscriptions)
      }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    });
  }

  const fetchAllRatings = () => {
    const { signal } = controller

    fetch(RATING_ROUTE,{
        method: "GET",
        credentials: 'include',
        signal,
        headers: {
            'Content-Type': 'application/json',
    }},)
    .then((response) => {
        return response.json()
    })
    .then((data)=> {
      if(!data.error && !data.errors){
        ratingOfReceipts.set(data.ratings)
      }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
    });
  }

  const rateReceipt = async (rate: number, id: number) => {
    const { signal } = controller;
  
    if (!user) return;
  
    const method = ratingOfReceipts.findIndexByKey("userId", user?.id) === -1 ? "POST" : "PUT";
  
    const body = {
      rate
    };
  
    try {
      const response = await fetch(RATING_ROUTE + `/${id}`, {
        method: method,
        credentials: 'include',
        signal,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();

      if (!data.error && !data.errors) {
        toastUpdate.addToast({toastText: "Rated receipt successfully", severity: severityColors.success})
        if (method === "PUT") {
          ratingOfReceipts.updateObjectByKey("userId", user.id, [{ field: "value", fieldValue: rate }]);
        } else {
          ratingOfReceipts.push({ value: rate, userId: user.id, receiptId: id });
        }
      }else{
        toastUpdate.addToast({toastText: "Unable to rate receipt", severity: severityColors.error})
      }
    } catch (error) {
      toastUpdate.addToast({toastText: "Unable to rate receipt", severity: severityColors.error})
      console.error('Error fetching user data:', error);
    }
  };

  const subscribeToReceipt = async (isUserSubscribed: boolean, id: number) => {
    const { signal } = controller;
  
    const route = isUserSubscribed ? UNSUBSCRIBE_TO_RECEIPT_ROUTE : SUBSCRIBE_TO_RECEIPT_ROUTE;
  
    try {
      const response = await fetch(route + `/${id}`, {
        method: "POST",
        credentials: 'include',
        signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
  
      if (!data.error && !data.errors) {
        if (isUserSubscribed) {
          const index = subscribedReceiptsIds.array.findIndex((ids) => ids === id);
          subscribedReceiptsIds.removeValueByIndex(index);
        } else {
          subscribedReceiptsIds.push(id);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const subscribeToUser = async (isUserSubscribed: boolean, userSubscribedTo: UserAuthor) => {
    const { signal } = controller;
  
    const route = isUserSubscribed ? USER_UNSUBSCRIBE_ROUTE : USER_SUBSCRIBE_ROUTE
  
    try {
      const response = await fetch(route + `/${userSubscribedTo.id}`, {
        method: "POST",
        credentials: 'include',
        signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();

      if (!data.error && !data.errors) {
        if (isUserSubscribed) {
          toastUpdate.addToast({toastText: "Unsubscribed from user successfully", severity: severityColors.success})
          subscriptionUsers.removeByKey("userSubscribedToId", userSubscribedTo.id)
        } else {
          toastUpdate.addToast({toastText: "Subscribed to user successfully", severity: severityColors.success})
          subscriptionUsers.push( {userId: user!.id, userSubscribedToId: userSubscribedTo.id, 
            userSubscribedTo: userSubscribedTo, user: user!, subscriptionStart:  data.subscription.subscriptionStart});
        }
        
      }else{
        toastUpdate.addToast({toastText: "Unable to subscribe to user", severity: severityColors.error})
      }
    } catch (error) {
      toastUpdate.addToast({toastText: "Unable to subscribe to user", severity: severityColors.error})
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
      const { signal } = controller

      fetch(USER_LOGOUT_ROUTE,{
          method: "POST",
          credentials: 'include',
          signal,
          headers: {
              'Content-Type': 'application/json',
      }},)
      .then((response) => {
          if(response.status===200){
              location.reload()
          }
      })
      .catch((error) => {
          console.error('Error fetching user data:', error);
          setIsLoading(false);
      });
  }

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, subscribeToReceipt, ratings: ratingOfReceipts.array,
        subscribedReceiptsIds: subscribedReceiptsIds.array, rateReceipt, subscribeToUser, subscriptionUsers: subscriptionUsers.array }}>
          {children}
        </AuthContext.Provider>
    );
};