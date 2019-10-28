
export default class functions {

    static init(){

        //creates Math builtin functions

        var dictionary = {};
        var builtInfunctions = ["E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2", "abs", "acos", "acosh",
            "asin", "asinh", "atan", "atan2", "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "exp", "expm1", "floor",
            "fround", "hypot", "imul", "log", "log10", "log1p", "log2", "max", "min", "pow", "random", "round", "sign",
            "sin", "sinh", "sqrt", "tan", "tanh", "trunc"];

        builtInfunctions.forEach( function(f){
            window[f] = Math[f];
            functions[f] = Math[f];
        });


        // GLSL methods

        //from http://www.shaderific.com/glsl-functions/

        var declarations = {

            radians :       "function(__x){ return __x * ( 3.141592653589793 / 180. ); }",
            degrees :       "function(__x){ return __x * ( 180. / 3.141592653589793 ); }",
            exp2 :          "function(__x){ return pow( __x, 2. ); }",
            log2 :          "function(__x){ return log( __x ); }",
            inversesqrt :   "function(__x){ return 1 / sqrt( __x ); }",
            fract :         "function(__x){ return __x % 1.; }",
            sign :          "function(__x){ return __x >= 0. ? 1. : -1.; }",
            normalize :     "function(__x){ return 1.;}",

            mod :           "function(__x,__a){ return __x % __a; }",
            step :          "function(__x,__a){ return __x < __a ? 0. : 1.; }",
            dot :           "function(__a,__b){ return ( __a*__b );}",
            distance :      "function(__a,__b){ return abs( __a-__b );}",

            clamp :         "function(__x,__a,__b){ return min( __b, max( __a, __x ) );}",
            smoothstep :    "function(__a,__b,__x){ return mix( __a,__b, __x * __x * (3.0 - 2.0 * __x)); }",
            mix :           "function(__a,__b,__x){ return __a * ( 1. - __x) + __b * __x; }",

            /*
             invalid ; length is a member of JS objects
             also the length of a scalar its absolute value...
             length :        "function(__x){ return abs( __x );}",
            */
        };
        for ( const key in declarations ){
            eval(  "window[ key ] = functions[ key ] = " + declarations[key] );
            dictionary[key] = declarations[key];
        }

        //makes the objects available globally (WIP)
        functions.dictionary = dictionary;
        window.functions = functions;
    }

}