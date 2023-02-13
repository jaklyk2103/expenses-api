"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../shared/types");
class ExpensesRepository {
    async getAllExpenses() {
        return [
            {
                description: 'na waciki',
                value: 50,
                currency: types_1.Currency.PLN
            }
        ];
    }
}
exports.default = ExpensesRepository;
//# sourceMappingURL=expenses.repository.js.map