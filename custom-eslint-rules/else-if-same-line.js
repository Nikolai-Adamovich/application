export default {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: {
      sameLine: '`else if` must be on the same line. New line after `else` is not allowed.',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      IfStatement(node) {
        const alternate = node.alternate;

        if (!alternate || alternate.type !== 'IfStatement') {
          return;
        }

        const elseToken = sourceCode.getTokenBefore(alternate, (token) => token.value === 'else');

        if (!elseToken) {
          return;
        }

        if (elseToken.loc.end.line !== alternate.loc.start.line) {
          context.report({
            node: alternate,
            messageId: 'sameLine',
            fix(fixer) {
              return fixer.replaceTextRange([elseToken.range[1], alternate.range[0]], ' ');
            },
          });
        }
      },
    };
  },
};
