import * as math from 'mathjs';

export function evaluateExpression(expression: string): string {
  try {
    // Remove any unnecessary whitespace
    const cleanExpr = expression.trim();

    // Evaluate the expression using math.js
    const result = math.evaluate(cleanExpr);
    
    // Handle different types of results
    if (typeof result === 'number') {
      // Format number results
      return math.format(result, {
        precision: 14,
        notation: (result > 1e6 || result < 1e-6) ? 'exponential' : 'fixed'
      });
    } else if (math.isMatrix(result)) {
      // Format matrix results
      return math.format(result, {
        notation: 'fixed'
      });
    } else {
      // For other types (complex numbers, units, etc.)
      return result.toString();
    }
  } catch (error) {
    return 'Error';
  }
}