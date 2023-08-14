import createElement from '../../dom-helper/create-element';

export function renderInput(
  type: string,
  input: HTMLInputElement,
  inputError: HTMLElement,
  passwordBtn?: HTMLElement,
): HTMLElement {
  const className = input.className.replace('--input', '');
  const wrapper = createElement('div', { class: `${className}` });
  const label = createElement('label', {
    class: `${className}--label`,
    for: input.id,
  });
  label.textContent = type;
  wrapper.append(label, input);
  if (type.toLowerCase() === 'password' && passwordBtn != null) {
    wrapper.append(passwordBtn);
  }
  wrapper.append(inputError);
  return wrapper;
}
