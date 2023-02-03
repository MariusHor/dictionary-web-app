class View {
  renderSpinner = () => {
    const markup = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderNetworkError = error => {
    const markup = this.getNetworkErrMarkup(error);
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderTimeoutError = error => {
    const markup = this.getTimeoutErrMarkup(error);
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderGenericError = date => {
    const markup = `
    <div class="error text-center">
      <h4 class="font-weight-bold">Unexpected error</h4>
      <p class="mt-4">Please try again and if the error persists contact the developer by clicking the button below</p>
      <a href="mailto:marius.horghidan@yahoo.com?subject=Dictionary App Error: ${date}" class="btn btn-purple mx-auto mt-4" data-error="send">Report error</a>
    </div>
  `;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  getNetworkErrMarkup(error) {
    return `
    <div class="error text-center d-flex flex-column gap-4">
      <h4 class="font-weight-bold">${error.name} ${error.status}</h4>
      <p>We couldn't find definitions for the word <span class="font-weight-bold font-italic">${error.query}</span>. You can try the search again at a later time or head to the web instead.</p>
      <a href="/" class="btn btn-purple mx-auto">Home</a>
    </div>
  `;
  }

  getTimeoutErrMarkup(error) {
    return `
    <div class="error text-center">
      <h4 class="font-weight-bold">${error.name}</h4>
      <p class="mt-4">${error.feedback}</p>
    </div>
  `;
  }

  focusInput() {
    this.input.value = '';
    this.input.focus();
  }

  clear() {
    while (this.parentEl.lastChild) {
      this.parentEl.removeChild(this.parentEl.lastChild);
    }
  }
}
export default View;
