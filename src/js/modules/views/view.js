class View {
  focusInput() {
    this.input.focus();
  }

  clear() {
    this.parentEl.innerHTML = '';
  }
}
export default View;
