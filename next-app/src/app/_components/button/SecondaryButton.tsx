import Styles from "./button.module.css";

type SecondaryButtonProps = {
  buttonText: string;
  clickHandler: () => void;
};

function SecondaryButton({ buttonText, clickHandler }: SecondaryButtonProps) {
  return (
    <button className={Styles.secondary_button} onClick={clickHandler}>
      {buttonText}
    </button>
  );
}

export default SecondaryButton;
