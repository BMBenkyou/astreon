const app = angular.module('AstreonApp', []);

app.controller('LearningModesController', function($scope, $window) {
  $scope.loading = false;

  $scope.learningModes = [
    { title: 'Memorization', description: 'Study your flashcards in a simple, easy-to-use interface', image: '../static/imgs/trace.png', imageWidth: '391px', imageHeight: '66px' },
    { title: 'Matching Type', description: 'Study your flashcards in a simple, easy-to-use interface', image: '../static/imgs/trace.png', imageWidth: '391px', imageHeight: '66px' },
    { title: 'Test Race', description: 'Study your flashcards in a simple, easy-to-use interface', image: '../static/imgs/trace.png', imageWidth: '391px', imageHeight: '66px' }
  ];

  $scope.isModalOpen = false;

  $scope.openModal = function() {
    $scope.isModalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.isModalOpen = false;
  };

  $scope.goBack = function() {
    $window.history.back();
  };
});
