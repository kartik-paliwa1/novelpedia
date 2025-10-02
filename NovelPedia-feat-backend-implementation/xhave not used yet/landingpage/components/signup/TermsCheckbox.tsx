interface Props {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export function TermsCheckbox({ checked, onChange }: Props) {
    return (
      <div className="flex gap-2 pt-2 text-sm">
        <input
          type="checkbox"
          name="agree"
          checked={checked}
          onChange={onChange}
          className="accent-violet-500"
          required
        />
        <div>
          I agree to{' '}
          <span className="text-purple-200">
            <a href="#">Terms of Service </a>
          </span>{' '}
          and
          <span className="text-purple-200">
            {' '}
            <a href="">Privacy Policy</a>
          </span>
        </div>
      </div>
    );
  }