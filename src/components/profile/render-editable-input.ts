import createElement from '../../dom-helper/create-element';
import { ElementValidator } from '../registration/validation/validate';

interface ListenerOptions {
  input: HTMLInputElement;
  okBtn: HTMLElement;
  cancelBtn: HTMLElement;
  validator?: ElementValidator;
  save: () => void;
}

class EditListener {
  private opts: ListenerOptions;

  private originalValue?: string;

  private static listeners: EditListener[] = [];

  constructor(opts: ListenerOptions) {
    this.opts = opts;
    this.opts.input.addEventListener('click', this.enterEditMode);
    this.opts.input.tabIndex = -1;
  }

  private okClick = (): void => {
    if (this.opts.input.classList.contains('edit')) {
      if (this.opts.validator && !this.opts.validator.validate()) {
        return;
      }
      this.originalValue = this.opts.input.value;
      this.stopEdit();
      this.opts.save();
    }
  };

  private stopEdit(): void {
    this.opts.input.classList.remove('edit');
    this.opts.input.parentElement?.classList.remove('edit-wrapper');
    this.opts.okBtn.classList.add('hidden');
    this.opts.okBtn.classList.remove('edit-btn');
    this.opts.cancelBtn.classList.add('hidden');
    this.opts.cancelBtn.classList.remove('edit-btn');
    this.opts.okBtn.removeEventListener('click', this.okClick, true);
    this.opts.cancelBtn.removeEventListener('click', this.cancelEditMode, true);
    this.opts.validator?.validate();
  }

  private cancelEditMode = (): void => {
    if (this.opts.input.classList.contains('edit')) {
      this.opts.input.value = this.originalValue ?? '';
      this.stopEdit();
    }
  };

  private enterEditMode = (): void => {
    if (!this.opts.input.classList.contains('edit')) {
      this.opts.input.select();
      this.opts.input.classList.add('edit');
      this.opts.input.parentElement?.classList.add('edit-wrapper');
      this.opts.okBtn.classList.remove('hidden');
      this.opts.okBtn.classList.add('edit-btn');
      this.opts.cancelBtn.classList.remove('hidden');
      this.opts.cancelBtn.classList.add('edit-btn');
      this.opts.okBtn.addEventListener('click', this.okClick, true);
      this.originalValue = this.opts.input.value;
      this.opts.cancelBtn.addEventListener('click', this.cancelEditMode, true);
    }
  };

  public static createListener(opts: ListenerOptions): void {
    const listener = new EditListener(opts);
    EditListener.listeners.push(listener);
  }
}

export function renderEditableInput(
  type: string,
  input: HTMLInputElement,
  save: () => void,
  inputError?: HTMLElement,
  validator?: ElementValidator,
): HTMLElement {
  const className = input.className.replace('--input', '');
  const wrapper = createElement('div', { class: `${className}` });
  const label = createElement('label', { class: `${className}--label`, for: input.id });
  label.textContent = type;
  if (input.type === 'checkbox') {
    wrapper.append(input, label);
  } else {
    wrapper.append(label, input);
  }

  const okBtn = createElement<HTMLDivElement>('div', { class: `${className}--ok hidden` });
  okBtn.textContent = '✓';
  const cancelBtn = createElement<HTMLDivElement>('div', { class: `${className}--cancel hidden` });
  cancelBtn.textContent = '✕';

  wrapper.append(okBtn, cancelBtn);

  EditListener.createListener({
    input,
    okBtn,
    cancelBtn,
    validator,
    save,
  });
  if (inputError != null) {
    wrapper.append(inputError);
  }

  return wrapper;
}
