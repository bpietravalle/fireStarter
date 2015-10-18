(function(angular) {
    "use strict";

    function fbAuthMockService(afEntity) {

        this.authObj = jasmine.createSpyObj('authObj', ['$authWithCustomToken',
            '$authAnonymously', '$authWithPassword',
            '$authWithOAuthPopup', '$authWithOAuthRedirect', '$authWithOAuthToken',
            '$unauth', '$getAuth', '$onAuth', '$offAuth',
            '$createUser', '$changePassword', '$changeEmail', '$removeUser', '$resetPassword'
        ]);
        this.ref = function() {
            var ref = jasmine.createSpyObj('ref', ['authWithCustomToken',
                'authAnonymously', 'authWithPassword',
                'authWithOAuthPopup', 'authWithOAuthRedirect', 'authWithOAuthToken',
                'unauth', 'getAuth', 'onAuth', 'offAuth',
                'createUser', 'changePassword', 'changeEmail', 'removeUser', 'resetPassword'
            ]);
            return ref;
        };

        this.authData = function() {
            var data = jasmine.createSpyObj('authData', ['uid', 'provider', 'token']);
            return data;
        };
        this.userData = function() {
            var data = jasmine.createSpyObj('userData', ['uid']);
            return data;
        };
        this.makeAuth = function(ref) {
            if (!ref) {
                this.ref();
            }
            var auth = afEntity.set("auth", ref);
            return auth;
        };
    }
    fbAuthMockService.$inject = ['afEntity'];
    angular.module('fbMocks')
        .service('mockAuth', fbAuthMockService);

})(angular);
