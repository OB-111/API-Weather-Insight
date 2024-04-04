function parseRule(ruleString) {
  const conditions = ruleString.split(",").map((condition) => {
    // console.log(condition);
    const [field, operator, value] = condition.split(/(>|<|=)/);
    // console.log(field, operator, value);
    return { field, operator, value: parseFloat(value) };
  });
  //   console.log(conditions);
  return conditions.length > 0
    ? { filed: conditions.map((condition) => condition.field), conditions }
    : null;
}

function evaluateCondition(values, rule, operator) {
  let condition_met = operator === "AND"; // If operator is AND, initialize as true, otherwise false
  const conditions = rule.split(",");
  for (const condition of conditions) {
    const [field, ruleOperator, value] = condition.split(/(>|<|=)/);
    const actualValue = values[field];
    switch (ruleOperator) {
      case ruleOperator === ">":
        condition_met =
          operator === "AND"
            ? condition_met && actualValue > parseFloat(value)
            : condition_met || actualValue > parseFloat(value);
        break;
      case ruleOperator === "<":
        condition_met =
          operator === "AND"
            ? condition_met && actualValue > parseFloat(value)
            : condition_met || actualValue > parseFloat(value);
        break;
      default:
        break;
    }
  }
  return condition_met;
}

module.exports = { parseRule, evaluateCondition };
