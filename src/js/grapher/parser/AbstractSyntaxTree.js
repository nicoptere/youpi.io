//https://medium.freecodecamp.org/how-to-build-a-math-expression-tokenizer-using-javascript-3638d4e5fbe9
// AST
import Token from "./Token"
export default class AbstractSyntaxTree {

    constructor(str) {

        var tokens = Token.tokenize(str);
        var outQueue = [];
        var opStack = [];

        function peek(array) {
            return array[array.length - 1];
        }

        tokens.forEach(function (token) {

            if (token.type === Token.LITERAL
            ||  token.type === Token.VARIABLE) {
                outQueue.push(token);
            }

            if (token.type === Token.FUNCTION) {
                opStack.push(token);
            }

            if (token.type === Token.SEPARATOR) {
                while (peek(opStack)
                && peek(opStack).type !== Token.LEFT_PARENTHESIS) {
                    outQueue.push(opStack.pop());
                }
            }

            if (token.type === Token.OPERATOR) {
                while (peek(opStack)
                && peek(opStack).type === Token.OPERATOR
                && token.precedence <= peek(opStack).precedence) {
                    outQueue.push(opStack.pop());
                }
                opStack.push(token);
            }

            if (token.type === Token.LEFT_PARENTHESIS) {
                opStack.push(token);
            }

            if (token.type === Token.RIGHT_PARENTHESIS) {

                while (peek(opStack)
                && peek(opStack).type !== Token.LEFT_PARENTHESIS) {
                    outQueue.push(opStack.pop());
                }

                opStack.pop();
                if (peek(opStack)
                && peek(opStack).type === Token.FUNCTION) {
                    outQueue.push(opStack.pop());
                }
            }
        });
        return outQueue.concat(opStack.reverse());

    }
}
