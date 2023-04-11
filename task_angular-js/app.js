var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider) {
  $routeProvider
      .when('/home', {
        templateUrl: 'index.html',
        // controller: 'appController'
      })
      .when('/', {
        templateUrl: 'pages/list.html',
        controller: 'listController'
      })
      .when('/', {
        templateUrl: 'pages/view.html',
        controller: 'viewController'
      })
  // .otherwise( {
  //   redirectTo: 'pages/notFound.html',
  //   controller: ''
  // })
});

myApp.controller('appController', function($scope) {
  $scope.name = '--- App controller ---';

});


// ============ ADD NEW USER ============
myApp.controller('formController', function($scope, $timeout, userService) {
  $scope.users = userService.list();
  $scope.usersCount = userService.getUsersLength();
  $scope.usersCount2 = $scope.users.length;
  console.log('==C==', $scope.usersCount);

  $scope.ifSearchUser = false;
  $scope.title = "List of Users";


  $scope.saveUser = function() {
    // debugger;
    console.log($scope.newUser);
    if($scope.newUser === null || $scope.newUser === angular.undefined) return;
    userService.save($scope.newUser);
    $scope.newUser = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      type: "",
    };
    console.log('form-controller -> NewUser', $scope.newUser);
  };

  // $timeout(function() {
  //   $scope.isUniqueUser = function() {
  //     debugger;
  //     if($scope.newUser.firstName.length) {
  //       $scope.isExist = userService.checkUniqueUser($scope.newUser);
  //       console.log('Is unique user', $scope.isExist);
  //     }
  //   }
  // }, 600);


  $scope.edit = function(id) {
    $scope.newUser = angular.copy(userService.get(id));
  };

  $scope.delete = function(id) {
    userService.delete(id);
    if($scope.newUser !== angular.undefined && $scope.id === id) {
      $scope.newUser = {};
    }
  };

  $scope.searchUser = function() {
    if($scope.title === "List of Users") {
      $scope.ifSearchUser = true;
      $scope.title = "Back";
    } else {
      $scope.ifSearchUser = false;
      $scope.title = "List of Users";
    }
  };
});


myApp.controller('viewController', function($scope) {
  $scope.name = '--- View controller ---';

});

myApp.controller('notFoundController', function($scope) {
  $scope.name = '--- Not Found controller ---';

});


// ============ SERVICE ============
myApp.service('userService', function($http) {
  const self = this;

  // $http.get('data/users.json').then(successCallback, errorCallback);
  // function successCallback(response) {
  //   self.users = response.data;
  //   console.log('LIST CONTROLLER -> USERS', $scope.users);
  // }
  //
  // function errorCallback(error) {
  //   console.log('ERROR', error);
  // }

  const users = [
    {
      "id": 0,
      "firstName": "Ivan",
      "lastName": "Franko",
      "email": "franko@com.ua",
      "password": "1234a5678",
      "type": "admin"
    },
    {
      "id": 1,
      "firstName": "Taras",
      "lastName": "Shevchenko",
      "email": "shevchenko@com.ua",
      "password": "1234b5678",
      "type": "driver"
    },
    {
      "id": 2,
      "firstName": "Lesya",
      "lastName": "Ukrainka",
      "email": "ukrainka@com.ua",
      "password": "1234c5678",
      "type": "driver"
    },
    // {
    //   "id": 3,
    //   "firstName": "Lesya",
    //   "lastName": "Ukrainka",
    //   "email": "ukrainka@com.ua",
    //   "password": "1234c5678",
    //   "type": "driver"
    // },
    // {
    //   "id": 4,
    //   "firstName": "Lesya",
    //   "lastName": "Ukrainka",
    //   "email": "ukrainka@com.ua",
    //   "password": "1234c5678",
    //   "type": "driver"
    // },
  ];

  this.getUsersLength = function() {
    console.log('--S--', users.length);
    return users.length;
  }

  this.save = function(user) {
    debugger;
    if(user.id === null || user.id === undefined) {
      user.id = new Date().getTime();
      users.push(user);
    } else {
      for(var i in users) {
        if(users[i].id === user.id) {
          users[i] = user
        }
      }
    }
  };

  this.get = function(id) {
    for(let i in users) {
      if(users[i].id === id) {
        return users[i];
      }
    }
  };

  this.delete = function(id) {
    for(let i in users) {
      if(users[i].id === id) {
        users.splice(+i, 1);
      }
    }
  };

  this.list = function() {
    return users;
  };

  this.checkUniqueUser = function(newUser) {
    if(newUser !== undefined) {
      const users = this.list();
      for(let user of users) {
        if (user.firstName === newUser) {
          return true
        }
      }
      return false;
    }
  }

});


myApp.directive('userUnique', ['userService', function(userService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      debugger;
      element.bind('blur', function(e) {
        if(!ngModel || !element.val()) return;
        var currentValue = element.val();
        var result = userService.checkUniqueUser(currentValue);
        debugger;
        ngModel.$setValidity('unique', !result);
      });
    }
  }
}]);


myApp.directive('dlContains', function() {
  return {
    require: 'ngModel', // need to add ngModel in element
    restrict: 'EAC',
    link: function(scope, element, attr, mCtrl) {
      function myValidation(value) { // can set the function name as per you requirement
        // if(value.indexOf("ab") > -1) {
        if(value.includes("ab")) {
          mCtrl.$setValidity('password', true);
        } else {
          mCtrl.$setValidity('password', false);
        }
        return value;
      }

      mCtrl.$parsers.push(myValidation());
    }
  };
});


myApp.directive('digitLetterContains', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs, ctrl) {
      var regex = attrs.digitLetterContains;
      elem.bind('keypress', function(event) {
        var input = elem.val() + event.key;
        var validator = new RegExp(regex);
        if(!validator.test(input)) {
          event.preventDefault();
          return false;
        }
      });
    }
  };
});


myApp.directive('mitOneDigit', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModel) {
      $scope.$watch($attrs.ngModel, function(value) {
        // var isValid = (value > 3 && value < 100);
        var isValid = (value > 3 && value < 100);
        ngModel.$setValidity($attrs.ngModel, isValid);
      });
    }
  };
});


