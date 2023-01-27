class View {
  renderSpinner = () => {
    const markup = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  handleError = error => {
    const markup = `
      <div class="error text-center">
        <h4 class="font-weight-bold">${error.name} ${error.status}</h4>
        <p class="mt-4">We couldn't find definitions for the word <span class="font-weight-bold font-italic">${error.query}</span>. You can try the search again at a later time or head to the web instead.</p>
      </div>
    `;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  handleValidationError = error => {
    this.parentEl.addEventListener(
      'submit',
      event => {
        if (!this.parentEl.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        this.feedbackEl.textContent = error.feedback;
        this.parentEl.classList.add('was-validated');
      },
      false,
    );
    this.formInput.addEventListener('blur', () => {
      this.parentEl.classList.remove('was-validated');
    });
  };

  focusInput() {
    this.input.focus();
  }

  clear() {
    this.parentEl.innerHTML = '';
  }
}
export default View;
