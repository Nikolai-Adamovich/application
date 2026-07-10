export default {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: {
      sameLine:
        '`if (` must be on the same line. New line between `if` and `(` is not allowed.',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      IfStatement(node) {
        const ifToken = sourceCode.getFirstToken(node); // if
        const openParen = sourceCode.getTokenAfter(ifToken); // (

        if (
          openParen &&
          ifToken.loc.end.line !== openParen.loc.start.line
        ) {
          context.report({
            node,
            messageId: 'sameLine',
            fix(fixer) {
              return fixer.replaceTextRange(
                [ifToken.range[1], openParen.range[0]],
                ' ',
              );
            },
          });
        }
      },
    };
  },
};
