const inputs = document.querySelectorAll('.TextInput_input__b2sSg');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        // Handle input changes here
        const newValue = input.value;
        console.log(`New value for ${input.id}: ${newValue}`);
    });

    input.addEventListener('focus', () => {
        // Handle focus here
        console.log(`Input ${input.id} focused`);
    });

    input.addEventListener('blur', () => {
        // Handle blur here
        console.log(`Input ${input.id} blurred`);
    });
});

// Example of adding a disabled state to an element
// const wrapper = document.querySelector('.Control_wrapper__VZIiC');
// wrapper.classList.toggle('disabled');