# fireStarter

fireStarter is a very simple wrapper for [angularFire](https://github.com/firebase/angularfire) and [Geofire](https://github.com/firebase/geofire-js).


## Installation & Setup

```bash
$ npm install firebase.starter --save
```

```bash
$ bower install firebase.starter --save
```

1.) Include fireStarter in your app dependencies.

```javascript
angular.module("yourApp",['firebase.starter']);
```

2.) Inject fireStarter service into your angular service.

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
3.) Define a root node constant.  The fireStarter service will look for a constant called 'FBURL'.
If you'd prefer to have fireStarter look for a different constant, you can do so, as explained below.
Either way make sure the constant is available in your module.

```javascript

(function(){
    "use strict";

    angular.module("yourApp")
	 .constant("FBURL", "http://your-firebase.firebaseio.com");


})();
```
## Usage

The fireStarter service can take up to four arguments

```javascript
	 fireStarter(type, path, flag, constant);
```
1. _type_: the specific API you want to access. Options include: "object","array","auth", or "geo".

2. _path_: the path of the child node you wish to create.  This argument should be passed as an array
of strings.  However, if there is only a single item in the array, you can also
just pass the argument as a string.  Also, you do not need to pass a _path_ argument if _type_ is set to "auth".

3. _flag_: if you already have a firebaseRef and simply want to wrap it in angularFire, then set the _path_ argument to 
the given firebaseRef and set this argument to _true_, otherwise leave this argument blank.

4. _constant_: if you want the angular $injector to search for a different constant than FBURL, then pass the constant as a string here.


## Contributing

Yes, please.  Below should get you setup.

```bash
$ git clone https://github.com/bpietravalle/fireStarter.git
$ cd fireStarter
$ npm install               # install dependencies
```
Refer to the [generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) for full list of commands. The commands
for unit tests are:

```bash
* gulp test #run test suite once
* gulp test:auto #watch files and run tests continually
```



