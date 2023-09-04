export class ShowMessage {
  private saveResult: HTMLElement;

  private success?: () => void;

  constructor(saveResult: HTMLElement, success?: () => void) {
    this.saveResult = saveResult;
    this.success = success;
  }

  public showSuccess(): void {
    this.showMessage('✓ Saved successfully', 'profile-success', this.success);
  }

  public showError(msg: string, callback?: () => void): void {
    this.showMessage(msg, 'profile-error', callback);
  }

  private showMessage(msg: string, cssClass: string, callback?: () => void): void {
    this.saveResult.textContent = msg;
    this.saveResult.classList.add(cssClass);
    const timeout = cssClass === 'profile-error' ? 5000 : 1500;
    setTimeout(() => {
      this.saveResult.textContent = '';
      this.saveResult.classList.remove(cssClass);
      if (callback) {
        callback();
      }
    }, timeout);
  }
}
