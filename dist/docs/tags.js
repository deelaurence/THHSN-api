"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    tags: [
        { name: 'Onboarding', description: 'Registration and login with user email' },
        { name: 'Forgot password', description: 'Registered users resets thier password by going through a confirmation link sent to their mail' },
        { name: 'Data collection', description: 'Collect resume data' },
        { name: 'User Profile', description: 'Fetching and Updating user profile' },
        // { name: 'Admin', description: 'Admin Endpoints' },
        // { name: 'Course', description: 'course section' },
        // { name: 'Withdrawal', description: 'Referees can process thier withdrawals' },
        // { name: 'Metrics', description : `There are two endpoints 
        // _1-loguser_ and _2-getlogs._ _loguser_ 
        // makes a get request to register thier IP address.
        // The _getlogs_ endpoint has a variety of queries that optionally can be supplied. 
        // To get metrics, supply different queries. Although 
        // all those queries are optional, 
        // I recommend combining 
        // __day__, __year__ and __month__ 
        // to get for a specific date. Using only __month__
        // to get all users for a month, using only __year__ to
        // get all users for a year.
        // Supplying only __day__ for example, [3] get all users that
        // for the 3rd of EVERY MONTH as far back as the data goes
        // which in itself doesn't offer much value but in another context
        // could be used to determine what day of each month has the biggest
        // user visits.
        // Also It logically makes sense to use __recentdays__ alone to get users
        // for the last 24hrs, 48hrs e.t.c  
        // NOT SUPPLYING ANY QUERY RETURNS THE TOTAL NUMBER OF VISITS FOR THE LIFETIME OF THE API`
        //  },
    ],
};
