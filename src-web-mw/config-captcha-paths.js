/**
 * This config is shared between Angular http interceptor and web middleware
 * If HTTP method and path is in the list that it would be protected by google v3 captcha
 */

/**
 * path, method - HTTP method which needs to be protected
 * action - Unique identifier used for check if generate captcha was for specific method
 */
const captchaProtectedMethods = [
    // {
    //     path: 'user/api/v1/auth/login',
    //     method: 'POST',
    //     action: 'user_v1_auth_login'
    // },
    // {
    //     path: 'user/api/v1/email_exists',
    //     method: 'POST',
    //     action: 'user_v1_email_exists'
    // },
    // {
    //     path: 'user/api/v1/register',
    //     method: 'POST',
    //     action: 'user_v1_register'
    // },
    // {
    //     path: 'checkout/api/v1/order/',
    //     method: 'POST',
    //     action: 'checkout_v1_order'
    // },
]

module.exports = captchaProtectedMethods;

/**
 * Following code would disable captcha check on MW and Angular app
 */
// module.exports = []
