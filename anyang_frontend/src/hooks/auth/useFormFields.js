import { useState } from 'react';

export function useFormFields(initialValues) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return [form, handleChange, setForm];
}
