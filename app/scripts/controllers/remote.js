'use strict';

angular.module('legoNxtRemoteApp')
  .controller('RemoteCtrl', function ($scope, robotModel) {

        $scope.robot = robotModel;

        /*
        $scope.connect = function() {

            //TODO: Getting error here $apply already in progress - research how to resolve.
            var done = function() {
                $scope.$apply();
            }

            if(!robotModel.isConnected)
            {
                robotModel.connect(done);
            }
            else {
                robotModel.disconnect(done);
            }
        }
        */
  });
