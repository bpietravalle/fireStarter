# FireStarter

[![Build Status](https://travis-ci.org/bpietravalle/fireStarter.svg?branch=master)](https://travis-ci.org/bpietravalle/fireStarter)
[![npm version](https://badge.fury.io/js/firebase.starter.svg)](https://badge.fury.io/js/firebase.starter)

FireStarter is a very simple wrapper for [angularFire](https://github.com/firebase/angularfire) and [Geofire](https://github.com/firebase/geofire-js).


## Installation & Setup

```bash
$ npm install firebase.starter --save
```

```bash
$ bower install firebase.starter --save
```

1.) Include FireStarter in your app dependencies.

```javascript
angular.module("yourApp",['firebase.starter']);
```
2.) Define your root url in a config block using the `setRoot` method.

```javascript

(function(){
    "use strict";

    angular.module("yourApp")
			.constant("YOURURL","https://your-firebase.firebaseio.com");
			.config(function(fireStarterProvider,YOURURL){
				 fireStarterProvider.setRoot(YOURURL);
			});

})();
```

3.) Inject fireStarter into your angular service.

```javascript

(function(){
    "use strict";

    angular.module("yourApp")
	 .factory("yourFactory", yourFactory);

	 /** @ngInject */
	 function yourFactory(fireStarter){

	 }

})();
```
## Usage

Firestarter can take up to three arguments

```javascript
	 fireStarter(type, path, flag);
```
1. _type_: the specific API you want to access. Options include: "array","auth", "geo", "object", or "ref".

2. _path_: the path of the child node you wish to create.  This argument should be passed as an array
of strings.  However, if there is only a single item in the array, you can also
just pass the argument as a string.  Also, you do not need to pass a _path_ argument if _type_ is set to "auth".

3. _flag_: if you already have a firebaseRef and simply want to wrap it in angularFire, then set the _path_ argument to 
the given firebaseRef and set this argument to _true_, otherwise leave this argument blank.


### Thanks!
The Geofire portion is largely due to [Mike Pugh](https://github.com/mikepugh/)'s awesome [wrapper](https://github.com/mikepugh/AngularGeofire).
Thanks!


### Contributing

Yes, please.  Below should get you setup.

```bash
$ git clone https://github.com/bpietravalle/fireStarter.git
$ cd fireStarter
$ npm install               # install dependencies
```
Refer to the [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) for full list of
commands. The commands for unit tests are:

```bash
* gulp test #run test suite once
* gulp test:auto #watch files and run tests continually
```



