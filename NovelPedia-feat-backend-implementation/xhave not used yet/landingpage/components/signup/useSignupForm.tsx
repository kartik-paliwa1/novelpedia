import { useState } from 'react';

export function useSignupForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setLoading(true);
    setLoading(false);
  };

  return {
    form,
    handleChange,
    handleSubmit,
    loading,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
  };
}