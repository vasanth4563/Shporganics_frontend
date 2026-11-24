export interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/** Validates the buyer profile form and returns a map of field errors. */
const validateProfile = (f: ProfileForm): Record<string, string> => {
  const er: Record<string, string> = {};
  if (!f.name.trim()) er.name = 'Name is required';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email';
  if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = 'Enter a valid 10-digit number';
  if (f.pincode && !/^\d{6}$/.test(f.pincode)) er.pincode = '6-digit pincode';
  return er;
};

export default validateProfile;
