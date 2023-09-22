let BASE_API_ROUTES_URL: string
let BASE_ROUTE_URL: string
let SITE_ROUTE_URL: string

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    BASE_API_ROUTES_URL = "https://localhost:7234/api/"
    SITE_ROUTE_URL = "https://localhost:7234"
    BASE_ROUTE_URL = "https://localhost:7234"
}
else{
    BASE_API_ROUTES_URL = "https://receiptsharingapp.azurewebsites.net/api/"
    SITE_ROUTE_URL = "https://shopik.onrender.com"
    BASE_ROUTE_URL = "https://receiptsharingapp.azurewebsites.net/"
}

const GOOGLE_LOGIN_ROUTE  = BASE_API_ROUTES_URL + "Auth/google"
const DISCORD_LOGIN_ROUTE  = BASE_API_ROUTES_URL + "Auth/discord"
const USER_INFO_ROUTE = BASE_API_ROUTES_URL + "Auth/user" 
const USER_LOGOUT_ROUTE = BASE_API_ROUTES_URL + "Auth/logout" 
const GET_RECEIPTS_ROUTE  = BASE_API_ROUTES_URL + "Receipt/newest"
const RECEIPTS_ROUTE = BASE_API_ROUTES_URL + "Receipt"
const SUBSCRIPTION_RECEIPTS_ROUTE = BASE_API_ROUTES_URL + "SubscriptionReceipt"
const SUBSCRIBE_TO_RECEIPT_ROUTE = BASE_API_ROUTES_URL + "SubscriptionReceipt/subscribe"
const UNSUBSCRIBE_TO_RECEIPT_ROUTE = BASE_API_ROUTES_URL + "SubscriptionReceipt/unsubscribe"
const RATING_ROUTE = BASE_API_ROUTES_URL + "Rating"
const REVIEW_ROUTE = BASE_API_ROUTES_URL + "Review"
const USER_SUBSCRIPTIONS_ROUTE = BASE_API_ROUTES_URL + "SubscriptionUser"
const USER_SUBSCRIBE_ROUTE = BASE_API_ROUTES_URL + "SubscriptionUser/subscribe"
const USER_UNSUBSCRIBE_ROUTE = BASE_API_ROUTES_URL + "SubscriptionUser/unsubscribe"
const USER_PROFILE_ROUTE = BASE_API_ROUTES_URL + "Auth/user/profile"
const USER_RECEIPTS_ROUTE = BASE_API_ROUTES_URL + "Receipt/user/receipts"
const RECEIPT_SUBSCRIBED_ROUTE = BASE_API_ROUTES_URL + "Receipt/subscribed"
const USER_CHANGE_USERNAME = BASE_API_ROUTES_URL + "Auth/username"

export {SUBSCRIPTION_RECEIPTS_ROUTE, GOOGLE_LOGIN_ROUTE , DISCORD_LOGIN_ROUTE , GET_RECEIPTS_ROUTE, USER_INFO_ROUTE, 
    USER_LOGOUT_ROUTE, RECEIPTS_ROUTE, SUBSCRIBE_TO_RECEIPT_ROUTE, UNSUBSCRIBE_TO_RECEIPT_ROUTE, USER_SUBSCRIPTIONS_ROUTE,
    RATING_ROUTE, REVIEW_ROUTE, USER_SUBSCRIBE_ROUTE, USER_UNSUBSCRIBE_ROUTE, RECEIPT_SUBSCRIBED_ROUTE,
    USER_PROFILE_ROUTE, USER_RECEIPTS_ROUTE, USER_CHANGE_USERNAME  }