angular.module('legoNxtRemoteApp').service("songService", [function() {

    this.getSong = function(id) {

        var songs = {
            //Mary had a Little Lamb converted from ruby https://github.com/zuk/ruby-nxt
            'Mary had a little lamb' :
            [
                //E  D C   D E   E  E
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 523, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500*2 },
                //D  D   D     E   G  G
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500*2 },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 784, duration: 500, delay: 500   },
                { frequency: 784, duration: 500, delay: 500*2 },
                //E  D C   D E   E  E
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 523, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                //E    D      D   E     D  C
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 659, duration: 500, delay: 500   },
                { frequency: 587, duration: 500, delay: 500   },
                { frequency: 523, duration: 750, delay: 500*3 }

            ]
        };

        return songs[id];
    }
}]);
