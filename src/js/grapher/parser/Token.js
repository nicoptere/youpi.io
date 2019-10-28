
let id = 0;
const _LITERAL           = id++;
const _VARIABLE          = id++;
const _OPERATOR          = id++;
const _SEPARATOR         = id++;
const _FUNCTION          = id++;
const _LEFT_PARENTHESIS  = id++;
const _RIGHT_PARENTHESIS = id++;
const _LINEEND           = id++;

const isComma = new RegExp(/,/);
const isSemicolon = new RegExp(/;/);
const isDot = new RegExp(/\./);
const isDigit = new RegExp(/\d/);
const isLetter = new RegExp(/[a-z]/i);
const highPrecedence = new RegExp(/[*/]/);
const isOperator = new RegExp(/[*+/-><]|<=|>=|==/);
const isLeftParenthesis = new RegExp(/\(/);
const isRightParenthesis = new RegExp(/\)/);

let result = [];
let numberBuffer = [];
let letterBuffer = [];


export default class Token{

    constructor( type, value, precedence ) {

        this.type = type;

        this.value = value;

        this.precedence = isNaN(precedence)? - 1 : precedence;

    }

    static get LITERAL(){               return _LITERAL;            }
    static get VARIABLE(){              return _VARIABLE;           }
    static get OPERATOR(){              return _OPERATOR;           }
    static get SEPARATOR(){             return _SEPARATOR;          }
    static get FUNCTION(){              return _FUNCTION;           }
    static get LEFT_PARENTHESIS(){      return _LEFT_PARENTHESIS;   }
    static get RIGHT_PARENTHESIS(){     return _RIGHT_PARENTHESIS;  }
    static get LINEEND(){               return _LINEEND;            }

    static tokenize(str) {

        result = [];
        numberBuffer = [];
        letterBuffer = [];

        let characters = str.replace(/\s+/g, "").split("");
        characters.forEach(function (char, i) {

            //literal tokens (int or float)
            if( letterBuffer.length === 0 && ( isDigit.test(char) || isDot.test(char) ) ){
                numberBuffer.push(char);
                return;
            }else{
                if (numberBuffer.length > 0) {
                    result.push( new Token( _LITERAL, numberBuffer.join("") ) );
                    numberBuffer = [];
                }
            }

            //variable, constant or function name
            if (isLetter.test(char) || isDigit.test(char) ){
                letterBuffer.push(char);
                return;
            }else{
                Token.commitLetters(char);
            }

            //operator
            if (isOperator.test(char)){
                let precedence = highPrecedence.test( char ) ? 1 : 0;
                result.push(new Token(_OPERATOR, char, precedence));
            }

            //opening parenthesis
            if (isLeftParenthesis.test(char)){
                result.push(new Token(_LEFT_PARENTHESIS, char));
            }

            //closing parenthesis
            if (isRightParenthesis.test(char)) {
                result.push(new Token(_RIGHT_PARENTHESIS, char));
            }

            //separator
            if( isComma.test(char) ) {
                result.push(new Token(_SEPARATOR, char));
            }

            //line end
            if( isSemicolon.test(char) ) {
                result.push(new Token(_LINEEND, char));
            }

        });

        if (numberBuffer.length > 0 ) {
            result.push( new Token( _LITERAL, numberBuffer.join("") ) );
        }

        if (letterBuffer.length > 0 ) {
            Token.commitLetters("");
        }
        return result;
    };


    static commitLetters(char){
        if (letterBuffer.length > 0) {
            let value = letterBuffer.join("");
            let type = ( isLeftParenthesis.test( char ) ) ? _FUNCTION : _VARIABLE;
            result.push( new Token( type, value ) );
            letterBuffer = [];
        }
    }

}