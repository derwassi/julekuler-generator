'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kpg.service.persist.url', [])
    .factory('bookmarkService', function () {
        return {
            bookmark: function () {
                var title = document.title;
                var url = document.location.href;

                if (window.sidebar && window.sidebar.addPanel) {
                    /* Mozilla Firefox Bookmark */
                    window.sidebar.addPanel(title, url, "");
                } else if (window.external && window.external.AddFavorite) {
                    /* IE Favorite */
                    window.external.AddFavorite(url, title);
                } else if (window.opera && window.print) {
                    /* Opera Hotlist */
                    alert("Press Control + D to bookmark");
                    return true;
                } else {
                    /* Other */
                    alert("Press Control + D to bookmark");
                }
                return false;
            }
        }
    })
    .factory('titleCodecService', function () {
        var p = {};
        /**
         * Encodes an title
         * @param patternService
         * @param modelService
         * @returns {string}
         */
        p.encode = function (patternService,modelService) {
            return modelService.title;
        };

        /**
         * decodes a title
         * @param title
         * @param patternService
         * @param modelService
         */
        p.decode = function (title,patternService,modelService) {
            modelService.title = title;
        };
        return p;
    })
    .factory('colorCodecService', function () {
        var p = {};
        /**
         * Encodes an array of colors to a string
         * @param patternService
         * @param modelService
         * @returns {string}
         */
        p.encode = function (patternService,modelService) {
            var first = true;
            var colstring = '';
            for (var _col in modelService.colors.getColors()) {
                if (!first) {
                    colstring += '/';
                }
                colstring += _col + ":" + modelService.colors.getColor(_col);

                first = false;
            }
            return colstring;
        };

        /**
         * decodes a colorstring to an array of collors
         * @param colorstring
         * @param patternService
         * @param modelService
         */
        p.decode = function (colorstring, patternService,modelService) {
           //new encoding
            var cols = colorstring.split('/');
            for (var col in cols) {
                var _tmp = cols[col].split(':');

                modelService.colors.setColor(''+_tmp[0], _tmp[1]);
            }
            console.log(modelService.colors.getColors());
        };
        return p;

    })

    .factory('patternCodecService', function () {
        var p = {};


        var encodeMap = {0: "-", 1: ".", 2: "/", 3: "0", 4: "1", 5: "2", 6: "3", 7: "4", 8: "5", 9: "6", 10: "7", 11: "8", 12: "9",
            13: "B",
            14: "C",
            15: "D",
            16: "E",
            17: "F",
            18: "G",
            19: "H",
            20: "I",
            21: "J",
            22: "K",
            23: "L",
            24: "M",
            25: "N",
            26: "O",
            27: "P",
            28: "Q",
            29: "R",
            30: "S",
            31: "T",
            32: "U",
            33: "V",
            34: "W",
            35: "X",
            36: "Y",
            37: "Z",
            38: "a",
            39: "b",
            40: "c",
            41: "d",
            42: "e",
            43: "f",
            44: "g",
            45: "h",
            46: "i",
            47: "j",
            48: "k",
            49: "l",
            50: "m",
            51: "n",
            52: "o",
            53: "p",
            54: "q",
            55: "r",
            56: "s",
            57: "t",
            58: "u",
            59: "v",
            60: "w",
            61: "x",
            62: "y",
            63: "z"
        };
        var decodeMap = {"-": 0,
            ".": 1,
            "/": 2,
            "0": 3,
            "1": 4,
            "2": 5,
            "3": 6,
            "4": 7,
            "5": 8,
            "6": 9,
            "7": 10,
            "8": 11,
            "9": 12,
            "B": 13,
            "C": 14,
            "D": 15,
            "E": 16,
            "F": 17,
            "G": 18,
            "H": 19,
            "I": 20,
            "J": 21,
            "K": 22,
            "L": 23,
            "M": 24,
            "N": 25,
            "O": 26,
            "P": 27,
            "Q": 28,
            "R": 29,
            "S": 30,
            "T": 31,
            "U": 32,
            "V": 33,
            "W": 34,
            "X": 35,
            "Y": 36,
            "Z": 37,
            "a": 38,
            "b": 39,
            "c": 40,
            "d": 41,
            "e": 42,
            "f": 43,
            "g": 44,
            "h": 45,
            "i": 46,
            "j": 47,
            "k": 48,
            "l": 49,
            "m": 50,
            "n": 51,
            "o": 52,
            "p": 53,
            "q": 54,
            "r": 55,
            "s": 56,
            "t": 57,
            "u": 58,
            "v": 59,
            "w": 60,
            "x": 61,
            "y": 62,
            "z": 63
        };
        var encode6BitToChar = function (bin) {
            return encodeMap[bin];
        };
        var decode6BitToChar = function (bin) {
            return decodeMap[bin];
        };

        /**
         * encodes a pattern objec
         *
         * @param traverseDrawingSurface
         * @param modelService
         * @returns {string}
         */
        p.encode = function (traverseDrawingSurface,modelService) {
            var i = 0;
            var bin = 0;
            var res = '';
            var val;
            traverseDrawingSurface(function (row, col) {
                //convert to string, 6 colors = 3 bit => 6 bit for 2 fields => fits into 64 characters (a-zA-Z0-9./)
                val = parseInt(modelService.pattern.getColorAt(row,col));
                if (!val) val = 0;
                bin |= val << (3 * (i % 2));
                if (i % 2 == 1) {
                    res += encode6BitToChar(bin);
                    bin = 0;
                }
                i++;
            });
            return res;
        };

        /**
         * Decodes a pattern string
         *
         * @param data
         * @param traverseDrawingSurface
         * @param modelService
         * @returns {*}
         */
        p.decode = function (data,traverseDrawingSurface,modelService) {
             var i=0;
            traverseDrawingSurface(function (row, col) {
                var bin = decode6BitToChar(data.charAt(Math.floor(i / 2)));
                if (i % 2 == 1) {
                    bin = bin >> 3;//last three bit
                } else {
                    bin = bin & 7;//first three bit
                }

                i++;
                modelService.pattern.setColorAt(row,col,bin);



            });
        };
        return p;
    });
