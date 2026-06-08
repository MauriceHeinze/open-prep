type CheckboxOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type CheckboxGroupProps<TValue extends string> = {
  ariaLabel: string;
  options: CheckboxOption<TValue>[];
  values: TValue[];
  onValuesChange: (values: TValue[]) => void;
};

export function CheckboxGroup<TValue extends string>({
  ariaLabel,
  options,
  values,
  onValuesChange,
}: CheckboxGroupProps<TValue>): JSX.Element {
  const selectedValues = new Set(values);

  const toggleValue = (value: TValue): void => {
    const nextValues = selectedValues.has(value)
      ? values.filter((selectedValue) => selectedValue !== value)
      : options
          .filter((option) => selectedValues.has(option.value) || option.value === value)
          .map((option) => option.value);

    onValuesChange(nextValues);
  };

  return (
    <div aria-label={ariaLabel} className="checkbox-group" role="group">
      {options.map((option) => (
        <label
          key={option.value}
          className="checkbox-group__option"
          htmlFor={`checkbox-group-${option.value}`}
        >
          <input
            checked={selectedValues.has(option.value)}
            className="checkbox-group__input"
            id={`checkbox-group-${option.value}`}
            onChange={() => toggleValue(option.value)}
            type="checkbox"
          />
          <span aria-hidden="true" className="checkbox-group__box" />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
