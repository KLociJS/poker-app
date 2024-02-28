import Styles from "./button.module.css";

type PrimaryButtonProps = {
  buttonText: string;
  clickHandler: () => void;
};

function PrimaryButton({ buttonText, clickHandler }: PrimaryButtonProps) {
  return (
    <button className={Styles.primary_button} onClick={clickHandler}>
      {buttonText}
    </button>
  );
}

export default PrimaryButton;
