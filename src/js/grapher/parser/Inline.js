//https://medium.freecodecamp.org/how-to-build-a-math-expression-tokenizer-using-javascript-3638d4e5fbe9
import AbstractSyntaxTree from "./AbstractSyntaxTree";
import Token from "./Token";
import functions from "../functions";

let debug = false;
export default class Inline{

    static compute( str ){

        let operations = new AbstractSyntaxTree(str);
        if( debug )console.log( str, operations );

        let result = "";
        let value = "";

        for( let i = 0; i < operations.length; i++ ){

            let t = operations[i];
            if( t.type === Token.LITERAL || t.type === Token.VARIABLE )continue;

            // if( debug )console.log( "RPN: " + operations.reduce( function (a, t){return a += t.value + ","; }, "") );

            if(  t.type === Token.OPERATOR ){
                let op0 = operations[i-2].value;
                let op1 = operations[i-1].value;
                value = op0 + t.value + op1;
                operations.splice( i - 2, 3, new Token( Token.LITERAL, value ) );
                i-=2;
            }

            if( t.type === Token.FUNCTION ){

                if( functions[ t.value ] === undefined ){
                    console.warn ("can't inline, function doesn't exist:", t.value);
                    break;
                }

                let argumentsCount = functions[t.value].length;

                //inlines custom function
                if( functions.dictionary[t.value] !== undefined ){

                    if( debug )console.log("custom");

                    let vars = [];
                    for( let j = argumentsCount; j > 0; j-- ){

                        if( /[0-9.]+/g.test( operations[i-j].value )
                        ||  operations[i-j].value.length === 1 ){
                            vars.push( operations[i-j].value );
                        }else{
                            vars.push( "(" + operations[i-j].value + ")" );
                        }
                    }

                    //gets the arguments names
                    let func = ""+ functions[t.value].toString().replace(/\n/gi, " " ).replace(/\r/gi, " ");
                    let args = Inline.getArguments(func);
                    if( debug )console.log("\targs: " + JSON.stringify(args), "vars: " + JSON.stringify(vars));

                    //inlines arguments
                    func = func.replace( /.*return|;\s+?}|;}|}/gi, '' );
                    for( let k = 0; k < vars.length; k++ ){

                        let reg = new RegExp( "\\b"+args[k]+"\\b", "gi" );
                        func = func.replace( reg, vars[k] );

                    }
                    value = "(" + func.replace(/\s/gi, '') + ")";
                    if( debug )console.log( value );

                }else{

                    // native functions
                    value = t.value + "(";
                    for( let j = argumentsCount; j > 0; j-- ){
                        value += operations[i-j].value +  (j>1?",":"");
                    }
                    value += ")";
                }

                operations.splice( i - argumentsCount, ( argumentsCount + 1 ), new Token( Token.LITERAL, value ) );

                i -= argumentsCount;

            }

        }

        if( debug )console.log( operations[0].value );

        return operations[0].value;

    };

    static getArguments(func) {
        let args = /\(\s*([^)]+?)\s*\)/.exec(func);
        try{
            if (args[1]) {
                args = args[1].split(/\s*,\s*/);
            }
        }catch( e ){
            console.log( func, args );
        }
        return args;
    }
}