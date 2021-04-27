import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { FieldError } from "react-hook-form";

import styles from "./FormInput.module.scss";

import inputStyles from "../../Input/Input.module.scss";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: any;
  round?: boolean;
  label?: string;
  error?: FieldError | undefined;
  wrapperStyles?: string;
}

function FormInput({
  id,
  type = "text",
  label,
  error,
  register,
  className,
  wrapperStyles,
  round,
  ...props
}: FormInputProps) {
  return (
    <div
      className={classNames(
        inputStyles.InputWrapper,
        wrapperStyles,

        {
          [inputStyles.round]: round,
        }
      )}
    >
      {!!label && (
        <label htmlFor={id} className={inputStyles.Label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={classNames(inputStyles.Input, className)}
        {...register}
        {...props}
      />
      {error?.message && <span className={styles.Error}>{error.message}</span>}
    </div>
  );
}

export default FormInput;
