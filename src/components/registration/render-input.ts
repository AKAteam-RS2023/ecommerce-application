import createElement from '../../dom-helper/create-element';

export function renderInput(
  type: string,
  input: HTMLInputElement,
  inputError?: HTMLElement,
  passwordBtn?: HTMLElement,
  labelHeader?: string,
): HTMLElement {
  const className = input.className.replace('--input', '');
  const wrapper = createElement('div', { class: `${className}` });
  const label = createElement('label', {
    class: `${className}--label`,
    for: input.id,
  });
  label.textContent = labelHeader ?? type;
  if (input.type === 'checkbox') {
    wrapper.append(input, label);
  } else {
    wrapper.append(label, input);
  }

  if (type.toLowerCase() === 'password' && passwordBtn != null) {
    wrapper.append(passwordBtn);
  }
  if (inputError != null) {
    wrapper.append(inputError);
  }

  return wrapper;
}
