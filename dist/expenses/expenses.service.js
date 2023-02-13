"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpensesService {
    constructor(expensesRepository) {
        this.expensesRepository = expensesRepository;
    }
    async getExpenses() {
        return this.expensesRepository.getAllExpenses();
    }
}
exports.default = ExpensesService;
//# sourceMappingURL=expenses.service.js.map