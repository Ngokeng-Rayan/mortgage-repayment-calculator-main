const form = document.getElementById('mortgageForm');
        const clearBtn = document.querySelector('.clear-btn');
        const amountInput = document.getElementById('amount');
        const termInput = document.getElementById('term');
        const rateInput = document.getElementById('rate');
        const radioOptions = document.querySelectorAll('.radio-option');
        const radioInputs = document.querySelectorAll('input[name="type"]');
        const emptyState = document.querySelector('.empty-state');
        const resultsDisplay = document.querySelector('.results-display');
        const monthlyResult = document.getElementById('monthlyResult');
        const totalResult = document.getElementById('totalResult');

        // Add focus/blur handlers for input styling
        const inputWrappers = document.querySelectorAll('.input-wrapper');
        inputWrappers.forEach(wrapper => {
            const input = wrapper.querySelector('input');
            
            input.addEventListener('focus', () => {
                wrapper.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                wrapper.classList.remove('focused');
            });
        });

        // Handle radio button selection styling
        radioOptions.forEach(option => {
            option.addEventListener('click', () => {
                radioOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input[type="radio"]').checked = true;
            });
        });

        // Form validation
        function validateForm() {
            let isValid = true;
            const formGroups = document.querySelectorAll('.form-group');
            
            // Remove all error states
            formGroups.forEach(group => {
                group.classList.remove('error');
                const wrapper = group.querySelector('.input-wrapper');
                if (wrapper) wrapper.classList.remove('error');
            });

            // Validate amount
            if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
                amountInput.closest('.form-group').classList.add('error');
                amountInput.closest('.input-wrapper').classList.add('error');
                isValid = false;
            }

            // Validate term
            if (!termInput.value || parseInt(termInput.value) <= 0) {
                termInput.closest('.form-group').classList.add('error');
                termInput.closest('.input-wrapper').classList.add('error');
                isValid = false;
            }

            // Validate rate
            if (!rateInput.value || parseFloat(rateInput.value) < 0) {
                rateInput.closest('.form-group').classList.add('error');
                rateInput.closest('.input-wrapper').classList.add('error');
                isValid = false;
            }

            // Validate mortgage type
            let typeSelected = false;
            radioInputs.forEach(input => {
                if (input.checked) typeSelected = true;
            });
            
            if (!typeSelected) {
                document.querySelector('.radio-group').closest('.form-group').classList.add('error');
                isValid = false;
            }

            return isValid;
        }

        // Calculate mortgage
        function calculateMortgage(amount, years, rate, type) {
            const principal = parseFloat(amount);
            const termMonths = parseInt(years) * 12;
            const monthlyRate = parseFloat(rate) / 100 / 12;

            let monthly, total;

            if (type === 'repayment') {
                if (monthlyRate === 0) {
                    monthly = principal / termMonths;
                } else {
                    monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
                }
                total = monthly * termMonths;
            } else {
                monthly = principal * monthlyRate;
                total = (monthly * termMonths) + principal;
            }

            return { monthly, total };
        }

        // Format currency
        function formatCurrency(value) {
            return '£' + value.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                const amount = amountInput.value;
                const term = termInput.value;
                const rate = rateInput.value;
                let type = '';
                
                radioInputs.forEach(input => {
                    if (input.checked) type = input.value;
                });

                const results = calculateMortgage(amount, term, rate, type);

                monthlyResult.textContent = formatCurrency(results.monthly);
                totalResult.textContent = formatCurrency(results.total);

                emptyState.classList.add('hidden');
                resultsDisplay.classList.add('active');
            }
        });

        // Clear form
        clearBtn.addEventListener('click', () => {
            form.reset();
            
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));
            
            const wrappers = document.querySelectorAll('.input-wrapper');
            wrappers.forEach(wrapper => wrapper.classList.remove('error'));
            
            radioOptions.forEach(opt => opt.classList.remove('selected'));
            
            emptyState.classList.remove('hidden');
            resultsDisplay.classList.remove('active');
        });